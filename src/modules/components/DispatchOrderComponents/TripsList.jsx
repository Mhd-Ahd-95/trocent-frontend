import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import TripRow from './TripRow';
import moment from 'moment';

const TripsList = ({ trips, filters, isInterliner, tripAction }) => {

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredTrips = useMemo(() => {
    let filtered = [...trips];
    if (filters?.searchInput) {
      const search = filters.searchInput.toLowerCase();
      filtered = filtered.filter((trip) =>
        String(trip.trip_number).includes(search) ||
        trip.driver_name?.toLowerCase().includes(search) ||
        trip.interliner_name?.toLowerCase().includes(search) ||
        trip.dispatched_orders.some((order) => String(order.order_number).toLowerCase().includes(search))
      );
    }
    if (filters?.pickupDate) {
      filtered = filtered.filter((trip) => trip.dispatched_orders.some((order) => moment(order.scheduled_date, 'YYYY-MM-DD').isSameOrAfter(moment(filters.pickupDate, 'YYYY-MM-DD'))));
    }
    if (filters?.deliveryDate) {
      filtered = filtered.filter((trip) => trip.dispatched_orders.some((order) => moment(order.scheduled_date, 'YYYY-MM-DD').isSameOrBefore(moment(filters.deliveryDate, 'YYYY-MM-DD'))));
    }
    if (filters?.quickFilter === 'today') {
      filtered = filtered.filter((trip) => trip.trip_date === today);
    }
    else if (filters?.quickFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      filtered = filtered.filter((trip) => trip.trip_date === tomorrowStr);
    }
    if (filters?.terminal) {
      filtered = filtered.filter((trip) => trip.dispatched_orders.some((order) => order.terminal === filters.terminal));
    }
    filtered.sort((a, b) => b.trip_number - a.trip_number)
    return filtered;
  }, [trips, filters, today]);


  if (filteredTrips.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}>
        <LocalShipping sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No trips found
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ minHeight: 400, overflowX: 'auto', '&::-webkit-scrollbar': { height: 8, }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, }, }}>
        <Box sx={{ minWidth: 1200 }}>
          {filteredTrips.map((trip, index) => (
            <TripRow
              key={index}
              trip={trip}
              isCompleted={trip?.trip_status === 'completed'}
              tripAction={tripAction}
              isInterliner={isInterliner}
              isToday={trip.trip_date === today}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default React.memo(TripsList);