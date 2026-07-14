import React, { useState, useMemo, useCallback, useTransition, useRef } from 'react';
import { Box, MenuItem, Select, CircularProgress, Pagination, Button, Grid } from '@mui/material';
import { ReceiptLongRounded, UnfoldMoreRounded, UnfoldLessRounded, RequestQuote } from '@mui/icons-material';
import { MainLayout } from '../../layouts';
import { CustomTitle, DrawerForm, SideMenu } from '../../components';
import useStyles from './Billing.styles';
import BillingFilterBar from './BillingFilterBar';
import CustomerBillingGroup from './CustomerBillingGroup';
import { useBillings } from '../../hooks/useBillings';
import AccessorialCharges from './CustomerAccessorials'

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function BillingView() {

    const { classes } = useStyles();
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPending, startTransition] = useTransition();
    const orderRef = React.useRef()
    const [openDrawer, setOpenDrawer] = React.useState(false)

    const { data = [], isLoading } = useBillings()

    const groupApis = useRef(new Map());
    const refCallbackCache = useRef(new Map());

    const getGroupRef = useCallback((id) => {
        if (!refCallbackCache.current.has(id)) {
            refCallbackCache.current.set(id, (el) => {
                if (el) groupApis.current.set(id, el);
                else groupApis.current.delete(id);
            });
        }
        return refCallbackCache.current.get(id);
    }, []);

    const pageCount = Math.max(1, Math.ceil(data?.length / rowsPerPage));

    const pageGroups = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, page, rowsPerPage]);

    const handleSearch = useCallback((filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setPage(1);
        });
    }, []);

    const handlePageChange = useCallback((_, newPage) => setPage(newPage), []);
    const handleRowsPerPageChange = useCallback((count) => {
        setRowsPerPage(count);
        setPage(1);
    }, []);

    const handleExpandAll = useCallback(() => {
        groupApis.current.forEach((api) => api.expand());
    }, []);
    const handleCollapseAll = useCallback(() => {
        groupApis.current.forEach((api) => api.collapse());
    }, []);

    const handleApprovalChange = useCallback(() => {
    }, []);

    const handleOpenCharges = useCallback(() => {
        setOpenDrawer(true)
    }, []);

    return (
        <MainLayout
            title="Billing"
            activeDrawer={{ active: 'Billing' }}
            sideMenu={SideMenu}
        >
            <Grid container spacing={2} sx={{ overflow: 'auto' }}>
                <Grid size={12}>
                    <BillingFilterBar onSearch={handleSearch} />
                </Grid>
                <Grid size={12}>
                    {pageGroups.length > 0 && (
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
                {isLoading ? <Grid container component={Box} justifyContent={'center'} width={'100%'} py={15}>
                    <CircularProgress />
                </Grid>
                    :
                    <>
                        <Grid size={12}>
                            {data && data?.length === 0 ? (
                                <Box className={classes.emptyState}>
                                    <ReceiptLongRounded sx={{ fontSize: 48, opacity: 0.35, mb: 1 }} />
                                    <Box sx={{ fontWeight: 700 }}>No orders match your filters</Box>
                                    <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword.</Box>
                                </Box>
                            ) : (
                                <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                    {data.map((group) => (
                                        <CustomerBillingGroup
                                            key={group.customer_id}
                                            orderRef={orderRef}
                                            customerId={group.customer_id}
                                            ref={getGroupRef(group.customer_id)}
                                            customerName={group.customer_name}
                                            accountNumber={group.customer_account_number}
                                            orders={group.orders}
                                            openCharges={handleOpenCharges}
                                            onApprovalChange={handleApprovalChange}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                        <Grid size={12}>
                            <Box className={classes.paginationBar}>
                                <Box className={classes.paginationInfo}>
                                    {isPending && <CircularProgress size={13} />}
                                    Customers per page
                                    <Select
                                        size="small" value={rowsPerPage}
                                        className={classes.rowsPerPageSelect}
                                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((n) => <MenuItem key={n} value={n} sx={{ fontSize: 12.5 }}>{n}</MenuItem>)}
                                    </Select>
                                    <span>· {data.length} Customer{data.length !== 1 ? 's' : ''} total</span>
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
            {openDrawer &&
                <DrawerForm customTitle={<CustomTitle title='Customer Accessorials Charges' Icon={RequestQuote} />} setOpen={setOpenDrawer} open={openDrawer}>
                    <AccessorialCharges
                        order={orderRef.current}
                        onClose={() => setOpenDrawer(false)}
                    />
                </DrawerForm>
            }
        </MainLayout>
    );
}