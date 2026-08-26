import React, { useTransition } from 'react'
import { Box, Button, CircularProgress, Grid, MenuItem, Pagination, Select } from '@mui/material'
import { MainLayout } from '../../layouts'
import { FilterPayDriverCommission, SideMenu, CustomerBillingGroup, DrawerForm, DriverClockHistory } from '../../components'
import { ReceiptLongRounded, UnfoldLessRounded, UnfoldMoreRounded } from '@mui/icons-material'
import useStyles from './DriverPay.styles'
import DriverHourlyCard from './DriverHourlyCard'
import { useHourlyDrivers } from '../../hooks/useBillings'
import DriverTripDetailsTable from './DriverHourlyDetails'
import { useSnackbar } from 'notistack'

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DriverPayHourly() {

    const { classes, cx } = useStyles()
    const groupApis = React.useRef(new Map());
    const refCallbackCache = React.useRef(new Map())
    const orderRef = React.useRef()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [appliedFilters, setAppliedFilters] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const { data: driverPays, isLoading, isFetching, isError, error } = useHourlyDrivers(appliedFilters, page, rowsPerPage)
    const data = driverPays?.data || []
    console.log(data);
    const pageCount = Math.max(1, Math.ceil(data?.length / rowsPerPage));

    const handleSearch = React.useCallback((filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setPage(1);
        });
    }, []);

    const getGroupRef = React.useCallback((id) => {
        if (!refCallbackCache.current.has(id)) {
            refCallbackCache.current.set(id, (el) => {
                if (el) groupApis.current.set(id, el);
                else groupApis.current.delete(id);
            });
        }
        return refCallbackCache.current.get(id);
    }, []);

    const handleExpandAll = React.useCallback(() => {
        groupApis.current.forEach((api) => api.expand());
    }, []);

    const handleCollapseAll = React.useCallback(() => {
        groupApis.current.forEach((api) => api.collapse());
    }, []);

    const handlePageChange = React.useCallback((_, newPage) => setPage(newPage), []);

    const handleRowsPerPageChange = React.useCallback((count) => {
        setRowsPerPage(count);
        setPage(1);
    }, []);


    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <MainLayout
            title='Driver Pay Hourly'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Hourly' }}
            grid noPanding
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterPayDriverCommission onSearch={handleSearch} isHourly defaultExpanded />
                </Grid>
                <Grid size={12}>
                    {data.length > 0 && (
                        <Box className={classes.toolbarRow}>
                            <Button className={classes.toolbarButton} color="inherit" startIcon={<UnfoldMoreRounded sx={{ fontSize: 16 }} />} onClick={handleExpandAll}>
                                Expand All
                            </Button>
                            <Button className={classes.toolbarButton} color="inherit" startIcon={<UnfoldLessRounded sx={{ fontSize: 16 }} />} onClick={handleCollapseAll}>
                                Collapse All
                            </Button>
                        </Box>
                    )}
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
                                    {data.map((group) => (
                                        <CustomerBillingGroup
                                            key={group.driver_id}
                                            driver_id={group.driver_id}
                                            driverDetails={{
                                                driver_id: group.driver_id,
                                                hourly_rate: group.hourly_rate,
                                                rate_per_km: group.rate_per_km,
                                                mileage_allotment: group.mileage_allotment,
                                                fuel_surcharge_type: group.fuel_surcharge_type
                                            }}
                                            orderRef={orderRef}
                                            customerId={group.driver_id}
                                            ref={getGroupRef(group.driver_id)}
                                            customerName={group.driver_name}
                                            accountNumber={group.driver_number}
                                            orders={group.days}
                                            openCharges={(nb) => setOpenModal(nb)}
                                            OrderCard={DriverHourlyCard}
                                            isHourly
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
                                    <span>· {data.length} Driver{data.length !== 1 ? 's' : ''} total</span>
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
            {openModal === 1 &&
                <DrawerForm title='Driver Details' open={openModal === 1} setOpen={setOpenModal}>
                    <DriverTripDetailsTable driverId={orderRef.current} filters={appliedFilters} />
                </DrawerForm>
            }

            {openModal === 2 &&
                <DrawerForm title='Driver History' open={openModal === 2} setOpen={setOpenModal}>
                    <DriverClockHistory driverId={orderRef.current} filters={appliedFilters} />
                </DrawerForm>
            }
        </MainLayout>
    )

}