import React, { useState, useCallback } from 'react';
import { Box, IconButton, Typography, Stack, Divider, Chip, Paper, Accordion, AccordionDetails, Grid, Link, Tooltip, alpha, useTheme, Collapse } from '@mui/material';
import { LocalShipping, CalendarToday, Place, PersonOutline, Business, TrendingFlat, MailOutline, Mail, LocalShippingOutlined, NoteAdd, CheckCircle, ExpandMoreRounded, TagRounded, SystemUpdateAlt } from '@mui/icons-material';
import TripActionsBar from './TripActionBar';
import { Link as RouterLink } from 'react-router-dom'
import { ConfirmModal, DrawerForm, Modal } from '..';
import moment from 'moment';
import { useDispatchOrderMutation } from '../../hooks/useDispatchOrders';
import UpdateTripForm from './UpdateTripForm'
import UpdateOrderStatusForm from './UpdateOrderStatusForm';
import { CustomTitle } from './CustomTitle';

const OrderCard = React.memo(({ order, actionTrip, handleUndispatchedOrder, isInterliner, handleUpdateOrderStatus }) => {

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
          <Typography variant="body2">{moment.utc(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
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
          <Typography variant="body2">{moment.utc(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
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
        {/* <Grid size={0.1}> */}
        <Divider orientation="vertical" flexItem />
        {/* </Grid> */}
        <Grid size={0.3}>
          <Stack direction="column" spacing={0.2} sx={{ height: '100%', justifyContent: 'center' }}>
            {!isInterliner &&
              <Tooltip title='Undispatch Order' placement='right'>
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
            }
            {/* <Tooltip title='Update Order Status' placement='right'>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateOrderStatus(order)
                }}
                sx={{ '&:hover': { bgcolor: 'error.50' } }}
              >
                <SystemUpdateAlt fontSize="small" color="action" />
              </IconButton>
            </Tooltip> */}
            <Tooltip title='Add Note' placement='right'>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
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
    </Paper>
  );
});

const TripRow = ({ trip, isToday, isInterliner, tripAction, isCompleted }) => {

  const [expanded, setExpanded] = useState(false);
  const firstOrder = trip?.dispatched_orders[0] ?? [];
  const dispatchedOrderRef = React.useRef(null)
  const [openModal, setOpenModal] = React.useState(false)
  const [showCompleted, setShowCompleted] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const tripRef = React.useRef()

  const { undispatchOrder, updateTrip } = useDispatchOrderMutation()

  const handleUndispatchedOrder = (order) => {
    dispatchedOrderRef.current = order
    setOpenModal(true)
  }

  const handleUpdateOrderStatus = (order) => {
    dispatchedOrderRef.current = order
    setOpenDrawer(2)
  }

  const theme = useTheme()

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Accordion
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          elevation={0}
          sx={{
            overflow: 'hidden', border: '1.5px solid', borderColor: expanded ? 'primary.main' : 'divider', borderRadius: 2, overflowX: 'auto',
            bgcolor: isToday ? alpha(theme.palette.primary.main, 0.09) : 'background.paper', '&:hover': { borderColor: 'primary.main', boxShadow: 2 }, '&:before': { display: 'none' }, '&.Mui-expanded': { margin: 0 },
          }}
        >
          <Box
            onClick={() => setExpanded(!expanded)}
            sx={{ px: 1.5, py: 0.5, cursor: 'pointer', bgcolor: 'transparent', display: 'flex', alignItems: 'center', }}    >
            <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
              <Grid size={{ xs: 1.5 }} sx={{ display: 'flex', alignItems: 'center', }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '10px', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`, flexShrink: 0,
                  }}>
                    <LocalShipping sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
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

              <Grid size={{ xs: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isInterliner ? (<Business sx={{ fontSize: 14 }} />) : (<PersonOutline sx={{ fontSize: 14 }} />)}
                  {isInterliner ? 'Interliner' : 'Driver'}
                </Typography>
                <Typography variant="body2" fontWeight="600" >
                  {isInterliner ? trip.interliner_name : trip.driver_name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 1 }} sx={{}}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TagRounded sx={{ fontSize: 14 }} />
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
                      ORDERS
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {trip.total_orders_completed} / {trip.total_orders}
                    </Typography>
                  </Grid>
                  <Grid size={5}>
                    <TripActionsBar
                      onUpdateStatus={() => {
                        tripRef.current = trip
                        setOpenDrawer(1)
                      }}
                      onShowTimeline={() => console.log('Show timeline:', trip.id)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <AccordionDetails sx={{ bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider', p: 1 }}>
            <Stack spacing={1.5}>
              {(trip?.dispatched_orders || []).sort((a, b) => a.order_level - b.order_level).map((order, idx) => (
                <OrderCard
                  actionTrip={tripAction}
                  handleUndispatchedOrder={handleUndispatchedOrder}
                  handleUpdateOrderStatus={handleUpdateOrderStatus}
                  key={order.id}
                  isInterliner={isInterliner}
                  order={order}
                  idx={idx}
                />
              ))}
            </Stack>
            {!isCompleted && trip.total_orders_completed > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Box
                  onClick={(e) => { e.stopPropagation(); setShowCompleted((p) => !p); }}
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, borderRadius: '8px', cursor: 'pointer', border: '1px dashed',
                    borderColor: alpha('#000', 0.1), color: 'text.secondary', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                    '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.05), },
                  }}
                >
                  <CheckCircle sx={{ fontSize: 13 }} />
                  {showCompleted ? 'Hide' : 'Show'} Completed Orders
                  <ExpandMoreRounded sx={{ fontSize: 15, transition: 'transform 0.2s', transform: showCompleted ? 'rotate(180deg)' : 'rotate(0deg)', }} />
                </Box>

                <Collapse in={showCompleted} timeout="auto">
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {(trip?.dispatched_orders || []).map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actionTrip={tripAction}
                        handleUndispatchedOrder={handleUndispatchedOrder}
                        handleUpdateOrderStatus={handleUpdateOrderStatus}
                        isInterliner={isInterliner}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>
            )}
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
              await undispatchOrder.mutateAsync({ id: trip.id, oid: dispatchedOrderRef.current.id })
              dispatchedOrderRef.current = null
              setOpenModal(false)
            }}
          />
        </Modal>
      }
      {openDrawer === 1 && (
        <DrawerForm customTitle={<CustomTitle number={trip.trip_number} title='Update Trip' Icon={LocalShipping} />} setOpen={setOpenDrawer} open={openDrawer}>
          <UpdateTripForm
            // order={dispatchOrderRef.current}
            updateTrip={(async (payload) => await updateTrip.mutateAsync({ trip_id: payload.trip_id, payload: payload.payload }))}
            isInterliner={Boolean(isInterliner)}
            tripData={trip}
            onClose={() => setOpenDrawer(false)}
          />
        </DrawerForm>
      )}
      {openDrawer === 2 && (
        <DrawerForm customTitle={<CustomTitle number={dispatchedOrderRef.current.order_number} title='Update Order Status' isOrder Icon={LocalShipping}  />} setOpen={setOpenDrawer} open={openDrawer}>
          <UpdateOrderStatusForm />
        </DrawerForm>
      )}
    </>
  );
};

export default React.memo(TripRow);
