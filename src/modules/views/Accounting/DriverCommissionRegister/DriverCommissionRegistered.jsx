import React, { useTransition, useState, useCallback } from "react";
import { Box, CircularProgress, Grid, Pagination, Select, MenuItem } from "@mui/material";
import { Breadcrumbs, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegisterBatch from "../Filterbar/FilterbarBatchStatus";
import useStyles from './Driver.styles'
import { useSnackbar } from "notistack";
import { useDriverPayCommissionRegistered } from "../../../hooks/useBillings";
import { ReceiptLongRounded } from "@mui/icons-material";
import DriverCommissionRegisterRow from "./DriverCommissionRegisterRow";
import DriverPaysApi from "../../../apis/DriverPays.api";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DriverCommissionRegistered() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [appliedFilters, setAppliedFilters] = useState({ payDateFrom: '', payDateTo: '', batch_number: '', keyword: '', quickFilter: 'today' });


    const { data: registered, isLoading, isFetching, isError, error } = useDriverPayCommissionRegistered(appliedFilters, page, rowsPerPage)
    const data = registered?.data || []
    const total = registered?.total || 0
    const pageCount = Math.max(1, registered?.lastPage || 1);

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

    return (
        <MainLayout
            title='Driver Commission Invoices'
            sideMenu={SideMenu}
            grid
            activeDrawer={{ active: 'Driver Commission Register' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[
                        { text: 'Driver Commission Register', url: '/accounting/driver-commission-register' },
                        { text: 'Invoice Register' }
                    ]}
                />
            }
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegisterBatch
                        EMPTY_FILTERS={{ payDateFrom: '', payDateTo: '', batch_number: '', keyword: '', quickFilter: 'today' }}
                        onSearch={handleSearch}
                        commissionRegistered
                    />
                </Grid>
                {isLoading || isFetching ? <Grid container component={Box} justifyContent={'center'} width={'100%'} py={15}>
                    <CircularProgress />
                </Grid>
                    :
                    <>
                        <Grid size={12}>
                            {data.length === 0 ? (
                                <Box className={classes.emptyState}>
                                    <ReceiptLongRounded sx={{ fontSize: 48, opacity: 0.35, mb: 1 }} />
                                    <Box sx={{ fontWeight: 700 }}>No commission invoices match your filters</Box>
                                    <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword or batch number.</Box>
                                </Box>
                            ) : (
                                <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                    {data.map((register) => (
                                        <DriverCommissionRegisterRow
                                            key={register.id}
                                            register={register}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                        <Grid size={12}>
                            <Box className={classes.paginationBar}>
                                <Box className={classes.paginationInfo}>
                                    {isPending && <CircularProgress size={13} />}
                                    Invoices per page
                                    <Select
                                        size="small" value={rowsPerPage}
                                        className={classes.rowsPerPageSelect}
                                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((n) => <MenuItem key={n} value={n} sx={{ fontSize: 12.5 }}>{n}</MenuItem>)}
                                    </Select>
                                    <span>· {total ?? 0} Invoice{total !== 1 ? 's' : ''} total</span>
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