import React, { useState, useMemo, useCallback } from 'react';
import { Grid, Typography, TextField, InputAdornment, Chip, Box, Collapse } from '@mui/material';
import { KeyboardArrowRightRounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './DriverHourly.styles';

const durationToSeconds = (value) => {
    if (!value) return 0;
    const parts = String(value).split(':').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
};

const formatSeconds = (totalSeconds) => {
    const sign = totalSeconds < 0 ? '-' : '';
    const abs = Math.abs(Math.round(totalSeconds));
    const h = String(Math.floor(abs / 3600)).padStart(2, '0');
    const m = String(Math.floor((abs % 3600) / 60)).padStart(2, '0');
    const s = String(abs % 60).padStart(2, '0');
    return `${sign}${h}:${m}:${s}`;
};

const formatTimeSec = (value) => {
    if (!value) return '—';
    const parsed = moment(value, ['YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', moment.ISO_8601], true);
    return parsed.isValid() ? parsed.format('HH:mm:ss') : value;
};

const formatDurationShort = (value) => {
    const totalMinutes = Math.round(durationToSeconds(value) / 60);
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
};

const getSeverity = (diffValue) => {
    const minutes = Math.round(durationToSeconds(diffValue) / 60);
    if (!diffValue) return 'good';
    if (minutes <= 40) return 'good';
    if (minutes <= 90) return 'warn';
    return 'bad';
};

const STATUS_META = {
    good: { label: 'On track' },
    warn: { label: 'Some idle' },
    bad: { label: 'Review needed' },
};

const WHY_TEXT = {
    good: 'Idle time is within the normal 30-minute window on both ends — no action needed.',
    warn: 'Idle time is above the normal window — consider adding a note or reviewing with the driver.',
    bad: 'Idle time is significantly above normal — this day should be reviewed before payroll is finalized.',
};

const StatTile = ({ classes, cx, label, value, highlight, isDeficit }) => (
    <Box className={cx(classes.statTile, highlight && classes.statTileHighlight)}>
        <Typography className={cx(classes.statLabel, highlight && classes.statLabelHighlight)}>
            {label}
        </Typography>
        <Typography className={cx(classes.statValue, label === 'Difference' ? isDeficit ? classes.statValueError : classes.statValueSuccess : null)}>
            {value}
        </Typography>
    </Box>
)

export default function DriverHourlyCard({ days = [], driverDetails = {}, onAdjustmentChange, onKmAdjustmentChange }) {

    const { classes, cx } = useStyles();
    const [adjustments, setAdjustments] = useState({});
    const [kmAdjustments, setKmAdjustments] = useState({});
    const [notes, setNotes] = useState({});
    const [expandedDates, setExpandedDates] = useState(() => new Set());

    const toggleExpanded = useCallback((date) => {
        setExpandedDates((prev) => {
            const next = new Set(prev);
            next.has(date) ? next.delete(date) : next.add(date);
            return next;
        });
    }, []);

    const handleAdjustmentChange = useCallback((date, value) => {
        setAdjustments((prev) => ({ ...prev, [date]: value }));
        onAdjustmentChange?.(date, value);
    }, [onAdjustmentChange]);

    const handleKmAdjustmentChange = useCallback((date, value) => {
        setKmAdjustments((prev) => ({ ...prev, [date]: value }));
        onKmAdjustmentChange?.(date, value);
    }, [onKmAdjustmentChange]);

    const dateRangeLabel = useMemo(() => {
        if (!days.length) return '—';
        const sorted = [...days].sort((a, b) => moment(a.date).diff(moment(b.date)));
        const from = moment(sorted[0].date).format('MMM D');
        const to = moment(sorted[sorted.length - 1].date).format('MMM D, YYYY');
        return `${days.length} days · ${from} – ${to}`;
    }, [days]);

    const totals = useMemo(() => {
        const tripSeconds = days.reduce((sum, d) => sum + durationToSeconds(d.trip_hours), 0);
        const clockedSeconds = days.reduce((sum, d) => sum + durationToSeconds(d.clocked_hours), 0);
        const differenceSeconds = clockedSeconds - tripSeconds;
        const adjustmentSeconds = Object.values(adjustments).reduce((sum, v) => sum + (Number(v) || 0) * 3600, 0);
        const adjustedClockedSeconds = clockedSeconds + adjustmentSeconds;
        const estPay = (adjustedClockedSeconds / 3600) * (driverDetails?.hourly_rate || 0);
        const kms = days.reduce((sum, d) => Number(d.km_driven) + sum, 0)
        const estPayKm = kms * (driverDetails?.rate_per_km || 0);
        return { tripSeconds, clockedSeconds, differenceSeconds, adjustmentSeconds, adjustedClockedSeconds, estPay, estPayKm };
    }, [days, adjustments, driverDetails]);

    const isDeficit = totals.differenceSeconds > 0;

    return (
        <Grid container className={classes.root} direction="column" wrap="nowrap">
            <Grid size={12} className={classes.statsRow}>
                <StatTile classes={classes} cx={cx} label="Trip Hours" value={formatSeconds(totals.tripSeconds)} />
                <StatTile classes={classes} cx={cx} label="Clocked Hours" value={formatSeconds(totals.clockedSeconds)} />
                <StatTile classes={classes} cx={cx} label="Difference" value={formatSeconds(totals.differenceSeconds)} highlight isDeficit={isDeficit} />
                <StatTile classes={classes} cx={cx} label="Adjustments" value={formatSeconds(totals.adjustmentSeconds)} />
                <StatTile classes={classes} cx={cx} label="Adjusted Clocked" value={formatSeconds(totals.adjustedClockedSeconds)} />
                <StatTile classes={classes} cx={cx} label={`Est. Pay @ ${driverDetails?.hourly_rate || 0}/H`} value={`${totals.estPay.toFixed(0)}`} />
                <StatTile classes={classes} cx={cx} label={`Est. Pay @ ${driverDetails?.rate_per_km || 0}/KM`} value={`${totals?.estPayKm.toFixed(0)}`} />
            </Grid>
            <Grid size={12} className={classes.tableHeaderRow}>
                <Grid container sx={{ width: '100%' }} alignItems="center">
                    <Grid size={3.2}><Typography className={classes.tableHeaderCell}>Date & Route</Typography></Grid>
                    <Grid size={1.5}><Typography className={classes.tableHeaderCell}>Clocked</Typography></Grid>
                    <Grid size={1.5}><Typography className={classes.tableHeaderCell}>Trip</Typography></Grid>
                    <Grid size={1.5}><Typography className={classes.tableHeaderCell}>Idle</Typography></Grid>
                    <Grid size={1.8}><Typography className={classes.tableHeaderCell}>Status</Typography></Grid>
                    <Grid size={1.2}><Typography className={classes.tableHeaderCell}>Adjust</Typography></Grid>
                    <Grid size={1.3}><Typography className={classes.tableHeaderCell}>Km</Typography></Grid>
                </Grid>
            </Grid>
            {days.map((day) => {

                const severity = getSeverity(day.difference);
                const isOpen = expandedDates.has(day.date);
                const puSeconds = durationToSeconds(day.pu_diff);
                const tripSeconds = durationToSeconds(day.trip_hours);
                const delSeconds = durationToSeconds(day.delivery_diff);
                const totalSeconds = puSeconds + tripSeconds + delSeconds;

                return (
                    <React.Fragment key={day.date}>
                        <Grid size={12} className={cx(classes.row, isOpen && classes.rowOpened)} onClick={() => toggleExpanded(day.date)}>
                            <Grid container sx={{ width: '100%' }} alignItems="center">
                                <Grid size={3.2}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <KeyboardArrowRightRounded className={cx(classes.expandIcon, isOpen && classes.expandIconOpen)} />
                                        <div>
                                            <Typography className={classes.dateText}>{moment(day.date).format('ddd, MMM D')}</Typography>
                                            <Typography className={classes.routeText}>{day.shipper_city || '—'} → {day.consignee_city || '—'}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid size={1.5}><Typography className={classes.cellValue}>{day.clocked_hours || '—'}</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.cellValue}>{day.trip_hours || '—'}</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.idleValue}>{day.difference || '—'}</Typography></Grid>
                                <Grid size={1.8}>
                                    <span className={classes.statusDot} style={{ background: `var(--status-${severity})` }} />
                                    <Typography component="span" className={cx(classes.statusText, classes[`status${severity[0].toUpperCase()}${severity.slice(1)}`])}>
                                        {STATUS_META[severity].label}
                                    </Typography>
                                </Grid>
                                <Grid size={1.2} onClick={(e) => e.stopPropagation()}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        className={classes.adjustField}
                                        value={adjustments[day.date] ?? ''}
                                        onChange={(e) => handleAdjustmentChange(day.date, e.target.value)}
                                        placeholder="0"
                                        slotProps={{ input: { endAdornment: <InputAdornment position="end">hr</InputAdornment> } }}
                                    />
                                </Grid>
                                <Grid size={1.3} onClick={(e) => e.stopPropagation()}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        className={classes.adjustField}
                                        value={kmAdjustments[day.date] ?? ''}
                                        onChange={(e) => handleKmAdjustmentChange(day.date, e.target.value)}
                                        placeholder="0"
                                        slotProps={{ input: { endAdornment: <InputAdornment position="end">km</InputAdornment> } }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Collapse in={isOpen} timeout={'auto'}>
                            <Grid size={12} className={classes.timelineWrap}>
                                <div className={classes.timelineBar}>
                                    {puSeconds > 0 && (
                                        <div className={classes.segmentIdle} style={{ flexGrow: puSeconds / (totalSeconds || 1), flexBasis: 0 }} />
                                    )}
                                    <div className={classes.segmentActive} style={{ flexGrow: tripSeconds / (totalSeconds || 1), flexBasis: 0 }} />
                                    {delSeconds > 0 && (
                                        <div className={classes.segmentIdle} style={{ flexGrow: delSeconds / (totalSeconds || 1), flexBasis: 0 }} />
                                    )}
                                </div>
                                <div className={classes.timelineLabels}>
                                    <div style={{ flex: '0 0 auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                            <Typography className={classes.tickTime}>{moment.utc(day.clock_in).format('HH:mm')}</Typography>
                                            {puSeconds > 0 && <Typography className={classes.tickDuration}>{formatDurationShort(day.pu_diff)}</Typography>}
                                        </div>
                                        <Typography className={classes.tickCaption}>Clock in waiting</Typography>
                                    </div>

                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <Typography className={classes.tickTime}>
                                            {day.first_pickup || '-'} → {day.last_delivery || '-'}
                                        </Typography>
                                        <Typography className={classes.tickCaption}>on the road</Typography>
                                    </div>
                                    <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                                            {delSeconds > 0 && <Typography className={classes.tickDuration} sx={{ marginRight: '6px', marginLeft: 0 }}>{formatDurationShort(day.delivery_diff)}</Typography>}
                                            <Typography className={classes.tickTime}>{moment.utc(day.clock_out).format('HH:mm')}</Typography>
                                        </div>
                                        <Typography className={classes.tickCaption}>after last stop · Clock out</Typography>
                                    </div>
                                </div>
                                <Grid container spacing={2} className={classes.detailGrid}>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            className={classes.noteField}
                                            placeholder="Add a note for this day's adjustment (e.g. traffic delay, warehouse wait)..."
                                            value={notes[day.date] ?? ''}
                                            onChange={(e) => setNotes((prev) => ({ ...prev, [day.date]: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }} className={classes.whyBox}>
                                        <Typography className={classes.whyTitle}>Why this matters</Typography>
                                        <Typography className={classes.whyText}>{WHY_TEXT[severity]}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </React.Fragment>
                );
            })}
        </Grid>
    );
}