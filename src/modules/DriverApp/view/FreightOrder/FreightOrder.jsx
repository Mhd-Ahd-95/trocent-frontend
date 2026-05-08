import React from 'react';
import { Box, CircularProgress, Divider, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { ArrowBackIos, LocalShipping, CheckRounded, Refresh, CheckCircle, Scale, Draw, ArrowBack } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import { AccordionComponent, TextInput } from '../../../components';
import useStyles from './Freight.styles';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatchOrderMutation, useDriverFreightOrder } from '../../../hooks/useDispatchOrders';
import { useSnackbar } from 'notistack';
import moment from 'moment';


function buildOrderState(orders) {
    const state = {};
    orders?.forEach(o => {
        state[o.id] = {
            pieces: String(o.total_pieces),
            pallets: String(o.total_pallets),
            weight: String(o.total_actual_weight),
            unit: o.weight_unit ?? 'lbs',
            selectedAccessorialIds: new Set(),
        };
    });
    return state;
}

function AccessorialItem({ label, checked, onToggle }) {
    const { classes, cx } = useStyles();
    return (
        <Box
            className={cx(classes.accessorialItem, checked && classes.accessorialItemActive)}
            onClick={onToggle}
        >
            <Box className={cx(classes.accessorialCheck, checked && classes.accessorialCheckActive)}>
                {checked && <CheckRounded className={classes.accessorialCheckIcon} />}
            </Box>
            <Typography className={cx(classes.accessorialLabel, checked && classes.accessorialLabelActive)}>
                {label}
            </Typography>
        </Box>
    );
}

const SignatureCanvas = React.forwardRef(function SignatureCanvas({ onSigned }, ref) {
    const { classes, cx } = useStyles();
    const canvasRef = React.useRef(null);
    const drawing = React.useRef(false);
    const hasMark = React.useRef(false);
    const [active, setActive] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        getDataURL: () => hasMark.current ? (canvasRef.current?.toDataURL('image/png') ?? null) : null,
    }));

    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return {
            x: (src.clientX - rect.left) * (canvas.width / rect.width),
            y: (src.clientY - rect.top) * (canvas.height / rect.height),
        };
    };

    const startDraw = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        drawing.current = true;
        setActive(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!drawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e, canvas);
        ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        if (!hasMark.current) { hasMark.current = true; onSigned(true); }
    };

    const endDraw = () => { drawing.current = false; };

    const clear = () => {
        const canvas = canvasRef.current;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        hasMark.current = false;
        setActive(false);
        onSigned(false);
    };

    return (
        <Box>
            <Box className={classes.signatureArea}>
                <canvas
                    ref={canvasRef}
                    width={700} height={160}
                    className={cx(classes.signatureCanvas, active && classes.signatureCanvasActive)}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                    onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                />
                {!active && <Box className={classes.signatureHint}>Sign here</Box>}
            </Box>
            <Box className={classes.signatureFooter}>
                <button className={classes.clearBtn} onClick={clear}>
                    <Refresh className={classes.clearIcon} /> Clear
                </button>
            </Box>
        </Box>
    );
});

export default function FreightOrder() {

    const { lt, tripId } = useParams();
    const isPickup = lt === 'pickup';
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { classes, cx } = useStyles();
    const dispatchedOrdersSelected = location.state;
    const [form, setForm] = React.useState({ orders: {}, hasSigned: false, done: false });
    const signeeRef = React.useRef('');
    const signatureRef = React.useRef(null);
    const seeded = React.useRef(false);
    const { data: SELECTED_ORDERS = [], isLoading, isError, error } = useDriverFreightOrder(dispatchedOrdersSelected);
    const { driverPickupDeliveryOrders } = useDispatchOrderMutation()

    const updateQty = React.useCallback((orderId, field, v) => setForm(prev => ({ ...prev, orders: { ...prev.orders, [orderId]: { ...prev.orders[orderId], [field]: v } } })), []);
    const onSigned = React.useCallback((val) => { setForm(prev => ({ ...prev, hasSigned: val })); }, []);

    const toggleAccessorial = React.useCallback((orderId, pivotId) => {
        setForm(prev => {
            const next = new Set(prev.orders[orderId].selectedAccessorialIds);
            next.has(pivotId) ? next.delete(pivotId) : next.add(pivotId);
            return { ...prev, orders: { ...prev.orders, [orderId]: { ...prev.orders[orderId], selectedAccessorialIds: next }, }, };
        });
    }, []);

    const handleComplete = async (e) => {
        e.preventDefault()
        try {
            const signeeName = signeeRef.current?.trim();
            if (!signeeName) {
                enqueueSnackbar('Please enter the signee name.', { variant: 'warning' });
                return;
            }
            const signature = signatureRef.current?.getDataURL();
            if (!signature) {
                enqueueSnackbar('Please provide a signature.', { variant: 'warning' });
                return;
            }
            const time = isPickup ?
                { pickup_in: moment(new Date()).format('HH:mm'), pickup_out: moment(new Date()).format('HH:mm'), pickup_at: moment(new Date()).format('YYYY-MM-DD') }
                :
                { delivery_in: moment(new Date()).format('HH:mm'), delivery_out: moment(new Date()).format('HH:mm'), delivery_at: moment(new Date()).format('YYYY-MM-DD') }
            const orderStatus = isPickup ? 'picked up' : 'completed'
            const payload = {
                type: lt,
                order_status: orderStatus,
                trip_id: tripId,
                orders: SELECTED_ORDERS.map(o => ({
                    id: o.id,
                    pieces: Number(form.orders[o.id]?.pieces) ?? 0,
                    pallets: Number(form.orders[o.id]?.pallets) ?? 0,
                    weight: Number(form.orders[o.id]?.weight) ?? 0,
                    unit: form.orders[o.id]?.unit,
                    accessorials: [...(form.orders[o.id]?.selectedAccessorialIds ?? [])],
                })),
                signee_name: signeeName,
                signature,
                ...time
            };
            const res = await driverPickupDeliveryOrders.mutateAsync(payload)
            if (res) {
                setForm(prev => ({ ...prev, done: true }));
            }
        }
        catch (err) {
            //
        }
    };

    React.useEffect(() => {
        if (SELECTED_ORDERS?.length && !seeded.current) {
            seeded.current = true;
            setForm(prev => ({ ...prev, orders: buildOrderState(SELECTED_ORDERS) }));
        }
    }, [SELECTED_ORDERS]);

    React.useEffect(() => {
        if (!isError || !error) return;
        const msg = error.response?.data?.message;
        const status = error.response?.status;
        enqueueSnackbar(msg ? `${msg} - ${status}` : error.message, { variant: 'error' });
    }, [isError, error]);

    if (form.done) {
        return (
            <DriverLayout active="Deliveries">
                <Box className={classes.successWrap}>
                    <Box className={classes.successIcon}>
                        <CheckCircle sx={{ fontSize: 42, color: 'success.main' }} />
                    </Box>
                    <Typography className={classes.successTitle}>
                        {isPickup ? 'Picked Up' : 'Delivered'} Successfully!
                    </Typography>
                    <Typography className={classes.successSub}>
                        {SELECTED_ORDERS?.length} order{SELECTED_ORDERS?.length > 1 ? 's' : ''} confirmed
                    </Typography>
                    <Box className={classes.successOrderList}>
                        {SELECTED_ORDERS?.map(o => (
                            <Box key={o.id} className={classes.successOrderChip}>Order #{o.order_number}</Box>
                        ))}
                    </Box>
                    <Box
                        component="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/driver-deliveries/${tripId}`) }}
                        className={classes.actionBtnPickup}
                        mt={2}
                    >
                        {<><ArrowBack sx={{ fontSize: 18 }} /> Back To Trip Live</>}
                    </Box>
                </Box>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout active="Deliveries">
            {isLoading ? (
                <Grid container component={Box} justifyContent="center" py={15}>
                    <CircularProgress />
                </Grid>
            ) : (
                <Grid container spacing={2} pb={2}>

                    <Grid size={12}>
                        <Stack direction="row" alignItems="center" className={classes.backRow} onClick={() => navigate(-1)}>
                            <ArrowBackIos className={classes.backIcon} />
                            <Typography className={classes.backLabel}>Back to Stop Actions</Typography>
                        </Stack>
                    </Grid>
                    <Grid size={12}>
                        <Stack direction="row" alignItems="center" gap={1.5} className={classes.pageTitle}>
                            <Box className={classes.pageTitleIcon}>
                                <LocalShipping sx={{ fontSize: 22, color: 'success.main' }} />
                            </Box>
                            <Box>
                                <Typography className={classes.pageTitleText}>
                                    Freight {isPickup ? 'Pick Up' : 'Delivery'}
                                </Typography>
                                <Typography className={classes.pageTitleSub}>
                                    {SELECTED_ORDERS?.length} order{SELECTED_ORDERS?.length > 1 ? 's' : ''} selected
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={12}>
                        <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                            <Scale sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography className={classes.sectionLabel}>Freight Details</Typography>
                        </Stack>
                        <Stack gap={1.5}>
                            {SELECTED_ORDERS.map((order, index) => {
                                const q = form.orders[order.id];
                                const selectedIds = q?.selectedAccessorialIds ?? new Set();
                                const checkedCount = selectedIds.size;
                                return (
                                    <AccordionComponent
                                        key={order.id}
                                        defaultExpanded={index !== 0}
                                        bordered="true"
                                        title={
                                            <Stack direction="row" alignItems="center" gap={1} flex={1} pr={1}>
                                                <Typography sx={{ fontSize: 16, fontWeight: 800, color: 'text.primary' }}>
                                                    # {order.order_number}
                                                </Typography>
                                                <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 500 }}>
                                                    · {order.customer_name}
                                                </Typography>
                                                {checkedCount > 0 && (
                                                    <Box className={classes.accordionBadge} sx={{ ml: 'auto' }}>
                                                        {checkedCount} Accessorial{checkedCount > 1 ? 's' : ''}
                                                    </Box>
                                                )}
                                            </Stack>
                                        }
                                        bold={700}
                                        content={
                                            <Stack gap={0} mt={-4}>
                                                <Typography className={classes.accessorialSectionLabel}>
                                                    Accessorial Charges
                                                </Typography>
                                                {order.accessorials?.length > 0 ? (
                                                    <Box className={classes.accessorialList}>
                                                        {order.accessorials.map(acc => (
                                                            <AccessorialItem
                                                                key={acc.id}
                                                                label={acc.access_name}
                                                                checked={selectedIds.has(acc.id)}
                                                                onToggle={() => toggleAccessorial(order.id, acc.id)}
                                                            />
                                                        ))}
                                                    </Box>
                                                ) :
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 600, color: '#aaa8a8', padding: 5, letterSpacing: '.5px' }}>
                                                        No accessorials available!
                                                    </Box>
                                                }
                                                <Divider sx={{ mx: -2, mb: 4 }} />
                                                <Grid container spacing={2} mb={2}>
                                                    <Grid size={6}>
                                                        <TextInput
                                                            variant="outlined" required fullWidth
                                                            label="Pieces"
                                                            type='number'
                                                            value={q?.pieces ?? ''}
                                                            onChange={e => updateQty(order.id, 'pieces', e.target.value)}
                                                            onFocus={(e) => e.target.select()}
                                                        />
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <TextInput
                                                            variant="outlined" required fullWidth
                                                            label="Pallets"
                                                            type='number'
                                                            value={q?.pallets ?? ''}
                                                            onChange={e => updateQty(order.id, 'pallets', e.target.value)}
                                                            onFocus={(e) => e.target.select()}
                                                        />
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <TextInput
                                                            variant="outlined" required fullWidth
                                                            label="Weight"
                                                            type='number'
                                                            value={q?.weight ?? ''}
                                                            onChange={e => updateQty(order.id, 'weight', e.target.value)}
                                                            onFocus={(e) => e.target.select()}
                                                        />
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <TextInput
                                                            variant="outlined" required fullWidth
                                                            label="Unit"
                                                            value={q?.unit ?? 'lbs'}
                                                            onChange={e => updateQty(order.id, 'unit', e.target.value)}
                                                            select
                                                        >
                                                            <MenuItem value="lbs">LBS</MenuItem>
                                                            <MenuItem value="kg">KG</MenuItem>
                                                        </TextInput>
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        }
                                    />
                                );
                            })}
                        </Stack>
                    </Grid>
                    <Grid size={12}>
                        <AccordionComponent
                            bordered="true"
                            defaultExpanded={false}
                            title={
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Draw sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <span>Customer Signature</span>
                                </Stack>
                            }
                            bold={700}
                            content={
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <TextInput
                                            variant="outlined"
                                            label="Signee Name"
                                            required
                                            fullWidth
                                            defaultValue=""
                                            onChange={e => { signeeRef.current = e.target.value; }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography sx={{
                                            pb: 1, fontSize: 12, fontWeight: 700,
                                            color: 'text.secondary', textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                        }}>
                                            Signature
                                        </Typography>
                                        <SignatureCanvas ref={signatureRef} onSigned={onSigned} />
                                    </Grid>
                                </Grid>
                            }
                        />
                    </Grid>
                    <Grid size={12}>
                        <button
                            className={cx(classes.actionBtn, classes.actionBtnComplete)}
                            disabled={!form.hasSigned}
                            onClick={handleComplete}
                        >
                            {driverPickupDeliveryOrders.isPending && <CircularProgress size={18} color="inherit" />}
                            <CheckCircle sx={{ fontSize: 22 }} />
                            {isPickup ? 'Pick Up and Complete' : 'Delivery and Complete'}
                        </button>
                    </Grid>

                </Grid>
            )}
        </DriverLayout>
    );
}