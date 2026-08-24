import React, { useState, useCallback } from 'react';
import { Tabs, Tab, Box, Typography, IconButton, TextField, Skeleton, Tooltip } from '@mui/material';
import { AccessTime, DirectionsCar, Edit, Check, Close, EventBusy, ArrowRightAltRounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './DriverClock.styles';
import { useDriverHistoryClock, useDriverHistoryKm } from '../../hooks/useDrivers';
import { useDriverMutation } from '../../hooks/useDrivers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function EmptyState({ classes, icon: Icon, text }) {
    return (
        <Box className={classes.emptyState}>
            <Icon className={classes.emptyIcon} />
            <Typography className={classes.emptyText}>{text}</Typography>
        </Box>
    );
}

function RowSkeleton({ classes }) {
    return (
        <Skeleton variant="rectangular" height={48} className={classes.skeletonRow} />
    );
}

const pickerSlotProps = (label) => ({
    textField: {
        size: 'small',
        fullWidth: true,
        label,
        sx: {
            width: '100%',
            '& .MuiInputLabel-root': { fontSize: '12.5px' },
            '& .MuiOutlinedInput-root': {
                fontSize: '12.5px',
                borderRadius: '8px',
                bgcolor: 'grey.50',
                '& fieldset': { borderColor: 'grey.200' },
            },
        },
    },
});

function ClockRow({ record, classes, isEditing, onStartEdit, onCancel, onSave, isSaving }) {

    const [clockIn, setClockIn] = useState(() => moment.utc(record.clock_in));
    const [clockOut, setClockOut] = useState(() => moment.utc(record.clock_out));

    const handleSave = () => {
        const newClockIn = clockIn ? clockIn.format('YYYY-MM-DD HH:mm:ss') : null;
        const newClockOut = clockOut ? clockOut.format('YYYY-MM-DD HH:mm:ss') : null;
        onSave({ id: record.id, clock_in: newClockIn, clock_out: newClockOut });
    };

    return (
        <Box className={`${classes.row} ${isEditing ? classes.rowEditing : ''}`}>
            <Box className={classes.rowIcon}>
                <AccessTime sx={{ fontSize: 15, color: 'text.secondary' }} />
            </Box>

            <Box className={classes.dateCol}>
                <Typography className={classes.dateText}>
                    {moment(record.created_at).format('MMM D, YYYY')}
                </Typography>
                <Typography className={classes.subText}>
                    {record.duration_label || '—'}
                </Typography>
            </Box>

            {!isEditing ? (
                <Box className={classes.valuesInline}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' fontSize={'11px'} color='textSecondary'>Clock In</Typography>
                        <Typography className={classes.valueText}>{moment.utc(record.clock_in).format('HH:mm:ss')}</Typography>
                    </Box>
                    <ArrowRightAltRounded className={classes.arrowIcon} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' fontSize={'11px'} color='textSecondary'>Clock Out</Typography>
                        <Typography className={classes.valueText}>
                            {record.clock_out ? moment.utc(record.clock_out).format('HH:mm:ss') : <span className={classes.valueDash}>—</span>}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box className={classes.editRow}>
                    <TimePicker
                        value={clockIn || null}
                        ampm={false}
                        onChange={(val) => setClockIn(val)}
                        slotProps={{
                            ...pickerSlotProps('Clock In'),
                            popper: { sx: { zIndex: 9999 } },
                        }}
                        className={classes.editField}
                    />
                    <ArrowRightAltRounded className={classes.arrowIcon} />
                    <TimePicker
                        value={clockOut || null}
                        ampm={false}
                        onChange={(val) => setClockOut(val)}
                        slotProps={{
                            ...pickerSlotProps('Clock Out'),
                            popper: { sx: { zIndex: 9999 } },
                        }}
                        className={classes.editField}
                    />
                </Box>
            )}

            <Box className={classes.actions}>
                {!isEditing ? (
                    <Tooltip title="Edit this entry">
                        <IconButton size="small" className={classes.editBtn} onClick={onStartEdit}>
                            <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title="Save">
                            <span>
                                <IconButton size="small" className={classes.saveBtn} onClick={handleSave} disabled={isSaving}>
                                    <Check sx={{ fontSize: 17 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton size="small" className={classes.cancelBtn} onClick={onCancel} disabled={isSaving}>
                                <Close sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );
}

function ClockHistoryTab({ driverId, filters }) {

    const { classes } = useStyles();
    const { data: records = [], isLoading } = useDriverHistoryClock(driverId, filters);
    const { updateDriverClock } = useDriverMutation();
    const [editingId, setEditingId] = useState(null);

    const handleSave = useCallback(async (payload) => {
        await updateDriverClock.mutateAsync(payload);
        setEditingId(null);
    }, [driverId]);

    if (isLoading) {
        return (
            <Box>
                <RowSkeleton classes={classes} />
                <RowSkeleton classes={classes} />
                <RowSkeleton classes={classes} />
            </Box>
        );
    }

    if (!records.length) {
        return <EmptyState classes={classes} icon={EventBusy} text="No clock history for this period" />;
    }

    return (
        <Box>
            {records.map((record) => (
                <ClockRow
                    key={record.id}
                    record={record}
                    classes={classes}
                    isEditing={editingId === record.id}
                    isSaving={updateDriverClock.isPending && editingId === record.id}
                    onStartEdit={() => setEditingId(record.id)}
                    onCancel={() => setEditingId(null)}
                    onSave={handleSave}
                />
            ))}
        </Box>
    );
}

function KmRow({ record, classes, isEditing, onStartEdit, onCancel, onSave, isSaving }) {

    const [kmIn, setKmIn] = useState(record.km_in ?? '');
    const [kmOut, setKmOut] = useState(record.km_out ?? '');

    const hasBoth = record.km_in !== null && record.km_in !== undefined && record.km_out !== null && record.km_out !== undefined;
    const driven = hasBoth ? (Number(record.km_out) - Number(record.km_in)).toFixed(1) : null;

    const handleSave = () => {
        if (!kmIn || !kmOut) return;
        onSave({ id: record.id, km_in: kmIn === '' ? null : Number(kmIn), km_out: kmOut === '' ? null : Number(kmOut) });
    };

    return (
        <Box className={`${classes.row} ${isEditing ? classes.rowEditing : ''}`}>
            <Box className={classes.rowIcon}>
                <DirectionsCar sx={{ fontSize: 15, color: 'text.secondary' }} />
            </Box>

            <Box className={classes.dateCol}>
                <Typography className={classes.dateText}>
                    {moment(record.created_at).format('MMM D, YYYY')}
                </Typography>
                <Typography className={classes.subText}>
                    {driven !== null ? `${driven} km` : '—'}
                </Typography>
            </Box>

            {!isEditing ? (
                <Box className={classes.valuesInline}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' fontSize={'11px'} color='textSecondary'>Km In</Typography>
                        <Typography className={classes.valueText}>
                            {record.km_in + ' KM' ?? <span className={classes.valueDash}>—</span>}
                        </Typography>
                    </Box>
                    <ArrowRightAltRounded className={classes.arrowIcon} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' fontSize={'11px'} color='textSecondary'>Km Out</Typography>
                        <Typography className={classes.valueText}>
                            {record.km_out + ' KM' ?? <span className={classes.valueDash}>—</span>}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box className={classes.editRow}>
                    <TextField
                        className={classes.editField}
                        label="Km in"
                        type="number"
                        size="small"
                        fullWidth
                        value={kmIn}
                        onChange={(e) => setKmIn(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={isSaving}
                    />
                    <ArrowRightAltRounded className={classes.arrowIcon} />
                    <TextField
                        className={classes.editField}
                        label="Km out"
                        type="number"
                        size="small"
                        fullWidth
                        value={kmOut}
                        onChange={(e) => setKmOut(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={isSaving}
                    />
                </Box>
            )}

            <Box className={classes.actions}>
                {!isEditing ? (
                    <Tooltip title="Edit this entry">
                        <IconButton size="small" className={classes.editBtn} onClick={onStartEdit}>
                            <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title="Save">
                            <span>
                                <IconButton size="small" className={classes.saveBtn} onClick={handleSave} disabled={isSaving}>
                                    <Check sx={{ fontSize: 17 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton size="small" className={classes.cancelBtn} onClick={onCancel} disabled={isSaving}>
                                <Close sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );
}

function KmHistoryTab({ driverId, filters }) {

    const { classes } = useStyles();
    const { data: records = [], isLoading } = useDriverHistoryKm(driverId, filters);
    const { updateDriverKm } = useDriverMutation();
    const [editingId, setEditingId] = useState(null);

    const handleSave = useCallback(async (payload) => {
        await updateDriverKm.mutateAsync(payload);
        setEditingId(null);
    }, [driverId]);

    if (isLoading) {
        return (
            <Box>
                <RowSkeleton classes={classes} />
                <RowSkeleton classes={classes} />
                <RowSkeleton classes={classes} />
            </Box>
        );
    }

    if (!records.length) {
        return <EmptyState classes={classes} icon={EventBusy} text="No km history for this period" />;
    }

    return (
        <Box>
            {records.map((record) => (
                <KmRow
                    key={record.id}
                    record={record}
                    classes={classes}
                    isEditing={editingId === record.id}
                    isSaving={updateDriverKm.isPending && editingId === record.id}
                    onStartEdit={() => setEditingId(record.id)}
                    onCancel={() => setEditingId(null)}
                    onSave={handleSave}
                />
            ))}
        </Box>
    );
}

function DriverClockHistory(props) {

    const { driverId, filters } = props;
    const { classes } = useStyles();
    const [tab, setTab] = useState(0);

    return (
        <Box className={classes.root}>
            <Box className={classes.tabsBar}>
                <Tabs
                    value={tab}
                    centered
                    onChange={(e, v) => setTab(v)}
                    classes={{ indicator: classes.tabIndicator }}
                >
                    <Tab
                        label="Clock History"
                        icon={<AccessTime sx={{ fontSize: 17 }} />}
                        iconPosition="start"
                        classes={{ root: classes.tabRoot }}
                    />
                    <Tab
                        label="Km History"
                        icon={<DirectionsCar sx={{ fontSize: 17 }} />}
                        iconPosition="start"
                        classes={{ root: classes.tabRoot }}
                    />
                </Tabs>
            </Box>
            <Box className={classes.listWrap}>
                {tab === 0 && <ClockHistoryTab driverId={driverId} filters={filters} />}
                {tab === 1 && <KmHistoryTab driverId={driverId} filters={filters} />}
            </Box>
        </Box>
    );
}

export default React.memo(DriverClockHistory)