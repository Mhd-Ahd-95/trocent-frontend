import React from 'react';
import { Box, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { ArrowBackIos, LocalShipping, CheckRounded, Refresh, CheckCircle, ListAlt, Scale, Draw, } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import { AccordionComponent, TextInput } from '../../../components';
import useStyles from './Pickup.styles';
import { useNavigate } from 'react-router-dom';

const ACCESSORIALS = [
    'Crossdock',
    'Extra Stop',
    'Failed delivery',
    'Inside delivery',
    'Rush Charge (less than 4 hours to p/u or deliver)',
    'Rush Service',
    'Tailgate',
    'Waiting time (1–12 skids)',
];

const SELECTED_ORDERS = [
    {
        id: 11,
        order_number: '7',
        customer_name: 'Ali Ahmad',
        service_type: 'Rush',
        total_pieces: 4,
        pallets: 1,
        total_actual_weight: 150,
        weight_unit: 'lbs',
    },
    // {
    //     id: 15,
    //     order_number: '9',
    //     customer_name: 'Sara Khalil',
    //     service_type: 'Regular',
    //     total_pieces: 2,
    //     pallets: 1,
    //     total_actual_weight: 80,
    //     weight_unit: 'lbs',
    // },
    // {
    //     id: 17,
    //     order_number: '12',
    //     customer_name: 'Omar Nasser',
    //     service_type: 'Direct',
    //     total_pieces: 1,
    //     pallets: 1,
    //     total_actual_weight: 40,
    //     weight_unit: 'lbs',
    // },
];

function initQtyState(orders) {
    const state = {};
    orders.forEach(o => {
        state[o.id] = {
            pieces: String(o.total_pieces),
            pallets: String(o.pallets),
            weight: String(o.total_actual_weight),
            unit: o.weight_unit,
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

function SignatureCanvas({ onSigned }) {
    const { classes, cx } = useStyles();
    const canvasRef = React.useRef(null);
    const drawing = React.useRef(false);
    const hasMark = React.useRef(false);
    const [active, setActive] = React.useState(false);

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
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        hasMark.current = true;
        onSigned(true);
    };

    const endDraw = () => { drawing.current = false; };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasMark.current = false;
        setActive(false);
        onSigned(false);
    };

    return (
        <Box>
            <Box className={classes.signatureArea}>
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={160}
                    className={cx(classes.signatureCanvas, active && classes.signatureCanvasActive)}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                />
                {!active && (
                    <Box className={classes.signatureHint}>Sign here</Box>
                )}
            </Box>
            <Box className={classes.signatureFooter}>
                <button className={classes.clearBtn} onClick={clear}>
                    <Refresh className={classes.clearIcon} /> Clear
                </button>
            </Box>
        </Box>
    );
}

export default function FreightPickup() {

    const { classes, cx } = useStyles();
    const [checkedAccessorials, setCheckedAccessorials] = React.useState(new Set());
    const [qtyState, setQtyState] = React.useState(() => initQtyState(SELECTED_ORDERS));
    const [signeeName, setSigneeName] = React.useState('');
    const [hasSigned, setHasSigned] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const navigate = useNavigate()

    const onBack = () => navigate(-1)

    const toggleAccessorial = (label) => {
        setCheckedAccessorials(prev => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
    };

    const updateQty = (orderId, field, value) => {
        setQtyState(prev => ({
            ...prev,
            [orderId]: { ...prev[orderId], [field]: value },
        }));
    };

    const canComplete = signeeName.trim().length > 0 && hasSigned;

    if (done) {
        return (
            <DriverLayout active="Deliveries">
                <Box className={classes.successWrap}>
                    <Box className={classes.successIcon}>
                        <CheckCircle sx={{ fontSize: 42, color: 'success.main' }} />
                    </Box>
                    <Typography className={classes.successTitle}>
                        Picked Up Successfully!
                    </Typography>
                    <Typography className={classes.successSub}>
                        {SELECTED_ORDERS.length} order{SELECTED_ORDERS.length > 1 ? 's' : ''} confirmed
                    </Typography>
                    <Box className={classes.successOrderList}>
                        {SELECTED_ORDERS.map(o => (
                            <Box key={o.id} className={classes.successOrderChip}>
                                Order #{o.order_number}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DriverLayout>
        );
    }
    return (
        <DriverLayout active="Deliveries">
            <Grid container spacing={2} pb={2}>
                <Grid size={12}>
                    <Stack direction="row" alignItems="center" className={classes.backRow} onClick={onBack}>
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
                            <Typography className={classes.pageTitleText}>Freight Pick Up</Typography>
                            <Typography className={classes.pageTitleSub}>
                                {SELECTED_ORDERS.length} order{SELECTED_ORDERS.length > 1 ? 's' : ''} selected
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <AccordionComponent
                        defaultExpanded={false}
                        bordered={'true'}
                        title={
                            <Stack direction="row" alignItems="center" gap={1}>
                                <ListAlt sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <span>Accessorial Charges</span>
                                {checkedAccessorials.size > 0 && (
                                    <Box className={classes.accordionBadge}>
                                        {checkedAccessorials.size} selected
                                    </Box>
                                )}
                            </Stack>
                        }
                        bold={700}
                        content={
                            <Box className={classes.accessorialList}>
                                {ACCESSORIALS.map(label => (
                                    <AccessorialItem
                                        key={label}
                                        label={label}
                                        checked={checkedAccessorials.has(label)}
                                        onToggle={() => toggleAccessorial(label)}
                                    />
                                ))}
                            </Box>
                        }
                    />
                </Grid>
                <Grid size={12} sx={{ border: '1px solid #ccc', py: 2, borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" gap={1} mb={2} sx={{ borderBottom: '1px solid #ccc', py: 2, px: 1, mt: -1.5 }}>
                        <Scale sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: 'black' }}>
                            Freight Details
                        </Typography>
                    </Stack>
                    <Stack gap={2} px={2}>
                        {SELECTED_ORDERS.map((order) => {
                            const q = qtyState[order.id];
                            return (
                                <AccordionComponent
                                    key={order.id}
                                    defaultExpanded={SELECTED_ORDERS.length >= 2}
                                    bordered={'true'}
                                    title={
                                        <Stack direction="row" alignItems={'center'} flex={1} py={1}>
                                            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                                                # {order.order_number}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 500 }}>
                                                . {order.customer_name}
                                            </Typography>
                                        </Stack>
                                    }
                                    bold={700}
                                    content={
                                        <Grid container spacing={3}>
                                            <Grid size={6}>
                                                <TextInput
                                                    variant='outlined'
                                                    required
                                                    fullWidth
                                                    label="Pieces"
                                                    value={q.pieces}
                                                    onChange={v => updateQty(order.id, 'pieces', v)}
                                                />
                                            </Grid>
                                            <Grid size={6}>
                                                <TextInput
                                                    variant='outlined'
                                                    required
                                                    fullWidth
                                                    label="Pallets"
                                                    value={q.pallets}
                                                    onChange={v => updateQty(order.id, 'pallets', v)}
                                                />
                                            </Grid>
                                            <Grid size={6}>
                                                <TextInput
                                                    variant='outlined'
                                                    required
                                                    fullWidth
                                                    label="Weight"
                                                    value={q.weight}
                                                    onChange={v => updateQty(order.id, 'weight', v)}
                                                />
                                            </Grid>
                                            <Grid size={6}>
                                                <TextInput
                                                    variant='outlined'
                                                    required
                                                    fullWidth
                                                    label="Unit"
                                                    value={q.unit}
                                                    onChange={e => updateQty(order.id, 'unit', e.target.value)}
                                                    select
                                                >
                                                    <MenuItem value='lbs'>LBS</MenuItem>
                                                    <MenuItem value='kg'>KG</MenuItem>
                                                </TextInput>
                                            </Grid>
                                        </Grid>
                                    }
                                />
                            );
                        })}
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <AccordionComponent
                        bordered={'true'}
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
                                        variant='outlined'
                                        label='Signee Name'
                                        required
                                        fullWidth
                                        value={signeeName || ''}
                                        onChange={e => setSigneeName(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Typography sx={{ pb: 1, fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        Signature
                                    </Typography>
                                    <SignatureCanvas onSigned={setHasSigned} />
                                </Grid>
                            </Grid>
                        }
                    />
                </Grid>
                <Grid size={12}>
                    <button
                        className={cx(classes.actionBtn, classes.actionBtnComplete)}
                        disabled={!canComplete}
                        onClick={() => setDone(true)}
                    >
                        <CheckCircle sx={{ fontSize: 22 }} />
                        Pick Up and Complete
                    </button>
                </Grid>
            </Grid>
        </DriverLayout>
    );
}