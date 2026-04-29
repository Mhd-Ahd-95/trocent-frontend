import React, { useState, useCallback, useEffect } from 'react';
import { Box, IconButton, Typography, Stack, Divider, Chip, Paper, Accordion, AccordionDetails, Grid, Link, Tooltip, Collapse, colors } from '@mui/material';
import { LocalShipping, CalendarToday, Place, PersonOutline, Business, TrendingFlat, MailOutline, Mail, NoteAdd, CheckCircle, ExpandMoreRounded, TagRounded, SystemUpdateAlt, UploadFile } from '@mui/icons-material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TripActionsBar from './TripActionBar';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmModal, DrawerForm, Modal } from '..';
import moment from 'moment';
import { useDispatchedOrdersCompleted, useDispatchOrderMutation } from '../../hooks/useDispatchOrders';
import UpdateTripForm from './UpdateTripForm';
import UpdateOrderStatusForm from './UpdateOrderStatusForm';
import { CustomTitle } from './CustomTitle';
import { useTripRowStyles, useOrderCardStyles } from './DispatchOrder.styles';
import { TabLoadingState } from './TripTabs';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const OrderCard = React.memo(({ order, actionTrip, handleUndispatchedOrder, isInterliner, handleUpdateOrderStatus, bgColor, bordered, isCompleted, pickedUpStatus, deliveredStatus }) => {

  const [showFreight, setShowFreight] = useState(false);
  const { classes } = useOrderCardStyles({ orderStatus: order.order_status, bgColor, bordered });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: order.id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'default',
  };

  const getServiceColor = useCallback((type) => {
    const colors = { Direct: 'primary', Rush: 'info', Regular: 'success' };
    return colors[type] || 'default';
  }, []);

  return (
    <Paper ref={setNodeRef} style={dragStyle} elevation={0} className={classes.paper}>
      <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
        {!isCompleted && (
          <Box {...attributes} {...listeners}
            onClick={(e) => e.stopPropagation()}
            sx={{ display: 'flex', alignItems: 'center', px: 0.5, cursor: isDragging ? 'grabbing' : 'grab', color: 'text.disabled', flexShrink: 0, '&:hover': { color: 'text.secondary' }, }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        )}

        <Grid
          container direction="row" spacing={1} alignItems="center"
          className={classes.gridContainer}
          onClick={(e) => { e.stopPropagation(); setShowFreight(!showFreight); }}
          sx={{ flex: 1 }}
        >
          <Grid size={1.2}>
            <Link component={RouterLink} to={`/orders/edit/${order.order_id}`} className={classes.orderLink}>
              <Typography variant="subtitle1" fontWeight="700"># {order.order_number}</Typography>
            </Link>
            <Typography variant="subtitle2">{order.customer_name}</Typography>
            <Tooltip title={order.reference_numbers || ''}>
              <Typography component={'p'} className={classes.referenceText} noWrap>
                {order.reference_numbers || '-'}
              </Typography>
            </Tooltip>
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid size={0.7}>
            <Typography variant="caption" color="textSecondary" fontWeight="600">SERVICE</Typography>
            <Chip
              label={order.service_type}
              color={getServiceColor(order.service_type)}
              size="medium"
              className={classes.serviceChip}
            />
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid size={3.5}>
            <Typography variant="caption" className={`${classes.sectionLabel} ${classes.shipperLabel}`}>
              <Place sx={{ fontSize: 12 }} />SHIPPER
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {order.shipper_name}
              {pickedUpStatus &&
                <Chip component={'span'} label={pickedUpStatus} color={'success'} size="medium" className={classes.statusChipPickedUp} />
              }
              {order.order_status === 'picked up' && (
                <Chip component={'span'} label={order.pickup_out ? `Picked Up At ${order.pickup_out}` : 'Picked Up'} color={'success'} size="medium" className={classes.statusChipPickedUp} />
              )}
              {order.order_status === 'arrived shipper' && (
                <Chip component={'span'} label={order.pickup_in ? `Arrived At ${order.pickup_in}` : 'Arrived At'} color={'warning'} size="medium" className={classes.statusChipArrived} />
              )}
            </Typography>
            <Typography component="p" className={classes.addressText}>{order.shipper_address}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.shipper_city || '-'} | {order.shipper_province || '-'} | {order.shipper_postal_code || '-'}
            </Typography>
          </Grid>

          <Grid size={1}>
            <Typography className={classes.timeLabel}>
              <CalendarToday sx={{ fontSize: 12 }} />Pickup
            </Typography>
            <Typography variant="body2">{moment.utc(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.pickup_time_from} - {order.pickup_time_to}
            </Typography>
            {order.shipper_special_instructions && <>
              <Divider />
              <Tooltip title={order.shipper_special_instructions}>
                <Typography component="p" className={classes.specialInstructions}>
                  {order.shipper_special_instructions}
                </Typography>
              </Tooltip>
            </>}
          </Grid>

          <Grid size={0.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingFlat sx={{ color: 'primary.main' }} />
          </Grid>

          <Grid size={3.5}>
            <Typography variant="caption" className={`${classes.sectionLabel} ${classes.receiverLabel}`}>
              <Place sx={{ fontSize: 12 }} />RECEIVER
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {order.receiver_name}
              {deliveredStatus &&
                <Chip component={'span'} label={deliveredStatus} color={'success'} size="medium" className={classes.statusChipPickedUp} />
              }
              {order.order_status === 'delivered' && (
                <Chip component={'span'} label={order.delivery_out ? `Delivered At ${order.delivery_out}` : 'Delivered'} color={'info'} size="medium" className={classes.statusChipDelivered} />
              )}
              {order.order_status === 'arrived receiver' && (
                <Chip component={'span'} label={order.delivery_in ? `Arrived At ${order.delivery_in}` : 'Arrived'} color={'warning'} size="medium" className={classes.statusChipDelivered} />
              )}
            </Typography>
            <Typography component="p" className={classes.addressText}>{order.receiver_address}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.receiver_city || '-'} | {order.receiver_province || '-'} | {order.receiver_postal_code || '-'}
            </Typography>
          </Grid>

          <Grid size={1}>
            <Typography className={classes.timeLabel}>
              <CalendarToday sx={{ fontSize: 12 }} />Delivery
            </Typography>
            <Typography variant="body2">{moment.utc(order.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {order.delivery_time_from} - {order.delivery_time_to}
            </Typography>
            {order.receiver_special_instructions && <>
              <Divider />
              <Tooltip title={order.receiver_special_instructions}>
                <Typography component="p" className={classes.specialInstructions}>
                  {order.receiver_special_instructions}
                </Typography>
              </Tooltip>
            </>}
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid size={0.3}>
            <Stack direction="column" spacing={0.2} className={classes.actionsStack}>
              {!isInterliner && (
                <Tooltip title='Undispatch Order' placement='right'>
                  <IconButton size="small" className={classes.undispatchBtn} onClick={(e) => { e.stopPropagation(); handleUndispatchedOrder(order); }}>
                    <SystemUpdateAlt fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              )}
              {!isCompleted &&
                <Tooltip title='Update Order Status' placement='right'>
                  <IconButton size="small" className={classes.updateStatusBtn} onClick={(e) => { e.stopPropagation(); handleUpdateOrderStatus(order); }}>
                    <LocalShipping fontSize="small" sx={{ color: colors.green[700] }} />
                  </IconButton>
                </Tooltip>
              }
              <Tooltip title='Add Note' placement='right'>
                <IconButton size="small" className={classes.addNoteBtn} onClick={(e) => { e.stopPropagation(); actionTrip?.current?.addNote(order); }}>
                  <NoteAdd fontSize="small" color="warning" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
});

const TripRow = ({ trip, isToday, isInterliner, tripAction, isCompleted, showAllCompleted, onReorderOrders }) => {

  const [expanded, setExpanded] = useState(false);
  const firstOrder = trip?.dispatched_orders[0] ?? [];
  const dispatchedOrderRef = React.useRef(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [showCompleted, setShowCompleted] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const tripRef = React.useRef();

  const { undispatchOrder, updateTrip } = useDispatchOrderMutation();
  const toggleShowing = React.useMemo(() => showAllCompleted ? expanded : showCompleted, [showAllCompleted, showCompleted, expanded]);
  const { data: completedOrders, isLoading: isCompletedLoading } = useDispatchedOrdersCompleted(trip.id, toggleShowing);
  const isActive = trip.trip_status === 'active';
  const { classes } = useTripRowStyles({ isActive, isToday, expanded });

  const sortedByLevel = React.useMemo(() => [...(trip?.dispatched_orders || [])].sort((a, b) => a.order_level - b.order_level), [trip?.dispatched_orders]);

  const [orderedList, setOrderedList] = useState(sortedByLevel);

  useEffect(() => {
    setOrderedList([...(trip?.dispatched_orders || [])].sort((a, b) => a.order_level - b.order_level));
  }, [trip?.dispatched_orders]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 }, }));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = orderedList.findIndex((o) => o.id === active.id);
    const newIndex = orderedList.findIndex((o) => o.id === over.id);
    const reordered = arrayMove(orderedList, oldIndex, newIndex);
    setOrderedList(reordered);
    const result = reordered.map((order, idx) => ({ id: order.id, order_level: idx + 1, }));
    onReorderOrders?.(trip.id, result);
  };

  const handleUndispatchedOrder = (order) => {
    dispatchedOrderRef.current = order;
    setOpenModal(true);
  };

  const handleUpdateOrderStatus = (order) => {
    dispatchedOrderRef.current = order;
    setOpenDrawer(2);
  };

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Accordion
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          elevation={0}
          className={classes.accordion}
        >
          <Box onClick={() => setExpanded(!expanded)} className={classes.accordionHeader}>
            <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>

              <Grid size={{ xs: 1.5 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box className={classes.tripIconBox}>
                    <LocalShipping sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold"># {trip.trip_number}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 12 }} />
                      {trip.trip_date}
                      <span style={{ marginLeft: 5 }}>
                        {trip.has_updates && (trip.driver_active
                          ? <Mail sx={{ fontSize: 22, color: 'primary.main' }} />
                          : <MailOutline sx={{ fontSize: 22, color: 'text.secondary' }} />
                        )}
                      </span>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 1 }}>
                <Typography variant="caption" className={classes.driverLabel}>
                  {isInterliner ? (
                    <Business sx={{ fontSize: 14 }} />
                  ) : isActive ? (
                    <Box className={classes.pulseDotWrapper}>
                      <Box className={classes.pulseRing} />
                      <Box className={classes.pulseDot} />
                    </Box>
                  ) : (
                    <PersonOutline sx={{ fontSize: 14 }} />
                  )}
                  {isInterliner ? 'Interliner' : 'Driver'}
                </Typography>
                <Typography variant="body2" className={classes.driverName}>
                  {isInterliner ? trip.interliner_name : trip.driver_name}
                </Typography>
                {!isInterliner && (
                  <Typography variant="caption" fontWeight="600">{trip.driver_number}</Typography>
                )}
              </Grid>

              <Grid size={{ xs: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TagRounded sx={{ fontSize: 14 }} />Order
                </Typography>
                <Typography variant="body2" fontWeight="600"># {firstOrder.order_number}</Typography>
              </Grid>

              <Grid size={{ xs: 7.5 }}>
                <Grid container alignItems={'center'} width={'100%'}>
                  <Grid size={5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Place sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" fontWeight="600" color="success.main">PICKUP</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="600" noWrap>{firstOrder.shipper_address}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {firstOrder.shipper_city || '-'} | {firstOrder.shipper_province || '-'} | {firstOrder.shipper_postal_code || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={2}>
                    <TrendingFlat sx={{ color: 'primary.main', fontSize: 28 }} />
                  </Grid>
                  <Grid size={5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Place sx={{ fontSize: 14, color: 'info.main' }} />
                      <Typography variant="caption" fontWeight="600" color="info.main">DELIVERY</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="600" noWrap>{firstOrder.receiver_address}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {firstOrder.receiver_city || '-'} | {firstOrder.receiver_province || '-'} | {firstOrder.receiver_postal_code || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
                <Grid container spacing={1} alignItems={'center'}>
                  <Grid size={7}>
                    <Typography variant="caption" color="text.secondary">ORDERS</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {trip.total_orders_completed} / {trip.total_orders}
                    </Typography>
                  </Grid>
                  <Grid size={5}>
                    <TripActionsBar
                      onUpdateStatus={() => { tripRef.current = trip; setOpenDrawer(1); }}
                      onShowTimeline={() => console.log('Show timeline:', trip.id)}
                    />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </Box>

          <AccordionDetails className={classes.accordionDetails}>
            <Stack spacing={1.5}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedList.map((o) => o.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack spacing={1.5}>
                    {orderedList.map((order, idx) => (
                      <OrderCard
                        key={order.id}
                        isCompleted={isCompleted}
                        actionTrip={tripAction}
                        handleUndispatchedOrder={handleUndispatchedOrder}
                        handleUpdateOrderStatus={handleUpdateOrderStatus}
                        isInterliner={isInterliner}
                        order={order}
                        idx={idx}
                      />
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            </Stack>

            {!isCompleted && trip.total_orders_completed > 0 && (
              <Box sx={{ mt: 1.5 }}>
                {!showAllCompleted ?
                  <Box
                    onClick={(e) => { e.stopPropagation(); setShowCompleted((p) => !p); }}
                    className={classes.showCompletedBtn}
                  >
                    <CheckCircle sx={{ fontSize: 13 }} />
                    {toggleShowing ? 'Hide' : 'Show'} Completed Orders
                    <ExpandMoreRounded className={classes.expandIcon} sx={{ transform: toggleShowing ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </Box>
                  :
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: colors.green[200] }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.green[700], fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                      <CheckCircle sx={{ fontSize: 13 }} />
                      COMPLETED ORDERS
                    </Box>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: colors.green[200] }} />
                  </Box>
                }
                <Collapse in={toggleShowing} timeout="auto">
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {isCompletedLoading ? <TabLoadingState textLoading={'Loading Completed Orders...'} /> :
                      (completedOrders || []).map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          bgColor={colors.green[50]}
                          bordered={colors.green[800]}
                          actionTrip={tripAction}
                          isCompleted={true}
                          pickedUpStatus={`Picked Up At ${order.pickup_out ?? '00:00'}`}
                          deliveredStatus={`Delivered At ${order.delivery_out ?? '00:00'}`}
                          handleUndispatchedOrder={handleUndispatchedOrder}
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

      {openModal && (
        <Modal open={openModal} handleClose={() => setOpenModal(false)}>
          <ConfirmModal
            noIcon
            title={<>Undispatch{' '}<strong style={{ fontSize: 15, paddingInline: 5 }}># {dispatchedOrderRef.current.order_number}</strong></>}
            subtitle='Are you sure you want to continue?'
            handleClose={() => setOpenModal(false)}
            handleSubmit={async () => {
              await undispatchOrder.mutateAsync({ id: trip.id, oid: dispatchedOrderRef.current.id });
              dispatchedOrderRef.current = null;
              setOpenModal(false);
            }}
          />
        </Modal>
      )}

      {openDrawer === 1 && (
        <DrawerForm customTitle={<CustomTitle number={trip.trip_number} title='Update Trip' Icon={LocalShipping} />} setOpen={setOpenDrawer} open={openDrawer}>
          <UpdateTripForm
            updateTrip={async (payload) => await updateTrip.mutateAsync(payload)}
            isInterliner={Boolean(isInterliner)}
            tripData={trip}
            onClose={() => setOpenDrawer(false)}
          />
        </DrawerForm>
      )}

      {openDrawer === 2 && (
        <DrawerForm customTitle={<CustomTitle number={dispatchedOrderRef.current.order_number} title='Update Order Status' isOrder Icon={LocalShipping} />} setOpen={setOpenDrawer} open={openDrawer}>
          <UpdateOrderStatusForm
            tid={trip.id}
            dispatchOrder={dispatchedOrderRef.current}
            isPickedUp={dispatchedOrderRef.current?.order_status === 'picked up' || dispatchedOrderRef.current?.order_status === 'delivered' || dispatchedOrderRef.current?.order_status === 'completed'}
            isDelivered={dispatchedOrderRef.current?.order_status === 'delivered' || dispatchedOrderRef.current?.order_status === 'completed'}
            handleClose={() => setOpenDrawer(false)}
          />
        </DrawerForm>
      )}
    </>
  );
};

export default React.memo(TripRow);