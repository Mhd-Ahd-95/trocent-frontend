import React from 'react';
import { Box, Button, Chip, IconButton, TextField, Grid, Typography, Divider } from '@mui/material';
import { EditRounded, CheckCircleRounded, CalendarToday, Place, LocalShippingRounded, AccessTime, StickyNote2Rounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './Billing.styles';

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

const SERVICE_CHIP_CLASS = {
    Direct: 'serviceChipDirect',
    Rush: 'serviceChipRush',
    Regular: 'serviceChipRegular',
};

const BoxTitle = ({ classes, icon, children, tone = 'neutral' }) => (
    <Box className={`${classes.boxTitle} ${classes[`boxTitle_${tone}`]}`}>
        {icon}
        {children}
    </Box>
);

const KVRow = ({ classes, label, value, emphasis, column }) => (
    <Box className={column ? classes.kvColumn : classes.kvRow}>
        <Typography className={label === 'Sub Total' ? classes.kvTotal : classes.kvLabel}>{label}</Typography>
        <Typography className={label === 'Sub Total' ? classes.kvTotalValue : emphasis ? classes.kvValueEmphasis : classes.kvValue}>{value}</Typography>
    </Box>
);

const DriverLine = ({ classes, driver, roleLabel }) => (
    <Typography className={classes.orderMetaLine}>
        Driver: <span className={classes.orderMetaStrong}>{driver.name}{driver.driver_number ? ` | ${driver.driver_number}` : ''} ({roleLabel})</span>
    </Typography>
);

const PayoutInput = ({ classes, driver }) => (
    <TextField
        className={classes.payoutInput}
        size="small"
        placeholder={`#${driver.driver_number ? driver.driver_number : driver.name}`}
    />
);

const OrderBillingCard = React.memo(({ order, handleCharge }) => {

    const { classes, cx } = useStyles();
    const isInterliner = order.interliners?.length > 0;
    const dp = order?.pickup_driver_assigned || null
    const dd = order?.delivery_driver_assigned || null
    const isSamedriver = Boolean(dp && dd && dp.id === dd.id);
    const approved = false
    const unit = order.freights?.length > 0 ? order.freights[0].unit : 'lbs'

    const differenceTime = (tin, tout) => moment(tout, 'HH:mm').diff(moment(tin, 'HH:mm'), 'minutes');

    return (
        <Box className={classes.orderCard}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Grid container justifyContent="space-between">
                        <Grid size="auto">
                            <Typography className={classes.orderNumber}># {order.order_number}</Typography>
                            <Typography className={classes.orderMetaLine}>Ref: <span className={classes.orderMetaStrong}>{order.references || '—'}</span></Typography>

                        </Grid>
                        <Grid size='auto'>
                            {dp && <DriverLine classes={classes} driver={dp} roleLabel={isSamedriver ? 'P & D' : 'P'} />}
                            {dd && !isSamedriver && <DriverLine classes={classes} driver={dd} roleLabel="D" />}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Grid container spacing={2} alignItems="stretch" sx={{ flexGrow: 1, height: '100%' }}>
                        <Grid size={4.5} className={classes.infoBox}>
                            <Grid container spacing={1.5} alignItems="stretch" sx={{ height: '100%' }}>
                                <Grid size={8.5}>
                                    <BoxTitle classes={classes} tone="shipper" icon={<Place sx={{ fontSize: 15 }} />}>Shipper</BoxTitle>
                                    <Typography className={classes.partyName}>{order.shipper_name}</Typography>
                                    <Typography className={classes.addressText}>{order.shipper_address}</Typography>
                                    <Typography className={classes.addressText}>
                                        {order.shipper_city || '-'} | {order.shipper_province || '-'} | {order.shipper_postal_code || '-'}
                                    </Typography>
                                    <Typography className={classes.specialInstructions}>{order.shipper_special_instructions || '-'}</Typography>
                                    {order.order_notes.filter(on => on.note_type === 'pickup')?.length > 0 &&
                                        <>
                                            <Typography className={classes.partyName} sx={{ mt: 0.5 }}>Driver | Dispatch Notes</Typography>
                                            <ul className={classes.driverNotes}>
                                                {order.order_notes.filter(on => on.note_type === 'pickup').map(n => (
                                                    <li key={n.id}><Typography className={classes.addressText}>{n.note}</Typography></li>
                                                ))}
                                            </ul>
                                        </>
                                    }
                                </Grid>
                                <Grid size={3.5} className={classes.timeCol}>
                                    <Typography className={classes.timeLabel}><CalendarToday sx={{ fontSize: 14 }} />Pickup</Typography>
                                    <Typography className={classes.dateValue}>{moment.utc(order.pickup_date).format('ddd, DD/MM')}</Typography>
                                    <Typography className={classes.timeRangeValue}><strong>Exp:</strong> {order.pickup_time_from} - {order.pickup_time_to}</Typography>
                                    <Typography className={classes.timeRangeValue}><strong>Act:</strong> {order.pickup_in} - {order.pickup_out}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={4.5} className={classes.infoBox}>
                            <Grid container spacing={1.5} alignItems="stretch" sx={{ height: '100%' }}>
                                <Grid size={8.5}>
                                    <BoxTitle classes={classes} tone="receiver" icon={<Place sx={{ fontSize: 15 }} />}>Receiver</BoxTitle>
                                    <Typography className={classes.partyName}>{order.receiver_name}</Typography>
                                    <Typography className={classes.addressText}>{order.receiver_address}</Typography>
                                    <Typography className={classes.addressText}>
                                        {order.receiver_city || '-'} | {order.receiver_province || '-'} | {order.receiver_postal_code || '-'}
                                    </Typography>
                                    <Typography className={classes.specialInstructions}>{order.receiver_special_instructions || '-'}</Typography>
                                    {order.order_notes.filter(on => on.note_type === 'delivery')?.length > 0 &&
                                        <>
                                            <Typography className={classes.partyName} sx={{ mt: 0.5 }}>Driver | Dispatch Notes</Typography>
                                            <ul className={classes.driverNotes}>
                                                {order.order_notes.filter(on => on.note_type === 'delivery').map(n => (
                                                    <li key={n.id}><Typography className={classes.addressText}>{n.note}</Typography></li>
                                                ))}
                                            </ul>
                                        </>
                                    }
                                </Grid>
                                <Grid size={3.5} className={classes.timeCol}>
                                    <Typography className={classes.timeLabel}><CalendarToday sx={{ fontSize: 12 }} />Delivery</Typography>
                                    <Typography className={classes.dateValue}>{moment.utc(order.delivery_date).format('ddd, DD/MM')}</Typography>
                                    <Typography className={classes.timeRangeValue}><strong>Exp:</strong> {order.delivery_time_from} - {order.delivery_time_to}</Typography>
                                    <Typography className={classes.timeRangeValue}><strong>Act:</strong> {order.delivery_in} - {order.delivery_out}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={3} className={classes.infoBox}>
                            <BoxTitle classes={classes} tone="waiting" icon={<AccessTime sx={{ fontSize: 15 }} />}>Waiting Time</BoxTitle>
                            <KVRow classes={classes} label="Pickup:" value={`${differenceTime(order.pickup_in, order.pickup_out)} min`} />
                            <KVRow classes={classes} label="Delivery:" value={`${differenceTime(order.delivery_in, order.delivery_out)} min`} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Grid container spacing={2} alignItems="stretch" sx={{ flexGrow: 1, height: '100%' }}>
                        <Grid size={isInterliner ? 6 : 9} className={classes.infoBox}>
                            <Chip
                                label={order.service_type}
                                className={cx(classes.serviceChip, classes[SERVICE_CHIP_CLASS[order.service_type]])}
                                size="medium"
                            />
                            <Grid container spacing={2} alignItems="stretch" sx={{ mt: 0.25, flex: 1 }}>
                                <Grid size={6} className={classes.infoSubBox}>
                                    <BoxTitle classes={classes} tone="neutral">Freight Details</BoxTitle>
                                    {order.freights.map((f, idx) => (
                                        <Box key={f.id ?? idx} className={classes.freightLineRow}>
                                            <span className={classes.freightPieces}>{f.pieces ?? '—'}</span>
                                            <span className={classes.freightType}>{f.type ?? '—'}</span>
                                            <span className={classes.freightDims}>
                                                {f.length ?? 0}×{f.width ?? 0}×{f.height ?? 0} {f.dim_unit ? f.dim_unit.toUpperCase() : 'IN'}
                                            </span>
                                            <span className={classes.freightDescription}>{f.description || 'FAK'}</span>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid size={6} className={classes.infoSubBox}>
                                    <BoxTitle classes={classes} tone="neutral">Totals</BoxTitle>
                                    <Grid container spacing={1}>
                                        <Grid size={6}>
                                            <KVRow classes={classes} label="Actual Weight" value={`${order.total_actual_weight} ${unit}`} emphasis column />
                                        </Grid>
                                        <Grid size={6}>
                                            <KVRow classes={classes} label="Chargeable Weight" value={`${order.total_chargeable_weight} ${unit}`} emphasis column />
                                        </Grid>
                                        <Grid size={6}>
                                            <KVRow classes={classes} label="Chargeable Skid" value={order.total_pieces_skid} emphasis column />
                                        </Grid>
                                        <Grid size={6}><KVRow classes={classes} label="Chargeable Box Weight" value={`${order.total_pieces_skid > 0 ? 0 : order.total_chargeable_weight} ${unit}`} emphasis column /></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {isInterliner && (
                            <Grid size={3} className={classes.infoBox}>
                                <BoxTitle classes={classes} tone="neutral" icon={<LocalShippingRounded sx={{ fontSize: 13 }} />}>Interliner Charges</BoxTitle>
                                {order.interliners.map((interliner) => (
                                    <React.Fragment key={interliner.id}>
                                        <KVRow classes={classes} label="Name:" value={interliner.name ? `${interliner.name} (${interliner.type === 'both' ? 'P & D' : interliner.type === 'pickup' ? 'P' : 'D'})` : '-'} emphasis />
                                        <KVRow classes={classes} label="Reference:" value={interliner.invoice || '-'} emphasis />
                                        <KVRow classes={classes} label="Amount:" value={money(interliner.charge_amount)} emphasis />
                                        {order.interliners.length > 1 &&
                                            <Divider />
                                        }
                                    </React.Fragment>
                                ))}
                            </Grid>
                        )}
                        <Grid size={3} className={classes.infoBox}>
                            <Box className={classes.chargesTitleRow}>
                                <BoxTitle classes={classes} tone="neutral">Charges</BoxTitle>
                                <IconButton className={classes.editButton} size="small" onClick={() => handleCharge(order)}>
                                    <EditRounded style={{ fontSize: 17 }} />
                                </IconButton>
                            </Box>
                            <KVRow classes={classes} label="Freight Charge" value={money(order.freight_rate)} emphasis />
                            <KVRow classes={classes} label="Fuel Surcharge" value={money(order.freight_fuel_surcharge)} emphasis />
                            {order.accessorials.map((a) => (
                                <KVRow classes={classes} key={a.id} label={`${a.name}:`} value={`${a.charge_quantity} x ${money(a.charge_amount)}`} emphasis />
                            ))}
                            <Divider className={classes.sectionDivider} />
                            <KVRow classes={classes} label="Sub Total" value={money(order.sub_total)} emphasis />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={6} className={classes.infoBox}>
                    <BoxTitle classes={classes} tone="neutral" icon={<StickyNote2Rounded sx={{ fontSize: 13 }} />}>Internal Note</BoxTitle>
                    <Typography className={classes.notesText}>{order.internal_note || '—'}</Typography>
                </Grid>
                <Grid size={6}>
                    <Grid container spacing={1} justifyContent={'flex-end'}>
                        <Grid size="auto" className={classes.topRightCol}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {dp && <PayoutInput classes={classes} driver={dp} />}
                                    {dd && !isSamedriver && <PayoutInput classes={classes} driver={dd} />}
                                </Box>
                            </Box>
                            {approved ? (
                                <Chip className={classes.approveChip} color="success" icon={<CheckCircleRounded style={{ fontSize: 14 }} />} label="Approved" />
                            ) : (
                                <Button className={classes.approveButton} variant="contained">
                                    Approve
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
});

OrderBillingCard.displayName = 'OrderBillingCard';
export default OrderBillingCard;