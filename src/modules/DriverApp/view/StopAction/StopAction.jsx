import React from 'react';
import { Box, Collapse, CircularProgress, Grid, Stack, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, LocalShipping, Business, Person, Phone, ReceiptLong, CheckRounded, EditNote, ExpandMore, Place, CheckCircle } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import useStyles from './StopAction.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatchOrderMutation, useStopAction } from '../../../hooks/useDispatchOrders';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { useOrderMutations } from '../../../hooks/useOrders';

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
            {type[0]}
        </Box>
    );
}

function formatDims(f) {
    if (!f.width && !f.length && !f.height) return null;
    const unit = f.dim_unit === 'in' ? 'IN' : 'LBS';
    return `${f.width}×${f.length}×${f.height} ${unit}`;
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

function FreightBillItem({ order, checked, onToggle, isCurrentOrder, isPickup }) {
    const { classes, cx } = useStyles();
    const [open, setOpen] = React.useState(false)
    const appointment = Array.isArray(order.appointment_numbers) && order.appointment_numbers.length > 0 ? order.appointment_numbers.join(', ') : null
    const references = Array.isArray(order.reference_numbers) && order.reference_numbers.length > 0 ? order.reference_numbers.join(', ') : null
    const unit = Array.isArray(order.freight_details) && order.freight_details > 0 ? order.freight_details[0]?.unit : 'lbs'
    return (
        <Box className={classes.freightBillItemCollapse}>
            <Box className={cx(classes.freightBillItem, open && classes.freightBillItemOpen)} onClick={onToggle}>
                <Box className={cx(classes.freightBillCheck, checked && classes.freightBillCheckActive)}>
                    {checked && <CheckRounded className={classes.freightBillCheckIcon} />}
                </Box>
                <Box className={classes.freightBillInfo}>
                    <Box className={classes.freightBillOrderNum}>
                        # {order.order_number}
                        {isCurrentOrder && (<Box component="span" className={classes.thisOrderTag}>THIS ORDER</Box>)}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 6px', marginTop: '3px' }}>
                        <Typography className={classes.freightBillSub}>
                            {order.customer_name}
                        </Typography>
                        <Typography className={classes.freightBillTotals}>
                            · {order.total_pieces} pcs · {order.total_actual_weight} {unit}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, '@media (max-width: 360px)': { width: '100%' } }}>
                    {order.service_type !== 'Regular' &&
                        <ServiceBadge type={order.service_type} />
                    }
                    <IconButton onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}><ExpandMore /></IconButton>
                </Box>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Grid container spacing={2} component={Box} px={2} py={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>
                            {isPickup ? 'Pickup Time' : 'Delivery Time'}
                        </Typography>
                        <Typography className={classes.legDetailValue}>{order.time || '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>Appointment Number</Typography>
                        <Typography className={classes.legDetailValue}>{appointment || '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>Special Instructions</Typography>
                        <Typography className={cx(classes.legDetailInstructions, order.special_instructions ? classes.legDetailInstructionsText : classes.legDetailInstructionsEmpty,)}>
                            {order.special_instructions || '—'}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography className={classes.legDetailLabel}>Reference Numbers</Typography>
                        <Typography className={classes.legDetailValue}>{references || '—'}</Typography>
                    </Grid>
                    {order.freight_details?.length > 0 && (
                        <Grid size={12}>
                            <Typography className={classes.legDetailLabel}>Freight</Typography>
                            <FreightTable
                                freights={order.freight_details}
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

const OrderNoteSection = React.memo(({ order_id, legType }) => {

    const { classes, cx } = useStyles()
    const [commentOpen, setCommentOpen] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');
    const { addNote } = useOrderMutations()

    const handleCreateNote = async (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (commentText.length === 0) return
        const payload = { order_id: order_id, note_type: legType, note: commentText }
        await addNote.mutateAsync(payload)
        setCommentText('')
        setCommentOpen(false)
    }

    return (
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
                        <button className={classes.commentSaveBtn} disabled={!commentText.trim()} onClick={handleCreateNote}>
                            {addNote.isPending && <CircularProgress color='inherit' size={18} style={{ marginRight: 10, marginBottom: -3 }} />}
                            Save Comment
                        </button>
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    )
})


export default function StopAction() {

    const params = useParams();
    const { classes, cx } = useStyles();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { data: stopActionData = {}, isLoading, isError, error } = useStopAction(params.id, params.lt);
    const { driverUpdateOrderStatus } = useDispatchOrderMutation();

    const dispatchOrder = stopActionData?.dispatch_order ?? {};
    const relatedOrders = stopActionData?.related_orders ?? [];

    const totalBills = React.useMemo(() => {
        const { totalPieces, totalWeight, unit } = relatedOrders.reduce((a, r) => {
            a['totalPieces'] += Number(r.total_pieces ?? 0)
            a['totalWeight'] += Number(r.total_actual_weight ?? 0)
            a['unit'] = r.freight_details && r.freight_details?.length > 0 ? r.freight_details[0].unit : 'lbs'
            return a
        }, { totalPieces: 0, totalWeight: 0, unit: 'lbs' })
        return { totalPieces, totalWeight, unit }
    }, [relatedOrders])

    const orderStatus = dispatchOrder?.order_status;
    const isPickup = params.lt === 'pickup';
    const arrivedShipper = orderStatus === 'arrived shipper';
    const arrivedReceiver = orderStatus === 'arrived receiver';
    const hideButtons = isPickup && ['arrived receiver', 'picked up', 'completed', 'delivered'].includes(orderStatus)
    const pickedUp = orderStatus === 'picked up';
    const delivered = orderStatus === 'delivered' || orderStatus === 'completed';
    const arriveDisabled = isPickup ? arrivedShipper || pickedUp : orderStatus === 'dispatched' || arrivedShipper || arrivedReceiver || delivered;
    const showArriveBtn = isPickup ? !pickedUp : !delivered;
    const showActionBtn = isPickup ? (arrivedShipper && !pickedUp) : (arrivedReceiver && !delivered);
    const [checkedOrders, setCheckedOrders] = React.useState(() => new Set());

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
        const arrivedTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
        await driverUpdateOrderStatus.mutateAsync({ dids: Array.from(checkedOrders), sts: status, lt: params.lt, arrivedTime });
    };

    const handlePickupOrDeliver = () => navigate(`/freight-order/${params.lt}/${params.tripId}`, { state: Array.from(checkedOrders) });

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
        }
    }, [isError, error]);

    React.useEffect(() => {
        if (dispatchOrder?.id) {
            setCheckedOrders(prev => {
                if (prev.has(dispatchOrder.id)) return prev;
                const next = new Set(prev);
                next.add(dispatchOrder.id);
                return next;
            });
        }
    }, [dispatchOrder?.id]);

    if (isLoading) {
        return (
            <DriverLayout active="Deliveries">
                <Stack alignItems="center" justifyContent="center" minHeight="60vh">
                    <CircularProgress />
                </Stack>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout active="Deliveries" tripId={dispatchOrder?.trip_id}>
            <Box className={classes.page}>
                <Stack direction="row" alignItems="center" className={classes.backRow} onClick={() => navigate(-1)}>
                    <ArrowBackIos className={classes.backIcon} />
                    <Typography className={classes.backLabel}>Back to Trip</Typography>
                </Stack>

                <Grid container spacing={1} mb={2} className={classes.pageTitle} justifyContent={'space-between'}>
                    <Grid size={'auto'}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box className={classes.pageTitleIcon} sx={{ flexShrink: 0 }}>
                                {isPickup ? 'P' : 'D'}
                            </Box>
                            <Box>
                                <Typography className={classes.pageTitleText}>Stop Actions</Typography>
                                <Typography className={classes.pageTitleSub}>
                                    {dispatchOrder?.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={'auto'}>
                        <StatusBadge status={orderStatus} />
                    </Grid>
                </Grid>

                <OrderNoteSection
                    order_id={dispatchOrder?.order_id}
                    legType={params.lt}
                />
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
                    <Grid container spacing={1} width={'100%'} justifyContent={'space-between'} alignItems={'center'} className={classes.cardHeader}>
                        <Grid size="auto" sx={{ minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ReceiptLong className={classes.cardHeaderIcon} sx={{ flexShrink: 0 }} />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 6px', minWidth: 0 }}>
                                    <Typography className={classes.cardHeaderTitle}>
                                        Freight Bills
                                    </Typography>
                                    <Typography className={classes.freightBillTotals}>
                                        {totalBills.totalPieces} pcs · {totalBills.totalWeight} {totalBills.unit}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={'auto'} sx={{ flexShrink: 0 }}>
                            <Typography sx={{ ml: 'auto', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
                                {checkedOrders.size} / {relatedOrders.length} selected
                            </Typography>
                        </Grid>
                    </Grid>
                    {relatedOrders.map(order => (
                        <FreightBillItem
                            key={order.id}
                            order={order}
                            checked={checkedOrders.has(order.id)}
                            onToggle={() => toggleOrder(order.id)}
                            isCurrentOrder={order.id === dispatchOrder.id}
                            isPickup={params.lt === 'pickup'}
                        />
                    ))}
                </Box>
                {!hideButtons &&
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
                }
            </Box>
        </DriverLayout>
    );
}