import React from 'react';
import { PlayArrow, Inventory2, AccessTime, Speed, DirectionsCar, QueryBuilder } from '@mui/icons-material';
import useStyles from './LandingPage.styles'
import { Box, CircularProgress, Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { DriverLayout } from '../../layouts';
import { useCompletedDriverTrips, useDispatchOrderMutation, useDriverTripsById } from '../../../hooks/useDispatchOrders'
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useDispatchScreenSync } from '../../../hooks/useDispatchScreenSync';
import { useNavigate } from 'react-router-dom';

const DRIVER = {
    serviceHours: '6h 42m',
};

export const LoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
            {textLoading ? textLoading : 'Loading trips…'}
        </Typography>
    </Box>
);

function formatTripDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = (inputDate - todayStart) / (1000 * 60 * 60 * 24);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Older';
    return inputDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

function TripItem({ trip, index, onSelect, isSelected, isActive, hasLiveTrip }) {
    const dateLabel = formatTripDate(trip.trip_date);
    const isToday = dateLabel === 'Today';
    const isPast = dateLabel === 'Older';
    const isLocked = !isActive && hasLiveTrip;

    const { classes, cx } = useStyles({ isSelected, isToday, index, isLocked });

    const handleClick = (e) => {
        e.preventDefault();
        if (isLocked || isActive) return;
        onSelect(trip);
    };

    return (
        <Tooltip
            title={isActive ? 'This trip is currently live' : isLocked ? 'Complete the active trip before selecting another' : ''}
            placement="top"
            disableHoverListener={!isLocked && !isActive}
        >
            <div
                className={cx(classes.tripItem, isActive && classes.tripItemActive)}
                onClick={handleClick}
            >
                <div className={cx(classes.tripIndex, isActive && classes.tripIndexActive)}>
                    {index + 1}
                </div>

                <div className={classes.tripInfo}>
                    <div className={classes.tripNumber}>Trip #{trip.trip_number}</div>
                    <div className={classes.tripDate}>
                        {trip.total_orders ?? 0} orders
                    </div>
                </div>

                <div className={classes.tripRight}>
                    {isActive && (
                        <div className={classes.liveBadge}>
                            <div className={classes.liveDot} />
                            LIVE
                        </div>
                    )}
                    <div className={cx(
                        classes.tripBadge,
                        isToday ? classes.tripBadgeToday : isPast ? classes.tripBadgeOlder : classes.tripBadgeUpcoming
                    )}>
                        {isToday ? 'TODAY' : isPast ? 'PAST' : 'UPCOMING'}
                    </div>
                </div>
            </div>
        </Tooltip>
    );
}

export default function DriverLanding() {

    useDispatchScreenSync();
    const { classes, cx } = useStyles();
    const authedUser = JSON.parse(localStorage.getItem('authedUser'));
    const [selectTrip, setSelectTrip] = React.useState(null);
    const { data: driverTrips, isLoading, isError, error } = useDriverTripsById(authedUser?.driver_id);
    const { data: countCompleted, isLoading: loadingCompleted } = useCompletedDriverTrips(authedUser?.driver_id);
    const { enqueueSnackbar } = useSnackbar();
    const { updateTrip } = useDispatchOrderMutation();
    const navigate = useNavigate()

    const liveTrip = React.useMemo(() => (driverTrips ?? []).find(t => t.trip_status === 'active') ?? null, [driverTrips]);
    const hasLiveTrip = Boolean(liveTrip);
    const hasAnyTrip = (driverTrips ?? []).length > 0;

    const startTripDisabled = hasLiveTrip || !selectTrip;
    const deliveriesDisabled = !hasLiveTrip;
    const hoursDisabled = !hasAnyTrip;

    const onSelect = React.useCallback((trip) => {
        setSelectTrip((prev) => prev?.id === trip.id ? null : trip);
    }, []);

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
        }
    }, [isError, error]);

    React.useEffect(() => {
        if (selectTrip && selectTrip.trip_status === 'active') {
            setSelectTrip(null);
        }
    }, [driverTrips]);

    const totalToday = React.useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        return (driverTrips ?? []).filter(t => moment(t.trip_date).format('YYYY-MM-DD') === today).length;
    }, [driverTrips]);

    const totalPending = React.useMemo(() => {
        return (driverTrips ?? []).filter(t => t.trip_status === 'planning').length;
    }, [driverTrips]);

    const startTrip = async (e) => {
        e.preventDefault();
        if (startTripDisabled) {
            if (hasLiveTrip) {
                enqueueSnackbar('You already have an active trip in progress. Complete it before starting a new one.', { variant: 'warning' });
            } else {
                enqueueSnackbar('Please select a trip before proceeding.', { variant: 'info' });
            }
            return;
        }
        const tripPayload = {
            trip_date: moment.utc(selectTrip.trip_date).format('YYYY-MM-DD'),
            driver_id: selectTrip.driver_id,
            driver_number: selectTrip.driver_number,
            driver_name: selectTrip.driver_name,
            trip_status: 'active',
            interliner_id: selectTrip.interliner_id,
            interliner_name: selectTrip.interliner_name,
        };
        await updateTrip.mutateAsync({ trip_id: selectTrip.id, payload: tripPayload });
        setSelectTrip(null);
    };

    const sortedTrips = React.useMemo(
        () => [...(driverTrips ?? [])].sort((a, b) => b.trip_number - a.trip_number),
        [driverTrips]
    );

    return (
        <DriverLayout
            active='Home'
            tripId={liveTrip?.id}
        >
            <Grid container spacing={2}>

                <Grid size={12}>
                    <div className={classes.hero}>
                        <div className={classes.driverName}>
                            WELCOME,&nbsp;<em>{authedUser?.username}</em>
                        </div>
                        <div className={classes.driverMeta}>
                            <span className={cx(classes.badge, classes.badgeId)}>
                                <Speed sx={{ fontSize: 12 }} />
                                ID: {authedUser.driver_number ? authedUser.driver_number : '-'}
                            </span>
                        </div>
                    </div>
                </Grid>

                <Grid size={12}>
                    <div className={classes.tripsCard}>
                        <div className={classes.tripsCardHeader}>
                            <div className={classes.tripsCardLeft}>
                                <div className={classes.tripsCardIcon}>
                                    <DirectionsCar sx={{ fontSize: 16, color: '#f59e0b' }} />
                                </div>
                                <span className={classes.tripsCardTitle}>Assigned Trips</span>
                            </div>
                            {driverTrips && (
                                <div className={classes.tripsCount}>{driverTrips.length}</div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className={classes.noTrips}>
                                <LoadingState textLoading={`Loading ${authedUser?.username} trips...`} />
                            </div>
                        ) : sortedTrips.length === 0 ? (
                            <div className={classes.noTrips}>
                                <div className={classes.noTripsIcon}>🚚</div>
                                <div className={classes.noTripsText}>No trips assigned</div>
                                <div className={classes.noTripsSub}>Waiting for dispatch assignment</div>
                            </div>
                        ) : (
                            <div className={classes.tripsList}>
                                {sortedTrips.map((trip, i) => (
                                    <TripItem
                                        key={trip.id}
                                        trip={trip}
                                        index={i}
                                        isSelected={selectTrip?.id === trip.id}
                                        onSelect={onSelect}
                                        isActive={trip.trip_status === 'active'}
                                        hasLiveTrip={hasLiveTrip}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Grid>

                <Grid size={12}>
                    <Grid container spacing={2}>

                        <Grid size={12}>
                            <Tooltip
                                title={hasLiveTrip ? 'Complete your active trip before starting a new one' : !selectTrip ? 'Select a trip first' : ''}
                                placement="top"
                                disableHoverListener={!startTripDisabled}
                            >
                                <span style={{ display: 'block', width: '100%' }}>
                                    <button
                                        className={cx(classes.actionBtn, classes.actionBtnPrimary)}
                                        onClick={startTrip}
                                        disabled={startTripDisabled}
                                    >
                                        <div className={classes.btnLeftGroup}>
                                            <div className={cx(classes.btnIcon, classes.btnIconPrimary)}>
                                                <PlayArrow sx={{ fontSize: 26, color: 'rgba(255,255,255,0.9)' }} />
                                            </div>
                                            <div>
                                                <div className={cx(classes.btnTitle, classes.btnTitlePrimary)}>Start Trip</div>
                                                <div className={classes.btnSubtitle}>
                                                    {hasLiveTrip ? 'A trip is already live' : 'View assigned orders'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={classes.btnArrow}>→</span>
                                    </button>
                                </span>
                            </Tooltip>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Tooltip
                                title={deliveriesDisabled ? 'Start a trip to access deliveries' : ''}
                                placement="top"
                                disableHoverListener={!deliveriesDisabled}
                            >
                                <span style={{ display: 'block', width: '100%' }}>
                                    <button
                                        className={cx(classes.actionBtn, classes.actionBtnSecondary)}
                                        disabled={deliveriesDisabled}
                                        onClick={() => navigate(`/driver-deliveries/${liveTrip.id}`)}
                                    >
                                        <div className={cx(classes.btnIcon, classes.btnIconSecondary)}>
                                            <Inventory2 sx={{ fontSize: 20, color: '#95a5a6' }} />
                                        </div>
                                        <div>
                                            <div className={classes.btnTitle}>Deliveries</div>
                                        </div>
                                    </button>
                                </span>
                            </Tooltip>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <button
                                className={cx(classes.actionBtn, classes.actionBtnTertiary)}
                                disabled={hoursDisabled}
                            >
                                <div className={cx(classes.btnIcon, classes.btnIconTertiary)}>
                                    <AccessTime sx={{ fontSize: 20, color: '#1a8a5a' }} />
                                </div>
                                <div>
                                    <div className={classes.btnTitle}>Hours</div>
                                </div>
                            </button>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid size={12}>
                    <div className={classes.hoursChip}>
                        <div className={classes.hoursLeft}>
                            <span className={classes.hoursIcon}><QueryBuilder fontSize="medium" /></span>
                            <div>
                                <div className={classes.hoursTitle}>Service Hours</div>
                                <div className={classes.hoursValue}>{DRIVER.serviceHours}</div>
                            </div>
                        </div>
                    </div>
                </Grid>

                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberGold)}>{totalToday}</div>
                                <div className={classes.statLabel}>Today</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                {loadingCompleted
                                    ? <Skeleton variant="rectangular" width="100%" height={20} />
                                    : <div className={cx(classes.statNumber, classes.statNumberGreen)}>{countCompleted}</div>
                                }
                                <div className={classes.statLabel}>Done</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberBlue)}>{totalPending}</div>
                                <div className={classes.statLabel}>Pending</div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </DriverLayout>
    );
}