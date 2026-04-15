import React, { useMemo } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import { MainLayout } from '../../layouts';
import { StatsCards, TripTabs } from '../../components';
import { useDispatchScreenSync } from '../../hooks/useDispatchScreenSync';
import { useDriverTrips, useInterlinerTrips, useUndispatchedDriversCount } from '../../hooks/useDispatchOrders';

const UndispatchedOrders = React.lazy(() => import('../../components/DispatchOrderComponents/UndispatchedOrder'))

export default function TripManagement() {

  useDispatchScreenSync()

  const [activeTab, setActiveTab] = React.useState(0);

  const { data: countDrivers, isLoading: countLoading } = useUndispatchedDriversCount({ enabled: activeTab === 0 || activeTab === 1 });
  const { data: driverTrips = [], isLoading: driverLoading } = useDriverTrips({ enabled: activeTab === 0 });
  const { data: interlinerTrips = [], isLoading: interlinerLoading } = useInterlinerTrips({ enabled: activeTab === 1 });

  const stats = useMemo(() => {
    const trips = activeTab === 0 ? driverTrips : activeTab === 1 ? interlinerTrips : null;
    return {
      totalTrips: trips?.length ?? 0,
      undispatchedOrders: trips !== null ? countDrivers : 0,
      onRouteDrivers: trips?.filter(t => t.trip_status === 'active').length ?? 0,
    };
  }, [activeTab, driverTrips, interlinerTrips, countDrivers]);

  const tripAction = React.useRef()

  return (
    <MainLayout activeDrawer={{ active: 'Dispatch' }} title='Dispatch' untitled grid noPanding>
      <Grid container spacing={2} component={Box} mt={-5}>

        <Grid size={12}>
          <StatsCards
            totalTrips={stats.totalTrips}
            isLoading={countLoading || driverLoading || interlinerLoading}
            undispatchedOrders={stats.undispatchedOrders}
            onRouteDrivers={stats.onRouteDrivers}
          />
        </Grid>

        <Grid size={12}>
          <TripTabs
            tripAction={tripAction}
            onTabChange={setActiveTab}
            trips={activeTab === 0 ? driverTrips : interlinerTrips}
            isLoading={driverLoading || interlinerLoading}
            activatedTab={activeTab}
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