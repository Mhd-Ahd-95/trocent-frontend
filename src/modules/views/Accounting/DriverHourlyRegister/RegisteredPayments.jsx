import React, { useTransition, useState, useCallback, useMemo, useEffect } from "react";
import { Box, CircularProgress, Grid, Pagination, Select, Typography, MenuItem, Checkbox, Button } from "@mui/material";
import { Breadcrumbs, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegisterBatch from "../Filterbar/FilterbarBatchStatus";
import useStyles from './Driver.styles'
import { useSnackbar } from "notistack";
import { useBillingMutation, useDriverPayHourlyRegistered } from "../../../hooks/useBillings";
import { ReceiptLongRounded, ForwardToInboxRounded } from "@mui/icons-material";
import RegisteredPaymentRow from "./RegisteredPaymentRow";
import { useDispatchScreenSync } from "../../../hooks/useDispatchScreenSync";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function RegisteredPayments() {

    useDispatchScreenSync()
    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const { resendCompaniesInvoice } = useBillingMutation()

    const { data: registeredCompanies, isLoading, isFetching, isError, error } = useDriverPayHourlyRegistered(appliedFilters, page, rowsPerPage)
    const data = registeredCompanies?.data || []
    const total = registeredCompanies?.total || 0

    const pageCount = Math.max(1, registeredCompanies?.lastPage || 1);

    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const allSelected = data.length > 0 && selectedIds.size === data.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    const handleSearch = (filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setPage(1);
        });
    }

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

    const toggleRowSelected = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const handleToggleSelectAll = useCallback(() => {
        setSelectedIds(prev => (prev.size === data.length ? new Set() : new Set(data.map(c => c.id))));
    }, [data]);

    const handleResendInvoices = async (e) => {
        e.preventDefault()
        const ids = Array.from(selectedIds);
        if (ids.length === 0) {
            enqueueSnackbar('Please select at least one company before resending invoices.', { variant: 'warning' })
            return
        }
        const payload = { register_ids: ids }
        await resendCompaniesInvoice.mutateAsync(payload)
        setSelectedIds(new Set())
    }

    return (
        <MainLayout
            title='Registered Payments'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Driver Hourly Register' }}
            grid
            breadcrumbs={
                <Breadcrumbs
                    items={[
                        { text: 'Driver Pay Hourly Register', url: '/accounting/driver-hourly-register' },
                        { text: 'Batch Status' }
                    ]}
                />
            }
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegisterBatch
                        EMPTY_FILTERS={{ payDateFrom: '', payDateTo: '', batch_number: '', keyword: '', quickFilter: 'today' }}
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
                                    {selectedIds.size > 0 ? `${selectedIds.size} of ${data.length} selected` : `Select all (${data.length})`}
                                </Typography>
                            </Box>
                            {selectedIds.size > 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={resendCompaniesInvoice.isPending ? <CircularProgress size={18} color="inherit" /> : <ForwardToInboxRounded sx={{ fontSize: 18 }} />}
                                    onClick={handleResendInvoices}
                                    sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                                    disabled={resendCompaniesInvoice.isPending}
                                >
                                    Re-send Invoices
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
                                    <Box sx={{ fontWeight: 700 }}>No registered payments match your filters</Box>
                                    <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword or batch number.</Box>
                                </Box>
                            ) : (
                                <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                    {data.map((row) => (
                                        <RegisteredPaymentRow
                                            key={row.id}
                                            row={row}
                                            selected={selectedIds.has(row.id)}
                                            onToggleSelect={toggleRowSelected}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                        <Grid size={12}>
                            <Box className={classes.paginationBar}>
                                <Box className={classes.paginationInfo}>
                                    {isPending && <CircularProgress size={13} />}
                                    Companies per page
                                    <Select
                                        size="small" value={rowsPerPage}
                                        className={classes.rowsPerPageSelect}
                                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((n) => <MenuItem key={n} value={n} sx={{ fontSize: 12.5 }}>{n}</MenuItem>)}
                                    </Select>
                                    <span>· {total ?? 0} Compan{total !== 1 ? 'ies' : 'y'} total</span>
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
        </MainLayout>
    )

}