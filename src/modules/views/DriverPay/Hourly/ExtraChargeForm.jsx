import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { StyledButton, SubmitButton } from '../../../components';


export default function ExtraChargeForm({ companyId, initialValues = {}, onSave, onClose }) {

    const [item, setItem] = useState({ note: '', price: '', ...initialValues });
    const [submitted, setSubmitted] = useState(false);

    const isValid = item.note.trim().length > 0 && item.price !== '' && !Number.isNaN(Number(item.price));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setSubmitted(true);
        try {
            const payload = {
                company_id: companyId,
                note: item.note.trim(),
                price: Number(Number(item.price).toFixed(2)),
            };
            await onSave?.(payload);
        } finally {
            setSubmitted(false);
            onClose?.();
        }
    };

    const handleReset = () => {
        setItem({ note: '', price: '', ...initialValues });
    };

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Box sx={{ px: 2, py: 2 }}>
                    <Grid container spacing={4}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label='Item'
                                required
                                value={item.note || ''}
                                onChange={(e) => setItem((prev) => ({ ...prev, note: e.target.value }))}
                                InputProps={{
                                    sx: { borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50' },
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                type="number"
                                required
                                label='Price'
                                value={item.price || ''}
                                onChange={(e) => setItem((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    sx: { borderRadius: '10px', fontSize: 13, bgcolor: 'grey.50' },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            id="save-extra-charge"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitted}
                            disabled={submitted || !isValid}
                        >
                            Save Charge
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