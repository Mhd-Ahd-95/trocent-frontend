import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { StyledButton, SubmitButton } from '../../../components';


export default function ExtraChargeForm({ companyId, initialItems = [], onSave, onClose }) {

    const initial = initialItems[0] || { note: '', price: '' };
    const [note, setNote] = useState(initial.note ?? '');
    const [price, setPrice] = useState(initial.price !== undefined && initial.price !== null ? String(initial.price) : '');
    const [submitted, setSubmitted] = useState(false);

    const isValid = note.trim().length > 0 && price !== '' && !Number.isNaN(Number(price));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setSubmitted(true);
        try {
            const payload = {
                company_id: companyId,
                note: note.trim(),
                price: Number(Number(price).toFixed(2)),
            };
            console.log('Extra charge payload:', payload);
            onSave?.(payload);
        } finally {
            setSubmitted(false);
            onClose?.();
        }
    };

    const handleReset = () => {
        setNote(initial.note ?? '');
        setPrice(initial.price !== undefined && initial.price !== null ? String(initial.price) : '');
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
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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