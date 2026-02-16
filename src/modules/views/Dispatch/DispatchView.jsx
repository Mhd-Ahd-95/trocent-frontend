import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  // Tabs,
  // Tab,
  Typography,
  Grid
} from '@mui/material';
import {
  Business,
  PersonOutline,
  CheckCircle,
  Inventory2,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts';
import { StatsCards, FilterBar, TripsList, UndispatchedOrders, Tabs } from '../../components'

// Generate dummy data
const generateTrips = (count, type) => {
  const trips = [];
  const serviceTypes = ['Direct', 'Rush', 'Regular'];

  for (let i = 0; i < count; i++) {
    const orderCount = Math.floor(Math.random() * 5) + 1;
    const completedCount = Math.floor(Math.random() * orderCount);
    const orders = [];

    for (let j = 0; j < orderCount; j++) {
      orders.push({
        id: i * 100 + j,
        order_number: `ORD-${String(1000 + i * 10 + j).padStart(6, '0')}`,
        customer_name: 'MHD AHD',
        service_type: serviceTypes[Math.floor(Math.random() * 3)],
        shipper_name: `Shipper ${i + j}`,
        shipper_address: `${100 + i + j} Main St`,
        shipper_city: 'Toronto, ON, 5001 TRANS-CANADIENNE GATE "H" / BAIE 48',
        shipper_province: 'QC',
        shipper_postal_code: 'H7I123',
        pickup_date: '2024-02-15',
        pickup_time_from: '10:00',
        pickup_time_to: '3:00',
        receiver_name: `Receiver ${i + j}`,
        receiver_address: `${200 + i + j} Business Ave`,
        receiver_city: 'Mississauga, ON 5001 TRANS-CANADIENNE GATE "H" / BAIE 48',
        receiver_province: 'ON',
        receiver_postal_code: 'K65T5',
        delivery_date: '2024-02-15',
        delivery_time_from: '10:00',
        delivery_time_to: '3:00',
        references: ['DAILY - TOROMONT POINTE CLAIRE-@3PM -> AIR INUIT/CANADIAN NORTH'],
        freight_count: Math.floor(Math.random() * 5) + 1,
        terminal: ['MTL', 'OTT', 'TOR'][Math.floor(Math.random() * 3)],
      });
    }

    trips.push({
      id: i + 1,
      trip_number: `TRP-${String(39000 + i).padStart(5, '0')}`,
      trip_date: i % 10 === 0 ? new Date().toISOString().split('T')[0] : '2024-02-15',
      driver_name: type === 'interliner' ? `Interliner ${i + 1}` : `Driver ${i + 1}`,
      trip_type: type,
      trip_status: ['active', 'planning'][Math.floor(Math.random() * 2)],
      total_orders: orderCount,
      total_orders_completed: completedCount,
      orders,
      has_updates: i % 5 === 0,
      driver_active: i % 3 === 0,
    });
  }
  return trips;
};

const generateUndispatchedOrders = (count) => {
  const orders = [];
  const serviceTypes = ['Direct', 'Rush', 'Regular'];

  for (let i = 0; i < count; i++) {
    orders.push({
      id: i + 1,
      order_number: `ORD-${String(2000 + i).padStart(6, '0')}`,
      service_type: serviceTypes[Math.floor(Math.random() * 3)],
      shipper_name: `Shipper ${i}`,
      shipper_address: `${300 + i} Industrial Rd`,
      shipper_city: 'Toronto, ON',
      pickup_date: '2024-02-15',
      pickup_time: '10:00 AM - 3:00 PM',
      receiver_name: `Receiver ${i}`,
      receiver_address: `${400 + i} Commerce St`,
      receiver_city: 'Mississauga, ON',
      delivery_date: '2024-02-15',
      delivery_time: '2:00 PM - 5:00 PM',
      freight_count: Math.floor(Math.random() * 5) + 1,
      terminal: ['MTL', 'OTT', 'TOR'][Math.floor(Math.random() * 3)],
    });
  }
  return orders;
};

const TRIPS_DATA = {
  interliners: generateTrips(10, 'interliner'),
  drivers: generateTrips(10, 'driver'),
  completed: generateTrips(10, 'completed'),
};

const UNDISPATCHED_ORDERS = generateUndispatchedOrders(100);

export default function TripManagement() {

  const [tripFilters, setTripFilters] = useState({});
  const [undispatchedFilters, setUndispatchedFilters] = useState({});


  const handleTripFilterChange = useCallback((newFilters) => {
    setTripFilters(newFilters);
  }, []);

  const handleUndispatchedFilterChange = useCallback((newFilters) => {
    setUndispatchedFilters(newFilters);
  }, []);

  const handleCompletedSearch = useCallback((searchFilters) => {
    console.log('Search completed trips:', searchFilters);
    // Implement API  for completed trips
  }, []);

  const handleUndispatchedSearch = useCallback((searchFilters) => {
    console.log('Search undispatched orders:', searchFilters);
  }, []);

  const totalTrips = useMemo(() => {
    return TRIPS_DATA.interliners.length + TRIPS_DATA.drivers.length;
  }, []);

  const onRouteDrivers = useMemo(() => {
    return TRIPS_DATA.drivers.filter((t) => t.trip_status === 'active').length;
  }, []);

  return (
    <MainLayout
      activeDrawer={{ active: 'Dispatch' }}
      grid
      noPanding
    >
      <Grid container spacing={2} component={Box} mt={-5}>
        <Grid size={12}>
          <StatsCards
            totalTrips={totalTrips}
            undispatchedOrders={UNDISPATCHED_ORDERS.length}
            onRouteDrivers={onRouteDrivers}
          />
        </Grid>
        <Grid size={12}>
          <Box elevation={0}           >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', }}>
              <Tabs
                labels={['Drivers', 'Interliners', 'Completed']}
                icons={[<PersonOutline fontSize='small' />, <Business fontSize='small' />, <CheckCircle fontSize='small' />]}
                contents={[
                  <>
                    <Box sx={{ bgcolor: 'grey.50' }}>
                      <FilterBar
                        onFilterChange={handleTripFilterChange}
                        onSearch={handleCompletedSearch}
                        defaultExpanded={false}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <TripsList
                        trips={TRIPS_DATA['drivers']}
                        filters={tripFilters}
                      />
                    </Box>
                  </>,
                  <>
                    <Box sx={{ bgcolor: 'grey.50' }}>
                      <FilterBar
                        onFilterChange={handleTripFilterChange}
                        onSearch={handleCompletedSearch}
                        defaultExpanded={false}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <TripsList
                        trips={TRIPS_DATA['interliners']}
                        filters={tripFilters}
                        isInterliner
                      />
                    </Box>
                  </>,
                  <>
                    <Box sx={{ bgcolor: 'grey.50' }}>
                      <FilterBar
                        onFilterChange={handleTripFilterChange}
                        onSearch={handleCompletedSearch}
                        showSearchButton={true}
                        defaultExpanded={false}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <TripsList
                        trips={TRIPS_DATA['completed']}
                        filters={tripFilters}
                      />
                    </Box>
                  </>
                ]}
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={12}>
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.50', }}            >
              <Inventory2 color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Undispatched Orders ({UNDISPATCHED_ORDERS.length})
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <FilterBar
                onFilterChange={handleUndispatchedFilterChange}
                onSearch={handleUndispatchedSearch}
                showSearchButton={true}
                defaultExpanded={false}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <UndispatchedOrders
                orders={UNDISPATCHED_ORDERS}
                filters={undispatchedFilters}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}