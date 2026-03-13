import React, { useMemo } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import { MainLayout } from '../../layouts';
import { StatsCards, TripTabs } from '../../components';

const UndispatchedOrders = React.lazy(() => import('../../components/DispatchOrderComponents/UndispatchedOrder'))

export default function TripManagement() {

  const stats = useMemo(() => ({ totalTrips: 0, undispatchedOrders: 0, onRouteDrivers: 0, }), []);
  const tripAction = React.useRef()

  return (
    <MainLayout activeDrawer={{ active: 'Dispatch' }} title='Dispatch' untitled grid noPanding>
      <Grid container spacing={2} component={Box} mt={-5}>

        <Grid size={12}>
          <StatsCards
            totalTrips={stats.totalTrips}
            undispatchedOrders={stats.undispatchedOrders}
            onRouteDrivers={stats.onRouteDrivers}
          />
        </Grid>

        <Grid size={12}>
          <TripTabs 
            tripAction={tripAction}
          />
        </Grid>

        <Grid size={12}>
          <React.Suspense fallback={<Grid container justifyContent={'center'} py={15} sx={{ width: '100%' }}><Skeleton variant='rectangular' width='100%' height={400} /></Grid>}>
            <UndispatchedOrders 
              tripAction={tripAction}
            />
          </React.Suspense>
        </Grid>

      </Grid>
    </MainLayout>
  );
}