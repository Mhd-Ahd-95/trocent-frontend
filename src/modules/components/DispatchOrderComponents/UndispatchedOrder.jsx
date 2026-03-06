import React, { useState, useMemo, useCallback } from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel, Button } from '@mui/material';
import { Inventory2, AddRoad } from '@mui/icons-material';
import moment from 'moment';
import OrderRow from './OrderRow';
import FilterBar from './FilterBar';
import { DrawerForm } from '..';
import TripForm from './TripForm';

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const getRandomDateBetween = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
};

const generateUndispatchedOrders = (count) => {
  const orders = [];
  const serviceTypes = ['Direct', 'Rush', 'Regular'];
  const terminals = ['MTL', 'OTT', 'TOR'];
  const statuses = ['Pending', 'Undispatched', 'Scheduled'];

  for (let i = 0; i < count; i++) {
    orders.push({
      id: i + 1,
      order_id: 1000 + i,
      order_number: `${String(112343 + i).padStart(4, '0')}`,
      leg_type: 'Pickup',
      order_level: 'Standard',
      scheduled_date: '2024-02-15',
      pickup_time_from: '10:00',
      pickup_time_to: '15:00',
      delivery_time_from: '14:00',
      delivery_time_to: '17:00',
      trip_id: null,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      customer_name: `Customer ${i}`,
      shipper_id: 5000 + i,
      shipper_name: `Shipper ${i}`,
      shipper_address: `${300 + i} 5001 TRANS-CANADIENNE`,
      shipper_city: 'Toronto',
      shipper_province: 'ON',
      shipper_postal_code: 'M1A1A1',
      shipper_special_instructions: 'PICKUP MONDAY-MARCH 2ND @ 11:45 - SHARP',
      shipper_appointment_numbers: ['A123456 GehJHKJDE'],
      receiver_id: 8000 + i,
      receiver_name: `Receiver ${i}`,
      receiver_address: `${400 + i} Commerce St`,
      receiver_city: 'Mississauga',
      receiver_province: 'ON',
      receiver_postal_code: 'L5B1A1',
      receiver_special_instructions: 'PICKUP MONDAY-MARCH 2ND @ 11:45 - SHARP',
      receiver_appointment_numbers: ['A123456 GehJHKJDE'],
      service_type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      order_status: statuses[Math.floor(Math.random() * statuses.length)],
      reference_numbers: `REF-${10000 + i}`,
      order_date: getRandomDateBetween(yesterday, tomorrow),
      freights: [
        { type: 'Skid', pieces: 2, length: 10, width: 15, height: 20, weight: 22.2, volume_weight: 13.32, unit: 'lbs' },
        { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
        // { type: 'Box', pieces: 1, length: 20, width: 25, height: 30, weight: 222.2, volume_weight: 123.32, unit: 'kg' },
      ]
    });
  }
  return orders;
};

const UNDISPATCHED_ORDERS = generateUndispatchedOrders(100);

const headerCellSx = {
  fontWeight: 700,
  fontSize: 13,
  color: 'text.primary',
  bgcolor: 'grey.200',
  borderBottom: '1px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
  py: 1.5,
  px: 2,
};

const COLUMNS = [
  { label: 'Order Number', key: 'order_number' },
  { label: 'Service Type', key: 'service_type' },
  { label: 'Shipper Name', key: 'shipper_name' },
  { label: 'Shipper City', key: 'shipper_city' },
  { label: 'Pickup Date', key: 'scheduled_date' },
  { label: 'Receiver Name', key: 'receiver_name' },
  { label: 'Receiver City', key: 'receiver_city' },
  { label: 'Delivery Date', key: 'delivery_date' },
  { label: 'Freight Details', key: null }, 
  { label: 'Actions', key: null },
];

const getValue = (row, key) => {
  const val = row[key];
  if (val === undefined || val === null) return '';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) return new Date(val).getTime();
  if (typeof val === 'string') return val.toLowerCase();
  return val;
};

const sortRows = (rows, key, direction) => {
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const av = getValue(a, key);
    const bv = getValue(b, key);
    if (av < bv) return direction === 'asc' ? -1 : 1;
    if (av > bv) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const UndispatchedOrdersTable = ({ orders, filters, selectedRows, onRowSelect }) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = useCallback((key) => {
    if (!key) return;
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
    setPage(0);
  }, []);

  const handleRowClick = useCallback((row) => {
    onRowSelect((prev) => {
      const next = new Map(prev);
      next.has(row.id) ? next.delete(row.id) : next.set(row.id, row);
      return next;
    });
  }, [onRowSelect]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (filters?.searchInput) {
      const s = filters.searchInput.toLowerCase();
      filtered = filtered.filter((o) =>
        o.order_number.toLowerCase().includes(s) ||
        o.shipper_name?.toLowerCase().includes(s) ||
        o.receiver_name?.toLowerCase().includes(s)
      );
    }
    if (filters?.pickupDate)
      filtered = filtered.filter((o) => o.pickup_date === filters.pickupDate.format('YYYY-MM-DD'));
    if (filters?.deliveryDate)
      filtered = filtered.filter((o) => o.delivery_date === filters.deliveryDate.format('YYYY-MM-DD'));
    if (filters?.terminal)
      filtered = filtered.filter((o) => o.terminal === filters.terminal);
    return filtered;
  }, [orders, filters]);

  const sortedOrders = useMemo(
    () => sortRows(filteredOrders, sortConfig.key, sortConfig.direction),
    [filteredOrders, sortConfig]
  );

  const visibleRows = useMemo(
    () => sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedOrders, page, rowsPerPage]
  );

  if (filteredOrders.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}>
        <Inventory2 sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No undispatched orders found</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ label, key }) => (
                <TableCell
                  key={label}
                  sx={{
                    ...headerCellSx,
                    borderRight: label === 'Actions' ? '' : '1px solid #ccc',
                    cursor: key ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  sortDirection={sortConfig.key === key ? sortConfig.direction : false}
                >
                  {key ? (
                    <TableSortLabel
                      active={sortConfig.key === key}
                      direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(key)}
                      sx={{
                        '& .MuiTableSortLabel-icon': { opacity: sortConfig.key === key ? 1 : 0.3 },
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {label}
                    </TableSortLabel>
                  ) : label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, idx) => (
              <OrderRow
                key={row.id}
                row={row}
                isEven={idx % 2 === 0}
                isToday={moment(row.order_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')}
                isSelected={selectedRows.has(row.id)}
                onRowClick={handleRowClick}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        rowsPerPageOptions={[50, 100, 200]}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Paper>
  );
};

function UndispatchedOrders(props) {

  const [undispatchedFilters, setUndispatchedFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Map());
  const [openDrawer, setOpenDrawer] = React.useState(false)

  const handleUndispatchedFilterChange = useCallback((newFilters) => {
    setUndispatchedFilters(newFilters);
  }, []);

  const handleUndispatchedSearch = useCallback((searchFilters) => {
    console.log('Search undispatched orders:', searchFilters);
  }, []);

  const hasSelection = selectedRows.size > 0;

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{
        p: 2, borderBottom: 1, borderColor: 'divider',
        display: 'flex', alignItems: 'center', gap: 2,
        bgcolor: 'grey.50', borderTopLeftRadius: 10, borderTopRightRadius: 10
      }}>
        <Inventory2 color="primary" />
        <Typography variant="h6" fontWeight="bold">Undispatched Orders</Typography>

        {hasSelection && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{selectedRows.size}</strong> order{selectedRows.size > 1 ? 's' : ''} selected
            </Typography>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddRoad />}
              onClick={() => setOpenDrawer(true)}
              sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '8px', whiteSpace: 'nowrap' }}
            >
              Create or Select Trip
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedRows(new Map())}
            >
              Clear
            </Typography>
          </Box>
        )}
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
        <UndispatchedOrdersTable
          orders={UNDISPATCHED_ORDERS}
          filters={undispatchedFilters}
          selectedRows={selectedRows}
          onRowSelect={setSelectedRows}
        />
      </Box>
      {openDrawer &&
        <DrawerForm title='Create or Select Trip' setOpen={setOpenDrawer} open={openDrawer}>
          <TripForm />
        </DrawerForm>
      }
    </Paper>
  );
}

export default React.memo(UndispatchedOrders);