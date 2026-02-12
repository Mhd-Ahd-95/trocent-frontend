import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';
import { Table } from '../../components';
import OrderActionsMenu from './OrderActionMenu';

const UndispatchedOrders = ({ orders, filters }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (filters?.searchInput) {
      const search = filters.searchInput.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(search) ||
          order.shipper_name?.toLowerCase().includes(search) ||
          order.receiver_name?.toLowerCase().includes(search)
      );
    }

    if (filters?.pickupDate) {
      filtered = filtered.filter(
        (order) => order.pickup_date === filters.pickupDate.format('YYYY-MM-DD')
      );
    }

    if (filters?.deliveryDate) {
      filtered = filtered.filter(
        (order) => order.delivery_date === filters.deliveryDate.format('YYYY-MM-DD')
      );
    }

    if (filters?.terminal) {
      filtered = filtered.filter((order) => order.terminal === filters.terminal);
    }

    return filtered;
  }, [orders, filters]);

  const getServiceColor = (type) => {
    const colors = {
      Direct: 'error',
      Rush: 'warning',
      Regular: 'primary',
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      field: 'order_number',
      headerName: 'Order Number',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'service_type',
      headerName: 'Service Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getServiceColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'shipper_address',
      headerName: 'Shipper Address',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'shipper_city',
      headerName: 'Shipper City',
      width: 150,
    },
    {
      field: 'pickup_date',
      headerName: 'Pick up by date',
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.pickup_date}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.pickup_time}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'receiver_address',
      headerName: 'Consignee Address',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'receiver_city',
      headerName: 'Consignee City',
      width: 150,
    },
    {
      field: 'delivery_date',
      headerName: 'Delivery Date',
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.delivery_date}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.delivery_time}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'freight_count',
      headerName: 'Freight Details',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          icon={<Inventory2 sx={{ fontSize: 16 }} />}
          label={params.value}
          size="small"
          color="secondary"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <OrderActionsMenu
          onUpdate={() => console.log('Update order:', params.row.id)}
          onAddNote={() => console.log('Add note:', params.row.id)}
        />
      ),
    },
  ];

  if (filteredOrders.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'divider' }}
      >
        <Inventory2 sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No undispatched orders found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Table
        columns={columns}
        data={filteredOrders}
        pageSize={50}
        pageSizeOptions={[50, 100, 200]}
        height={45}
        disableRowSelectionOnClick
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        title="Undispatched Orders"
      />
    </Box>
  );
};

export default React.memo(UndispatchedOrders);