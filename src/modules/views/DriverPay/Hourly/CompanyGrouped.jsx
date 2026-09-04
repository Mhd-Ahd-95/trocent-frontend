import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, IconButton } from '@mui/material';
import { ExpandMoreRounded, AddCardRounded, EditRounded, DeleteOutlineRounded, ReceiptLongRounded, Download } from '@mui/icons-material';
import { DrawerForm, DriverClockHistory } from '../../../components';
import ExtraChargeForm from './ExtraChargeForm';
import useStyles from './Hourly.styles';
import DriverHourlyCard from './DriverHourlyCard'
import DriverTripDetailsTable from './DriverHourlyDetails';
import { useBillingMutation } from '../../../hooks/useBillings';

const CompanyGrouped = forwardRef(({ companyId, companyName, legalName, drivers = [], appliedFilters = {}, extraCharges = [], downloadExcel }, ref) => {

    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const driverRef = React.useRef()
    const extraChargeRef = React.useRef()
    const { addExtraCharge, updateExtraCharge, deleteExtraCharge } = useBillingMutation()

    useImperativeHandle(ref, () => ({
        expand: () => setExpanded(true),
        collapse: () => setExpanded(false),
    }), []);

    const handleChange = useCallback(() => setExpanded((prev) => !prev), []);

    const handleOpenDrawer = useCallback((e, nb) => {
        e.stopPropagation();
        setDrawerOpen(nb);
    }, []);

    const handleRemoveCharge = async (e, id) => {
        e.preventDefault()
        await deleteExtraCharge.mutateAsync({ id, cid: companyId })
    }

    const totalExtra = extraCharges.reduce((sum, it) => sum + (Number(it.price) || 0), 0);

    return (
        <Accordion className={classes.accordionRoot} expanded={expanded} onChange={handleChange} disableGutters TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreRounded />}>
                <Box className={classes.accordionSummaryContent}>
                    <Box className={classes.customerIdentity}>
                        <Box className={classes.customerName}>{companyName}</Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {legalName && (<Box className={classes.customerMeta}>{legalName}</Box>)}.
                            <Box className={classes.customerMeta}>{drivers.length} driver{drivers.length !== 1 ? 's' : ''}</Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            component="span" role="button" tabIndex={0}
                            className={cx(classes.detailsButton, classes.btnAccordion)}
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                downloadExcel()
                            }}
                        >
                            <Download sx={{ fontSize: 15 }} />
                            Download Drivers Report
                        </Box>
                        <Box
                            component="span" role="button" tabIndex={0}
                            className={cx(classes.extraButton, classes.btnAccordion)}
                            onClick={(e) => handleOpenDrawer(e, 3)}
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
                                        <IconButton size="small" className={classes.extraChargeActionBtn} onClick={(e) => { extraChargeRef.current = item; handleOpenDrawer(e, 4) }}>
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
                    {drivers.map((driver) => (
                        <DriverHourlyCard
                            key={driver.driver_id}
                            driverId={driver.driver_id}
                            driverName={driver.driver_name}
                            driverNumber={driver.driver_number}
                            days={driver.days}
                            driverRef={driverRef}
                            openModal={(nb) => setDrawerOpen(nb)}
                            driverDetails={{
                                driver_id: driver.driver_id,
                                hourly_rate: driver.hourly_rate,
                                rate_per_km: driver.rate_per_km,
                                mileage_allotment: driver.mileage_allotment,
                                fuel_surcharge_type: driver.fuel_surcharge_type,
                                company_id: companyId
                            }}
                        />
                    ))}
                </Box>
            </AccordionDetails>
            {drawerOpen === 3 &&
                <DrawerForm title={`Add Extra Charges — ${companyName}`} open={drawerOpen === 3} setOpen={setDrawerOpen}>
                    <ExtraChargeForm
                        companyId={companyId}
                        initialValues={{}}
                        onSave={async (dt) => await addExtraCharge.mutateAsync(dt)}
                        onClose={() => setDrawerOpen(false)}
                    />
                </DrawerForm>
            }

            {drawerOpen === 4 &&
                <DrawerForm title={`Edit Extra Charges — ${companyName}`} open={drawerOpen === 4} setOpen={setDrawerOpen}>
                    <ExtraChargeForm
                        companyId={companyId}
                        initialValues={extraChargeRef.current}
                        onSave={async (dt) => {
                            await updateExtraCharge.mutateAsync({ id: extraChargeRef.current.id, payload: dt })
                            extraChargeRef.current = null
                        }}
                        onClose={() => setDrawerOpen(false)}
                    />
                </DrawerForm>
            }

            {drawerOpen === 1 &&
                <DrawerForm title='Driver Details' open={drawerOpen === 1} setOpen={setDrawerOpen}>
                    <DriverTripDetailsTable driverId={driverRef.current} filters={appliedFilters} />
                </DrawerForm>
            }
            {drawerOpen === 2 &&
                <DrawerForm title='Driver History' open={drawerOpen === 2} setOpen={setDrawerOpen}>
                    <DriverClockHistory driverId={driverRef.current} filters={appliedFilters} />
                </DrawerForm>
            }
        </Accordion>
    );
});

CompanyGrouped.displayName = 'CompanyGrouped';
export default CompanyGrouped;