import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Grid } from '@mui/material';
import { LocalShipping, Inventory2, PersonPin } from '@mui/icons-material';

const StatsCards = ({ totalTrips, undispatchedOrders, onRouteDrivers }) => {
    const stats = [
        {
            title: 'Total Trips',
            value: totalTrips,
            icon: LocalShipping,
            color: '#1976d2',
            bgColor: '#e3f2fd',
        },
        {
            title: 'Undispatched Orders',
            value: undispatchedOrders,
            icon: Inventory2,
            color: '#ed6c02',
            bgColor: '#fff4e5',
        },
        {
            title: 'On Route Drivers',
            value: onRouteDrivers,
            icon: PersonPin,
            color: '#2e7d32',
            bgColor: '#e8f5e9',
        },
    ];

    return (
        <Grid container spacing={2}>
            {stats.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                        elevation={0}
                        sx={{
                            paddingInline: '10px',
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${stat.bgColor}01 0%, ${stat.color}15 100%)`,
                            border: `2px solid ${stat.color}30`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: stat.bgColor,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default React.memo(StatsCards);