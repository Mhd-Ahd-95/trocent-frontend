import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import useStyles from './Filter.styles';
import moment from 'moment';

const CustomerBillingGroup = React.memo(forwardRef(({ customerName, customerInvoicing, accountNumber, orders, orderRef, openCharges, OrderCard, isInvoicing = false,
    customerId, isDriverPay, driver_id, onApprove, isHourly, isCompanyGroup = false, driverDetails }, ref) => {

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

    const type = isCompanyGroup ? 'Driver' : 'Order'

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
                            <Box className={classes.customerMeta}>
                                {orders.length} {type}{orders.length !== 1 ? 's' : ''}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                {OrderCard ? isInvoicing ? <OrderCard orders={orders} customerInvoicing={customerInvoicing} customerId={customerId} /> :
                    isDriverPay ? dateGroups.map(({ date, orders: dateOrders }) => (<OrderCard key={date} date={date} orders={dateOrders} driver={{ driver_id, driver_number: accountNumber }} onApprove={onApprove} />))
                        : isCompanyGroup ? <OrderCard days={orders} driverDetails={driverDetails} /> :
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