import React, { useState, useMemo } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, CircularProgress, Typography, TextField, InputAdornment, useTheme, alpha, Grid } from '@mui/material';
import { RouteRounded, Search } from '@mui/icons-material';
import moment from 'moment';
import { useHourlyDriverDetails } from '../../hooks/useBillings';
import useStyles from './DriverHourly.styles'

const TRIP_COLUMNS = [
    { key: 'trip_number', label: 'Trip #' },
    { key: 'order_number', label: 'Order #' },
    { key: 'route', label: 'Route' },
    { key: 'pickup', label: 'Pickup (in / out)' },
    { key: 'delivery', label: 'Delivery (in / out)' },
    { key: 'delivered_on', label: 'Delivered on', align: 'right' },
    { key: 'weight', label: 'Weight', align: 'right' },
    { key: 'pieces', label: 'Pieces', align: 'right' },
];

const formatDate = (value) => {
    if (!value) return '—';
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : value;
};

const TimeRangeCell = ({ from, to }) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {from ? (moment(from, ['YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', moment.ISO_8601], true).isValid() ? moment(from, ['YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', moment.ISO_8601], true).format('HH:mm') : from) : '—'}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>→</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {to ? (moment(to, ['YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', moment.ISO_8601], true).isValid() ? moment(to, ['YYYY-MM-DD HH:mm:ss', 'HH:mm:ss', moment.ISO_8601], true).format('HH:mm') : to) : '—'}
        </Typography>
    </Box>
);

const LabeledField = ({ label, icon, children, classes }) => (
    <Box>
        <Box className={classes.labelText}>
            {icon}
            {label}
        </Box>
        {children}
    </Box>
);

export default function DriverTripDetailsTable({ driverId, filters }) {

    const { classes } = useStyles()
    const theme = useTheme();
    const { data, isLoading } = useHourlyDriverDetails(driverId, filters);
    const rows = data?.data || [];

    const isDark = theme.palette.mode === 'dark';
    const secondary = theme.palette.secondary.main;
    const primary = theme.palette.primary.main;

    const [numberSearch, setNumberSearch] = useState('');
    const [routeSearch, setRouteSearch] = useState('');

    const filteredRows = useMemo(() => {
        const numberQuery = numberSearch.trim().toLowerCase();
        const routeQuery = routeSearch.trim().toLowerCase();
        return rows.filter((row) => {
            const matchesNumber = !numberQuery || String(row.trip_number ?? '').toLowerCase().includes(numberQuery) || String(row.order_number ?? '').toLowerCase().includes(numberQuery);
            const matchesRoute = !routeQuery || String(row.shipper_city ?? '').toLowerCase().includes(routeQuery) || String(row.consignee_city ?? '').toLowerCase().includes(routeQuery);
            return matchesNumber && matchesRoute;
        });
    }, [rows, numberSearch, routeSearch]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    return (
        <Box sx={{ paddingInline: { xs: 2, md: 5 }, paddingBlock: 3 }}>
            <Grid container spacing={2} pb={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LabeledField classes={classes} label="Keyword" icon={<Search sx={{ fontSize: 13 }} />}>
                        <TextField
                            size="small" fullWidth className={classes.inputRoot}
                            placeholder="Trip # or order #..."
                            value={numberSearch}
                            onChange={(e) => setNumberSearch(e.target.value)}
                        />
                    </LabeledField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LabeledField classes={classes} label="Route" icon={<Search sx={{ fontSize: 13 }} />}>
                        <TextField
                            size="small" fullWidth className={classes.inputRoot}
                            placeholder="Route (shipper / consignee city..."
                            value={routeSearch}
                            onChange={(e) => setRouteSearch(e.target.value)}
                        />
                    </LabeledField>
                </Grid>
            </Grid>
            {!filteredRows.length ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, opacity: 0.6 }}>
                    <RouteRounded sx={{ fontSize: 40, mb: 1 }} />
                    <Typography sx={{ fontWeight: 700 }}>No trips found</Typography>
                    <Typography sx={{ fontSize: 13 }}>Try widening the date range or clearing the search.</Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={0} className={classes.tableContainer}>
                    <Table sx={{ tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                {TRIP_COLUMNS.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        align={col.align || 'left'}
                                        className={classes.tripColumn}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <TableRow
                                    key={row.order_number ?? index}
                                    sx={{
                                        bgcolor: index % 2 === 0 ? (isDark ? alpha('#fff', 0.025) : theme.palette.grey[50]) : theme.palette.background.paper,
                                        transition: 'background-color 0.15s ease',
                                        '&:hover': { bgcolor: alpha(primary, 0.06) },
                                        '&:not(:last-of-type) td': { borderBottom: '1px solid', borderColor: isDark ? alpha('#fff', 0.06) : alpha(secondary, 0.07) },
                                        '&:last-of-type td': { borderBottom: 'none' }
                                    }}
                                >
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 800, color: primary }}>
                                            # {row.trip_number ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                            # {row.order_number ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary' }}>
                                                {row.shipper_city || '—'}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>→</Typography>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary' }}>
                                                {row.consignee_city || '—'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <TimeRangeCell from={row.pickup_in} to={row.pickup_out} />
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <TimeRangeCell from={row.delivery_in} to={row.delivery_out} />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.25 }}>
                                        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'text.secondary' }}>
                                            {formatDate(row.delivered_on)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.25 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                            {row.weight ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.25 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                            {row.pieces ?? '—'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}