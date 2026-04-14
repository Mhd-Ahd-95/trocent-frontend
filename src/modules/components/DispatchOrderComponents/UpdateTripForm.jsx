import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, InputAdornment, Autocomplete, Avatar, Grid, CircularProgress } from '@mui/material';
import { PersonOutline, CalendarTodayOutlined, LocalShippingOutlined, CheckCircleOutlined, RadioButtonUncheckedOutlined, DirectionsCarOutlined, DoneAllOutlined, BusinessOutlined } from '@mui/icons-material';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';
import { useDrivers } from '../../hooks/useDrivers';
import { useInterliners } from '../../hooks/useInterliners';
import moment from 'moment';


const LoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} sx={{ color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary">{textLoading ?? 'Loading…'}</Typography>
    </Box>
);

const initials = (name) =>
    name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

const AVATAR_COLORS = ['#DD9100', '#7c3aed', '#0891b2', '#059669', '#d97706', '#2c3e50'];
const avatarColor = (seed) => {
    const idx = seed
        ? seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
        : 0;
    return AVATAR_COLORS[idx];
};

const TRIP_STATUSES = [
    {
        value: 'planning',
        label: 'Planning',
        icon: RadioButtonUncheckedOutlined,
        color: '#64748b',
        bg: '#f1f5f9',
        chipBg: '#e2e8f0',
        chipColor: '#475569',
    },
    {
        value: 'active',
        label: 'Active',
        icon: DirectionsCarOutlined,
        color: '#2980b9',
        bg: '#eff6ff',
        chipBg: '#dbeafe',
        chipColor: '#1e40af',
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: DoneAllOutlined,
        color: '#059669',
        bg: '#f0fdf4',
        chipBg: '#dcfce7',
        chipColor: '#166534',
    },
];

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Icon sx={{ fontSize: 15, color: 'text.disabled' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {children}
        </Typography>
    </Box>
);

const StatusOption = ({ status, selected, onClick }) => {
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
            {selected && (<CheckCircleOutlined sx={{ fontSize: 16, color: status.color, flexShrink: 0 }} />)}
        </Box>
    );
};

export default function UpdateTripForm({ updateTrip, tripData, isInterliner, onClose }) {

    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [tripStatus, setTripStatus] = useState(tripData?.trip_status ?? '');
    const [tripDate, setTripDate] = useState(tripData?.trip_date ? moment(tripData.trip_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
    const [submitted, setSubmitted] = useState(false);

    const { data: drivers, isLoading: isDriverLoading } = useDrivers({ enabled: !Boolean(isInterliner) });
    const { data: interliners, isLoading: isInterlinerLoading } = useInterliners({ enabled: Boolean(isInterliner) });

    const options = isInterliner ? (interliners || []) : (drivers || []);
    const isLoading = isInterliner ? isInterlinerLoading : isDriverLoading;

    const getOptionLabel = (o) => isInterliner ? o.name : `${o.fname} ${o.lname} — ${o.driver_number}`;
    const getAssigneeName = (o) => isInterliner ? o.name : `${o.fname} ${o.lname}`;
    const getAssigneeNumber = (o) => isInterliner ? null : o.driver_number;
    const getAssigneeSeed = (o) => isInterliner ? o.name : `${o.fname}${o.lname}`;

    const isSubmitDisabled = useMemo(() => {
        if (submitted) return true;
        return !selectedAssignee && !tripStatus && !tripDate;
    }, [submitted, selectedAssignee, tripStatus, tripDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        try {
            let payload = { trip_id: tripData?.id }
            if (isInterliner) {
                payload['payload'] = { interliner_id: selectedAssignee.id, interliner_name: selectedAssignee.name, trip_status: tripStatus, trip_date: tripDate }
            }
            else {
                payload['payload'] = { driver_id: selectedAssignee.id, driver_number: selectedAssignee.driver_number, driver_name: `${selectedAssignee.fname} ${selectedAssignee.lname}`, trip_status: tripStatus, trip_date: tripDate }
            }
            await updateTrip(payload);
        } catch (_) {
        } finally {
            setSubmitted(false);
        }
    };

    const reset = () => {
        handleSelectedAssigned();
        setTripStatus(tripData?.trip_status ?? '');
        setTripDate(tripData?.trip_date ? moment(tripData.trip_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
    };

    const handleSelectedAssigned = () => {
        if (isInterliner) {
            const interliner = options.find(o => o.id === tripData.interliner_id)
            interliner ? setSelectedAssignee(interliner) : setSelectedAssignee(null)
            return
        }
        const driver = options.find(o => o.id === tripData.driver_id)
        driver ? setSelectedAssignee(driver) : setSelectedAssignee(null)
    }

    React.useEffect(() => {
        if (options?.length > 0) {
            handleSelectedAssigned()
        }
    }, [options, isInterliner])

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <SectionLabel icon={isInterliner ? BusinessOutlined : PersonOutline}>
                            {isInterliner ? 'Assign Interliner' : 'Assign Driver'}
                        </SectionLabel>
                        {isLoading ? (
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
                                value={selectedAssignee}
                                onChange={(_, val) => setSelectedAssignee(val)}
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
                                slotProps={{
                                    popper: {
                                        sx: {
                                            zIndex: 9999,
                                        },
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder={isInterliner ? 'Search interliner by company or number…' : 'Search driver by name or number…'}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    {selectedAssignee ? (
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: avatarColor(getAssigneeSeed(selectedAssignee)), fontSize: 10, fontWeight: 700, mr: 0.5 }}>
                                                            {initials(getAssigneeName(selectedAssignee))}
                                                        </Avatar>
                                                    ) : isInterliner ? (
                                                        <BusinessOutlined sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                    ) : (
                                                        <PersonOutline sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                    )}
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            sx: {
                                                borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50',
                                                '& fieldset': { borderColor: 'grey.200' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' },
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
                                    selected={tripStatus === status.value}
                                    onClick={() => setTripStatus(tripStatus === status.value ? '' : status.value)}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <SectionLabel icon={CalendarTodayOutlined}>Trip Date</SectionLabel>
                        <TextField
                            fullWidth
                            type="date"
                            size="small"
                            value={tripDate}
                            onChange={(e) => setTripDate(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50',
                                    '& fieldset': { borderColor: 'grey.200' },
                                    '&:hover fieldset': { borderColor: 'primary.main' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                            inputProps={{ style: { fontSize: 13 } }}
                        />
                        {tripDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.75, pl: 0.5 }}>
                                <CheckCircleOutlined sx={{ fontSize: 13, color: 'primary.main' }} />
                                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                                    {moment(tripDate).format('dddd, MMMM D, YYYY')}
                                </Typography>
                            </Box>
                        )}
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
                            onClick={reset}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}