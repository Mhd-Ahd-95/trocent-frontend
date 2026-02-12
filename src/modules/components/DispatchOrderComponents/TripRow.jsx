import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Stack,
  Divider,
  Chip,
  Collapse,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  LocalShipping,
  CalendarToday,
  AccessTime,
  Place,
  PersonOutline,
  Business,
  Inventory2,
  TrendingFlat,
  MailOutline,
  Mail,
  Edit,
  LocalShippingOutlined,
  NoteAdd,
} from '@mui/icons-material';
import TripActionsBar from './TripActionBar';

const TripRow = ({ trip, activeTab, isToday }) => {
  const [expanded, setExpanded] = useState(false);
  const firstOrder = trip.orders[0];
  const isInterliner = activeTab === 0;

  const getServiceColor = useCallback((type) => {
    const colors = {
      Direct: 'error',
      Rush: 'warning',
      Regular: 'primary',
    };
    return colors[type] || 'default';
  }, []);

  const getStatusColor = useCallback((status) => {
    const colors = {
      active: 'success',
      planning: 'warning',
      completed: 'default',
    };
    return colors[status] || 'default';
  }, []);

  const OrderCard = ({ order, idx }) => {
    const [showFreight, setShowFreight] = useState(false);

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Order Number Badge */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            }}
          >
            {idx + 1}
          </Box>

          {/* Order Number */}
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" fontWeight="600">
              {order.order_number}
            </Typography>
            <Chip
              label={order.service_type}
              color={getServiceColor(order.service_type)}
              size="small"
              sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Shipper */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="success.main"
              fontWeight="600"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Place sx={{ fontSize: 12 }} />
              SHIPPER
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {order.shipper_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order.shipper_city}
            </Typography>
          </Box>

          {/* Pickup Date */}
          <Box sx={{ minWidth: 140 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <CalendarToday sx={{ fontSize: 12 }} />
              Pickup
            </Typography>
            <Typography variant="body2">{order.pickup_date}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.pickup_time}
            </Typography>
          </Box>

          <TrendingFlat sx={{ color: 'text.secondary' }} />

          {/* Receiver */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="info.main"
              fontWeight="600"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Place sx={{ fontSize: 12 }} />
              RECEIVER
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {order.receiver_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order.receiver_city}
            </Typography>
          </Box>

          {/* Delivery Date */}
          <Box sx={{ minWidth: 140 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <CalendarToday sx={{ fontSize: 12 }} />
              Delivery
            </Typography>
            <Typography variant="body2">{order.delivery_date}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.delivery_time}
            </Typography>
          </Box>

          {/* Freight Count with Expand */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowFreight(!showFreight);
            }}
            sx={{
              bgcolor: 'secondary.50',
              '&:hover': { bgcolor: 'secondary.100' },
            }}
          >
            <Inventory2 fontSize="small" color="secondary" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Order Actions */}
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Update order:', order.id);
              }}
              sx={{ '&:hover': { bgcolor: 'primary.50' } }}
            >
              <Edit fontSize="small" color="primary" />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Undispatch order:', order.id);
              }}
              sx={{ '&:hover': { bgcolor: 'error.50' } }}
            >
              <LocalShippingOutlined fontSize="small" color="error" />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Add note:', order.id);
              }}
              sx={{ '&:hover': { bgcolor: 'warning.50' } }}
            >
              <NoteAdd fontSize="small" color="warning" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Freight Details Collapse */}
        <Collapse in={showFreight}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight="600" color="text.secondary" gutterBottom>
              Freight Details ({order.freight_count} items)
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {Array.from({ length: order.freight_count }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Type</Typography>
                      <Typography variant="body2" fontWeight="600">Pallet</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Pieces</Typography>
                      <Typography variant="body2" fontWeight="600">5</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Weight</Typography>
                      <Typography variant="body2" fontWeight="600">500 lbs</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Dimensions (L×W×H)</Typography>
                      <Typography variant="body2" fontWeight="600">48" × 40" × 60"</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Volume Weight</Typography>
                      <Typography variant="body2" fontWeight="600">450 lbs</Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Paper>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Card
        elevation={0}
        sx={{
          border: isToday ? '2px solid' : '1px solid',
          borderColor: isToday ? 'warning.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.2s',
          bgcolor: isToday ? 'warning.50' : 'background.paper',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 2,
          },
        }}
      >
        {/* Collapsed View */}
        <Box
          onClick={() => setExpanded(!expanded)}
          sx={{
            p: 2.5,
            cursor: 'pointer',
            bgcolor: expanded ? 'primary.50' : 'transparent',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>

            {/* Trip Number + Envelope */}
            <Box sx={{ minWidth: 140 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShipping color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="h6" fontWeight="bold">
                  {trip.trip_number}
                </Typography>
                {trip.has_updates && (
                  trip.driver_active ? (
                    <Mail sx={{ fontSize: 18, color: 'primary.main' }} />
                  ) : (
                    <MailOutline sx={{ fontSize: 18, color: 'text.secondary' }} />
                  )
                )}
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
              >
                <CalendarToday sx={{ fontSize: 12 }} />
                {trip.trip_date}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ minWidth: 180 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                {isInterliner ? (
                  <Business sx={{ fontSize: 14 }} />
                ) : (
                  <PersonOutline sx={{ fontSize: 14 }} />
                )}
                {isInterliner ? 'Interliner' : 'Driver'}
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {trip.driver_name}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" color="text.secondary">Order</Typography>
              <Typography variant="body2" fontWeight="600">
                {firstOrder.order_number}
              </Typography>
              <Chip
                label={firstOrder.service_type}
                color={getServiceColor(firstOrder.service_type)}
                size="small"
                sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
              />
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Place sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" fontWeight="600" color="success.main">
                  PICKUP
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight="600" noWrap>
                {firstOrder.shipper_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {firstOrder.shipper_city}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
              >
                <AccessTime sx={{ fontSize: 12 }} />
                {firstOrder.pickup_time}
              </Typography>
            </Box>

            <TrendingFlat sx={{ color: 'primary.main', fontSize: 28 }} />

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Place sx={{ fontSize: 14, color: 'info.main' }} />
                <Typography variant="caption" fontWeight="600" color="info.main">
                  DELIVERY
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight="600" noWrap>
                {firstOrder.receiver_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {firstOrder.receiver_city}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
              >
                <AccessTime sx={{ fontSize: 12 }} />
                {firstOrder.delivery_time}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ minWidth: 100, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">Orders</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {trip.total_orders_completed} / {trip.total_orders}
              </Typography>
              <Chip
                label={trip.trip_status}
                color={getStatusColor(trip.trip_status)}
                size="small"
                sx={{ mt: 0.5, textTransform: 'capitalize' }}
              />
            </Box>

            <TripActionsBar
              onUpdateStatus={() => console.log('Update status:', trip.id)}
              onShowTimeline={() => console.log('Show timeline:', trip.id)}
            />
          </Stack>
        </Box>

        {/* Expanded View - All Orders */}
        <Collapse in={expanded}>
          <Box sx={{ bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider', p: 2 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight="600"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Inventory2 fontSize="small" />
              All Orders ({trip.orders.length})
            </Typography>

            <Stack spacing={1.5}>
              {trip.orders.map((order, idx) => (
                <OrderCard key={order.id} order={order} idx={idx} />
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default React.memo(TripRow);