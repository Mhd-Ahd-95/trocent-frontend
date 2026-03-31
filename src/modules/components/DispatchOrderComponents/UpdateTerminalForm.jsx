import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { CheckCircleOutlined, BusinessOutlined } from '@mui/icons-material';
import StyledButton from '../StyledButton/StyledButton';
import SubmitButton from '../SubmitButton/SubmitButton';

const TERMINALS = [
    { value: 'TERM-MTL', label: 'TERM-MTL', city: 'Montreal, QC' },
    { value: 'TERM-OTT', label: 'TERM-OTT', city: 'Ottawa, ON' },
    { value: 'TERM-TOR', label: 'TERM-TOR', city: 'Toronto, ON' },
];

const SectionLabel = ({ icon: Icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Icon sx={{ fontSize: 15, color: 'text.disabled' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.disabled' }}>
            {children}
        </Typography>
    </Box>
);

const TerminalOption = ({ terminal, selected, isCurrent, onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1.1, borderRadius: '10px', cursor: 'pointer', border: '1.5px solid', borderColor: selected ? '#2980b9' : 'transparent',
            bgcolor: selected ? '#eff6ff' : 'grey.50', transition: 'all 0.15s ease', '&:hover': { borderColor: '#2980b9', bgcolor: '#eff6ff' },
        }}
    >
        <Box sx={{
            width: 30, height: 30, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: selected ? '#2980b9' : 'grey.200', transition: 'all 0.15s', flexShrink: 0,
        }}>
            <BusinessOutlined sx={{ fontSize: 15, color: selected ? '#fff' : 'text.disabled' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: selected ? 700 : 500, color: selected ? '#2980b9' : 'text.primary' }}>
                    {terminal.label}
                </Typography>
                {isCurrent && (
                    <Box sx={{ fontSize: 10, fontWeight: 600, px: 1, py: 0.25, borderRadius: '20px', bgcolor: '#dbeafe', color: '#1e40af' }}>
                        Current
                    </Box>
                )}
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{terminal.city}</Typography>
        </Box>
        {selected && <CheckCircleOutlined sx={{ fontSize: 16, color: '#2980b9', flexShrink: 0 }} />}
    </Box>
);

export default function UpdateTerminalForm({ updateTerminal, orderData, onClose }) {

    const defaultTerminal = orderData?.terminal ?? '';
    const [selectedTerminal, setSelectedTerminal] = useState(defaultTerminal);
    const [submitted, setSubmitted] = useState(false);

    const isSubmitDisabled = useMemo(() => {
        if (submitted) return true;
        return !selectedTerminal || selectedTerminal === defaultTerminal;
    }, [submitted, selectedTerminal, defaultTerminal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        try {
            await updateTerminal(selectedTerminal);
        } catch (_) {
        } finally {
            setSubmitted(false);
        }
    };

    const reset = () => setSelectedTerminal(defaultTerminal);

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 5, py: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <SectionLabel icon={BusinessOutlined}>Terminal</SectionLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.65 }}>
                            {TERMINALS.map((terminal) => (
                                <TerminalOption
                                    key={terminal.value}
                                    terminal={terminal}
                                    selected={selectedTerminal === terminal.value}
                                    isCurrent={defaultTerminal === terminal.value}
                                    onClick={() => setSelectedTerminal(selectedTerminal === terminal.value ? '' : terminal.value)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            id="update-terminal-action"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitted}
                            disabled={isSubmitDisabled}
                        >
                            Update Terminal
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