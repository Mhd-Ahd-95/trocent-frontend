import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Chip } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import useStyles from './Billing.styles';
import OrderBillingCard from './OrderBillingCard';

const CustomerBillingGroup = React.memo(forwardRef(({ customerName, accountNumber, orders, onApprovalChange, orderRef, openCharges }, ref) => {

    const { classes } = useStyles();
    const [expanded, setExpanded] = useState(true);

    useImperativeHandle(ref, () => ({
        expand: () => setExpanded(true),
        collapse: () => setExpanded(false),
    }), []);

    const handleChange = useCallback(() => setExpanded((prev) => !prev), []);

    const handleCharge = (order) => {
        orderRef.current = order
        openCharges()
    }

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
                        <Box className={classes.customerMeta}>#{accountNumber}</Box>
                    </Box>
                    <Chip className={classes.orderCountChip} label={`${orders.length} order${orders.length > 1 ? 's' : ''}`} />
                </Box>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                {orders.map((order) => (
                    <OrderBillingCard key={order.order_id} order={order} onApprovalChange={onApprovalChange} handleCharge={handleCharge} />
                ))}
            </AccordionDetails>
        </Accordion>
    );
}));

CustomerBillingGroup.displayName = 'CustomerBillingGroup';
export default CustomerBillingGroup;