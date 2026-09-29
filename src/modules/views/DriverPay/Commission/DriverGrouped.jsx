import React, { forwardRef, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, IconButton } from '@mui/material';
import { ExpandMoreRounded, AddCardRounded, EditRounded, DeleteOutlineRounded, ReceiptLongRounded } from '@mui/icons-material';
import { DrawerForm } from '../../../components';
import ExtraChargeForm from '../Hourly/ExtraChargeForm';
import useStyles from './Commission.styles';
import DateGroupedSummary from './DateGroupedSummary';
import moment from 'moment';
import { useBillingMutation } from '../../../hooks/useBillings';

const DriverGrouped = forwardRef(({ driverId, driverName, driverNumber, orders = [], extraCharges = [] }, ref) => {

    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(true);
    const [openDrawer, setOpenDrawer] = useState(false);
    const extraChargeRef = React.useRef()

    const { deleteExtraDriverCharge, addExtraDriverCharge, updateExtraDriverCharge } = useBillingMutation()

    const handleChange = useCallback(() => setExpanded((prev) => !prev), []);

    React.useImperativeHandle(ref, () => ({
        expand: () => setExpanded(true),
        collapse: () => setExpanded(false),
    }), []);

    const handleOpenDrawer = useCallback((e, nb) => {
        e.stopPropagation();
        setOpenDrawer(nb);
    }, []);

    const handleRemoveCharge = async (e, id) => {
        e.preventDefault()
        await deleteExtraDriverCharge.mutateAsync({ id, did: driverId })
    }

    const totalExtra = extraCharges.reduce((sum, it) => sum + (Number(it.price) || 0), 0);

    const dateGroups = React.useMemo(() => {
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
    }, [orders]);


    return (
        <Accordion className={classes.accordionRoot} expanded={expanded} onChange={handleChange} disableGutters TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreRounded />}>
                <Box className={classes.accordionSummaryContent}>
                    <Box className={classes.customerIdentity}>
                        <Box className={classes.customerName}>{driverName}</Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {<Box className={classes.customerMeta}>{driverNumber}</Box>}.
                            <Box className={classes.customerMeta}>{orders.length} Order{orders.length !== 1 ? 's' : ''}</Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            component="span" role="button" tabIndex={0}
                            className={cx(classes.extraButton, classes.btnAccordion)}
                            onClick={(e) => handleOpenDrawer(e, 1)}
                        >
                            <AddCardRounded sx={{ fontSize: 15 }} />
                            Add Extra Charge
                        </Box>
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                {extraCharges.length > 0 && (
                    <Box className={classes.extraChargesWrap}>
                        <Box className={classes.extraChargesHeader}>
                            <Box className={classes.extraChargesHeaderLeft}>
                                <Box className={classes.extraChargesIconBadge}>
                                    <ReceiptLongRounded sx={{ fontSize: 16 }} />
                                </Box>
                                <Box>
                                    <Typography className={classes.extraChargesTitle}>Extra Charges</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.extraChargesTotalPill}>
                                <Typography className={classes.extraChargesTotalLabel}>Total</Typography>
                                <Typography className={classes.extraChargesTotalValue}>${totalExtra.toFixed(2)}</Typography>
                            </Box>
                        </Box>
                        <Box className={classes.extraChargesList}>
                            {extraCharges.map((item, idx) => (
                                <Box key={item.id} className={classes.extraChargeCard}>
                                    <Box className={classes.extraChargeContent}>
                                        <Typography className={classes.extraChargeNote}>{item.note}</Typography>
                                    </Box>
                                    <Typography className={classes.extraChargePrice}>
                                        ${Number(item.price).toFixed(2)}
                                    </Typography>
                                    <Box className={classes.extraChargeActions}>
                                        <IconButton size="small" className={classes.extraChargeActionBtn} onClick={(e) => { extraChargeRef.current = item; handleOpenDrawer(e, 2) }}>
                                            <EditRounded sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            className={cx(classes.extraChargeActionBtn, classes.extraChargeDeleteBtn)}
                                            onClick={async (e) => handleRemoveCharge(e, item.id)}
                                        >
                                            <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {
                        dateGroups.map(({ date, orders: dateOrders }) => (
                            <DateGroupedSummary
                                key={date}
                                date={date}
                                orders={dateOrders}
                                driver={{ driver_id: driverId, driver_number: driverNumber }}
                            />))
                    }
                </Box>
            </AccordionDetails>
            {openDrawer === 1 &&
                <DrawerForm title={`Add Extra Charges — ${driverName}`} open={openDrawer === 1} setOpen={setOpenDrawer}>
                    <ExtraChargeForm
                        companyId={driverId}
                        isDriverCharge
                        initialValues={{}}
                        onSave={async (dt) => await addExtraDriverCharge.mutateAsync(dt)}
                        onClose={() => setOpenDrawer(false)}
                    />
                </DrawerForm>
            }

            {openDrawer === 2 &&
                <DrawerForm title={`Edit Extra Charges — ${driverName}`} open={openDrawer === 2} setOpen={setOpenDrawer}>
                    <ExtraChargeForm
                        companyId={driverId}
                        isDriverCharge
                        initialValues={{ ...extraChargeRef.current }}
                        onSave={async (dt) => {
                            await updateExtraDriverCharge.mutateAsync({ id: extraChargeRef.current.id, payload: dt })
                            extraChargeRef.current = null
                        }}
                        onClose={() => setOpenDrawer(false)}
                    />
                </DrawerForm>
            }
        </Accordion>
    );
});

DriverGrouped.displayName = 'DriverGrouped';
export default DriverGrouped;