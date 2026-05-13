import React from 'react';
import { Box, Collapse, Grid, Skeleton, Typography } from '@mui/material';
import { LocalShipping, Person, Tag, ExpandMore, Inventory2, CalendarToday, CheckCircle, NotificationsActive, } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import moment from 'moment';
import { useDispatchOrderMutation, useTripById } from '../../../hooks/useDispatchOrders';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDispatchScreenSync } from '../../../hooks/useDispatchScreenSync';
import { useStyles, ORDER_STATUS_STYLES } from './Deliveries.styles';
import DriverNotificationBanner from '../LandingPage/DriverNotificationBanner';


function formatTime(from, to) {
    if (!from && !to) return null;
    if (from && to) return `${from} – ${to}`;
    return from || to;
}

function formatDims(f) {
    if (!f.width && !f.length && !f.height) return null;
    const unit = f.dim_unit === 'in' ? 'IN' : 'LBS';
    return `${f.width}×${f.length}×${f.height} ${unit}`;
}

function formatAddress(address, city, province, postal) {
    const parts = [city, province, postal].filter(Boolean).join(' · ');
    if (address && parts) return `${address}, ${parts}`;
    return address || parts || null;
}


function FreightTable({ freights, totalPieces, totalWeight }) {
    const { classes } = useStyles();

    if (!freights || freights.length === 0) return null;
    const weightUnit = freights[0]?.unit ?? 'lbs';

    return (
        <Box>
            <Grid container className={classes.freightHeaderRow}>
                <Grid size={1}>
                    <Typography variant="caption" className={classes.freightHeaderText}>PCS</Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant="caption" className={classes.freightHeaderText}>Type</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="caption" className={classes.freightHeaderText}>Dims (W×L×H)</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="caption" className={classes.freightHeaderText}>Desc</Typography>
                </Grid>
            </Grid>
            {freights.map((f) => (
                <Grid container key={f.id} alignItems="center" className={classes.freightRow}>
                    <Grid size={1}>
                        <Box className={classes.freightPieceBadge}>{f.pieces}</Box>
                    </Grid>
                    <Grid size={3}>
                        <Typography className={classes.freightType}>{f.type}</Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography className={classes.freightDims}>{formatDims(f) ?? '—'}</Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography className={classes.freightDesc}>{f.description || '—'}</Typography>
                    </Grid>
                </Grid>
            ))}
            <Box className={classes.freightTotalsRow}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                    <Typography className={classes.freightTotalNumber}>{totalPieces}</Typography>
                    <Typography className={classes.freightTotalUnit}>pcs</Typography>
                </Box>
                <Box className={classes.freightTotalDot} />
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                    <Typography className={classes.freightTotalNumber}>{totalWeight}</Typography>
                    <Typography className={classes.freightTotalUnit}>{weightUnit}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

function LegSection({ order, legType, onAction, isLast }) {

    const { classes, cx } = useStyles();
    const [open, setOpen] = React.useState(false);
    const isPickup = legType === 'pickup';
    const isDone = isPickup ? ['picked up', 'delivered', 'completed', 'arrived receiver'].includes(order.order_status) : ['delivered', 'completed'].includes(order.order_status);

    const name = isPickup ? order.shipper_name : order.receiver_name;
    const address = isPickup
        ? formatAddress(order.shipper_address, order.shipper_city, order.shipper_province, order.shipper_postal_code)
        : formatAddress(order.receiver_address, order.receiver_city, order.receiver_province, order.receiver_postal_code);

    const timeFrom = isPickup ? order.pickup_time_from : order.delivery_time_from;
    const timeTo = isPickup ? order.pickup_time_to : order.delivery_time_to;
    const time = formatTime(timeFrom, timeTo);
    const instructions = isPickup ? order.shipper_special_instructions : order.receiver_special_instructions;
    const appointment = isPickup
        ? Array.isArray(order.pickup_appointment_numbers) && order.pickup_appointment_numbers.length > 0 ? order.pickup_appointment_numbers[0] : null
        : Array.isArray(order.delivery_appointment_numbers) && order.delivery_appointment_numbers.length > 0 ? order.delivery_appointment_numbers[0] : null;

    return (
        <Box sx={{ borderTop: isLast ? 'none' : undefined }}>
            <Box
                onClick={() => setOpen((o) => !o)}
                className={cx(classes.legRow, open ? isPickup ? classes.legRowPickupOpen : classes.legRowDeliveryOpen : isPickup ? classes.legRowPickupHover : classes.legRowDeliveryHover)}
            >
                <Box className={isPickup ? classes.legCirclePickup : classes.legCircleDelivery}>
                    {isPickup ? 'P' : 'D'}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
                    <Typography
                        className={cx(classes.legName, isDone && classes.legNameDone)}
                    >
                        {name || '—'}
                    </Typography>
                    <Typography className={classes.legAddress}>{address || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                    {isDone ? (
                        <Box className={classes.doneBadge}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                            DONE
                        </Box>
                    ) : (
                        <Box
                            component="button"
                            onClick={(e) => { e.stopPropagation(); onAction(order, legType); }}
                            className={isPickup ? classes.actionBtnPickup : classes.actionBtnDelivery}
                        >
                            {isPickup ? <><LocalShipping sx={{ fontSize: 16 }} /> Action</> : <><Inventory2 sx={{ fontSize: 16 }} /> Action</>}
                        </Box>
                    )}
                    <ExpandMore className={cx(classes.expandIcon, open ? classes.expandIconOpen : classes.expandIconClosed,)} />
                </Box>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Grid container spacing={2} component={Box} px={2} py={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>
                            {isPickup ? 'Pickup Time' : 'Delivery Time'}
                        </Typography>
                        <Typography className={classes.legDetailValue}>{time || '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>Appointment Number</Typography>
                        <Typography className={classes.legDetailValue}>{appointment || '—'}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography className={classes.legDetailLabel}>Special Instructions</Typography>
                        <Typography
                            className={cx(
                                classes.legDetailInstructions,
                                instructions ? classes.legDetailInstructionsText : classes.legDetailInstructionsEmpty,
                            )}
                        >
                            {instructions || '—'}
                        </Typography>
                    </Grid>
                    {order.freights?.length > 0 && (
                        <Grid size={12}>
                            <Typography className={classes.legDetailLabel}>Freight</Typography>
                            <FreightTable
                                freights={order.freights}
                                totalPieces={order.total_pieces}
                                totalWeight={order.total_actual_weight}
                            />
                        </Grid>
                    )}
                </Grid>
            </Collapse>
        </Box>
    );
}

function OrderCard({ order, index, onAction }) {

    const { classes } = useStyles();
    const statusStyle = ORDER_STATUS_STYLES[order.order_status] ?? ORDER_STATUS_STYLES.dispatched;
    const reference = Array.isArray(order.reference_numbers) && order.reference_numbers.length > 0 ? order.reference_numbers.join(', ') : null;
    const date = moment.utc(order.scheduled_date).format('ddd, DD MMM');

    return (
        <Box className={classes.orderCard}>
            <Box className={classes.orderCardHeader}>
                <Box className={classes.orderIndexBadge}>{index + 1}</Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', gap: 5 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography className={classes.orderNumber}># {order.order_number}</Typography>
                        <Box className={classes.orderDateRow}>
                            <CalendarToday className={classes.orderDateIcon} />
                            <Typography className={classes.orderDate}>{date}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Box className={classes.orderCustomerRow}>
                            <Person className={classes.orderCustomerIcon} />
                            <Typography className={classes.orderCustomer}>{order.customer_name}</Typography>
                        </Box>
                        <Box className={classes.orderRefRow}>
                            <Tag className={classes.orderRefIcon} />
                            <Typography className={classes.orderRef}>{reference || '—'}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    className={classes.orderStatusBadge}
                    sx={{ background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border, }}
                >
                    {order.order_status}
                </Box>
            </Box>
            <LegSection order={order} legType="pickup" onAction={onAction} />
            <LegSection order={order} legType="delivery" onAction={onAction} isLast />
        </Box>
    );
}


export default function DriverDeliveries() {

    useDispatchScreenSync();
    const { classes } = useStyles();
    const { tid } = useParams();
    const tripId = isNaN(tid) ? undefined : tid;
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [notifOpen, setNotifOpen] = React.useState(false);

    const { data: liveTrip = {}, isLoading, isError, error } = useTripById(tripId, true);

    const { acknowlegeTrip } = useDispatchOrderMutation()

    const hasNotification = liveTrip?.is_trip_updated && !liveTrip?.is_acknowleged;

    const sortedOrders = React.useMemo(
        () => liveTrip?.dispatched_orders ? [...liveTrip.dispatched_orders].sort((a, b) => a.order_level - b.order_level) : [],
        [liveTrip],
    );

    const handleAction = (order, legType) => {
        navigate(`/stop-actions/${order.id}/${legType}/${tid}`);
    };

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' },);
        }
    }, [isError, error]);

    return (
        <DriverLayout active="Deliveries" tripId={tid}>
            {isLoading ? (
                <Grid container spacing={2}>
                    <Grid size={12}><Skeleton variant="rectangular" width="100%" height={50} /></Grid>
                    <Grid size={12}><Skeleton variant="rectangular" width="100%" height={200} /></Grid>
                </Grid>
            ) : !tripId || tripId === undefined || Object.keys(liveTrip).length === 0 ? (
                <Box className={classes.emptyWrap}>
                    <Box className={classes.emptyInner}>
                        <Box className={classes.emptyIconWrap}>
                            <LocalShipping className={classes.emptyIcon} />
                        </Box>
                        <Typography className={classes.emptyTitle}>No Active Trip</Typography>
                        <Typography className={classes.emptySubtitle}>
                            You don't have any live trip right now.
                            Once you have a live trip, it will appear here.
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ pb: 5 }}>
                    <Box className={classes.tripHeader}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box className={classes.tripIconWrap}>
                                <LocalShipping className={classes.tripIcon} />
                            </Box>
                            <Box>
                                <Typography className={classes.tripNumber}>
                                    Trip #{liveTrip.trip_number}
                                </Typography>
                                <Typography className={classes.tripDate}>
                                    {moment.utc(liveTrip.trip_date).format('ddd, DD MMM YYYY')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {hasNotification && (
                                    <Box
                                        component="button"
                                        onClick={() => setNotifOpen(o => !o)}
                                        className={classes.notifBtn}
                                    >
                                        <Box className={classes.notifDot} />
                                        <NotificationsActive className={classes.notifIcon} />
                                    </Box>
                                )}
                                <Box className={classes.liveBadge}>
                                    <Box className={classes.liveDot} />
                                    LIVE
                                </Box>
                            </Box>
                            <Typography className={classes.tripProgress}>
                                {liveTrip.total_orders_completed} / {liveTrip.total_orders} done
                            </Typography>
                        </Box>
                    </Box>
                    <Collapse in={notifOpen && hasNotification} timeout="auto" unmountOnExit>
                        <Box className={classes.notifCollapse}>
                            <DriverNotificationBanner
                                tripNumber={liveTrip.trip_number}
                                isSubmitting={acknowlegeTrip.isPending || false}
                                onAcknowledge={async (e) => {
                                    e.preventDefault();
                                    await acknowlegeTrip.mutateAsync(liveTrip.id);
                                }}
                            />
                        </Box>
                    </Collapse>
                    <Grid container spacing={3}>
                        {sortedOrders.map((order, idx) => (
                            <Grid size={12} key={idx}>
                                <OrderCard order={order} index={idx} onAction={handleAction} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </DriverLayout>
    );
}