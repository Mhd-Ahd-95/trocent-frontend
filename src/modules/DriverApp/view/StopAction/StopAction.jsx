import React from 'react';
import { Box, Collapse, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { ArrowBackIos, LocalShipping, Business, Person, Phone, ReceiptLong, CheckRounded, EditNote, ExpandMore, Place, CheckCircle } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import useStyles from './StopAction.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatchOrderMutation, useStopAction } from '../../../hooks/useDispatchOrders';
import { useSnackbar } from 'notistack';

const STATUS_CLASS = {
    'dispatched': 'statusDispatched',
    'arrived shipper': 'statusArrivedShipper',
    'arrived receiver': 'statusArrivedShipper',
    'picked up': 'statusPickedUp',
    'delivered': 'statusDelivered',
    'completed': 'statusCompleted',
};

const SERVICE_CLASS = {
    Rush: 'serviceRush',
    Regular: 'serviceRegular',
    Direct: 'serviceDirect',
};

function StatusBadge({ status }) {
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(classes.badge, classes[STATUS_CLASS[status] ?? 'statusDispatched'])}>
            {status}
        </Box>
    );
}

function ServiceBadge({ type }) {
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(classes.badge, classes[SERVICE_CLASS[type] ?? 'serviceRegular'])}>
            {type}
        </Box>
    );
}

function FreightBillItem({ order, checked, onToggle, isCurrentOrder }) {
    const { classes, cx } = useStyles();
    return (
        <Box className={classes.freightBillItem} onClick={onToggle}>
            <Box className={cx(classes.freightBillCheck, checked && classes.freightBillCheckActive)}>
                {checked && <CheckRounded className={classes.freightBillCheckIcon} />}
            </Box>
            <Box className={classes.freightBillInfo}>
                <Box className={classes.freightBillOrderNum}>
                    # {order.order_number}
                    {isCurrentOrder && (
                        <Box component="span" className={classes.thisOrderTag}>THIS ORDER</Box>
                    )}
                </Box>
                <Typography className={classes.freightBillSub}>
                    {order.customer_name} · {order.total_pieces} pcs
                </Typography>
            </Box>
            <ServiceBadge type={order.service_type} />
        </Box>
    );
}

export default function StopAction() {

    const params = useParams();
    const { classes, cx } = useStyles();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { data: stopActionData = {}, isLoading, isFetching, isError, error } = useStopAction(params.id, params.lt);
    const { driverUpdateOrderStatus } = useDispatchOrderMutation();

    const dispatchOrder = stopActionData?.dispatch_order ?? {};
    const relatedOrders = stopActionData?.related_orders ?? [];
    const orderStatus = dispatchOrder?.order_status;

    const isPickup = params.lt === 'pickup';

    const arrivedShipper = orderStatus === 'arrived shipper';
    const arrivedReceiver = orderStatus === 'arrived receiver';
    const pickedUp = orderStatus === 'picked up';
    const delivered = orderStatus === 'delivered' || orderStatus === 'completed';

    const arriveDisabled = isPickup ? arrivedShipper || pickedUp : orderStatus === 'dispatched' || arrivedShipper || arrivedReceiver || delivered;

    const showArriveBtn = isPickup ? !pickedUp : !delivered;
    const showActionBtn = isPickup ? (arrivedShipper && !pickedUp) : (arrivedReceiver && !delivered);

    const [checkedOrders, setCheckedOrders] = React.useState(() => new Set());
    const [commentOpen, setCommentOpen] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');

    const toggleOrder = (id) => {
        setCheckedOrders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleArrive = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const status = isPickup ? 'arrived shipper' : 'arrived receiver';
        await driverUpdateOrderStatus.mutateAsync({ dids: Array.from(checkedOrders), sts: status, lt: params.lt });
    };

    const handlePickupOrDeliver = () => {
        navigate(`/freight-order/${params.lt}`, { state: Array.from(checkedOrders) });
    };

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
        }
        if (dispatchOrder?.id) {
            setCheckedOrders(prev => {
                const next = new Set(prev);
                next.add(dispatchOrder.id);
                return next;
            });
        }
    }, [stopActionData, isError, error]);

    if (isLoading || isFetching) {
        return (
            <DriverLayout active="Deliveries">
                <Stack alignItems="center" justifyContent="center" minHeight="60vh">
                    <CircularProgress />
                </Stack>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout active="Deliveries">
            <Box className={classes.page}>
                <Stack direction="row" alignItems="center" className={classes.backRow} onClick={() => navigate(-1)}>
                    <ArrowBackIos className={classes.backIcon} />
                    <Typography className={classes.backLabel}>Back to Trip</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" gap={1.25} mb={2} className={classes.pageTitle}>
                    <Box className={classes.pageTitleIcon}>
                        <LocalShipping sx={{ fontSize: 20, color: 'success.main' }} />
                    </Box>
                    <Box flex={1}>
                        <Typography className={classes.pageTitleText}>Stop Actions</Typography>
                        <Typography className={classes.pageTitleSub}>
                            {isPickup ? 'Pickup' : 'Delivery'} · {dispatchOrder?.name}
                        </Typography>
                    </Box>
                    <StatusBadge status={orderStatus} />
                </Stack>
                <Box className={classes.card}>
                    <button
                        className={cx(classes.commentToggleBtn, commentOpen && classes.commentToggleBtnBordered)}
                        onClick={() => setCommentOpen(o => !o)}
                    >
                        <Box className={classes.commentToggleIcon}>
                            <EditNote sx={{ fontSize: 16, color: 'primary.main' }} />
                        </Box>
                        <Typography className={classes.commentToggleLabel}>Write a Comment</Typography>
                        <ExpandMore className={cx(classes.commentChevron, commentOpen && classes.commentChevronOpen)} />
                    </button>
                    <Collapse in={commentOpen} timeout="auto" unmountOnExit>
                        <Box className={classes.commentBody}>
                            <textarea
                                className={classes.commentInput}
                                placeholder="Write your comment here…"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                maxLength={500}
                            />
                            <Stack direction="row" alignItems="center" gap={1} mt={1}>
                                <Typography className={classes.commentCharCount} flex={1}>
                                    {commentText.length} / 500
                                </Typography>
                                <button className={classes.commentCancelBtn} onClick={() => { setCommentOpen(false); setCommentText(''); }}>
                                    Cancel
                                </button>
                                <button className={classes.commentSaveBtn} disabled={!commentText.trim()}>
                                    Save Comment
                                </button>
                            </Stack>
                        </Box>
                    </Collapse>
                </Box>
                <Box className={classes.card}>
                    <Stack direction="row" alignItems="center" gap={1} className={classes.cardHeader}>
                        <Business className={classes.cardHeaderIcon} />
                        <Typography className={classes.cardHeaderTitle}>
                            {isPickup ? 'Shipper Info' : 'Receiver Info'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" gap={1.25} className={classes.infoRow}>
                        <Box className={classes.infoIconWrap}>
                            <Place className={classes.infoIcon} />
                        </Box>
                        <Box>
                            <Typography className={classes.infoLabel}>Location</Typography>
                            <Typography className={classes.infoValue}>{dispatchOrder?.name}</Typography>
                            <Typography className={classes.infoValueMuted}>
                                {`${dispatchOrder?.address}, ${dispatchOrder?.city}, ${dispatchOrder?.province}, ${dispatchOrder?.postal_code}`}
                            </Typography>
                        </Box>
                    </Stack>
                    <Grid container className={classes.infoRow}>
                        <Grid size={6}>
                            <Stack direction="row" alignItems="flex-start" gap={1.25}>
                                <Box className={classes.infoIconWrap}>
                                    <Person className={classes.infoIcon} />
                                </Box>
                                <Box>
                                    <Typography className={classes.infoLabel}>Contact</Typography>
                                    <Typography className={classes.infoValue}>{dispatchOrder.contact_name}</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={6}>
                            <Stack direction="row" alignItems="flex-start" gap={1.25}>
                                <Box className={classes.infoIconWrap}>
                                    <Phone className={classes.infoIcon} />
                                </Box>
                                <Box>
                                    <Typography className={classes.infoLabel}>Phone</Typography>
                                    <Typography component="a" href={`tel:${dispatchOrder.phone_number}`} className={classes.infoValuePhone}>
                                        {dispatchOrder.phone_number}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Box className={classes.card}>
                    <Stack direction="row" alignItems="center" gap={1} className={classes.cardHeader}>
                        <ReceiptLong className={classes.cardHeaderIcon} />
                        <Typography className={classes.cardHeaderTitle}>Freight Bills</Typography>
                        <Typography sx={{ ml: 'auto', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
                            {checkedOrders.size} / {relatedOrders.length} selected
                        </Typography>
                    </Stack>
                    {relatedOrders.map(order => (
                        <FreightBillItem
                            key={order.id}
                            order={order}
                            checked={checkedOrders.has(order.id)}
                            onToggle={() => toggleOrder(order.id)}
                            isCurrentOrder={order.id === dispatchOrder.id}
                        />
                    ))}
                </Box>
                <Stack gap={1.25} className={classes.actionsCard}>
                    {showArriveBtn && (
                        <button
                            className={cx(classes.actionBtn, arriveDisabled ? (arrivedShipper || arrivedReceiver) ? classes.actionBtnArrived : classes.actionBtnDisabled : classes.actionBtnArrive)}
                            onClick={!arriveDisabled ? handleArrive : undefined}
                            disabled={arriveDisabled || driverUpdateOrderStatus.isPending}
                        >
                            {(arrivedShipper && isPickup) || (arrivedReceiver && !isPickup)
                                ? <><CheckCircle sx={{ fontSize: 18 }} />{isPickup ? 'Arrived At Shipper' : 'Arrived At Receiver'}</>
                                : arriveDisabled
                                    ? <><Place sx={{ fontSize: 18 }} />Awaiting Pickup</>
                                    : <>{driverUpdateOrderStatus.isPending && <CircularProgress size={18} color="inherit" />}<Place sx={{ fontSize: 18 }} />Arrive</>
                            }
                        </button>
                    )}
                    {showActionBtn && (
                        <button className={cx(classes.actionBtn, classes.actionBtnPickup)} onClick={handlePickupOrDeliver}>
                            <LocalShipping sx={{ fontSize: 18 }} />{isPickup ? 'Pick Up' : 'Deliver'}
                        </button>
                    )}
                    {(pickedUp && isPickup) && (
                        <button className={cx(classes.actionBtn, classes.actionBtnDone)} disabled>
                            <CheckCircle sx={{ fontSize: 18 }} />Picked Up ✓
                        </button>
                    )}
                    {(delivered && !isPickup) && (
                        <button className={cx(classes.actionBtn, classes.actionBtnDone)} disabled>
                            <CheckCircle sx={{ fontSize: 18 }} />Delivered ✓
                        </button>
                    )}
                </Stack>
            </Box>
        </DriverLayout>
    );
}