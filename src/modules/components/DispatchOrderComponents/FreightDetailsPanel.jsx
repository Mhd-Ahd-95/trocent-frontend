import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const FreightDetailPanel = React.memo(({ row }) => {
    const freights = row.freights || [];

    const totalPieces = freights.reduce((sum, f) => sum + (f.pieces || 0), 0);
    const totalWeight = freights.reduce((sum, f) => sum + (f.weight || 0), 0);

    return (
        <Box sx={{ px: 4, py: 2, bgcolor: '#f5f8ff', borderBottom: '2px solid', borderColor: 'primary.light' }}>
            <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                <LocalShipping fontSize="small" color="primary" />
                <Typography variant="subtitle2" fontWeight={600} fontSize={13}>
                    Freight Details — <strong>{row.order_number}</strong>
                </Typography>
            </Stack>

            {freights.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No freight details available for this order.</Typography>
            ) : (
                <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr',
                        gap: 1, px: 1.5, py: 0.75,
                        bgcolor: '#e8eeff', borderRadius: 1, mb: 0.5, minWidth: 400
                    }}>
                        {['Type', 'Pieces', 'Dimensions', 'Description'].map((h) => (
                            <Typography key={h} variant="caption" fontWeight={700} color="text.secondary">{h}</Typography>
                        ))}
                    </Box>
                    {freights.map((freight, idx) => (
                        <Box
                            key={freight.id ?? idx}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr',
                                gap: 1, px: 1.5, py: 0.75,
                                bgcolor: idx % 2 === 0 ? '#fff' : 'grey.50',
                                borderRadius: 1, minWidth: 400
                            }}
                        >
                            <Typography variant="body2">{freight.type ?? '—'}</Typography>
                            <Typography variant="body2">{freight.pieces ?? '—'}</Typography>
                            <Typography variant="body2">
                                {freight.length && freight.width && freight.height
                                    ? `${freight.length}×${freight.width}×${freight.height} ${freight.dim_unit ?? ''}`
                                    : '—'}
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>FAK</Typography>
                        </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent:'flex-end', gap: 3, px: 1.5, py: 0.75, bgcolor: '#e8eeff', borderRadius: 1, minWidth: 400 }}>
                        <Stack direction="row" gap={0.75} alignItems="center">
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Total Pieces:</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.primary">{totalPieces}</Typography>
                        </Stack>
                        <Stack direction="row" gap={0.75} alignItems="center">
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Total Actual Weight:</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.primary">
                                {totalWeight.toFixed(2)} {freights[0]?.unit ?? ''}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            )}
        </Box>
    );
});

export default FreightDetailPanel;