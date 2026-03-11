import React from 'react';
import { Box, Typography, Divider, Tooltip } from '@mui/material';

const MAX_ROWS = 4;

const FreightRow = ({ f }) => {
    const dims = `${f.length ? f.length : 0}×${f.width ? f.width : 0}×${f.height ? f.height : 0} ${f.dim_unit ? f.dim_unit.toUpperCase() : 'IN'}`
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '25px 50px 1fr 50px', alignItems: 'baseline', lineHeight: 1.5 }}>
            <Typography fontSize={12} fontWeight={600} color="text.primary" noWrap>{f.pieces ?? '—'}</Typography>
            <Typography fontSize={11} color="text.secondary" noWrap>{f.type ?? '—'}</Typography>
            <Typography fontSize={11} color="text.secondary" noWrap>{dims}</Typography>
            <Typography fontSize={11} fontWeight={600} color="text.secondary" noWrap>FAK</Typography>
        </Box>
    );
};

const InlineFreightCell = React.memo(({ freights = [], total_pieces, total_actual_weight }) => {
    if (!freights.length) {
        return <Typography variant="caption" color="text.disabled">—</Typography>;
    }

    const weightUnit = freights.find((f) => f.unit)?.unit.toUpperCase() ?? 'LBS';
    const hasOverflow = freights.length > MAX_ROWS;
    const visibleFreights = hasOverflow ? freights.slice(0, MAX_ROWS) : freights;

    const tooltipContent = (
        <Box sx={{ p: 0.5, minWidth: 240 }}>
            <Typography fontSize={10} fontWeight={700} sx={{ mb: 0.75, opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                All {freights.length} Freights
            </Typography>
            {freights.map((f, idx) => {
                const dims = `${f.length ? f.length : 0}×${f.width ? f.width : 0}×${f.height ? f.height : 0} ${f.dim_unit ? f.dim_unit.toUpperCase() : 'IN'}`
                return (
                    <Box key={f.id ?? idx} sx={{ display: 'grid', gridTemplateColumns: '22px 48px 1fr 36px', gap: '0 6px', mb: 0.3 }}>
                        <Typography fontSize={11} fontWeight={700} color="inherit">{f.pieces ?? '—'}</Typography>
                        <Typography fontSize={11} color="inherit" sx={{ opacity: 0.85 }}>{f.type ?? '—'}</Typography>
                        <Typography fontSize={11} color="inherit" sx={{ opacity: 0.75 }}>{dims}</Typography>
                        <Typography fontSize={11} fontWeight={600} color="inherit">FAK</Typography>
                    </Box>
                );
            })}
        </Box>
    );

    return (
        <Box sx={{ minWidth: 220 }}>
            <Tooltip
                title={hasOverflow ? tooltipContent : ''}
                placement="left"
                arrow
                disableHoverListener={!hasOverflow}
                componentsProps={{
                    tooltip: {
                        sx: { maxWidth: 300, bgcolor: 'grey.800', borderRadius: '8px', p: 1, '& .MuiTooltip-arrow': { color: 'grey.800' }, }
                    }
                }}
            >
                <Box
                    sx={{
                        maxHeight: `${MAX_ROWS * 24}px`,
                        overflowY: hasOverflow ? 'auto' : 'visible',
                        overflowX: 'hidden',
                        cursor: hasOverflow ? 'default' : 'inherit',
                        '&::-webkit-scrollbar': { width: '3px' },
                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: '4px' },
                    }}
                >
                    {visibleFreights.map((f, idx) => (<FreightRow key={f.id ?? idx} f={f} />))}
                    {hasOverflow && (
                        <Typography fontSize={10} fontWeight={600} color="primary.main" sx={{ mt: 0.25, letterSpacing: '0.02em' }}>
                            +{freights.length - MAX_ROWS} more · hover to see all
                        </Typography>
                    )}
                </Box>
            </Tooltip>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                <Typography fontSize={11} color="text.secondary" noWrap>
                    <Box component="span" fontWeight={700} color="text.primary">
                        {total_pieces ?? 0}
                    </Box>
                </Typography>
                <Typography fontSize={11} color="text.secondary" noWrap sx={{ ml: 1 }}>
                    <Box component="span" fontWeight={700} color="text.primary">
                        {total_actual_weight ? total_actual_weight.toFixed(2) : 0}
                    </Box>
                    {' '}
                    <Box component="span" fontWeight={600}>{weightUnit}</Box>
                </Typography>
            </Box>
        </Box>
    );
});

export default InlineFreightCell;