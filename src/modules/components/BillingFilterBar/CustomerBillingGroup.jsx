import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Chip, Typography } from '@mui/material';
import { ExpandMoreRounded, History, RouteRounded } from '@mui/icons-material';
import useStyles from './Filter.styles';
import moment from 'moment';

const CustomerBillingGroup = React.memo(forwardRef(({ customerName, customerInvoicing, accountNumber, orders, orderRef, openCharges, OrderCard, isInvoicing = false,
    customerId, isDriverPay, driver_id, onApprove, isHourly, driverDetails }, ref) => {

    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(true);

    useImperativeHandle(ref, () => ({
        expand: () => setExpanded(true),
        collapse: () => setExpanded(false),
    }), []);

    const handleChange = useCallback(() => setExpanded((prev) => !prev), []);

    const handleCharge = (order) => {
        orderRef.current = order
        openCharges(1)
    }

    const handleInterliner = (order) => {
        orderRef.current = order
        openCharges(2)
    }

    const handleDetails = (e, nb) => {
        e.stopPropagation()
        orderRef.current = customerId
        openCharges(nb)
    }

    const dateGroups = React.useMemo(() => {
        if (!isDriverPay) return []
        const map = new Map();
        orders.forEach((o) => {
            const dateField = o.leg_type === 'pickup' ? o.pickup_at : o.delivery_at
            const key = moment(dateField).format('YYYY-MM-DD');
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(o);
        });
        return Array.from(map.entries())
            .sort((a, b) => moment(b[0]).diff(moment(a[0])))
            .map(([date, dateOrders]) => ({ date, orders: dateOrders }));
    }, [orders, isDriverPay]);

    const type = isHourly ? 'Day' : 'Order'

    const dateRangeLabel = React.useMemo(() => {
        if (!isHourly) return
        if (!orders.length) return '—';
        const sorted = [...orders].sort((a, b) => moment(a.date).diff(moment(b.date)));
        const from = moment(sorted[0].date).format('MMM D');
        const to = moment(sorted[sorted.length - 1].date).format('MMM D, YYYY');
        return `${orders.length} days · ${from} – ${to}`;
    }, [orders, isHourly]);

    return (
        <Accordion
            className={classes.accordionRoot}
            expanded={expanded}
            onChange={handleChange}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
        >
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreRounded />}>
                <Box className={classes.accordionSummaryContent}>
                    <Box className={classes.customerIdentity}>
                        <Box className={classes.customerName}>{customerName}</Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Box className={classes.customerMeta}>#{accountNumber}.</Box>
                            <Box className={classes.customerMeta}>{dateRangeLabel}</Box>
                            {/* <Chip className={classes.orderCountChip} label={dateRangeLabel} /> */}
                        </Box>
                    </Box>
                    {isHourly &&
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box component="span" role="button" tabIndex={0} className={cx(classes.historyButton, classes.btnAccordion)} onClick={(e) => handleDetails(e, 2)}>
                                <History sx={{ fontSize: 15 }} />
                                Driver History
                            </Box>

                            <Box component="span" role="button" tabIndex={0} className={cx(classes.detailsButton, classes.btnAccordion)} onClick={(e) => handleDetails(e, 1)}>
                                <RouteRounded sx={{ fontSize: 15 }} />
                                Show Trip Details
                            </Box>
                        </Box>
                    }
                </Box>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                {OrderCard ? isInvoicing ? <OrderCard orders={orders} customerInvoicing={customerInvoicing} customerId={customerId} /> :
                    isDriverPay ? dateGroups.map(({ date, orders: dateOrders }) => (<OrderCard key={date} date={date} orders={dateOrders} driver={{ driver_id, driver_number: accountNumber }} onApprove={onApprove} />))
                        : isHourly ? <OrderCard days={orders} driverDetails={driverDetails} /> :
                            orders.map((order) => (
                                <OrderCard key={order.order_id} order={order} handleCharge={handleCharge} handleInterliner={handleInterliner} />
                            ))
                    : null
                }
            </AccordionDetails>
        </Accordion>
    );
}));

CustomerBillingGroup.displayName = 'CustomerBillingGroup';
export default CustomerBillingGroup;