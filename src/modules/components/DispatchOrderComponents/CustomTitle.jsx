import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export const CustomTitle = React.memo(({ number, title, Icon, isOrder }) => (
    <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}      >
            <Icon sx={{ fontSize: 18, color: '#fff' }} />
        </Box>
        <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                {title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                    {isOrder ? 'Order' : 'Trip'}
                </Typography>
                <Typography variant="caption" fontWeight={700}
                    sx={{ color: 'primary.main', bgcolor: 'primary.outlineHover', px: 0.75, py: 0.1, borderRadius: 1, fontFamily: 'monospace', fontSize: 12, }}
                >
                    # {number}
                </Typography>
            </Stack>
        </Box>
    </Stack>
))