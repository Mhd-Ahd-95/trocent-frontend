import React from 'react';
import useStyles from './LandingPage.styles'
import { Login, Logout, QueryBuilder } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Skeleton, TextField, Typography, } from '@mui/material';
import globalVariables from '../../../global';
import { useDriverClock, useDriverKm, useDriverMutation } from '../../../hooks/useDrivers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
    if (m > 0) return `${m}m ${pad(s)}s`;
    return `${s}s`;
}

function ClockInOut({ hasTrips, clockedInRef }) {

    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const authUser = globalVariables.auth.user;

    const { data, isLoading, isFetching } = useDriverClock(authUser?.driver_id);
    const { data: kmData, isLoading: kmLoading } = useDriverKm(authUser?.driver_id);

    const { driverClockInOut, driverKmInOut } = useDriverMutation();
    const [tickSeconds, setTickSeconds] = React.useState(0);
    const [kmOutOpen, setKmOutOpen] = React.useState(false);
    const [kmOutValue, setKmOutValue] = React.useState('');

    const intervalRef = React.useRef(null);

    React.useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (!data?.active_clock_in) {
            clockedInRef.current = false
            setTickSeconds(0);
            return;
        }
        if (data?.active_clock_in) {
            clockedInRef.current = true
        }
        const base = moment(data.active_clock_in).valueOf();
        const tick = () => setTickSeconds(Math.floor((Date.now() - base) / 1000));
        tick();
        intervalRef.current = setInterval(tick, 1000);
        return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
    }, [data?.active_clock_in])

    const completedSeconds = data ? (data.total_hours * 3600) + (data.total_minutes * 60) + (data.total_seconds ?? 0) : 0;
    const totalSeconds = completedSeconds + tickSeconds;
    const isClockedIn = Boolean(data?.active_clock_id);
    const isPending = driverClockInOut.isPending;
    const hasActiveKm = Boolean(kmData?.active_km_id);

    const handleClockIn = async (e) => {
        e.preventDefault()
        clockedInRef.current = true
        try {
            await driverClockInOut.mutateAsync({ did: authUser?.driver_id, cid: null, clock_in: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
        } catch (e) {
            //
        }
    };

    const doClockOut = async () => {
        clockedInRef.current = false
        try {
            await driverClockInOut.mutateAsync({ did: authUser?.driver_id, cid: data?.active_clock_id, clock_out: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
        } catch (e) {
            //
        }
    };

    const handleClockOutClick = (e) => {
        e.preventDefault();
        if (hasActiveKm) {
            setKmOutOpen(true);
        } else {
            doClockOut();
        }
    };

    const handleKmOutSubmit = async () => {
        if (kmOutValue === '' || Number(kmOutValue) < 0) return;
        try {
            await driverKmInOut.mutateAsync({ did: authUser?.driver_id, kid: kmData?.active_km_id, km_out: kmOutValue });
            setKmOutOpen(false);
            setKmOutValue('');
            await doClockOut();
        } catch (e) {
            //
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                {isClockedIn ? (
                    <button
                        className={cx(classes.actionBtn, classes.clockBtnOut)}
                        onClick={handleClockOutClick}
                        disabled={isPending || isLoading || kmLoading}
                    >
                        <div className={cx(classes.btnIcon, classes.clockBtnIconOut)}>
                            {isPending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Logout sx={{ fontSize: 20, color: '#fff' }} />}
                        </div>
                        <div>
                            <div className={classes.btnTitle}>{t('clock.clockOut')}</div>
                        </div>
                    </button>
                ) : (
                    <button
                        className={cx(classes.actionBtn, classes.clockBtnIn)}
                        onClick={handleClockIn}
                        disabled={isPending || isLoading || !hasTrips}
                    >
                        <div className={cx(classes.btnIcon, classes.clockBtnIconIn)}>
                            {isPending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Login sx={{ fontSize: 20, color: '#fff' }} />}
                        </div>
                        <div>
                            <div className={classes.btnTitle} >{t('clock.clockIn')}</div>
                        </div>
                    </button>
                )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <div className={classes.hoursChip}>
                    <div className={classes.hoursLeft}>
                        <span className={classes.hoursIcon}><QueryBuilder fontSize="medium" /></span>
                        <div>
                            <div className={classes.hoursTitle}>{t('clock.serviceHoursToday')}</div>
                            <div className={classes.hoursValue}>
                                {isLoading || driverClockInOut.isPending || isFetching ? <Skeleton variant='rectangular' width='120px' height={25} /> : totalSeconds > 0 ? formatDuration(totalSeconds) : '—'}
                            </div>
                        </div>
                    </div>
                    {isClockedIn && (<div className={classes.clockDotActive} />)}
                </div>
            </Grid>

            <Dialog open={kmOutOpen} onClose={() => !driverKmInOut.isPending && setKmOutOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="warning" />
                    {t('clock.kmOutTitle', 'Enter ending odometer')}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('clock.kmOutDesc', 'We need your km-out reading before you can clock out.')}
                    </Typography>
                    <TextField
                        fullWidth
                        autoFocus
                        type="number"
                        label={t('clock.kmOut', 'Km Out')}
                        value={kmOutValue}
                        onChange={(e) => setKmOutValue(e.target.value)}
                        disabled={driverKmInOut.isPending}
                        inputProps={{ min: 0, inputMode: 'decimal' }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        onClick={() => setKmOutOpen(false)}
                        disabled={driverKmInOut.isPending}
                    >
                        {t('clock.cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        disabled={driverKmInOut.isPending || kmOutValue === '' || Number(kmOutValue) < 0}
                        onClick={handleKmOutSubmit}
                        startIcon={driverKmInOut.isPending ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <DirectionsCarIcon />}
                    >
                        {t('clock.saveKmOut', 'Save & Clock Out')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default React.memo(ClockInOut);