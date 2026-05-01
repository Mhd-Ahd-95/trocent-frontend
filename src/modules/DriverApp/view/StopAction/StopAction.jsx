import React from 'react';
import { Box, Collapse, Grid, Stack, Typography } from '@mui/material';
import { ArrowBackIos, LocalShipping, Business, Person, Phone, ReceiptLong, CheckRounded, EditNote, ExpandMore, Place, CheckCircle, CommentOutlined, } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import useStyles from './StopAction.styles';
import { useNavigate } from 'react-router-dom';

const CURRENT_ORDER = {
    id: 11,
    order_id: 7,
    order_number: '7',
    leg_type: 'pickup',
    order_status: 'dispatched',
    shipper_name: 'MESSAGERS HQ',
    shipper_address: '2985 DOUGLAS B. FLOREANI',
    shipper_city: 'MONTREAL',
    shipper_province: 'QC',
    shipper_postal_code: 'H4S 1Y7',
    shipper_contact_name: 'Matt Brecknock',
    shipper_phone: '514-937-0505',
    service_type: 'Rush',
    total_pieces: 4,
    total_actual_weight: 150,
};

const TRIP_ORDERS_SAME_SHIPPER = [
    { id: 11, order_number: '7', shipper_name: 'MESSAGERS HQ', shipper_address: '2985 DOUGLAS B. FLOREANI', customer_name: 'Ali Ahmad', service_type: 'Rush', total_pieces: 4 },
    { id: 15, order_number: '9', shipper_name: 'MESSAGERS HQ', shipper_address: '2985 DOUGLAS B. FLOREANI', customer_name: 'Sara Khalil', service_type: 'Regular', total_pieces: 2 },
    { id: 17, order_number: '12', shipper_name: 'MESSAGERS HQ', shipper_address: '2985 DOUGLAS B. FLOREANI', customer_name: 'Omar Nasser', service_type: 'Direct', total_pieces: 1 },
];

const STATUS_CLASS = {
    'dispatched': 'statusDispatched',
    'arrived shipper': 'statusArrivedShipper',
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
    
    const { classes, cx } = useStyles();
    const navigate = useNavigate()
    const [orderStatus, setOrderStatus] = React.useState(CURRENT_ORDER.order_status);
    const [checkedOrders, setCheckedOrders] = React.useState(() => new Set([CURRENT_ORDER.id]));
    const [commentOpen, setCommentOpen] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');
    const [savedComment, setSavedComment] = React.useState('');

    const toggleOrder = (id) => {
        setCheckedOrders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const onBack = () => navigate(-1)
    const handleArrive = () => setOrderStatus('arrived shipper');
    const handlePickup = () => navigate('/freight-pickup');

    const handleSaveComment = () => {
        if (!commentText.trim()) return;
        setSavedComment(commentText.trim());
        setCommentText('');
        setCommentOpen(false);
    };

    const hasArrived = orderStatus === 'arrived shipper';
    const pickedUp = orderStatus === 'picked up';

    const address = [
        CURRENT_ORDER.shipper_address,
        CURRENT_ORDER.shipper_city,
        CURRENT_ORDER.shipper_province,
        CURRENT_ORDER.shipper_postal_code,
    ].filter(Boolean).join(', ');

    return (
        <DriverLayout active="Deliveries">
            <Box className={classes.page}>
                <Stack direction="row" alignItems="center" className={classes.backRow} onClick={onBack}>
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
                            Pickup · {CURRENT_ORDER.shipper_name}
                        </Typography>
                    </Box>
                    <StatusBadge status={orderStatus} />
                </Stack>
                <Box className={classes.card}>
                    <button
                        className={cx(
                            classes.commentToggleBtn,
                            (commentOpen || savedComment) && classes.commentToggleBtnBordered
                        )}
                        onClick={() => setCommentOpen(o => !o)}
                    >
                        <Box className={classes.commentToggleIcon}>
                            <EditNote sx={{ fontSize: 16, color: 'primary.main' }} />
                        </Box>
                        <Typography className={classes.commentToggleLabel}>
                            {savedComment ? 'Edit Comment' : 'Write a Comment'}
                        </Typography>
                        <ExpandMore className={cx(classes.commentChevron, commentOpen && classes.commentChevronOpen)} />
                    </button>
                    {savedComment && !commentOpen && (
                        <Stack direction="row" gap={1} className={classes.savedComment}>
                            <CommentOutlined className={classes.savedCommentIcon} />
                            <Typography className={classes.savedCommentText}>{savedComment}</Typography>
                        </Stack>
                    )}
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
                                <button
                                    className={classes.commentCancelBtn}
                                    onClick={() => { setCommentOpen(false); setCommentText(savedComment || ''); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={classes.commentSaveBtn}
                                    onClick={handleSaveComment}
                                    disabled={!commentText.trim()}
                                >
                                    Save Comment
                                </button>
                            </Stack>
                        </Box>
                    </Collapse>
                </Box>
                <Box className={classes.card}>
                    <Stack direction="row" alignItems="center" gap={1} className={classes.cardHeader}>
                        <Business className={classes.cardHeaderIcon} />
                        <Typography className={classes.cardHeaderTitle}>Shipper Info</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" gap={1.25} className={classes.infoRow}>
                        <Box className={classes.infoIconWrap}>
                            <Place className={classes.infoIcon} />
                        </Box>
                        <Box>
                            <Typography className={classes.infoLabel}>Location</Typography>
                            <Typography className={classes.infoValue}>{CURRENT_ORDER.shipper_name}</Typography>
                            <Typography className={classes.infoValueMuted}>{address}</Typography>
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
                                    <Typography className={classes.infoValue}>
                                        {CURRENT_ORDER.shipper_contact_name}
                                    </Typography>
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
                                    <Typography
                                        component="a"
                                        // href={`tel:${CURRENT_ORDER.shipper_phone}`}
                                        className={classes.infoValuePhone}
                                    >
                                        {CURRENT_ORDER.shipper_phone}
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
                            {checkedOrders.size} / {TRIP_ORDERS_SAME_SHIPPER.length} selected
                        </Typography>
                    </Stack>
                    {TRIP_ORDERS_SAME_SHIPPER.map(order => (
                        <FreightBillItem
                            key={order.id}
                            order={order}
                            checked={checkedOrders.has(order.id)}
                            onToggle={() => toggleOrder(order.id)}
                            isCurrentOrder={order.id === CURRENT_ORDER.id}
                        />
                    ))}
                </Box>
                <Stack gap={1.25} className={classes.actionsCard}>
                    {!pickedUp && (
                        <button
                            className={cx(classes.actionBtn, hasArrived ? classes.actionBtnArrived : classes.actionBtnArrive)}
                            onClick={!hasArrived ? handleArrive : undefined}
                            disabled={hasArrived}
                        >
                            {hasArrived
                                ? <><CheckCircle sx={{ fontSize: 18 }} /> Arrived at Shipper</>
                                : <><Place sx={{ fontSize: 18 }} /> Arrive</>
                            }
                        </button>
                    )}
                    {hasArrived && !pickedUp && (
                        <button
                            className={cx(classes.actionBtn, classes.actionBtnPickup)}
                            onClick={handlePickup}
                        >
                            <LocalShipping sx={{ fontSize: 18 }} /> Pick Up
                        </button>
                    )}
                    {pickedUp && (
                        <button className={cx(classes.actionBtn, classes.actionBtnDone)} disabled>
                            <CheckCircle sx={{ fontSize: 18 }} /> Picked Up ✓
                        </button>
                    )}
                </Stack>
            </Box>
        </DriverLayout>
    );
}