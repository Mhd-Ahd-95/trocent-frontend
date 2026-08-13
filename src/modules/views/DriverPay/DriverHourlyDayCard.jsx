import React, { useState, useCallback, useMemo } from 'react';
import { TableRow, TableCell, Typography, Chip, Tooltip, InputAdornment, TextField, Stack, Box } from '@mui/material';
import { ArrowRightAltRounded, CheckCircleRounded, WarningAmberRounded, ErrorRounded, ScheduleRounded, KeyboardArrowUpRounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './DriverHourly.styles';

const durationToSeconds = (value) => {
    if (!value) return 0;
    const parts = String(value).split(':').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
};

const durationToMinutes = (value) => (value ? Math.round(durationToSeconds(value) / 60) : null);

const getSeverity = (diffValue) => {
    const minutes = durationToMinutes(diffValue);
    if (minutes === null) return 'neutral';
    if (minutes <= 15) return 'good';
    if (minutes <= 60) return 'warn';
    return 'bad';
};

const SEVERITY_META = {
    good: { icon: CheckCircleRounded, label: 'On track' },
    warn: { icon: WarningAmberRounded, label: 'Minor gap' },
    bad: { icon: ErrorRounded, label: 'Review needed' },
    neutral: { icon: ScheduleRounded, label: 'No data' },
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function DriverHourlyDayCard({ order, onAdjustmentChange, onKmAdjustmentChange }) {

    const { classes, cx } = useStyles();
    const [adjustment, setAdjustment] = useState(order?.adjustment ?? '');
    const [kmAdjustment, setKmAdjustment] = useState(order?.adjustment_km ?? '');

    const severity = useMemo(() => getSeverity(order?.difference), [order?.difference]);
    const SeverityIcon = SEVERITY_META[severity].icon;


    const hasTimeline = useMemo(() => {
        const pu = durationToSeconds(order?.pu_diff);
        const trip = durationToSeconds(order?.trip_hours);
        const delivery = durationToSeconds(order?.delivery_diff);
        return pu + trip + delivery > 0;
    }, [order?.pu_diff, order?.trip_hours, order?.delivery_diff]);

    const timelineColumns = useMemo(() => {
        if (!order) return [];
        return [
            { type: 'node', key: 'clockIn', width: 64, align: 'left', label: 'Clock in', value: moment.utc(order.clock_in).format('HH:mm') },
            { type: 'segment', key: 'pu', grow: 1, label: 'Pu diff', tone: 'idle', value: order.pu_diff || '00:00:00' },
            { type: 'node', key: 'pickup', width: 74, align: 'center', label: '1st pickup', value: order.first_pickup },
            { type: 'segment', key: 'trip', grow: 1, label: 'Trip Hrs', tone: 'active', value: order.trip_hours || '00:00:00' },
            { type: 'node', key: 'delivery', width: 84, align: 'center', label: 'Last delivery', value: order.last_delivery },
            { type: 'segment', key: 'del', grow: 1, label: 'Delivery diff', tone: 'idle', value: order.delivery_diff || '00:00:00' },
            { type: 'node', key: 'clockOut', width: 64, align: 'right', label: 'Clock out', value: moment.utc(order.clock_out).format('HH:mm') },
        ];
    }, [order]);

    const handleAdjustmentChange = useCallback((e) => {
        const value = e.target.value;
        setAdjustment(value);
        onAdjustmentChange?.(order?.date, value);
    }, [onAdjustmentChange, order?.date]);

    const handleKmAdjustmentChange = useCallback((e) => {
        const value = e.target.value;
        setKmAdjustment(value);
        onKmAdjustmentChange?.(order?.date, value);
    }, [onKmAdjustmentChange, order?.date]);

    if (!order) return null;

    return (
        <>
            <TableRow className={classes.valueRow}>
                <TableCell className={classes.bodyCell}>
                    <Typography className={classes.dateText}>{moment(order.date).format('ddd DD-MM-YYYY')}</Typography>
                </TableCell>
                <TableCell className={classes.bodyCell}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography className={classes.routeCity} noWrap>{order.shipper_city || '—'}</Typography>
                        <ArrowRightAltRounded className={classes.routeArrow} />
                        <Typography className={classes.routeCity} noWrap>{order.consignee_city || '—'}</Typography>
                    </Stack>
                </TableCell>
                <TableCell align="right" className={classes.bodyCell}>
                    <Typography className={classes.summaryValue}>{order.clocked_hours || '—'}</Typography>
                </TableCell>
                <TableCell align="right" className={classes.bodyCell}>
                    <Tooltip title={SEVERITY_META[severity].label} arrow>
                        <Chip
                            size="small"
                            className={cx(classes.diffChip, classes[`diffChip${capitalize(severity)}`])}
                            icon={<SeverityIcon sx={{ fontSize: 15 }} />}
                            label={order.difference || '00:00:00'}
                        />
                    </Tooltip>
                </TableCell>
                <TableCell align="right" className={classes.bodyCell}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        className={classes.adjustmentField}
                        value={adjustment}
                        onChange={handleAdjustmentChange}
                        placeholder="0"
                        slotProps={{ input: { endAdornment: <InputAdornment position="end">hr</InputAdornment> } }}
                    />
                </TableCell>
                <TableCell align="right" className={classes.bodyCell}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        className={classes.adjustmentField}
                        value={kmAdjustment}
                        onChange={handleKmAdjustmentChange}
                        placeholder="0"
                        slotProps={{ input: { endAdornment: <InputAdornment position="end">km</InputAdornment> } }}
                    />
                </TableCell>
            </TableRow>
            {hasTimeline && (
                <TableRow className={classes.timelineRow}>
                    <TableCell colSpan={6} className={classes.timelineCell}>

                        <Box className={classes.timelineValueRow}>
                            {timelineColumns.map((col) => col.type === 'node' ? (
                                <Box key={col.key} sx={{ width: col.width, textAlign: col.align }}>
                                    <Typography noWrap className={classes.timelineNodeValue}>{col.value}</Typography>
                                </Box>
                            ) : (
                                <Box key={col.key} sx={{ flexGrow: col.grow, flexBasis: 0 }} className={cx(classes.timelineSegment, classes[`timelineSegment${capitalize(col.tone)}`])}>
                                    <Typography noWrap className={cx(classes.timelineSegmentValue, classes[`timelineSegmentValue${capitalize(col.tone)}`])}>
                                        {col.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box className={classes.timelineTitleRow}>
                            {timelineColumns.map((col) => (
                                <Box key={col.key} sx={{ width: col.width, flexGrow: col.grow, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <KeyboardArrowUpRounded className={classes.timelineArrow} />
                                    <Typography noWrap align="center" className={classes.timelineTitle}>{col.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}