import React, { useTransition, useState, useCallback } from "react";
import { Grid, Box, Select, Pagination, MenuItem, CircularProgress, Typography } from "@mui/material";
import { ConfirmModal, CustomerBillingGroup, DrawerForm, Modal, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegister from "../Filterbar/Filterbar";
import { ReceiptLongRounded, SettingsPowerRounded } from "@mui/icons-material";
import useStyles from './Driver.styles'
import { useBillingMutation, useDriverPayCommissionApproved } from "../../../hooks/useBillings";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import DriverTotals from "./DriverTotals";
import ExtraChargesDisplay from "../DriverHourlyRegister/ExtraChargeDisplaying";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DriverCommissionRegister() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false)
    const { data: drivers, isLoading, isFetching, isError, error } = useDriverPayCommissionApproved(appliedFilters, page, rowsPerPage)
    const driverRef = React.useRef()
    const extraChargeRef = React.useRef()
    const data = drivers?.data ?? []
    const { deleteExtraDriverCharge } = useBillingMutation()
    const [openModal, setOpenModal] = React.useState(false)

    const meta = drivers?.meta ?? {};
    const pageCount = Math.max(1, meta.lastPage || 1);


    const handleSearch = useCallback((filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setPage(1);
        });
    }, []);

    const handleRowsPerPageChange = useCallback((count) => {
        setRowsPerPage(count);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((_, newPage) => setPage(newPage), []);

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    const navigate = useNavigate()

    return (
        <MainLayout
            title='Driver Pay Commission Register'
            sideMenu={SideMenu}
            grid
            activeDrawer={{ active: 'Driver Commission Register' }}
            button
            btnProps={{ label: 'Commission Invoices', onClick: () => navigate('/accounting/driver-commission-registered'), icon: <ReceiptLongRounded /> }}
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegister
                        EMPTY_FILTERS={{ approvedDateFrom: '', approvedDateTo: '', keyword: '' }}
                        onSearch={handleSearch}
                    />
                </Grid>

                {isLoading || isFetching ? <Grid container component={Box} justifyContent={'center'} width={'100%'} py={15}>
                    <CircularProgress />
                </Grid>
                    :
                    <>
                        <Grid size={12}>
                            {data && data?.length === 0 ? (
                                <Box className={classes.emptyState}>
                                    <ReceiptLongRounded sx={{ fontSize: 48, opacity: 0.35, mb: 1 }} />
                                    <Box sx={{ fontWeight: 700 }}>No Drivers match your filters</Box>
                                    <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword.</Box>
                                </Box>
                            ) : (
                                <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                    {data.map((driver) => (
                                        <CustomerBillingGroup
                                            key={driver.driver_id}
                                            driver_id={driver.driver_id}
                                            customerName={driver.driver_name}
                                            accountNumber={driver.driver_number}
                                            orders={driver.totals}
                                            company={driver}
                                            orderRef={driverRef}
                                            commissionRegister
                                            openCharges={(nb) => setOpenDrawer(nb)}
                                            OrderCard={(props) => <DriverTotals {...props} extra_charges={driver.extra_charges} />}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                        <Grid size={12}>
                            <Box className={classes.paginationBar}>
                                <Box className={classes.paginationInfo}>
                                    {isPending && <CircularProgress size={13} />}
                                    Drivers per page
                                    <Select
                                        size="small" value={rowsPerPage}
                                        className={classes.rowsPerPageSelect}
                                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((n) => <MenuItem key={n} value={n} sx={{ fontSize: 12.5 }}>{n}</MenuItem>)}
                                    </Select>
                                    <span>· {meta.total ?? 0} Driver{meta.total !== 1 ? 's' : ''} total</span>
                                </Box>
                                <Pagination
                                    className={classes.muiPaginationRoot}
                                    count={pageCount}
                                    page={page}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    color="primary"
                                    siblingCount={1}
                                />
                            </Box>
                        </Grid>
                    </>
                }
            </Grid>
            {openDrawer === 1 &&
                <DrawerForm
                    customTitle={
                        <Box className={classes.extraChargesHeaderLeft}>
                            <Box className={classes.extraChargesIconBadge}>
                                <ReceiptLongRounded sx={{ fontSize: 16 }} />
                            </Box>
                            <Box>
                                <Typography className={classes.extraChargesTitle}>Extra Charges — {driverRef.current?.driver_name} </Typography>
                                <Typography className={classes.extraChargesSubtitle}>
                                    {driverRef.current?.extra_charges.length || 0} item{driverRef.current?.extra_charges.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        </Box>}
                    open={openDrawer === 1}
                    setOpen={setOpenDrawer}
                >
                    <ExtraChargesDisplay
                        companyId={driverRef.current?.driver_id}
                        extraChargeRef={extraChargeRef}
                        openModal={() => setOpenModal(true)}
                        extraCharges={driverRef.current?.extra_charges ?? []}
                        onClose={() => setOpenDrawer(false)}
                        isDriverCharge
                    />
                </DrawerForm>
            }
            <Modal open={openModal} handleClose={() => setOpenModal(false)}>
                <ConfirmModal
                    title={
                        <>
                            Delete Extra Charge {' '}
                            <strong style={{ fontSize: 15, paddingInline: 5 }}>"{extraChargeRef.current?.note}"</strong>
                        </>
                    }
                    subtitle='Are you sure you want to continue?'
                    handleClose={() => setOpenModal(false)}
                    handleSubmit={async () => {
                        await deleteExtraDriverCharge.mutateAsync({ id: extraChargeRef.current?.id, did: extraChargeRef.current?.driver_id })
                        setOpenDrawer(false)
                    }}
                />
            </Modal>
        </MainLayout>
    )

}