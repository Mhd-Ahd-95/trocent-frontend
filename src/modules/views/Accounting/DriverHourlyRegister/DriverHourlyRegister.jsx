import React, { useTransition, useState, useCallback } from "react";
import { Grid, Box, Select, Pagination, MenuItem, CircularProgress, Typography, Checkbox, Button } from "@mui/material";
import { CustomerBillingGroup, DrawerForm, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegister from "../Filterbar/Filterbar";
import { ReceiptLongRounded, PictureAsPdfRounded } from "@mui/icons-material";
import useStyles from './Driver.styles'
import { useApprovedDriverHourlyTotals, useBillingMutation } from "../../../hooks/useBillings";
import { useSnackbar } from "notistack";
import CompanySummary from "./CompanySummary";
import ExtraChargesDisplay from "./ExtraChargeDisplaying";
import DriverPaysApi from "../../../apis/DriverPays.api";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DriverHourlyRegister() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const companyRef = React.useRef()
    const { data: totalDrivers, isLoading, isFetching, isError, error } = useApprovedDriverHourlyTotals(appliedFilters, page, rowsPerPage)
    const data = totalDrivers?.data ?? []
    const [openDrawer, setOpenDrawer] = useState(false)
    const [downloading, setDownloading] = React.useState(false)

    const { batchPayDriverHourlyRegister } = useBillingMutation()
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const meta = totalDrivers?.meta ?? {};
    const pageCount = Math.max(1, meta.lastPage || 1);

    // useEffect(() => {
    //     setSelectedIds(new Set(data.map(c => c.company_id)));
    // }, [data]);

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

    const toggleCompanySelected = useCallback((companyId) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(companyId)) next.delete(companyId);
            else next.add(companyId);
            return next;
        });
    }, []);

    const allSelected = data.length > 0 && selectedIds.size === data.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    const handleToggleSelectAll = useCallback(() => {
        setSelectedIds(prev => (prev.size === data.length ? new Set() : new Set(data.map(c => c.company_id))));
    }, [data]);

    // const selectedCompanies = useMemo(
    //     () => data.filter(c => selectedIds.has(c.company_id)),
    //     [data, selectedIds]
    // );

    const handleBulkGeneratePdf = async (e) => {
        e.preventDefault()
        const selectedCompanies = data.filter(c => selectedIds.has(c.company_id))
        const payload = selectedCompanies.map(company => ({
            company_id: company.company_id,
            driver_pay_totals_ids: company.drivers.map(d => d.driver_pay_totals_id),
        }))
        await batchPayDriverHourlyRegister.mutateAsync(payload)
    }

    const downloadPDF = async (company) => {
        setDownloading(true)
        try {
            const payload = {
                company_id: company.company_id,
                driver_pay_totals_ids: company.drivers.map(d => d.driver_pay_totals_id)
            }
            await DriverPaysApi.downloadCompanyInvoice(payload)
        }
        catch (err) {

        }
        finally { setDownloading(false) }
    }

    const navigate = useNavigate()

    return (
        <MainLayout
            title='Driver Pay Hourly Register'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Driver Hourly Register' }}
            button
            btnProps={{ label: 'Hourly Invoices', onClick: () => navigate('/accounting/driver-hourly-registered'), icon: <ReceiptLongRounded /> }}
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegister
                        EMPTY_FILTERS={{ approvedDateFrom: '', approvedDateTo: '', keyword: '' }}
                        onSearch={handleSearch}
                    />
                </Grid>

                {!isLoading && !isFetching && data.length > 0 && (
                    <Grid size={12}>
                        <Box className={classes.selectionBar}>
                            <Box className={classes.selectionBarLeft}>
                                <Checkbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={handleToggleSelectAll}
                                    size="small"
                                />
                                <Typography className={classes.selectionBarText}>
                                    {selectedIds.size > 0
                                        ? `${selectedIds.size} of ${data.length} selected`
                                        : `Select all (${data.length})`}
                                </Typography>
                            </Box>
                            {selectedIds.size > 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={batchPayDriverHourlyRegister.isPending ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdfRounded sx={{ fontSize: 18 }} />}
                                    onClick={handleBulkGeneratePdf}
                                    sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                                    disabled={batchPayDriverHourlyRegister.isPending}
                                >
                                    Generate PDF ({selectedIds.size})
                                </Button>
                            )}
                        </Box>
                    </Grid>
                )}

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
                                            key={group.company_id}
                                            customerName={group.operating_name}
                                            accountNumber={group.legal_name}
                                            orders={group.drivers}
                                            hourlyRegister
                                            company={group}
                                            orderRef={companyRef}
                                            openCharges={(nb) => setOpenDrawer(nb)}
                                            OrderCard={CompanySummary}
                                            downloadPDF={downloadPDF}
                                            downloading={downloading}
                                            selected={selectedIds.has(group.company_id)}
                                            onToggleSelect={toggleCompanySelected}
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
                                <Typography className={classes.extraChargesTitle}>Extra Charges — {companyRef.current?.operating_name} </Typography>
                                <Typography className={classes.extraChargesSubtitle}>
                                    {companyRef.current?.extra_charges.length || 0} item{companyRef.current?.extra_charges.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        </Box>}
                    open={openDrawer === 1}
                    setOpen={setOpenDrawer}
                >
                    <ExtraChargesDisplay
                        companyId={companyRef.current?.company_id}
                        extraCharges={companyRef.current?.extra_charges ?? []}
                        onClose={() => setOpenDrawer(false)}
                    />
                </DrawerForm>
            }
        </MainLayout>
    )

}