import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel, Button, CircularProgress, Skeleton, Stack } from '@mui/material';
import { Inventory2, AddRoad, NoteAdd } from '@mui/icons-material';
import moment from 'moment';
import OrderRow from './OrderRow';
import FilterBar from './FilterBar';
import { DrawerForm } from '..';
import TripForm from './TripForm';
import { useDispatchOrderMutation, useUndispatchedOrders } from '../../hooks/useDispatchOrders';
import OrderNoteForm from './NoteForm';

const CustomTitle = React.memo(({ order_number }) => (
  <Stack direction="row" alignItems="center" spacing={1.5}>
    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}      >
      <NoteAdd sx={{ fontSize: 18, color: '#fff' }} />
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
        Add Note
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Order
        </Typography>
        <Typography variant="caption" fontWeight={700}
          sx={{ color: 'primary.main', bgcolor: 'primary.outlineHover', px: 0.75, py: 0.1, borderRadius: 1, fontFamily: 'monospace', fontSize: 12, }}
        >
          # {order_number}
        </Typography>
      </Stack>
    </Box>
  </Stack>
))

const headerCellSx = {
  fontWeight: 700, fontSize: 13, color: 'text.primary',
  bgcolor: 'grey.200', borderBottom: '1px solid', borderColor: 'divider',
  whiteSpace: 'nowrap', py: 1.5, px: 2,
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

const SkeletonRows = ({ count = 10 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      {COLUMNS.map(({ label }) => (
        <TableCell key={label}><Skeleton variant="text" width="80%" /></TableCell>
      ))}
    </TableRow>
  ));


const UndispatchedOrdersTable = React.memo(({ orders, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, sortConfig, onSort, isLoading, isFetching, selectedRows, onRowSelect, onAddNote }) => {

  const handleRowClick = useCallback((row) => {
    onRowSelect((prev) => {
      const next = new Map(prev);
      next.has(row.id) ? next.delete(row.id) : next.set(row.id, row);
      return next;
    });
  }, [onRowSelect]);

  if (!isLoading && orders.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}>
        <Inventory2 sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No undispatched orders found</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{
      border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden',
      opacity: isFetching && !isLoading ? 0.7 : 1,
      transition: 'opacity 0.15s ease',
    }}>
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
                      onClick={() => onSort(key)}
                      sx={{
                        '& .MuiTableSortLabel-icon': { opacity: sortConfig.key === key ? 1 : 0.3 },
                        fontWeight: 700, fontSize: 13,
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
            {isLoading
              ? <SkeletonRows count={rowsPerPage} />
              : orders.map((row, idx) => (
                <OrderRow
                  key={row.id}
                  row={row}
                  onAddNote={onAddNote}
                  isEven={idx % 2 === 0}
                  isToday={moment(row.order_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')}
                  isSelected={selectedRows.has(row.id)}
                  onRowClick={handleRowClick}
                />
              ))
            }
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, p) => onPageChange(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { onRowsPerPageChange(+e.target.value); }}
        rowsPerPageOptions={[50, 100, 200]}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Paper>
  );
});

function UndispatchedOrders(props) {

  const { tripAction } = props

  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Map());
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatchOrderRef = React.useRef(null)

  const { createTrip, addOrdersToTrip } = useDispatchOrderMutation()

  const { data, isLoading, isFetching } = useUndispatchedOrders({ ...appliedFilters, sort_by: sortConfig.key, sort_direction: sortConfig.direction }, page + 1, rowsPerPage,);

  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearch = useCallback((searchFilters) => {
    setAppliedFilters(searchFilters);
    setPage(0);
  }, []);

  const handleSort = useCallback((key) => {
    if (!key) return;
    setSortConfig((prev) => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' });
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: document.getElementById('undispatched-section')?.offsetTop ?? 0, behavior: 'smooth', });
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleNote = (row) => {
    dispatchOrderRef.current = row
    setOpenDrawer(2)
  }

  const hasSelection = selectedRows.size > 0;

  React.useImperativeHandle(tripAction, () => ({
    addNote: handleNote
  }), [dispatchOrderRef.current])

  return (
    <Paper id="undispatched-section" elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.50', borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
        <Inventory2 color="primary" />
        <Typography variant="h6" fontWeight="bold">Undispatched Orders</Typography>

        {isFetching && !isLoading && <CircularProgress size={14} sx={{ ml: 1 }} />}

        {hasSelection && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{selectedRows.size}</strong> order{selectedRows.size > 1 ? 's' : ''} selected
            </Typography>
            <Button
              variant="contained" size="small" startIcon={<AddRoad />}
              onClick={() => setOpenDrawer(1)}
              sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '8px', whiteSpace: 'nowrap' }}
            >
              Create or Select Trip
            </Button>
            <Typography
              variant="body2" color="text.secondary"
              sx={{ cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedRows(new Map())}
            >
              Clear
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <FilterBar onSearch={handleSearch} showSearchButton defaultExpanded={false} />
      </Box>

      <Box sx={{ p: 2 }}>
        <UndispatchedOrdersTable
          orders={orders}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading}
          isFetching={isFetching}
          selectedRows={selectedRows}
          onRowSelect={setSelectedRows}
          onAddNote={handleNote}
        />
      </Box>

      {openDrawer === 1 && (
        <DrawerForm title="Create or Select Trip" setOpen={setOpenDrawer} open={openDrawer}>
          <TripForm
            enabled={true}
            createTrip={async (payload) => {
              await createTrip.mutateAsync({ payload })
              setSelectedRows(new Map())
              setOpenDrawer(false)
            }}
            addOrdersToTrip={async (payload) => {
              await addOrdersToTrip.mutateAsync({ id: payload.trip_id, payload: payload.dispatch_orders })
              setSelectedRows(new Map())
              setOpenDrawer(false)
            }}
            orderIds={Array.from(selectedRows.keys())}
            setSelectedOrders={setSelectedRows}
          />
        </DrawerForm>
      )}

      {openDrawer === 2 && (
        <DrawerForm customTitle={<CustomTitle order_number={dispatchOrderRef.current.order_number} />} setOpen={setOpenDrawer} open={openDrawer}>
          <OrderNoteForm
            order={dispatchOrderRef.current}
            onClose={() => setOpenDrawer(false)}
          />
        </DrawerForm>
      )}
    </Paper>
  );
}

export default React.memo(UndispatchedOrders);