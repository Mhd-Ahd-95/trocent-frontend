import React from "react";
import { Box, TablePagination, Paper, Typography } from "@mui/material";
import TripRow from "./TripRow";
import { LocalShipping } from "@mui/icons-material";

const EmptyState = () => (
    <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}>
        <LocalShipping sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No completed trips found</Typography>
    </Paper>
);

const CompletedTripsList = React.memo(({ trips, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, isFetching }) => {

    if (trips.length === 0) return <EmptyState />;

    return (
        <Box sx={{
            border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden',
            opacity: isFetching ? 0.7 : 1,
            transition: 'opacity 0.15s ease',
        }}>
            <Box sx={{ minWidth: 1200, overflowX: 'auto' }}>
                {trips.map((trip) => (
                    <TripRow key={trip.id} trip={trip} isToday={trip.trip_date === today} />
                ))}
            </Box>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[50, 100, 200]}
                sx={{ borderTop: 1, borderColor: 'divider' }}
            />
        </Box>
    );
});

export default CompletedTripsList