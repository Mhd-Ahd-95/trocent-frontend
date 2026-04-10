import React, { useState, useMemo } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField, Grid, Paper, Fade, Divider, } from '@mui/material';
import { LocalShippingOutlined, MoveToInboxOutlined, CheckCircleOutlined, WarningAmberRounded, PersonOutline, } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';
import moment from 'moment';

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
        <Icon sx={{ fontSize: 14, color: 'text.disabled' }} />
        <Typography
            sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.disabled',
            }}
        >
            {children}
        </Typography>
    </Box>
);

const pickerSlotProps = (label) => ({
    textField: {
        size: 'small',
        fullWidth: true,
        label,
        sx: {
            '& .MuiInputLabel-root': { fontSize: '13px' },
            '& .MuiOutlinedInput-root': {
                fontSize: '13px',
                borderRadius: '10px',
                bgcolor: 'grey.50',
                '& fieldset': { borderColor: 'grey.200' },
            },
        },
    },
});

const isTabComplete = (state) => state.in !== null && state.out !== null && state.at !== null && state.signee.trim() !== '';

const defaultState = () => ({ in: moment(), out: moment(), at: moment(), signee: '' });

const StatusBanner = ({ complete, tab }) => {
    if (complete) {
        return (
            <Fade in>
                <Paper
                    elevation={0}
                    sx={{ mt: 2, px: 2, py: 1.5, borderRadius: '10px', border: '1.5px solid', borderColor: 'success.light', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 1.25 }}
                >
                    <CheckCircleOutlined sx={{ fontSize: 18, color: 'success.main', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'success.dark' }}>
                        {tab === 'pickup' ? 'Pickup' : 'Delivery'} details complete — ready to save
                    </Typography>
                </Paper>
            </Fade>
        );
    }
    return <></>
};


const TabPanel = ({ type, state, onChange }) => {
    
    const label = type === 'pickup' ? 'Pickup' : 'Delivery';
    const Icon = type === 'pickup' ? MoveToInboxOutlined : LocalShippingOutlined;
    const complete = isTabComplete(state);

    return (
        <Box>
            <SectionLabel icon={Icon}>{label} Schedule</SectionLabel>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid size={4}>
                    <TimePicker
                        value={state.in}
                        onChange={(val) => onChange('in', val)}
                        slotProps={pickerSlotProps(`${label} In`)}
                    />
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5, pl: 0.5 }}>
                        Arrival time
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <TimePicker
                        value={state.out}
                        onChange={(val) => onChange('out', val)}
                        slotProps={pickerSlotProps(`${label} Out`)}
                    />
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5, pl: 0.5 }}>
                        Departure time
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <DatePicker
                        value={state.at}
                        onChange={(val) => onChange('at', val)}
                        slotProps={pickerSlotProps(`${label} At`)}
                    />
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5, pl: 0.5 }}>
                        Date
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mb: 2, borderColor: 'grey.100' }} />
            <Box sx={{ mb: 1 }}>
                <SectionLabel icon={PersonOutline}>{label} Signee</SectionLabel>
                <TextField
                    label={`${label} Signee`}
                    variant="outlined"
                    value={state.signee}
                    onChange={(e) => onChange('signee', e.target.value)}
                    multiline
                    minRows={3}
                    maxRows={3}
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root': { fontSize: '13px' },
                        '& .MuiOutlinedInput-root': {
                            fontSize: '13px',
                            borderRadius: '10px',
                            bgcolor: 'grey.50',
                            '& fieldset': { borderColor: 'grey.200' },
                        },
                    }}
                />
            </Box>
            <StatusBanner complete={complete} tab={type} />
        </Box>
    );
};


const Dot = ({ complete, active }) => (
    <Box
        component="span"
        sx={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', ml: 0.75, flexShrink: 0, bgcolor: complete ? 'success.main' : active ? 'primary.main' : 'grey.300', transition: 'background-color 0.2s' }}
    />
);


export default function UpdateOrderStatusForm({ order_id }) {

    const [tab, setTab] = useState('pickup');
    const [submitted, setSubmitted] = useState(false);

    const [pickup, setPickup] = useState(defaultState());
    const [delivery, setDelivery] = useState(defaultState());

    const pickupComplete = useMemo(() => isTabComplete(pickup), [pickup]);
    const deliveryComplete = useMemo(() => isTabComplete(delivery), [delivery]);

    const activeComplete = tab === 'pickup' ? pickupComplete : deliveryComplete;

    const handleTabChange = (_, val) => {
        if (!val) return;
        setTab(val);
    };

    const handleChange = (setter) => (field, value) => {
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!activeComplete || submitted) return;
        setSubmitted(true);
        try {
            const state = tab === 'pickup' ? pickup : delivery;
            const status = tab === 'pickup' ? 'Picked Up' : 'Delivered'
            const payload = {
                type: tab,
                [`${tab}_in`]: state.in ? state.in.format('HH:mm') : null,
                [`${tab}_out`]: state.out ? state.out.format('HH:mm') : null,
                [`${tab}_at`]: state.at ? state.at.format('YYYY-MM-DD') : null,
                [`${tab}_signee`]: state.signee,
                order_status: status
            };
            console.log(payload);
        } catch (_) {
            // handle error
        } finally {
            setSubmitted(false);
        }
    };

    const reset = () => {
        setPickup(defaultState());
        setDelivery(defaultState());
    };

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <ToggleButtonGroup
                            value={tab}
                            exclusive
                            onChange={handleTabChange}
                            fullWidth
                            sx={{
                                bgcolor: 'grey.100',
                                borderRadius: '12px',
                                p: '4px',
                                border: 'none',
                                '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '9px !important', mx: '2px', transition: 'all 0.2s ease', },
                            }}
                        >
                            <ToggleButton
                                value="pickup"
                                sx={{
                                    py: 1, fontWeight: 600, fontSize: 13, textTransform: 'none', color: 'text.secondary',
                                    '&.Mui-selected': { bgcolor: '#fff !important', color: 'primary.main', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', },
                                }}
                            >
                                <MoveToInboxOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Pickup
                                <Dot complete={pickupComplete} active={tab === 'pickup'} />
                            </ToggleButton>

                            <ToggleButton
                                value="delivery"
                                sx={{
                                    py: 1, fontWeight: 600, fontSize: 13, textTransform: 'none', color: 'text.secondary',
                                    '&.Mui-selected': { bgcolor: '#fff !important', color: 'primary.main', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', },
                                }}
                            >
                                <LocalShippingOutlined sx={{ fontSize: 16, mr: 0.75 }} />
                                Delivery
                                <Dot complete={deliveryComplete} active={tab === 'delivery'} />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Fade in key={tab}>
                        <Box>
                            {tab === 'pickup' ? (
                                <TabPanel
                                    type="pickup"
                                    state={pickup}
                                    onChange={handleChange(setPickup)}
                                />
                            ) : (
                                <TabPanel
                                    type="delivery"
                                    state={delivery}
                                    onChange={handleChange(setDelivery)}
                                />
                            )}
                        </Box>
                    </Fade>
                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            id="save-trip-action"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitted}
                            disabled={!activeComplete || submitted}
                        >
                            {tab === 'pickup' ? 'Save Pickup' : 'Save Delivery'}
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