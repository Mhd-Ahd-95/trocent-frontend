import React from 'react';
import useStyles from './LandingPage.styles'
import { Login, Logout, QueryBuilder } from '@mui/icons-material';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import globalVariables from '../../../global';
import { useDriverClock, useDriverMutation } from '../../../hooks/useDrivers';
import moment from 'moment';

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
    const authUser = globalVariables.auth.user;

    const { data, isLoading, isFetching } = useDriverClock(authUser?.driver_id);
    const { driverClockInOut } = useDriverMutation();
    const [tickSeconds, setTickSeconds] = React.useState(0);

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
        if (data?.active_clock_in){
            clockedInRef.current = true
        }
        const base = moment.utc(data.active_clock_in).valueOf();
        const tick = () => setTickSeconds(Math.floor((Date.now() - base) / 1000));
        tick();
        intervalRef.current = setInterval(tick, 1000);
        return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
    }, [data?.active_clock_in])

    const completedSeconds = data ? (data.total_hours * 3600) + (data.total_minutes * 60) + (data.total_seconds ?? 0) : 0;
    const totalSeconds = completedSeconds + tickSeconds;
    const isClockedIn = Boolean(data?.active_clock_id);
    const isPending = driverClockInOut.isPending;

    const handleClockIn = async (e) => {
        e.preventDefault()
        clockedInRef.current = true
        try {
            await driverClockInOut.mutateAsync({ did: authUser?.driver_id, cid: null });
        } catch (e) {
            //
        }
    };

    const handleClockOut = async (e) => {
        e.preventDefault()
        clockedInRef.current = false
        try {
            await driverClockInOut.mutateAsync({ did: authUser?.driver_id, cid: data?.active_clock_id });
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
                        onClick={handleClockOut}
                        disabled={isPending || isLoading}
                    >
                        <div className={cx(classes.btnIcon, classes.clockBtnIconOut)}>
                            {isPending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Logout sx={{ fontSize: 20, color: '#fff' }} />}
                        </div>
                        <div>
                            <div className={classes.btnTitle}>Clock Out</div>
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
                            <div className={classes.btnTitle} >Clock In</div>
                        </div>
                    </button>
                )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <div className={classes.hoursChip}>
                    <div className={classes.hoursLeft}>
                        <span className={classes.hoursIcon}><QueryBuilder fontSize="medium" /></span>
                        <div>
                            <div className={classes.hoursTitle}>Service Hours Today</div>
                            <div className={classes.hoursValue}>
                                {isLoading || driverClockInOut.isPending || isFetching ? <Skeleton variant='rectangular' width='120px' height={25} /> : totalSeconds > 0 ? formatDuration(totalSeconds) : '—'}
                            </div>
                        </div>
                    </div>
                    {isClockedIn && (<div className={classes.clockDotActive} />)}
                </div>
            </Grid>
        </Grid>
    );
}

export default React.memo(ClockInOut);