import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, CircularProgress, Checkbox, IconButton } from '@mui/material';
import { CreditCardOutlined, Download, ExpandMoreRounded } from '@mui/icons-material';
import useStyles from './Filter.styles';
import moment from 'moment';

const CustomerBillingGroup = React.memo(forwardRef(({ customerName, customerInvoicing, accountNumber, orders = [], orderRef, openCharges, OrderCard, isInvoicing = false,
    customerId, driver_id, hourlyRegister = false, company, downloadPDF, downloading, selected, onToggleSelect, commissionRegister }, ref) => {

    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(true);

    useImperativeHandle(ref, () => ({
        expand: () => setExpanded(true),
        collapse: () => setExpanded(false),
    }), []);

    const handleChange = useCallback(() => setExpanded((prev) => !prev), []);

    const handleCharge = (order, nb) => {
        orderRef.current = order
        openCharges(nb)
    }

    const handleInterliner = (order) => {
        orderRef.current = order
        openCharges(2)
    }

    const handleToggleSelect = useCallback((e) => {
        // e.preventDefault();
        e.stopPropagation();
        onToggleSelect?.(company.company_id);
    }, [onToggleSelect, company]);

    const type = hourlyRegister ? 'Driver' : commissionRegister ? 'Day' : 'Order'

    return (
        <Accordion className={classes.accordionRoot} expanded={expanded} onChange={handleChange} disableGutters TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreRounded />}>
                <Box className={classes.accordionSummaryContent}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {hourlyRegister &&
                            <Checkbox
                                checked={selected}
                                size="small"
                                onClick={(e) => e.stopPropagation()}
                                onChange={handleToggleSelect}
                                sx={{ p: 0.5, mr: 0.5 }}
                            />
                        }
                        <Box className={classes.customerIdentity}>
                            <Box className={classes.customerName}>{customerName}</Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box className={classes.customerMeta}>{hourlyRegister ? '' : '#'}{accountNumber}.</Box>
                                <Box className={classes.customerMeta}>
                                    {orders.length} {type}{orders.length !== 1 ? 's' : ''}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {hourlyRegister &&
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <IconButton
                                component="span" role="button" tabIndex={0}
                                disabled={downloading}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (downloading) return
                                    downloadPDF(company)
                                }}
                            >
                                {downloading ? <CircularProgress size={20} /> : <Download sx={{ fontSize: 25 }} color='primary' />}
                            </IconButton>
                            <Box
                                component="span" role="button" tabIndex={0}
                                className={cx(classes.detailsButton, classes.btnAccordion)}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleCharge(company, 1)
                                }}
                            >
                                <CreditCardOutlined sx={{ fontSize: 15 }} />
                                Extra Charges
                            </Box>
                        </Box>
                    }
                    {commissionRegister &&
                        <Box
                            component="span" role="button" tabIndex={0}
                            className={cx(classes.detailsButton, classes.btnAccordion)}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleCharge(company, 1)
                            }}
                        >
                            <CreditCardOutlined sx={{ fontSize: 15 }} />
                            Extra Charges
                        </Box>
                    }
                </Box>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                {OrderCard ? isInvoicing ? <OrderCard orders={orders} customerInvoicing={customerInvoicing} customerId={customerId} />
                    : hourlyRegister ? <OrderCard company={company} drivers={orders} /> : commissionRegister ? <OrderCard totals={orders} driver_id={driver_id} /> :
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
// function arePropsEqual(prev, next) {
//     return (
//         prev.customerName === next.customerName &&
//         prev.accountNumber === next.accountNumber &&
//         prev.orders === next.orders &&
//         prev.company === next.company &&
//         prev.hourlyRegister === next.hourlyRegister &&
//         prev.OrderCard === next.OrderCard &&
//         prev.openCharges === next.openCharges &&
//         prev.downloadPDF === next.downloadPDF &&
//         prev.downloading === next.downloading &&
//         prev.selected === next.selected &&
//         prev.onToggleSelect === next.onToggleSelect
//     );
// }

export default React.memo(CustomerBillingGroup);