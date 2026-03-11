import React, { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Paper, TextField, InputAdornment, Autocomplete, Chip, Avatar, Grid, CircularProgress } from '@mui/material';
import { RouteOutlined, PersonOutline, LocalShippingOutlined, CalendarTodayOutlined, TagOutlined, SearchOutlined, AddCircleOutlineOutlined, HistoryOutlined } from '@mui/icons-material';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';
import { useDriverTrips } from '../../hooks/useDispatchOrders';
import { useDrivers } from '../../hooks/useDrivers'

const DRIVERS = [
    { id: 1, name: 'James Tremblay', number: 'DRV-001' },
    { id: 2, name: 'Marie Bouchard', number: 'DRV-002' },
    { id: 3, name: 'Kevin Okafor', number: 'DRV-003' },
    { id: 4, name: 'Sylvie Lapointe', number: 'DRV-004' },
    { id: 5, name: 'Ahmed Mansouri', number: 'DRV-005' },
    { id: 6, name: 'Chantal Gagnon', number: 'DRV-006' },
    { id: 7, name: 'Derek Fontaine', number: 'DRV-007' },
    { id: 8, name: 'Priya Nair', number: 'DRV-008' },
    { id: 9, name: 'Lucas Bergeron', number: 'DRV-009' },
    { id: 10, name: 'Fatima El-Hassan', number: 'DRV-010' },
];

const OLD_TRIPS = [
    { id: 1, trip_number: 'TRP-8841', date: '2025-03-01', driver_number: 'DRV-003', driver_name: 'Kevin Okafor' },
    { id: 2, trip_number: 'TRP-8842', date: '2025-03-01', driver_number: 'DRV-007', driver_name: 'Derek Fontaine' },
    { id: 3, trip_number: 'TRP-8843', date: '2025-03-02', driver_number: 'DRV-001', driver_name: 'James Tremblay' },
    { id: 4, trip_number: 'TRP-8844', date: '2025-03-02', driver_number: 'DRV-005', driver_name: 'Ahmed Mansouri' },
    { id: 5, trip_number: 'TRP-8845', date: '2025-03-03', driver_number: 'DRV-009', driver_name: 'Lucas Bergeron' },
    { id: 6, trip_number: 'TRP-8846', date: '2025-03-03', driver_number: 'DRV-002', driver_name: 'Marie Bouchard' },
    { id: 7, trip_number: 'TRP-8847', date: '2025-03-04', driver_number: 'DRV-010', driver_name: 'Fatima El-Hassan' },
    { id: 8, trip_number: 'TRP-8848', date: '2025-03-04', driver_number: 'DRV-006', driver_name: 'Chantal Gagnon' },
    { id: 9, trip_number: 'TRP-8849', date: '2025-03-05', driver_number: 'DRV-004', driver_name: 'Sylvie Lapointe' },
    { id: 10, trip_number: 'TRP-8850', date: '2025-03-05', driver_number: 'DRV-008', driver_name: 'Priya Nair' },
];

const LoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">{textLoading ? textLoading : 'Loading trips…'}</Typography>
    </Box>
);

const initials = (name) => name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

const avatarColor = () => {
    const palette = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
    return palette[Math.floor(Math.random() * palette.length)];
};

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Icon sx={{ fontSize: 15, color: 'text.disabled' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {children}
        </Typography>
    </Box>
);

const TripCard = ({ trip, selected, onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.75,
            py: 1.25,
            borderRadius: '10px',
            border: '1.5px solid',
            borderColor: selected ? 'primary.main' : 'transparent',
            bgcolor: selected ? 'primary.50' : 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: selected ? 'primary.main' : 'grey.300', bgcolor: selected ? 'primary.50' : '#fff' },
        }}
    >
        <Box sx={{ px: 1, py: 0.4, borderRadius: '6px', bgcolor: selected ? 'primary.main' : 'grey.200', minWidth: 90, textAlign: 'center', }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: selected ? '#fff' : 'text.primary' }}>
                {trip.trip_number}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
            <CalendarTodayOutlined sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{formatDate(trip.trip_date)}</Typography>
        </Box>
        <Chip
            avatar={
                <Avatar sx={{ width: 35, height: 35, bgcolor: `${avatarColor()} !important`, fontSize: '10px !important' }}>
                    {initials(trip.driver_name)}
                </Avatar>
            }
            label={trip.driver_number}
            // size="small"
            sx={{
                fontSize: 11, fontWeight: 600, bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', py: 2,
                '& .MuiChip-avatar': {
                    width: 25,
                    height: 25,
                    marginRight: 0.1,
                    color: '#fff'
                },
                '& .MuiChip-label': {
                    pl: 0.75,
                },
            }}
        />
    </Box>
);

export default function TripForm({ onFormChange, enabled }) {

    const [mode, setMode] = useState('existing');
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [tripSearch, setTripSearch] = useState('');

    const handleModeChange = (_, val) => { if (val) setMode(val); };
    const { data: trips, isLoading } = useDriverTrips({ enabled });

    const { data: drivers, isLoading: isDriverLoading } = useDrivers({ enabled: mode === 'new' ? true : false })

    const filteredTrips = (trips || []).filter((t) => {
        const q = tripSearch.toLowerCase();
        return (
            t.trip_number.toLowerCase().includes(q) ||
            t.driver_number.toLowerCase().includes(q) ||
            t.driver_name.toLowerCase().includes(q) ||
            t.trip_date.includes(q)
        );
    });

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }}        >
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <ToggleButtonGroup
                            value={mode}
                            exclusive
                            onChange={handleModeChange}
                            fullWidth
                            sx={{
                                bgcolor: 'grey.100',
                                borderRadius: '12px',
                                p: '4px',
                                border: 'none',
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 'none !important',
                                    borderRadius: '9px !important',
                                    mx: '2px',
                                    transition: 'all 0.2s ease',
                                },
                            }}
                        >
                            <ToggleButton
                                value="existing"
                                sx={{
                                    py: 1, fontWeight: 600, fontSize: 13,
                                    textTransform: 'none', color: 'text.secondary',
                                    '&.Mui-selected': {
                                        bgcolor: '#fff !important', color: 'primary.main',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <HistoryOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Select Existing Trip
                            </ToggleButton>
                            <ToggleButton
                                value="new"
                                sx={{
                                    py: 1, fontWeight: 600, fontSize: 13,
                                    textTransform: 'none', color: 'text.secondary',
                                    '&.Mui-selected': {
                                        bgcolor: '#fff !important', color: 'primary.main',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <AddCircleOutlineOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Create New Trip
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {mode === 'existing' && (
                        <Box>
                            <SectionLabel icon={RouteOutlined}>Available Trips</SectionLabel>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by trip #, driver…"
                                value={tripSearch}
                                onChange={(e) => setTripSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlined sx={{ fontSize: 17, color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: '10px', fontSize: 13,
                                        bgcolor: 'grey.50',
                                        '& fieldset': { borderColor: 'grey.200' },
                                    },
                                }}
                                sx={{ mb: 1.5 }}
                            />
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', gap: 0.75,
                                maxHeight: 450, overflowY: 'auto',
                                pr: 0.5,
                                '&::-webkit-scrollbar': { width: 4 },
                                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
                            }}>
                                {isLoading ? <LoadingState textLoading={'Loading Driver Trips...'} /> :
                                    filteredTrips.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No trips match your search</Typography>
                                        </Box>
                                    ) : filteredTrips.map((trip) => (
                                        <TripCard
                                            key={trip.id}
                                            trip={trip}
                                            selected={selectedTrip?.id === trip.id}
                                            onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
                                        />
                                    ))}
                            </Box>
                            {selectedTrip && (
                                <Paper elevation={0} sx={{
                                    mt: 2, p: 1.5, borderRadius: '10px',
                                    border: '1px solid', borderColor: 'primary.light',
                                    bgcolor: 'primary.50',
                                    display: 'flex', alignItems: 'center', gap: 1.5
                                }}>
                                    <LocalShippingOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main' }}>
                                            {selectedTrip.trip_number}
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                                            {formatDate(selectedTrip.date)} · {selectedTrip.driver_name} ({selectedTrip.driver_number})
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    )}
                    {mode === 'new' && (
                        <Box>
                            <SectionLabel icon={PersonOutline}>Assign Driver</SectionLabel>
                            {isDriverLoading ? <LoadingState textLoading={'Loading Drivers...'} />
                                :
                                (drivers || []).length === 0 ?
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No drivers available</Typography>
                                    </Box>
                                    :
                                    <Autocomplete
                                        options={drivers || []}
                                        value={selectedDriver}
                                        onChange={(_, val) => setSelectedDriver(val)}
                                        getOptionLabel={(o) => `${o.fname} ${o.lname} — ${o.driver_number}`}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '10px !important' }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor(), fontSize: 12, fontWeight: 700 }}>
                                                    {initials(`${option.fname} ${option.lname}`)}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{`${option.fname} ${option.lname}`}</Typography>
                                                    <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{option.driver_number}</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Search driver by name or number…"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            {selectedDriver ? (
                                                                <Avatar sx={{ width: 24, height: 24, bgcolor: avatarColor(), fontSize: 10, fontWeight: 700, mr: 0.5 }}>
                                                                    {initials(`${selectedDriver.fname} ${selectedDriver.lname}`)}
                                                                </Avatar>
                                                            ) : (
                                                                <PersonOutline sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                            )}
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    ),
                                                    sx: {
                                                        borderRadius: '10px', fontSize: 13,
                                                        bgcolor: 'grey.50',
                                                        '& fieldset': { borderColor: 'grey.200' },
                                                    },
                                                }}
                                            />
                                        )}
                                        sx={{ mb: 2.5 }}
                                    />
                            }
                            {selectedDriver && (
                                <Paper elevation={0} sx={{
                                    p: 2, borderRadius: '12px',
                                    border: '1px solid', borderColor: 'divider',
                                    background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                                    display: 'flex', alignItems: 'center', gap: 2,
                                }}>
                                    <Avatar sx={{ width: 44, height: 44, bgcolor: avatarColor(), fontSize: 16, fontWeight: 700 }}>
                                        {initials(`${selectedDriver.fname} ${selectedDriver.lname}`)}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{`${selectedDriver.fname} ${selectedDriver.lname}`}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                            <TagOutlined sx={{ fontSize: 13, color: 'text.disabled' }} />
                                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                                                {selectedDriver.driver_number}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label="Assigned"
                                        size="small"
                                        sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: 11 }}
                                    />
                                </Paper>
                            )}
                        </Box>
                    )}
                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}            >
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            id='save-user-action'
                            type='submit'
                            variant='outlined'
                            color='secondary'
                            size='small'
                            textTransform='capitalize'
                        // isLoading={loading}
                        >
                            Submit
                        </SubmitButton>
                    </Grid>
                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            // disabled={loading}
                            textTransform='capitalize'
                        // onClick={() => reset()}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}