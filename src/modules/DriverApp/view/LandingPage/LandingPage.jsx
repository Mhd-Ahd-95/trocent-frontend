import React from 'react';
import { PlayArrow, Inventory2, Speed, DirectionsCar, Visibility } from '@mui/icons-material';
import useStyles from './LandingPage.styles';
import { Box, CircularProgress, Divider, Grid, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { DriverLayout } from '../../layouts';
import { useCompletedDriverTrips, useDispatchOrderMutation, useDriverTripsById } from '../../../hooks/useDispatchOrders';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useDispatchScreenSync } from '../../../hooks/useDispatchScreenSync';
import { useNavigate } from 'react-router-dom';
import DriverNotificationBanner from './DriverNotificationBanner';
import { StopCircle } from '@mui/icons-material';
import ClockInOut from './ClockInOut';
import { useQueryClient } from '@tanstack/react-query';
import QuestionApi from '../../../apis/Questions.api';
import { TripChecklist } from '../../components';
import { useTranslation } from 'react-i18next';

export const LoadingState = ({ textLoading }) => {
    const { t } = useTranslation();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
                {textLoading ? textLoading : t('landing.loadingTrips')}
            </Typography>
        </Box>
    );
};

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
    const { t } = useTranslation();
    const dateLabel = formatTripDate(trip.trip_date);
    const isToday = dateLabel === 'Today';
    const isPast = dateLabel === 'Older';
    const isLocked = !isActive && hasLiveTrip;
    const navigate = useNavigate();
    const { classes, cx } = useStyles({ isSelected, isToday, index, isLocked });

    const handleClick = (e) => {
        e.preventDefault();
        if (isLocked || isActive) return;
        onSelect(trip);
    };

    return (
        <div className={cx(classes.tripItem, isActive && classes.tripItemActive)} onClick={handleClick}>
            <div className={cx(classes.tripIndex, isActive && classes.tripIndexActive)}>
                {index + 1}
            </div>
            <div className={classes.tripInfo}>
                <div className={classes.tripNumber}>{t('landing.tripNumber', { number: trip.trip_number })}</div>
                <div className={classes.tripDate}>{t('landing.ordersCount', { count: trip.total_orders ?? 0 })}</div>
            </div>
            <div className={classes.tripRight}>
                {isActive && (
                    <div className={classes.liveBadge}>
                        <div className={classes.liveDot} />
                        {t('landing.live')}
                    </div>
                )}
                <div className={cx(
                    classes.tripBadge,
                    isToday ? classes.tripBadgeToday : isPast ? classes.tripBadgeOlder : classes.tripBadgeUpcoming
                )}>
                    {isToday ? t('landing.today') : isPast ? t('landing.past') : t('landing.upcoming')}
                </div>
                {!isActive && (
                    <IconButton color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/driver-deliveries/${trip.id}/no-action`);
                    }}>
                        <Visibility sx={{ fontSize: 30 }} />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

export default function DriverLanding() {
    
    useDispatchScreenSync();

    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const authedUser = JSON.parse(localStorage.getItem('authedUser'));
    const [selectTrip, setSelectTrip] = React.useState(null);
    const [checklistOpen, setChecklistOpen] = React.useState(false);
    const [checklistId, setChecklistId] = React.useState(null);
    const [checklistLoading, setChecklistLoading] = React.useState(false);

    const { data: driverTrips = [], isLoading, isError, error } = useDriverTripsById(authedUser?.driver_id);
    const { data: countCompleted, isLoading: loadingCompleted } = useCompletedDriverTrips(authedUser?.driver_id);
    const { enqueueSnackbar } = useSnackbar();
    const { updateTrip, acknowlegeTrip } = useDispatchOrderMutation();
    const navigate = useNavigate();
    const clockedInRef = React.useRef(true);
    const queryClient = useQueryClient();

    const sections = queryClient.getQueryData(['questions']) ?? [];

    const liveTrip = React.useMemo(() => driverTrips?.find(t => t.trip_status === 'active') ?? null, [driverTrips]);
    const hasLiveTrip = Boolean(liveTrip);
    const startTripDisabled = hasLiveTrip || !selectTrip;
    const deliveriesDisabled = !hasLiveTrip;

    const onSelect = React.useCallback((trip) => {
        if (!clockedInRef.current) {
            enqueueSnackbar(t('landing.clockInWarning'), { variant: 'warning' });
            return;
        }
        setSelectTrip(prev => prev?.id === trip.id ? null : trip);
    }, [t]);

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
        }
    }, [isError, error]);

    React.useEffect(() => {
        if (selectTrip && selectTrip.trip_status === 'active') setSelectTrip(null);
    }, [driverTrips]);

    const totalToday = React.useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        return driverTrips?.filter(t => moment(t.trip_date).format('YYYY-MM-DD') === today)?.length || 0;
    }, [driverTrips]);

    const totalPending = React.useMemo(() => driverTrips?.filter(t => t.trip_status === 'planning')?.length || 0, [driverTrips]);

    const startTrip = async (e) => {
        e.preventDefault();
        if (startTripDisabled) {
            if (hasLiveTrip) {
                enqueueSnackbar(t('landing.activeTripWarning'), { variant: 'warning' });
            } else {
                enqueueSnackbar(t('landing.selectTripInfo'), { variant: 'info' });
            }
            return;
        }
        if (!clockedInRef.current) {
            enqueueSnackbar(t('landing.clockInWarning'), { variant: 'warning' });
            return;
        }
        setChecklistLoading(true);
        try {
            const res = await QuestionApi.checkTripInChecklist(selectTrip.id, authedUser?.driver_id);
            const { already_answered, checklist_id } = res.data;
            if (already_answered) {
                await activateTrip(selectTrip);
            } else {
                setChecklistId(checklist_id);
                setChecklistOpen(true);
            }
        } catch (err) {
            enqueueSnackbar(t('landing.checklistError'), { variant: 'error' });
        } finally {
            setChecklistLoading(false);
        }
    };

    const activateTrip = async (trip) => {
        const tripPayload = {
            trip_date: moment.utc(trip.trip_date).format('YYYY-MM-DD'),
            driver_id: trip.driver_id,
            driver_number: trip.driver_number,
            driver_name: trip.driver_name,
            trip_status: 'active',
            interliner_id: trip.interliner_id,
            interliner_name: trip.interliner_name,
            isDriverApp: true,
        };
        await updateTrip.mutateAsync({ trip_id: trip.id, payload: tripPayload });
        setSelectTrip(null);
        setChecklistOpen(false);
        setChecklistId(null);
    };

    const handleChecklistComplete = async () => {
        await activateTrip(selectTrip);
    };

    const endTrip = async (e) => {
        e.preventDefault();
        const tripPayload = {
            trip_date: moment.utc(liveTrip.trip_date).format('YYYY-MM-DD'),
            driver_id: liveTrip.driver_id,
            driver_number: liveTrip.driver_number,
            driver_name: liveTrip.driver_name,
            trip_status: 'planning',
            interliner_id: liveTrip.interliner_id,
            interliner_name: liveTrip.interliner_name,
            isDriverApp: true,
        };
        await updateTrip.mutateAsync({ trip_id: liveTrip.id, payload: tripPayload });
    };

    const sortedTrips = React.useMemo(() => driverTrips?.slice().sort((a, b) => b.trip_number - a.trip_number), [driverTrips]);

    return (
        <DriverLayout active="Home" tripId={liveTrip?.id} clockedInRef={clockedInRef}>
            {checklistOpen && sections.length > 0 && (
                <TripChecklist
                    language={authedUser?.language || 'en'}
                    sections={sections}
                    tripId={selectTrip?.id}
                    checklistId={checklistId}
                    driverId={authedUser?.driver_id}
                    onComplete={handleChecklistComplete}
                />
            )}
            <Grid container spacing={3}>
                {hasLiveTrip && (
                    <Grid size={12}>
                        {liveTrip?.is_trip_updated && !liveTrip?.is_acknowleged && (
                            <DriverNotificationBanner
                                tripNumber={liveTrip.trip_number}
                                isSubmitting={acknowlegeTrip.isPending}
                                onAcknowledge={async (e) => {
                                    e.preventDefault();
                                    await acknowlegeTrip.mutateAsync(liveTrip.id);
                                }}
                            />
                        )}
                    </Grid>
                )}
                <Grid size={12}>
                    <div className={classes.hero}>
                        <div className={classes.driverName}>
                            {t('landing.welcome')}&nbsp;<em>{authedUser?.fname}</em>
                        </div>
                        <div className={classes.driverMeta}>
                            <span className={cx(classes.badge, classes.badgeId)}>
                                <Speed sx={{ fontSize: 12 }} />
                                {t('landing.driverId', { id: authedUser.driver_number ?? '-' })}
                            </span>
                        </div>
                    </div>
                </Grid>
                <Grid size={12}><Divider /></Grid>
                <Grid size={12}>
                    <div className={classes.tripsCard}>
                        <div className={classes.tripsCardHeader}>
                            <div className={classes.tripsCardLeft}>
                                <div className={classes.tripsCardIcon}>
                                    <DirectionsCar sx={{ fontSize: 25, color: '#f59e0b' }} />
                                </div>
                                <span className={classes.tripsCardTitle}>{t('landing.assignedTrips')}</span>
                            </div>
                            {driverTrips && <div className={classes.tripsCount}>{driverTrips.length}</div>}
                        </div>

                        {isLoading ? (
                            <div className={classes.noTrips}>
                                <LoadingState textLoading={t('landing.loadingUserTrips', { username: authedUser?.username })} />
                            </div>
                        ) : sortedTrips.length === 0 ? (
                            <div className={classes.noTrips}>
                                <div className={classes.noTripsIcon}>🚚</div>
                                <div className={classes.noTripsText}>{t('landing.noTripsAssigned')}</div>
                                <div className={classes.noTripsSub}>{t('landing.noTripsSub')}</div>
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
                        {hasLiveTrip ? (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <button
                                    className={cx(classes.actionBtn, classes.actionBtnEndTrip)}
                                    onClick={endTrip}
                                >
                                    <div className={classes.btnLeftGroup}>
                                        <div className={cx(classes.btnIcon, classes.btnIconEndTrip)}>
                                            {updateTrip.isPending
                                                ? <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.9)' }} />
                                                : <StopCircle sx={{ fontSize: 26, color: 'rgba(255,255,255,0.9)' }} />}
                                        </div>
                                        <div>
                                            <div className={cx(classes.btnTitle, classes.btnTitleEndTrip)}>{t('landing.endTrip')}</div>
                                        </div>
                                    </div>
                                    <div className={classes.endTripPulse} />
                                    <span className={classes.btnArrowEnd}>■</span>
                                </button>
                            </Grid>
                        ) : (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <span style={{ display: 'block', width: '100%' }}>
                                    <button
                                        className={cx(classes.actionBtn, classes.actionBtnPrimary)}
                                        onClick={startTrip}
                                        disabled={startTripDisabled || checklistLoading}
                                    >
                                        <div className={classes.btnLeftGroup}>
                                            <div className={cx(classes.btnIcon, classes.btnIconPrimary)}>
                                                {checklistLoading || updateTrip.isPending
                                                    ? <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.9)' }} />
                                                    : <PlayArrow sx={{ fontSize: 26, color: 'rgba(255,255,255,0.9)' }} />}
                                            </div>
                                            <div>
                                                <div className={cx(classes.btnTitle, classes.btnTitlePrimary)}>{t('landing.startTrip')}</div>
                                            </div>
                                        </div>
                                        <span className={classes.btnArrow}>→</span>
                                    </button>
                                </span>
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Tooltip
                                title={deliveriesDisabled ? t('landing.startTripToAccessDeliveries') : ''}
                                placement="top"
                                disableHoverListener={!deliveriesDisabled}
                            >
                                <span style={{ display: 'block', width: '100%' }}>
                                    <button
                                        className={cx(classes.actionBtn, classes.actionBtnSecondary)}
                                        disabled={deliveriesDisabled}
                                        onClick={() => {
                                            if (!clockedInRef.current) {
                                                enqueueSnackbar(t('landing.clockInWarning'), { variant: 'warning' });
                                                return;
                                            }
                                            navigate(`/driver-deliveries/${liveTrip.id}`);
                                        }}
                                    >
                                        <div className={cx(classes.btnIcon, classes.btnIconSecondary)}>
                                            <Inventory2 sx={{ fontSize: 20, color: '#95a5a6' }} />
                                        </div>
                                        <div>
                                            <div className={classes.btnTitle}>{t('landing.deliveries')}</div>
                                        </div>
                                    </button>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Grid size={12}>
                            <ClockInOut
                                hasTrips={driverTrips.length > 0}
                                clockedInRef={clockedInRef}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberGold)}>{totalToday}</div>
                                <div className={classes.statLabel}>{t('landing.statToday')}</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                {loadingCompleted
                                    ? <Skeleton variant="rectangular" width="100%" height={20} />
                                    : <div className={cx(classes.statNumber, classes.statNumberGreen)}>{countCompleted}</div>
                                }
                                <div className={classes.statLabel}>{t('landing.statDone')}</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberBlue)}>{totalPending}</div>
                                <div className={classes.statLabel}>{t('landing.statPending')}</div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DriverLayout>
    );
}