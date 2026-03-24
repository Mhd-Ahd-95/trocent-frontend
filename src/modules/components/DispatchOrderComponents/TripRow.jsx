import React, { useState, useCallback } from 'react';
import { Box, IconButton, Typography, Stack, Divider, Chip, Paper, Accordion, AccordionDetails, Grid, Link, Tooltip } from '@mui/material';
import { LocalShipping, CalendarToday, Place, PersonOutline, Business, TrendingFlat, MailOutline, Mail, LocalShippingOutlined, NoteAdd, } from '@mui/icons-material';
import TripActionsBar from './TripActionBar';
import { Link as RouterLink } from 'react-router-dom'
import { ConfirmModal, Modal } from '..';
import moment from 'moment';
import { useDispatchOrderMutation } from '../../hooks/useDispatchOrders';

const OrderCard = React.memo(({ order, actionTrip, handleUndispatchedOrder }) => {

  const [showFreight, setShowFreight] = useState(false);

  const getServiceColor = useCallback((type) => {
    const colors = { Direct: 'primary', Rush: 'info', Regular: 'success', };
    return colors[type] || 'default';
  }, []);

  return (
    <Paper elevation={0} sx={{ py: 0, px: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', overflowX: 'auto', '&::-webkit-scrollbar': { height: 6, }, }}>
      <Grid container direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer', minHeight: 50 }}
        onClick={(e) => {
          e.stopPropagation();
          setShowFreight(!showFreight);
        }}
      >
        <Grid size={1.2}>
          <Link component={RouterLink} to={`/orders/edit/${order.order_id}`}>
            <Typography variant="subtitle1" fontWeight="700">
              # {order.order_number}
            </Typography>
          </Link>
          <Typography variant="subtitle2">
            {order.customer_name}
          </Typography>
          <Tooltip title='R123PT HHH GTFDK JJJJDGED HGDEDLK JDJEGAK GFFSBVC'>
            <Typography component={'p'} fontSize={'11px'} noWrap>
              {order.reference_numbers || 'R123PT HHH GTFDK JJJJDGED HGDEDLK JDJEGAK GFFSBVC'}
            </Typography>
          </Tooltip>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid size={0.7}>
          <Typography variant="caption" color="textSecondary" fontWeight="600">
            SERVICE
          </Typography>
          <Chip
            label={order.service_type}
            color={getServiceColor(order.service_type)}
            size="medium"
            sx={{ mt: 0.5, height: 20, fontSize: '0.8rem' }}
          />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid size={3.5}>
          <Typography variant="caption" color="success.main" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Place sx={{ fontSize: 12 }} />
            SHIPPER
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {order.shipper_name}
            {order.order_status === 'Picked Up' &&
              <span style={{ marginLeft: 20 }}>
                <Chip
                  label={order.order_status}
                  color={'success'}
                  size="medium"
                  sx={{ height: 22, fontSize: '0.7rem', letterSpacing: '0.1px', marginTop: -0.5 }}
                />
              </span>
            }
          </Typography>
          <Typography component="p" fontSize={14} color="text.secondary">
            {order.shipper_address}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.shipper_city || '-'} | {order.shipper_province || '-'} | {order.shipper_postal_code || '-'}
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography variant="caption" color="text.secondary" fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 12 }} />
            Pickup
          </Typography>
          <Typography variant="body2">{moment(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {order.pickup_time_from} - {order.pickup_time_to}
          </Typography>
          {order.shipper_special_instructions && <>
            <Divider />
            <Tooltip title={order.shipper_special_instructions}>
              <Typography component="p" fontSize="12px" color="text.secondary"
                sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {order.shipper_special_instructions}
              </Typography>
            </Tooltip>
          </>}
        </Grid>
        <Grid size={0.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingFlat sx={{ color: 'primary.main' }} />
        </Grid>
        <Grid size={3.5}>
          <Typography variant="caption" color="info.main" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Place sx={{ fontSize: 12 }} />
            RECEIVER
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {order.receiver_name}
            {order.order_status === 'Delivered' &&
              <span style={{ marginLeft: 20 }}>
                <Chip
                  label={order.order_status}
                  color={'info'}
                  size="medium"
                  sx={{ height: 22, fontSize: '0.8rem', marginTop: -0.5 }}
                />
              </span>
            }
          </Typography>
          <Typography component="p" fontSize={14} color="text.secondary">
            {order.receiver_address}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.receiver_city || '-'} | {order.receiver_province || '-'} | {order.receiver_postal_code || '-'}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Typography variant="caption" color="text.secondary" fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 12 }} />
            Delivery
          </Typography>
          <Typography variant="body2">{moment(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {order.delivery_time_from} - {order.delivery_time_to}
          </Typography>
          {order.receiver_special_instructions && <>
            <Divider />
            <Tooltip title={order.receiver_special_instructions}>
              <Typography component="p" fontSize="12px" color="text.secondary"
                sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {order.receiver_special_instructions}
              </Typography>
            </Tooltip>
          </>}
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid size={0.4}>
          <Stack direction="column" spacing={0.5} sx={{ height: '100%', justifyContent: 'center' }}>
            <Tooltip title='Undispatch Order'>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUndispatchedOrder(order)
                }}
                sx={{ '&:hover': { bgcolor: 'error.50' } }}
              >
                <LocalShippingOutlined fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title='Add Note'>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add note:', order.id);
                  actionTrip?.current?.addNote(order)
                }}
                sx={{ '&:hover': { bgcolor: 'warning.50' } }}
              >
                <NoteAdd fontSize="small" color="warning" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      {/* <Collapse in={showFreight}>
          <Box sx={{ mt: 2, py: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight="600" color="text.secondary" gutterBottom>
              Freight Details ({order.freight_count} Freights)
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {Array.from({ length: order.freight_count }).map((_, i) => (
                <Box
                  key={i}
                  sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'divider' }}
                >
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Type</Typography>
                      <Typography variant="body2" fontWeight="600">Skid</Typography>
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
                      <Typography variant="body2" fontWeight="600">48 × 40 × 60</Typography>
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
        </Collapse> */}
    </Paper>
  );
});

const TripRow = ({ trip, isToday, isInterliner, tripAction }) => {

  const [expanded, setExpanded] = useState(false);
  const firstOrder = trip?.dispatched_orders[0] ?? [];
  const dispatchedOrderRef = React.useRef(null)
  const [openModal, setOpenModal] = React.useState(false)
  const { undispatchOrder } = useDispatchOrderMutation()

  const handleUndispatchedOrder = (order) => {
    dispatchedOrderRef.current = order
    setOpenModal(true)
  }

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Accordion
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          elevation={0}
          sx={{
            overflow: 'hidden',
            border: '1.5px solid',
            borderColor: expanded ? 'primary.main' : 'divider',
            borderRadius: 2,
            overflowX: 'auto',
            bgcolor: isToday ? 'primary.outlineHover' : 'background.paper',
            '&:hover': { borderColor: 'primary.main', boxShadow: 2 },
            '&:before': { display: 'none' },
            '&.Mui-expanded': { margin: 0 },
          }}
        >
          <Box
            onClick={() => setExpanded(!expanded)}
            sx={{ px: 1.5, py: 0.5, cursor: 'pointer', bgcolor: 'transparent', display: 'flex', alignItems: 'center', }}    >
            <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
              <Grid size={{ xs: 1.5 }} sx={{ display: 'flex', alignItems: 'center', }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalShipping color="primary" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      # {trip.trip_number}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <CalendarToday sx={{ fontSize: 12 }} />
                      {trip.trip_date}
                      <span style={{ marginLeft: 5 }}>
                        {trip.has_updates && (trip.driver_active ? (<Mail sx={{ fontSize: 22, color: 'primary.main' }} />) : (<MailOutline sx={{ fontSize: 22, color: 'text.secondary' }} />))}
                      </span>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 1 }} sx={{}}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isInterliner ? (<Business sx={{ fontSize: 14 }} />) : (<PersonOutline sx={{ fontSize: 14 }} />)}
                  {isInterliner ? 'Interliner' : 'Driver'}
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {isInterliner ? trip.interliner_name : trip.driver_name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 1 }} sx={{}}>
                <Typography variant="caption" color="text.secondary">
                  Order
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  # {firstOrder.order_number}
                </Typography>
              </Grid>

              <Grid size={{ xs: 7.5 }}>
                <Grid container alignItems={'center'} justifyContent={'space-around'}>
                  <Grid size>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Place sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" fontWeight="600" color="success.main">
                        PICKUP
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="600" noWrap>
                      {firstOrder.shipper_address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {firstOrder.shipper_city ? firstOrder.shipper_city : '-'} | {firstOrder.shipper_province ? firstOrder.shipper_province : '-'} | {firstOrder.shipper_postal_code ? firstOrder.shipper_postal_code : '-'}
                    </Typography>
                  </Grid>
                  <Grid size>
                    <TrendingFlat sx={{ color: 'primary.main', fontSize: 28 }} />
                  </Grid>
                  <Grid size>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Place sx={{ fontSize: 14, color: 'info.main' }} />
                      <Typography variant="caption" fontWeight="600" color="info.main">
                        DELIVERY
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="600" noWrap>
                      {firstOrder.receiver_address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {firstOrder.receiver_city ? firstOrder.receiver_city : '-'} | {firstOrder.receiver_province ? firstOrder.receiver_province : '-'} | {firstOrder.receiver_postal_code ? firstOrder.receiver_postal_code : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
                <Grid container spacing={1} alignItems={'center'}>
                  <Grid size={7}>
                    <Typography variant="caption" color="text.secondary">
                      Orders
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {trip.total_orders_completed} / {trip.total_orders}
                    </Typography>
                  </Grid>
                  <Grid size={5}>
                    <TripActionsBar
                      onUpdateStatus={() => console.log('Update status:', trip.id)}
                      onShowTimeline={() => console.log('Show timeline:', trip.id)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <AccordionDetails sx={{ bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider', p: 1 }}>
            <Stack spacing={1.5}>
              {(trip?.dispatched_orders || []).map((order, idx) => (
                <OrderCard
                  actionTrip={tripAction}
                  handleUndispatchedOrder={handleUndispatchedOrder}
                  key={order.id}
                  order={order}
                  idx={idx}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
      {openModal &&
        <Modal open={openModal} handleClose={() => setOpenModal(false)}>
          <ConfirmModal
            noIcon
            title={
              <>
                Undispatch{' '}
                <strong style={{ fontSize: 15, paddingInline: 5 }}># {dispatchedOrderRef.current.order_number}</strong>
              </>
            }
            subtitle='Are you sure you want to continue?'
            handleClose={() => setOpenModal(false)}
            handleSubmit={async () => {
              await undispatchOrder.mutateAsync({id: trip.id, oid: dispatchedOrderRef.current.id})
              dispatchedOrderRef.current = null
              setOpenModal(false)
            }}
          />
        </Modal>
      }
    </>
  );
};

export default React.memo(TripRow);