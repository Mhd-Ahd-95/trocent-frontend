import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';
import { Table } from '../../components';
import OrderActionsMenu from './OrderActionMenu';
import moment from 'moment';

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
      Direct: 'info',
      Rush: 'warning',
      Regular: 'secondary',
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      field: 'order_number',
      headerName: 'Order Number',
      minWidth: 250,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='subtitle1' fontWeight={600} fontSize={14}>{params.value}</Typography>
          <Typography variant='caption' color='textSecondary' fontSize={11}>{params.row.customer_name}</Typography>
          <Typography variant='caption' color='textSecondary' noWrap fontSize={11}>{params.row.reference_numbers} gggdeujj hhdeu hjdehhd jojsjjjsw hjwbd jhdhede</Typography>
          <Typography variant='caption' color='textSecondary' fontSize={11}>{moment(params.row.order_date || new Date()).format('ddd, DD/MM/YYYY')}</Typography>
        </Box>
      ),
    },
    {
      field: 'service_type',
      headerName: 'Service Type',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getServiceColor(params.value)}
          size="small"
          sx={{ fontSize: 13 }}
        />
      ),
    },
    {
      field: 'shipper_name',
      headerName: 'Shipper Address',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', height: '100%' }}>
          <Typography variant='subtitle1' fontWeight={600} fontSize={14}>{params.value}</Typography>
          <Typography noWrap variant='caption' color='textSecondary' fontSize={11}>{params.row.shipper_address}</Typography>
        </Box>
      ),
    },
    {
      field: 'shipper_city',
      headerName: 'Shipper City',
      minWidth: 230,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography noWrap variant='subtitle1' fontWeight={500} fontSize={13}>{params.value} | {params.row.shipper_province} | {params.row.shipper_postal_code}</Typography>
        </Box>
      ),
    },
    {
      field: 'scheduled_date',
      headerName: 'Pick up by date',
      minWidth: 135,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} fontSize={13}>{moment(params.value).format('ddd, DD/MM/YYYY')}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.pickup_time_from} - {params.row.pickup_time_to}</Typography>
        </Box>
      ),
    },
    {
      field: 'receiver_name',
      headerName: 'Receiver Address',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', height: '100%' }}>
          <Typography variant='subtitle1' fontWeight={600} fontSize={14}>{params.value}</Typography>
          <Typography noWrap variant='caption' color='textSecondary' fontSize={11}>{params.row.receiver_address}</Typography>
        </Box>
      ),
    },
    {
      field: 'receiver_city',
      headerName: 'Receiver City',
      width: 230,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography noWrap variant='subtitle1' fontWeight={500} fontSize={13}>{params.value} | {params.row.receiver_province} | {params.row.receiver_postal_code}</Typography>
        </Box>
      ),
    },
    {
      field: 'scheduled_date',
      headerName: 'Delivery Date',
      minWidth: 135,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} fontSize={13}>{moment(params.value).format('ddd, DD/MM/YYYY')}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.delivery_time_from} - {params.row.delivery_time_to}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 85,
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
        height={80}
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