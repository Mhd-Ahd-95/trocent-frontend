import React from 'react';
import { Box, Collapse, Grid, Skeleton, Typography, } from '@mui/material';
import { LocalShipping, Person, Tag, ExpandMore, Inventory2, CalendarToday, CheckCircle, } from '@mui/icons-material';
import { DriverLayout } from '../../layouts';
import moment from 'moment';
import { useTripById } from '../../../hooks/useDispatchOrders';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';


const ORDER_STATUS_STYLES = {
    dispatched: { bg: 'rgba(41,128,185,0.1)', color: '#1a5276', border: '1px solid rgba(41,128,185,0.3)' },
    'picked up': { bg: 'rgba(221,145,0,0.1)', color: '#7d5200', border: '1px solid rgba(221,145,0,0.3)' },
    delivered: { bg: 'rgba(39,174,96,0.1)', color: '#1a5e35', border: '1px solid rgba(39,174,96,0.3)' },
    completed: { bg: 'rgba(39,174,96,0.15)', color: '#1a5e35', border: '1px solid rgba(39,174,96,0.4)' },
};

function formatTime(from, to) {
    if (!from && !to) return null;
    if (from && to) return `${from} – ${to}`;
    return from || to;
}

function formatDims(f) {
    if (!f.width && !f.length && !f.height) return null;
    const unit = f.dim_unit === 'in' ? 'IN' : 'LBS'
    return `${f.width}×${f.length}×${f.height} ${unit}`;
}

function formatAddress(address, city, province, postal) {
    const parts = [city, province, postal].filter(Boolean).join(' · ');
    if (address && parts) return `${address}, ${parts}`;
    return address || parts || null;
}


function FreightTable({ freights, totalPieces, totalWeight }) {

    if (!freights || freights.length === 0) return null;
    const weightUnit = freights[0]?.unit ?? 'lbs';

    return (
        <Box>
            <Grid container sx={{ px: 1, py: 0.5, mb: 0.5, background: 'rgba(44,62,80,0.09)' }}>
                <Grid size={1}>
                    <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        PCS
                    </Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        Type
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        Dims (W×L×H)
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        Desc
                    </Typography>
                </Grid>
            </Grid>
            {freights.map((f) => (
                <Grid container key={f.id} alignItems={'center'} sx={{ px: 1, py: 0.75, borderRadius: 1, '&:not(:last-child)': { borderBottom: '1px solid rgba(0,0,0,0.05)' } }}>
                    <Grid size={1}>
                        <Box sx={{ width: 20, height: 20, borderRadius: '5px', background: 'rgba(44,62,80,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                            {f.pieces}
                        </Box>
                    </Grid>
                    <Grid size={3}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#2c3e50' }}>{f.type}</Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2c3e50', fontVariantNumeric: 'tabular-nums' }}>
                            {formatDims(f) ?? '—'}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography sx={{ fontSize: 13, color: '#2c3e50' }}>{f.description || '—'}</Typography>
                    </Grid>
                </Grid>
            ))}
            <Box sx={{ display: 'flex', gap: 2, mt: 1, pt: 1, justifyContent: 'flex-end', borderTop: '1px solid rgba(44,62,80,0.08)', px: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#2c3e50', fontVariantNumeric: 'tabular-nums' }}>
                        {totalPieces}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        pcs
                    </Typography>
                </Box>
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(44,62,80,0.2)', alignSelf: 'center' }} />
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#2c3e50', fontVariantNumeric: 'tabular-nums' }}>
                        {totalWeight}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {weightUnit}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

function LegSection({ order, legType, onAction, isLast }) {

    const [open, setOpen] = React.useState(false);
    const isPickup = legType === 'pickup';

    const isDone = isPickup ? ['picked up', 'delivered', 'completed'].includes(order.order_status) : ['delivered', 'completed'].includes(order.order_status);

    const name = isPickup ? order.shipper_name : order.receiver_name;
    const address = isPickup ? formatAddress(order.shipper_address, order.shipper_city, order.shipper_province, order.shipper_postal_code)
        : formatAddress(order.receiver_address, order.receiver_city, order.receiver_province, order.receiver_postal_code);

    const timeFrom = isPickup ? order.pickup_time_from : order.delivery_time_from;
    const timeTo = isPickup ? order.pickup_time_to : order.delivery_time_to;
    const time = formatTime(timeFrom, timeTo);
    const instructions = isPickup ? order.shipper_special_instructions : order.receiver_special_instructions;
    const appointment = order.leg_type === 'pickup' ? Array.isArray(order.pickup_appointment_numbers) && order.pickup_appointment_numbers.length > 0 ? order.pickup_appointment_numbers[0] : null :
                Array.isArray(order.delivery_appointment_numbers) && order.delivery_appointment_numbers.length > 0 ? order.delivery_appointment_numbers[0] : null

    const accentColor = isPickup ? '#27ae60' : '#2980b9';
    const accentBg = isPickup ? 'rgba(39,174,96,0.08)' : 'rgba(41,128,185,0.08)';
    const accentBorder = isPickup ? 'rgba(39,174,96,0.18)' : 'rgba(41,128,185,0.18)';

    return (
        <Box sx={{ borderTop: isLast ? 'none' : undefined }}>
            <Box
                onClick={() => setOpen(o => !o)}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.2, cursor: 'pointer', transition: 'background 0.15s', background: open ? accentBg : 'transparent', '&:hover': { background: accentBg },
                    borderTop: `1px solid rgba(44,62,80,0.07)`,
                }}>
                <Box
                    sx={{
                        width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, letterSpacing: '0.05em', flexShrink: 0, boxShadow: `0 4px 10px ${accentColor}40`,
                    }}
                >
                    {isPickup ? 'P' : 'D'}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#161616', whiteSpace: 'nowrap', overflow: 'hidden', opacity: isDone ? 0.6 : 1, }}>
                        {name || '—'}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#5b5d5e', mt: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                        {address || '—'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                    {isDone ? (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 9, fontWeight: 800, color: '#1a5e35', background: 'rgba(39,174,96,0.1)',
                            border: '1px solid rgba(39,174,96,0.25)', borderRadius: '5px', px: 0.75, py: 0.3, letterSpacing: '0.06em',
                        }}>
                            <CheckCircle sx={{ fontSize: 10 }} />
                            DONE
                        </Box>
                    ) : (
                        <Box
                            component="button"
                            onClick={(e) => { e.stopPropagation(); onAction(order, legType); }}
                            sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.4, borderRadius: '6px', cursor: 'pointer', fontSize: 16, fontWeight: 700, letterSpacing: '0.04em',
                                border: `1px solid ${accentBorder}`, background: accentBg, color: accentColor, transition: 'background 0.15s',
                                '&:hover': { background: isPickup ? 'rgba(39,174,96,0.16)' : 'rgba(41,128,185,0.16)' }, '&:active': { transform: 'scale(0.97)' },
                            }}
                        >
                            {isPickup ? <><LocalShipping sx={{ fontSize: 16 }} /> Action</> : <><Inventory2 sx={{ fontSize: 16 }} /> Action</>}
                        </Box>
                    )}
                    <ExpandMore sx={{ fontSize: 15, color: '#95a5a6', transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0)', }} />
                </Box>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Grid container spacing={2} component={Box} px={2} py={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.4 }}>
                            {isPickup ? 'Pickup Time' : 'Delivery Time'}
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>
                            {time || '—'}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.4 }}>
                            Appointment Number
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>
                            {appointment || '—'}
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.4 }}>
                            Special Instructions
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: instructions ? '#2c3e50' : '#bdc3c7', lineHeight: 1.5 }}>
                            {instructions || '—'}
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        {order.freights?.length > 0 && (
                            <>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#95a5a6', mb: 0.75, }}>
                                    Freight
                                </Typography>
                                <FreightTable
                                    freights={order.freights}
                                    totalPieces={order.total_pieces}
                                    totalWeight={order.total_actual_weight}
                                />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Collapse >
        </Box >
    );
}

function OrderCard({ order, index, onAction }) {

    const statusStyle = ORDER_STATUS_STYLES[order.order_status] ?? ORDER_STATUS_STYLES.dispatched;
    const reference = Array.isArray(order.reference_numbers) && order.reference_numbers.length > 0 ? order.reference_numbers.join(', ') : null;
    const date = moment.utc(order.scheduled_date).format('ddd, DD MMM');

    return (
        <Box sx={{ background: '#fff', border: '1px solid rgba(44,62,80,0.1)', borderRadius: '12px', overflow: 'hidden', }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, background: 'rgba(44,62,80,0.025)', borderBottom: '1px solid rgba(44,62,80,0.07)', }}>
                <Box sx={{
                    width: 22, height: 22, borderRadius: '6px', background: '#2c3e50', color: '#fff', fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    {index + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', gap: 5 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#2c3e50', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                            # {order.order_number}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                            <CalendarToday sx={{ fontSize: 12, color: '#95a5a6' }} />
                            <Typography sx={{ fontSize: 12, color: '#95a5a6', fontWeight: 500 }}>
                                {date}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person sx={{ fontSize: 12, color: '#95a5a6' }} />
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>
                                {order.customer_name}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                            <Tag sx={{ fontSize: 12, color: '#95a5a6' }} />
                            <Typography sx={{ fontSize: 12, color: '#95a5a6', fontWeight: 500 }}>
                                {reference || '—'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                    <Box sx={{
                        fontSize: 13, fontWeight: 800, letterSpacing: '0.07em', borderRadius: '5px', px: 1, py: 0.3, textTransform: 'capitalize', whiteSpace: 'nowrap',
                        background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border,
                    }}>
                        {order.order_status}
                    </Box>
                </Box>
            </Box>
            <LegSection order={order} legType="pickup" onAction={onAction} />
            <LegSection order={order} legType="delivery" onAction={onAction} isLast />
        </Box>
    );
}


export default function DriverDeliveries() {

    const { tid } = useParams()
    const tripId = isNaN(tid) ? undefined : tid
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { data: liveTrip = {}, isLoading, isError, error } = useTripById(tripId, true)

    const sortedOrders = React.useMemo(() =>
        liveTrip?.dispatched_orders ? [...liveTrip.dispatched_orders].sort((a, b) => a.order_level - b.order_level) : [],
        [liveTrip]);

    const handleAction = (order, legType) => {
        console.log('Action triggered', { ...order, legType });
        navigate('/stop-actions')
    };

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
        }
    }, [isError, error]);


    return (
        <DriverLayout
            active='Deliveries'
        >
            {isLoading ?
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Skeleton variant='rectangular' width='100%' height={50} />
                    </Grid>
                    <Grid size={12}>
                        <Skeleton variant='rectangular' width='100%' height={200} />
                    </Grid>
                </Grid>
                :
                !tripId || tripId === undefined ?
                    <Box sx={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                        <Box sx={{ textAlign: 'center', maxWidth: 320, px: 2, }}>
                            <Box
                                sx={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(44,62,80,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <LocalShipping sx={{ fontSize: 32, color: '#2c3e50', opacity: 0.6 }} />
                            </Box>
                            <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#2c3e50', mb: 0.5, }}>
                                No Active Trip
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: '#95a5a6', lineHeight: 1.5 }}>
                                You don’t have any live trip right now.
                                Once you have a live trip, it will appear here.
                            </Typography>
                        </Box>
                    </Box>
                    :
                    <Box sx={{ pb: 5 }}>
                        <Box sx={{ background: '#2c3e50', borderRadius: '14px', px: 2, py: 1.5, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(221,145,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <LocalShipping sx={{ fontSize: 18, color: '#DD9100' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                                        Trip #{liveTrip.trip_number}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.48)', mt: 0.4 }}>
                                        {moment.utc(liveTrip.trip_date).format('ddd, DD MMM YYYY')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, background: 'rgba(221,145,0,0.18)', border: '1px solid rgba(221,145,0,0.45)', borderRadius: '6px', px: 1, py: 0.4, fontSize: 10, fontWeight: 800, color: '#DD9100', letterSpacing: '0.08em' }}>
                                    <Box sx={{
                                        width: 5, height: 5, borderRadius: '50%', background: '#DD9100', animation: 'blink 1.2s ease-in-out infinite',
                                        '@keyframes blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
                                    }} />
                                    LIVE
                                </Box>
                                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', fontWeight: 600 }}>
                                    {liveTrip.total_orders_completed} / {liveTrip.total_orders} done
                                </Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={3}>
                            {sortedOrders.map((order, idx) => (
                                <Grid size={12} key={idx}>
                                    <OrderCard
                                        order={order}
                                        index={idx}
                                        onAction={handleAction}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
            }
        </DriverLayout>
    );
}