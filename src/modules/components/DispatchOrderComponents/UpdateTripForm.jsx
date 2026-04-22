import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Autocomplete, Avatar, Grid, CircularProgress } from '@mui/material';
import { PersonOutline, CalendarTodayOutlined, LocalShippingOutlined, CheckCircleOutlined, RadioButtonUncheckedOutlined, DirectionsCarOutlined, DoneAllOutlined, BusinessOutlined } from '@mui/icons-material';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';
import { useDrivers } from '../../hooks/useDrivers';
import { useInterliners } from '../../hooks/useInterliners';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const LoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} sx={{ color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary">{textLoading ?? 'Loading…'}</Typography>
    </Box>
);

const initials = (name) => name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

const AVATAR_COLORS = ['#DD9100', '#7c3aed', '#0891b2', '#059669', '#d97706', '#2c3e50'];
const avatarColor = (seed) => {
    const idx = seed ? seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length : 0;
    return AVATAR_COLORS[idx];
};

const TRIP_STATUSES = [
    { value: 'planning', label: 'Planning', icon: RadioButtonUncheckedOutlined, color: '#64748b', bg: '#f1f5f9', chipBg: '#e2e8f0', chipColor: '#475569' },
    { value: 'active', label: 'Active', icon: DirectionsCarOutlined, color: '#2980b9', bg: '#eff6ff', chipBg: '#dbeafe', chipColor: '#1e40af' },
    { value: 'completed', label: 'Completed', icon: DoneAllOutlined, color: '#059669', bg: '#f0fdf4', chipBg: '#dcfce7', chipColor: '#166534' },
];

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Icon sx={{ fontSize: 15, color: 'text.disabled' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {children}
        </Typography>
    </Box>
);

const StatusOption = React.memo(({ status, selected, onClick }) => {
    const Icon = status.icon;
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1.1, borderRadius: '10px', cursor: 'pointer', border: '1.5px solid',
                borderColor: selected ? status.color : 'transparent', bgcolor: selected ? status.bg : 'grey.50',
                transition: 'all 0.15s ease', '&:hover': { borderColor: status.color, bgcolor: status.bg },
            }}
        >
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: selected ? status.color : 'grey.200', transition: 'all 0.15s', flexShrink: 0 }}>
                <Icon sx={{ fontSize: 15, color: selected ? '#fff' : 'text.disabled' }} />
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: selected ? 700 : 500, color: selected ? status.color : 'text.primary', flex: 1 }}>
                {status.label}
            </Typography>
            {selected && <CheckCircleOutlined sx={{ fontSize: 16, color: status.color, flexShrink: 0 }} />}
        </Box>
    );
});

export default function UpdateTripForm({ updateTrip, tripData, isInterliner, onClose }) {

    const [form, setForm] = useState({ assignee: null, status: tripData?.trip_status ?? '', trip_date: moment(tripData.trip_date).format('YYYY-MM-DD') });
    const [submitted, setSubmitted] = useState(false);

    const { data: drivers, isLoading: isDriverLoading } = useDrivers({ enabled: !Boolean(isInterliner) });
    const { data: interliners, isLoading: isInterlinerLoading } = useInterliners({ enabled: Boolean(isInterliner) });

    const options = useMemo(() => (isInterliner ? interliners : drivers) ?? [], [isInterliner, interliners, drivers]);

    const getOptionLabel = useCallback((o) => isInterliner ? o.name : `${o.fname} ${o.lname} — ${o.driver_number}`, [isInterliner]);
    const getAssigneeName = useCallback((o) => isInterliner ? o.name : `${o.fname} ${o.lname}`, [isInterliner]);
    const getAssigneeNumber = useCallback((o) => isInterliner ? null : o.driver_number, [isInterliner]);
    const getAssigneeSeed = useCallback((o) => isInterliner ? o.name : `${o.fname}${o.lname}`, [isInterliner]);

    useEffect(() => {
        if (!options.length) return;
        const match = isInterliner ? options.find((o) => o.id === tripData?.interliner_id) : options.find((o) => o.id === tripData?.driver_id);
        setForm((prev) => ({ ...prev, assignee: match ?? null }));
    }, [options, isInterliner, tripData?.interliner_id, tripData?.driver_id]);

    const isSubmitDisabled = submitted || (!form.assignee && !form.status && !form.date);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        try {
            const payload = { trip_id: tripData?.id };
            payload.payload = isInterliner
                ? { interliner_id: form.assignee.id, interliner_name: form.assignee.name, trip_status: form.status, trip_date: moment.utc(form.trip_date).format('YYYY-MM-DD') }
                : { driver_id: form.assignee.id, driver_number: form.assignee.driver_number, driver_name: `${form.assignee.fname} ${form.assignee.lname}`, trip_status: form.status, trip_date: moment.utc(form.trip_date).format('YYYY-MM-DD') };
            await updateTrip(payload);
        } catch (_) {
        } finally {
            setSubmitted(false);
            onClose()
        }
    };

    const handleReset = useCallback(() => {
        const match = isInterliner ? options.find((o) => o.id === tripData?.interliner_id) : options.find((o) => o.id === tripData?.driver_id);
        setForm({ assignee: match ?? null, status: tripData?.trip_status ?? '', trip_date: moment(tripData.trip_date).format('YYYY-MM-DD') });
    }, [options, isInterliner, tripData]);

    const handleStatusToggle = useCallback((value) => setForm((prev) => ({ ...prev, status: prev.status === value ? '' : value })), []);
    const handleAssigneeChange = useCallback((_, val) => setForm((prev) => ({ ...prev, assignee: val })), []);
    const handleDateChange = useCallback((date) => setForm((prev) => ({ ...prev, trip_date: date })), []);

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <SectionLabel icon={isInterliner ? BusinessOutlined : PersonOutline}>
                            {isInterliner ? 'Assign Interliner' : 'Assign Driver'}
                        </SectionLabel>
                        {isDriverLoading || isInterlinerLoading ? (
                            <LoadingState textLoading={isInterliner ? 'Loading Interliners…' : 'Loading Drivers…'} />
                        ) : options.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
                                    {isInterliner ? 'No interliners available' : 'No drivers available'}
                                </Typography>
                            </Box>
                        ) : (
                            <Autocomplete
                                options={options}
                                value={form.assignee}
                                onChange={handleAssigneeChange}
                                getOptionLabel={getOptionLabel}
                                renderOption={(props, option) => {
                                    const { key, ...rest } = props;
                                    const seed = getAssigneeSeed(option);
                                    const color = avatarColor(seed);
                                    const name = getAssigneeName(option);
                                    const number = getAssigneeNumber(option);
                                    return (
                                        <Box key={key} component="li" {...rest} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '10px !important' }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: 12, fontWeight: 700 }}>
                                                {initials(name)}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{name}</Typography>
                                                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{number}</Typography>
                                            </Box>
                                        </Box>
                                    );
                                }}
                                slotProps={{ popper: { sx: { zIndex: 9999 } } }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        placeholder={isInterliner ? 'Search interliner by company or number…' : 'Search driver by name or number…'}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    {form.assignee ? (
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: avatarColor(getAssigneeSeed(form.assignee)), fontSize: 10, fontWeight: 700, mr: 0.5 }}>
                                                            {initials(getAssigneeName(form.assignee))}
                                                        </Avatar>
                                                    ) : isInterliner ? (<BusinessOutlined sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                    ) : (<PersonOutline sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                    )}
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            sx: {
                                                borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50',
                                                '& fieldset': { borderColor: 'grey.200' },
                                                '&:hover fieldset': { borderColor: 'primary.main' },
                                                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <SectionLabel icon={LocalShippingOutlined}>Trip Status</SectionLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.65 }}>
                            {TRIP_STATUSES.map((status) => (
                                <StatusOption
                                    key={status.value}
                                    status={status}
                                    selected={form.status === status.value}
                                    onClick={() => handleStatusToggle(status.value)}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <SectionLabel icon={CalendarTodayOutlined}>Trip Date</SectionLabel>
                        <DatePicker
                            views={['year', 'month', 'day']}
                            value={form.trip_date ? moment(form.trip_date) : null}
                            onChange={(date) => {
                                const onlyDate = date ? moment(date).format("YYYY-MM-DD") : null;
                                handleDateChange(onlyDate)
                            }}
                            slotProps={{
                                popper: {
                                    sx: { zIndex: 9999 }
                                },
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    sx: {
                                        '& .MuiPickersOutlinedInput-root': { height: 45, borderRadius: 2 },
                                        '& .MuiOutlinedInput-input': { fontSize: '14px', padding: '10px 14px' },
                                        '& .MuiInputLabel-root': { fontSize: '13px' },
                                        '& .MuiInputLabel-shrink': { fontSize: '14px' },
                                    }
                                }
                            }}
                        />
                    </Box>

                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            id="update-trip-action"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitted}
                            disabled={isSubmitDisabled}
                        >
                            Update Trip
                        </SubmitButton>
                    </Grid>
                    <Grid size="auto">
                        <StyledButton
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={submitted}
                            textTransform="capitalize"
                            onClick={handleReset}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}