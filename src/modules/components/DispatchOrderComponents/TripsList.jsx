import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { Virtuoso } from 'react-virtuoso';
import TripRow from './TripRow';

const TripsList = ({ trips, activeTab, filters }) => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredTrips = useMemo(() => {
    let filtered = [...trips];

    // Apply filters
    if (filters?.searchInput) {
      const search = filters.searchInput.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.trip_number.toLowerCase().includes(search) ||
          trip.driver_name?.toLowerCase().includes(search) ||
          trip.orders.some((order) =>
            order.order_number.toLowerCase().includes(search)
          )
      );
    }

    if (filters?.pickupDate) {
      filtered = filtered.filter((trip) =>
        trip.orders.some(
          (order) => order.pickup_date === filters.pickupDate.format('YYYY-MM-DD')
        )
      );
    }

    if (filters?.deliveryDate) {
      filtered = filtered.filter((trip) =>
        trip.orders.some(
          (order) => order.delivery_date === filters.deliveryDate.format('YYYY-MM-DD')
        )
      );
    }

    if (filters?.quickFilter === 'today') {
      filtered = filtered.filter((trip) => trip.trip_date === today);
    } else if (filters?.quickFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      filtered = filtered.filter((trip) => trip.trip_date === tomorrowStr);
    }

    if (filters?.terminal) {
      filtered = filtered.filter((trip) =>
        trip.orders.some((order) => order.terminal === filters.terminal)
      );
    }

    return filtered;
  }, [trips, filters, today]);

  if (filteredTrips.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}
      >
        <LocalShipping sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No trips found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 450px)', minHeight: 400 }}>
      <Virtuoso
        data={filteredTrips}
        itemContent={(index, trip) => (
          <TripRow
            key={trip.id}
            trip={trip}
            activeTab={activeTab}
            isToday={trip.trip_date === today}
          />
        )}
      />
    </Box>
  );
};

export default React.memo(TripsList);