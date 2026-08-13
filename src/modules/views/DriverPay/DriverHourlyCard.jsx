import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Grid, Button } from '@mui/material';
import DriverHourlyDayCard from './DriverHourlyDayCard';
import useStyles from './DriverHourly.styles';
import RouteIcon from '@mui/icons-material/Route';

export const SUMMARY_COLUMNS = [
    { key: 'date', label: 'Date', width: '14%' },
    { key: 'route', label: 'Route', width: '22%' },
    { key: 'clocked', label: 'Clocked', width: '14%', align: 'right' },
    { key: 'diff', label: 'Diff', width: '16%', align: 'right' },
    { key: 'adjustmentHrs', label: 'Adj (Hrs)', width: '18%', align: 'right' },
    { key: 'adjustmentKm', label: 'Adjustment (Km)', width: '16%', align: 'right' },
];

export default function DriverHourlyCard({ days = [], handleDetails }) {

    const { classes } = useStyles();

    const onAdjustmentChange = () => { }
    const onKmAdjustmentChange = () => { }

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Grid container justifyContent={'flex-end'}>
                    <Grid size={'auto'}>
                        <Button
                            onClick={handleDetails}
                            variant="text"
                            startIcon={<RouteIcon />}
                            sx={{
                                borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, py: 1, borderWidth: 1.5,
                                '&:hover': { borderWidth: 1.5 }
                            }}
                        >
                            Show Trip Details
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <TableContainer component={Paper} elevation={0} className={classes.tableContainer}>
                    <Table sx={{ tableLayout: 'fixed' }}>
                        <colgroup>
                            {SUMMARY_COLUMNS.map((col) => (
                                <col key={col.key} style={{ width: col.width }} />
                            ))}
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                {SUMMARY_COLUMNS.map((col) => (
                                    <TableCell key={col.key} align={col.align || 'left'} className={classes.headerCell}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {days.map((day, index) => (
                                <DriverHourlyDayCard
                                    key={day.date ?? index}
                                    order={day}
                                    onAdjustmentChange={onAdjustmentChange}
                                    onKmAdjustmentChange={onKmAdjustmentChange}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid size={12}>
                 {/* Totals */}
            </Grid>
        </Grid>
    );
}