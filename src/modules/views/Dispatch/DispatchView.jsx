import React, { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { MainLayout } from '../../layouts';
import { StatsCards, UndispatchedOrders, TripTabs } from '../../components';

export default function TripManagement() {

  const stats = useMemo(() => ({ totalTrips: 0, undispatchedOrders: 0, onRouteDrivers: 0, }), []);

  return (
    <MainLayout activeDrawer={{ active: 'Dispatch' }} grid noPanding>
      <Grid container spacing={2} component={Box} mt={-5}>

        <Grid size={12}>
          <StatsCards
            totalTrips={stats.totalTrips}
            undispatchedOrders={stats.undispatchedOrders}
            onRouteDrivers={stats.onRouteDrivers}
          />
        </Grid>

        <Grid size={12}>
          <TripTabs />
        </Grid>

        <Grid size={12}>
          <UndispatchedOrders />
        </Grid>

      </Grid>
    </MainLayout>
  );
}