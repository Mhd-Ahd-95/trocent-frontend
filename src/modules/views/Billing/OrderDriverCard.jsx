import React from 'react'
import { Box, Chip, TextField, Grid, Typography, Divider, Tooltip } from '@mui/material'
import { CalendarToday, Place, LocalShippingRounded, AccessTime, StickyNote2Rounded } from '@mui/icons-material'
import moment from 'moment'
import useStyles from './Billing.styles'
import { money } from '../Utils/driverPay'

const SERVICE_CHIP_CLASS = {
    Direct: 'serviceChipDirect',
    Rush: 'serviceChipRush',
    Regular: 'serviceChipRegular',
}

const BoxTitle = ({ classes, icon, children, tone = 'neutral' }) => (
    <Box className={`${classes.boxTitle} ${classes[`boxTitle_${tone}`]}`}>
        {icon}
        {children}
    </Box>
)

const KVRow = ({ classes, label, value, emphasis, column, isBilling, cx }) => (
    <Box className={column ? classes.kvColumn : classes.kvRow}>
        <Typography className={label === 'Sub Total' ? classes.kvTotal : classes.kvLabel}>{label}</Typography>
        <Typography className={label === 'Sub Total' ? classes.kvTotalValue : emphasis ? classes.kvValueEmphasis : classes.kvValue} sx={{ display: 'flex', gap: 1, alignItems: 'center', position: 'relative' }}>
            {isBilling && (
                <Tooltip title={'Amount changed from billing.'} arrow placement="top">
                    <span className={cx(classes.statusDot, classes.statusDotGreen, classes.statusDotPulsing)} />
                </Tooltip>
            )}
            {value}
        </Typography>
    </Box>
)

const LegLine = ({ classes, leg }) => (
    <Typography className={classes.orderMetaLine}>
        Leg: <span className={classes.orderMetaStrong} style={{ textTransform: 'capitalize' }}>{leg}</span>
    </Typography>
)

const PayoutInput = ({ classes, placeholder, value, onChange }) => (
    <TextField
        className={classes.payoutInput}
        size="small"
        value={value ?? ''}
        type="number"
        onChange={(e) => {
            const val = e.target.value
            if (val < 0) return
            onChange?.(val)
        }}
        placeholder={placeholder}
    />
)

const OrderDriverCard = React.memo(({ order, onPayoutChange, driver }) => {

    const { classes, cx } = useStyles()
    const [payout, setPayout] = React.useState(order?.driver_payout || 0)
    const unit = order.freights?.length > 0 ? order.freights[0].unit : 'lbs'
    const isInterliner = (order.interliners?.length || 0) > 0

    const pickupNotes = React.useMemo(() => order.order_notes.filter(on => on.note_type === 'pickup'), [order.order_notes])
    const deliveryNotes = React.useMemo(() => order.order_notes.filter(on => on.note_type === 'delivery'), [order.order_notes])

    const differenceTime = (tin, tout) => moment(tout, 'HH:mm').diff(moment(tin, 'HH:mm'), 'minutes')

    const handleOrderClick = (e) => {
        e.preventDefault()
        window.open(`/orders/edit/${order.order_id}`, '_blank', 'noopener,noreferrer')
    }

    const handleChange = React.useCallback((value) => {
        setPayout(value)
        onPayoutChange?.(order.order_id, value)
    }, [order.order_id, onPayoutChange])

    return (
        <Box className={classes.orderCard}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Grid container justifyContent="space-between">
                        <Grid size="auto">
                            <a href={`/orders/edit/${order.order_id}`} onClick={handleOrderClick} className={classes.orderNumberLink}>
                                # {order.order_number}
                            </a>
                            <Typography className={classes.orderMetaLine}>Ref: <span className={classes.orderMetaStrong}>{order.references || '—'}</span></Typography>
                        </Grid>
                        <Grid size="auto">
                            <LegLine classes={classes} leg={order.leg_type} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="stretch">
                <Grid size={{ xs: 12, sm: 6, md: 4.5 }}>
                    <Box className={classes.infoBox}>
                        <Grid container spacing={1.5} alignItems="stretch" sx={{ height: '100%' }}>
                            <Grid size={{ xs: 12, sm: 8.5 }}>
                                <BoxTitle classes={classes} tone="shipper" icon={<Place sx={{ fontSize: 15 }} />}>Shipper</BoxTitle>
                                <Typography className={classes.partyName}>{order.shipper_name}</Typography>
                                <Typography className={classes.addressText}>{order.shipper_address}</Typography>
                                <Typography className={classes.addressText}>
                                    {order.shipper_city || '-'} | {order.shipper_province || '-'} | {order.shipper_postal_code || '-'}
                                </Typography>
                                <Typography className={classes.specialInstructions}>{order.shipper_special_instructions || '-'}</Typography>
                                {pickupNotes.length > 0 &&
                                    <>
                                        <Typography className={classes.partyName} sx={{ mt: 0.5 }}>Driver | Dispatch Notes</Typography>
                                        <ul className={classes.driverNotes}>
                                            {pickupNotes.map(n => (
                                                <li key={n.id}><Typography className={classes.addressText}>{n.note}</Typography></li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3.5 }} className={classes.timeCol}>
                                <Typography className={classes.timeLabel}><CalendarToday sx={{ fontSize: 14 }} />Pickup</Typography>
                                <Typography className={classes.dateValue}>{moment.utc(order.pickup_date).format('ddd, DD/MM')}</Typography>
                                <Typography className={classes.timeRangeValue}><strong>Exp:</strong> {order.pickup_time_from} - {order.pickup_time_to}</Typography>
                                <Typography className={classes.timeRangeValue}><strong>Act:</strong> {order.pickup_in} - {order.pickup_out}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4.5 }}>
                    <Box className={classes.infoBox}>
                        <Grid container spacing={1.5} alignItems="stretch" sx={{ height: '100%' }}>
                            <Grid size={{ xs: 12, sm: 8.5 }}>
                                <BoxTitle classes={classes} tone="receiver" icon={<Place sx={{ fontSize: 15 }} />}>Receiver</BoxTitle>
                                <Typography className={classes.partyName}>{order.receiver_name}</Typography>
                                <Typography className={classes.addressText}>{order.receiver_address}</Typography>
                                <Typography className={classes.addressText}>
                                    {order.receiver_city || '-'} | {order.receiver_province || '-'} | {order.receiver_postal_code || '-'}
                                </Typography>
                                <Typography className={classes.specialInstructions}>{order.receiver_special_instructions || '-'}</Typography>
                                {deliveryNotes.length > 0 &&
                                    <>
                                        <Typography className={classes.partyName} sx={{ mt: 0.5 }}>Driver | Dispatch Notes</Typography>
                                        <ul className={classes.driverNotes}>
                                            {deliveryNotes.map(n => (
                                                <li key={n.id}><Typography className={classes.addressText}>{n.note}</Typography></li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3.5 }} className={classes.timeCol}>
                                <Typography className={classes.timeLabel}><CalendarToday sx={{ fontSize: 12 }} />Delivery</Typography>
                                <Typography className={classes.dateValue}>{moment.utc(order.delivery_date).format('ddd, DD/MM')}</Typography>
                                <Typography className={classes.timeRangeValue}><strong>Exp:</strong> {order.delivery_time_from} - {order.delivery_time_to}</Typography>
                                <Typography className={classes.timeRangeValue}><strong>Act:</strong> {order.delivery_in} - {order.delivery_out}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Box className={classes.infoBox}>
                        <Grid container>
                            <Grid size={12}>
                                <BoxTitle classes={classes} tone="waiting" icon={<AccessTime sx={{ fontSize: 15 }} />}>Waiting Time</BoxTitle>
                                <KVRow classes={classes} label="Pickup:" value={`${differenceTime(order.pickup_in, order.pickup_out)} min`} />
                                <KVRow classes={classes} label="Delivery:" value={`${differenceTime(order.delivery_in, order.delivery_out)} min`} />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="stretch">
                <Grid size={{ xs: 12, sm: 12, md: isInterliner ? 6 : 9 }}>
                    <Box className={classes.infoBox}>
                        <Chip
                            label={order.service_type}
                            className={cx(classes.serviceChip, classes[SERVICE_CHIP_CLASS[order.service_type]])}
                            size="medium"
                        />
                        <Grid container spacing={2} alignItems="stretch" sx={{ mt: 0.25, flex: 1 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box className={classes.infoSubBox}>
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
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box className={classes.infoSubBox}>
                                    <BoxTitle classes={classes} tone="neutral">Totals</BoxTitle>
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <KVRow classes={classes} label="Actual Weight" value={`${order.total_actual_weight} ${unit}`} emphasis column />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <KVRow classes={classes} label="Chargeable Weight" value={`${order.total_chargeable_weight} ${unit}`} emphasis column />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <KVRow classes={classes} label="Chargeable Skid" value={order.total_pieces_skid} emphasis column />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}><KVRow classes={classes} label="Chargeable Box Weight" value={`${order.total_pieces_skid > 0 ? 0 : order.total_chargeable_weight} ${unit}`} emphasis column /></Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {isInterliner && (
                    <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                        <Box className={classes.infoBox}>
                            <Box className={classes.chargesTitleRow}>
                                <BoxTitle classes={classes} tone="neutral" icon={<LocalShippingRounded sx={{ fontSize: 13 }} />}>Interliner Charges</BoxTitle>
                            </Box>
                            {order.interliners.map((interliner) => (
                                <React.Fragment key={interliner.id}>
                                    <KVRow classes={classes} label="Name:" value={interliner.name ? `${interliner.name} (${interliner.type === 'both' ? 'P & D' : interliner.type === 'pickup' ? 'P' : 'D'})` : '-'} emphasis />
                                    <KVRow classes={classes} label="Reference:" value={interliner.invoice || '-'} emphasis />
                                    <KVRow classes={classes} label="Amount:" isBilling={interliner.is_billing} value={money(interliner.charge_amount)} emphasis cx={cx} />
                                    {order.interliners.length > 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Grid>
                )}
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Box className={classes.infoBox}>
                        <Box className={classes.chargesTitleRow}>
                            <BoxTitle classes={classes} tone="neutral">Charges</BoxTitle>
                        </Box>
                        <KVRow classes={classes} label="Freight Charge" value={money(order.freight_rate)} emphasis />
                        <KVRow classes={classes} label="Fuel Surcharge" value={money(order.freight_fuel_surcharge)} emphasis />
                        {order.accessorials.map((a) => (
                            <KVRow classes={classes} key={a.id} label={`${a.name}:`} value={`${a.charge_quantity} x ${money(a.charge_amount)}`} emphasis />
                        ))}
                        <Divider className={classes.sectionDivider} />
                        <KVRow classes={classes} label="Sub Total" value={money(order.sub_total)} emphasis />
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} className={classes.infoBox}>
                    <BoxTitle classes={classes} tone="neutral" icon={<StickyNote2Rounded sx={{ fontSize: 13 }} />}>Internal Note</BoxTitle>
                    <Typography className={classes.notesText}>{order.internal_note || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Grid container spacing={1} justifyContent="flex-end">
                        <Grid size="auto" className={classes.topRightCol}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <PayoutInput
                                    classes={classes}
                                    value={payout}
                                    onChange={handleChange}
                                    placeholder={`#${driver.driver_number}`}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
})

OrderDriverCard.displayName = 'OrderDriverCard'
export default OrderDriverCard