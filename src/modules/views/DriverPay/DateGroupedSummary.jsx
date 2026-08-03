import React, { useState, useMemo, useCallback, useRef } from 'react'
import { Box, Typography, TextField, Button, Grid, Collapse } from '@mui/material'
import { TuneRounded } from '@mui/icons-material'
import moment from 'moment'
import OrderBillingDetailCard from '../Billing/OrderBillingCard'
import { money, accessorialsTotal, interlinersTotal } from '../Utils/driverPay'
import useStyles from './DriverPay.styles'

const StatTile = ({ classes, cx, label, value, highlight }) => (
    <Box className={cx(classes.statTile, highlight && classes.statTileHighlight)}>
        <Typography className={cx(classes.statLabel, highlight && classes.statLabelHighlight)}>
            {label}
        </Typography>
        <Typography className={cx(classes.statValue, highlight && classes.statValueHighlight)}>
            {value}
        </Typography>
    </Box>
)

const DateGroupedSummary = React.memo(({ date, orders }) => {

    const { classes, cx } = useStyles()
    const [expanded, setExpanded] = useState(false)
    const hasOpened = useRef(false)
    const [approved, setApproved] = useState(false)
    const payoutsRef = useRef({})
    const [runningTotal, setRunningTotal] = useState(() => orders.reduce((sum, o) => sum + Number(o.driver_payout || 0), 0))
    const [autoSync, setAutoSync] = useState(true)

    const totals = useMemo(() => {
        let freight = 0, fuel = 0, subTotal = 0, accessorials = 0, interliners = 0
        orders.forEach(o => {
            freight += Number(o.freight_rate || 0)
            fuel += Number(o.freight_fuel_surcharge || 0)
            subTotal += Number(o.sub_total || 0)
            accessorials += accessorialsTotal(o.accessorials)
            interliners += interlinersTotal(o.interliners)
        })
        return { freight, fuel, subTotal, accessorials, interliners, subFuel: subTotal - fuel }
    }, [orders])

    const handleToggle = useCallback(() => {
        hasOpened.current = true
        setExpanded(p => !p)
    }, [])

    const handlePayoutChange = useCallback((orderId, value) => {
        payoutsRef.current[orderId] = value
        if (autoSync) {
            const sum = Object.values(payoutsRef.current).reduce((a, b) => a + Number(b || 0), 0)
            setRunningTotal(sum)
        }
    }, [autoSync])

    const handleRunningTotalChange = useCallback((val) => {
        setAutoSync(false)
        setRunningTotal(val)
    }, [])

    const handleApprove = useCallback((e) => {
        e.stopPropagation()
        setApproved(true)
    }, [orders, runningTotal])

    return (
        <Box className={classes.dateGroupRoot}>
            <Box onClick={handleToggle} className={cx(classes.summaryHeader, expanded && classes.summaryHeaderExpanded)}>
                <Box>
                    <Typography className={classes.dateHeading}>
                        {moment(date).format('dddd Do [of] MMMM YYYY')}
                    </Typography>
                    <Typography className={classes.orderCountText}>
                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Box className={cx(classes.toggleIcon, expanded && classes.toggleIconOpen)}>
                    <TuneRounded sx={{ fontSize: 18, color: 'primary.contrastText' }} />
                </Box>
            </Box>

            <Box className={classes.summaryBody}>
                <Grid container className={classes.summaryRow} wrap="nowrap" alignItems="stretch">
                    <StatTile classes={classes} cx={cx} label="Freight Charges" value={money(totals.freight)} />
                    <StatTile classes={classes} cx={cx} label="Accessorials" value={money(totals.accessorials)} />
                    <StatTile classes={classes} cx={cx} label="Fuel surcharges" value={money(totals.fuel)} />
                    <StatTile classes={classes} cx={cx} label="Interliners" value={money(totals.interliners)} />
                    <StatTile classes={classes} cx={cx} label="Sub-fuel" value={money(totals.subFuel)} />
                    <StatTile classes={classes} cx={cx} label="Subtotals" value={money(totals.subTotal)} highlight />

                    <Box className={classes.divider} />

                    <Box className={classes.runningTotalGroup} onClick={(e) => e.stopPropagation()}>
                        <Typography className={classes.runningTotalLabel}>Running total</Typography>
                        <Typography className={classes.runningTotalSign}>$</Typography>
                        <TextField
                            size="small"
                            type="number"
                            className={classes.runningTotalInput}
                            value={runningTotal}
                            disabled={approved}
                            onChange={(e) => handleRunningTotalChange(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            className={classes.approveButton}
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                    </Box>
                </Grid>
            </Box>
            <Collapse in={expanded} timeout={'auto'}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid size={12}>
                        {orders.map(order => (
                            <OrderBillingDetailCard
                                key={order.order_id}
                                order={order}
                                isDriverPay
                                onPayoutChange={handlePayoutChange}
                            />
                        ))}
                    </Grid>
                </Grid>
            </Collapse>
        </Box>
    )
})

DateGroupedSummary.displayName = 'DateGroupedSummary'
export default DateGroupedSummary