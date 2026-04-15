import React, { useState, useMemo } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Paper, TextField, InputAdornment, Autocomplete, Chip, Avatar, Grid, CircularProgress, Collapse, Fade, Alert, Divider } from '@mui/material';
import { RouteOutlined, PersonOutline, LocalShippingOutlined, CalendarTodayOutlined, TagOutlined, SearchOutlined, AddCircleOutlineOutlined, HistoryOutlined, WarningAmberRounded, CheckCircleOutlined, ArrowForwardOutlined } from '@mui/icons-material';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';
import { useDriverTrips } from '../../hooks/useDispatchOrders';
import { useDrivers } from '../../hooks/useDrivers';
import moment from 'moment';


const LoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">{textLoading ?? 'Loading…'}</Typography>
    </Box>
);

const initials = (name) => name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
const avatarColor = (seed) => {
    const idx = seed ? seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length : Math.floor(Math.random() * AVATAR_COLORS.length);
    return AVATAR_COLORS[idx];
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Icon sx={{ fontSize: 15, color: 'text.disabled' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {children}
        </Typography>
    </Box>
);

const TripCard = ({ trip, selected, onClick }) => {
    const color = avatarColor(trip.driver_name);
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, px: 1.75, py: 1.25, borderRadius: '10px', border: '1.5px solid', borderColor: selected ? 'primary.main' : 'transparent',
                bgcolor: selected ? 'primary.50' : 'grey.50', cursor: 'pointer', transition: 'all 0.15s ease', '&:hover': { borderColor: selected ? 'primary.main' : 'grey.300', bgcolor: selected ? 'primary.50' : '#fff' },
            }}
        >
            <Box sx={{ px: 1, py: 0.4, borderRadius: '6px', bgcolor: selected ? 'primary.main' : 'grey.200', minWidth: 90, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: selected ? '#fff' : 'text.primary' }}>
                    # {trip.trip_number}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                <CalendarTodayOutlined sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{formatDate(trip.trip_date)}</Typography>
            </Box>
            <Chip
                avatar={
                    <Avatar sx={{ width: 35, height: 35, bgcolor: `${color} !important`, fontSize: '10px !important' }}>
                        {initials(trip.driver_name)}
                    </Avatar>
                }
                label={trip.driver_number}
                sx={{
                    fontSize: 11, fontWeight: 600, bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', py: 2,
                    '& .MuiChip-avatar': { width: 25, height: 25, marginRight: 0.1, color: '#fff' }, '& .MuiChip-label': { pl: 0.75 },
                }}
            />
            {selected && <CheckCircleOutlined sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />}
        </Box>
    );
};

const ConflictBanner = ({ driver, driverTripsCount, onCreateNewTrip, onSelectExisting }) => (
    <Fade in>
        <Paper elevation={0} sx={{ mt: 2, borderRadius: '12px', overflow: 'hidden', border: '1.5px solid', borderColor: 'warning.light', }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fffbeb', display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <WarningAmberRounded sx={{ fontSize: 20, color: 'warning.main', mt: 0.1, flexShrink: 0 }} />
                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                        Driver already has {driverTripsCount} active trip{driverTripsCount > 1 ? 's' : ''}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#a16207', mt: 0.25 }}>
                        <strong>{driver.fname} {driver.lname}</strong> ({driver.driver_number}) is already assigned to the following trip{driverTripsCount > 1 ? 's' : ''}.
                        How would you like to proceed?
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'warning.light' }} />

            <Box sx={{ px: 2, py: 1.5, bgcolor: '#fffdf5', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Box
                    onClick={onCreateNewTrip}
                    sx={{
                        flex: 1, minWidth: 160, px: 2, py: 1.25, borderRadius: '9px', border: '1.5px solid', borderColor: 'grey.300', bgcolor: '#fff', cursor: 'pointer', transition: 'all 0.15s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }, display: 'flex', flexDirection: 'column', gap: 0.25,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <AddCircleOutlineOutlined sx={{ fontSize: 15, color: 'primary.main' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main' }}>Create New Trip</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                        Add a separate trip for this driver
                    </Typography>
                </Box>

                <Box
                    onClick={onSelectExisting}
                    sx={{
                        flex: 1, minWidth: 160, px: 2, py: 1.25, borderRadius: '9px', border: '1.5px solid', borderColor: 'grey.300', bgcolor: '#fff', cursor: 'pointer', transition: 'all 0.15s',
                        '&:hover': { borderColor: 'warning.main', bgcolor: '#fffbeb' }, display: 'flex', flexDirection: 'column', gap: 0.25,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ArrowForwardOutlined sx={{ fontSize: 15, color: 'warning.dark' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'warning.dark' }}>Select Existing Trip</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                        Add orders to one of this driver's trips
                    </Typography>
                </Box>
            </Box>
        </Paper>
    </Fade>
);

const DriverTripSelector = ({ driver, trips, selectedTrip, onSelect }) => {

    const color = avatarColor(driver.fname + driver.lname);
    const driverTrips = useMemo(() => (trips || []).filter((t) => t.driver_id === driver.id || t.driver_number === driver.driver_number), [trips, driver]);

    return (
        <Fade in>
            <Box>
                <Paper elevation={0} sx={{ mb: 2, px: 1.75, py: 1.25, borderRadius: '10px', border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)', display: 'flex', alignItems: 'center', gap: 1.5, }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: color, fontSize: 13, fontWeight: 700 }}>
                        {initials(`${driver.fname} ${driver.lname}`)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{driver.fname} {driver.lname}</Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{driver.driver_number}</Typography>
                    </Box>
                    <Chip label={`${driverTrips.length} trip${driverTrips.length !== 1 ? 's' : ''}`}
                        size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: 'primary.50', color: 'primary.main' }} />
                </Paper>

                <SectionLabel icon={RouteOutlined}>Select a Trip for This Driver</SectionLabel>

                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 340, overflowY: 'auto', pr: 0.5, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
                }}>
                    {driverTrips.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No trips found for this driver</Typography>
                        </Box>
                    ) : driverTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            selected={selectedTrip?.id === trip.id}
                            onClick={() => onSelect(selectedTrip?.id === trip.id ? null : trip)}
                        />
                    ))}
                </Box>
            </Box>
        </Fade>
    );
};

const SelectedTripSection = ({ selectedTrip }) => {
    return <Fade in>
        <Paper elevation={0} sx={{ mt: 2, p: 1.5, borderRadius: '10px', border: '1px solid', borderColor: 'primary.light', bgcolor: 'primary.50', display: 'flex', alignItems: 'center', gap: 1.5, }}>
            <LocalShippingOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
            <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main' }}>
                    Trip #{selectedTrip.trip_number}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {formatDate(selectedTrip.trip_date)} · {selectedTrip.driver_name} ({selectedTrip.driver_number})
                </Typography>
            </Box>
        </Paper>
    </Fade>
}

export default function TripForm({ createTrip, addOrdersToTrip, orderIds, setSelectedOrders }) {

    const [mode, setMode] = useState('existing');
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [tripSearch, setTripSearch] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [conflictState, setConflictState] = useState(null);

    const { data: trips, isLoading } = useDriverTrips({ enabled: true });
    const { data: drivers, isLoading: isDriverLoading } = useDrivers({ enabled: mode === 'new' });

    const filteredTrips = useMemo(() => (trips || []).filter((t) => {
        const q = tripSearch.toLowerCase();
        return (String(t.trip_number)?.includes(q) || String(t.driver_number)?.toLowerCase()?.includes(q) || String(t.driver_name)?.toLowerCase()?.includes(q) || String(t.trip_date)?.includes(q));
    }), [trips, tripSearch]);

    const conflictDriverTrips = useMemo(() => {
        if (!selectedDriver || !trips) return [];
        return trips.filter((t) => t.driver_id === selectedDriver.id || t.driver_number === selectedDriver.driver_number);
    }, [selectedDriver, trips]);

    const handleDriverChange = (_, val) => {
        setSelectedDriver(val);
        setConflictState(null);
        setSelectedTrip(null);
        if (!val) return;
        const driverTrips = (trips || []).filter((t) => t.driver_id === val.id || t.driver_number === val.driver_number);
        if (driverTrips.length > 0) {
            setConflictState('pending');
        }
    };

    const handleModeChange = (_, val) => {
        if (!val) return;
        setMode(val);
        setSelectedTrip(null);
        setSelectedDriver(null);
        setConflictState(null);
    };

    const isSubmitDisabled = useMemo(() => {
        if (submitted) return true;
        if (mode === 'existing') return !selectedTrip;
        if (mode === 'new') {
            if (!selectedDriver) return true;
            if (conflictState === 'pending') return true;
            if (conflictState === 'select') return !selectedTrip;
            if (conflictState === 'create') return false;
            return false;
        }
        return true;
    }, [mode, selectedTrip, selectedDriver, conflictState, submitted]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        try {
            let payload = {};
            const isCreatingNew = mode === 'new' && conflictState !== 'select';

            if (isCreatingNew) {
                payload = {
                    driver_id: selectedDriver.id,
                    driver_number: selectedDriver.driver_number,
                    driver_name: `${selectedDriver.fname} ${selectedDriver.lname}`,
                    trip_date: moment(new Date()).format('YYYY-MM-DD'),
                    trip_type: 'driver',
                    trip_status: 'planning',
                    driver_active: false,
                    dispatch_orders: orderIds.map((id, index) => ({ order_id: id, order_level: index + 1 })),
                };
                await createTrip(payload);
            } else {
                payload = {
                    trip_id: Number(selectedTrip.id),
                    dispatch_orders: orderIds.map((id) => Number(id)),
                };
                await addOrdersToTrip(payload);
            }
        } catch (_) {
            // error
        } finally {
            setSubmitted(false);
        }
    };

    const reset = () => {
        setSelectedDriver(null);
        setSelectedTrip(null);
        setSelectedOrders(new Map());
        setConflictState(null);
    };

    const submitLabel = useMemo(() => {
        if (mode === 'existing') return 'Add to Trip';
        if (conflictState === 'select') return 'Add to Trip';
        return 'Create Trip';
    }, [mode, conflictState]);

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <ToggleButtonGroup
                            value={mode} exclusive onChange={handleModeChange} fullWidth
                            sx={{ bgcolor: 'grey.100', borderRadius: '12px', p: '4px', border: 'none', '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '9px !important', mx: '2px', transition: 'all 0.2s ease' }, }}
                        >
                            <ToggleButton value="existing" sx={{ py: 1, fontWeight: 600, fontSize: 13, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { bgcolor: '#fff !important', color: 'primary.main', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' } }}>
                                <HistoryOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Select Existing Trip
                            </ToggleButton>
                            <ToggleButton value="new" sx={{ py: 1, fontWeight: 600, fontSize: 13, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { bgcolor: '#fff !important', color: 'primary.main', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' } }}>
                                <AddCircleOutlineOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Create New Trip
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {mode === 'existing' && (
                        <Box>
                            <SectionLabel icon={RouteOutlined}>Available Trips</SectionLabel>
                            <TextField
                                fullWidth size="small"
                                placeholder="Search by trip #, driver…"
                                value={tripSearch}
                                onChange={(e) => setTripSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment>,
                                    sx: { borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50', '& fieldset': { borderColor: 'grey.200' } },
                                }}
                                sx={{ mb: 1.5 }}
                            />
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 450, overflowY: 'auto', pr: 0.5,
                                '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
                            }}>
                                {isLoading ? <LoadingState textLoading="Loading Driver Trips…" /> :
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
                            {selectedTrip && (<SelectedTripSection selectedTrip={selectedTrip} />)}
                        </Box>
                    )}

                    {mode === 'new' && (
                        <Box>
                            <SectionLabel icon={PersonOutline}>Assign Driver</SectionLabel>
                            {isDriverLoading
                                ? <LoadingState textLoading="Loading Drivers…" />
                                : (drivers || []).length === 0
                                    ? <Box sx={{ textAlign: 'center', py: 4 }}><Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No drivers available</Typography></Box>
                                    : (
                                        <Autocomplete
                                            options={drivers || []}
                                            value={selectedDriver}
                                            onChange={handleDriverChange}
                                            getOptionLabel={(o) => `${o.fname} ${o.lname} — ${o.driver_number}`}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            slotProps={{
                                                popper: {
                                                    sx: {
                                                        zIndex: 9999,
                                                    },
                                                },
                                            }}
                                            renderOption={(props, option) => {
                                                const { key, ...rest } = props;
                                                const color = avatarColor(option.fname + option.lname);
                                                return (
                                                    <Box key={key} component="li" {...rest} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '10px !important' }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: 12, fontWeight: 700 }}>
                                                            {initials(`${option.fname} ${option.lname}`)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{option.fname} {option.lname}</Typography>
                                                            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{option.driver_number}</Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Search driver by name or number…"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                {selectedDriver
                                                                    ? <Avatar sx={{ width: 24, height: 24, bgcolor: avatarColor(selectedDriver.fname + selectedDriver.lname), fontSize: 10, fontWeight: 700, mr: 0.5 }}>{initials(`${selectedDriver.fname} ${selectedDriver.lname}`)}</Avatar>
                                                                    : <PersonOutline sx={{ fontSize: 17, color: 'text.disabled', mr: 0.5 }} />
                                                                }
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        ),
                                                        sx: { borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50', '& fieldset': { borderColor: 'grey.200' } },
                                                    }}
                                                />
                                            )}
                                            sx={{ mb: 1 }}
                                        />
                                    )
                            }
                            {conflictState === 'pending' && selectedDriver && (
                                <ConflictBanner
                                    driver={selectedDriver}
                                    driverTripsCount={conflictDriverTrips?.length ?? 0}
                                    onCreateNewTrip={() => setConflictState('create')}
                                    onSelectExisting={() => setConflictState('select')}
                                />
                            )}
                            {conflictState === 'create' && selectedDriver && (
                                <Fade in>
                                    <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: '12px', border: '1.5px solid', borderColor: 'success.light', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 1.5, }}>
                                        <CheckCircleOutlined sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                                        <Box>
                                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'success.dark' }}>
                                                New trip will be created
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                                                A new trip will be assigned to <strong>{selectedDriver.fname} {selectedDriver.lname}</strong> ({selectedDriver.driver_number})
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Fade>
                            )}
                            {conflictState === 'select' && selectedDriver && (
                                <Box sx={{ mt: 2 }}>
                                    <DriverTripSelector
                                        driver={selectedDriver}
                                        trips={trips}
                                        selectedTrip={selectedTrip}
                                        onSelect={setSelectedTrip}
                                    />
                                    {selectedTrip && (<SelectedTripSection selectedTrip={selectedTrip} />)}
                                </Box>
                            )}
                            {!conflictState && selectedDriver && (
                                <Fade in>
                                    <Paper elevation={0} sx={{ mt: 1.5, p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)', display: 'flex', alignItems: 'center', gap: 2, }}>
                                        <Avatar sx={{ width: 44, height: 44, bgcolor: avatarColor(selectedDriver.fname + selectedDriver.lname), fontSize: 16, fontWeight: 700 }}>
                                            {initials(`${selectedDriver.fname} ${selectedDriver.lname}`)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{selectedDriver.fname} {selectedDriver.lname}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                                <TagOutlined sx={{ fontSize: 13, color: 'text.disabled' }} />
                                                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{selectedDriver.driver_number}</Typography>
                                            </Box>
                                        </Box>
                                        <Chip label="Assigned" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: 11 }} />
                                    </Paper>
                                </Fade>
                            )}
                        </Box>
                    )}
                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            id="save-user-action"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitted}
                            disabled={isSubmitDisabled}
                        >
                            {submitLabel}
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