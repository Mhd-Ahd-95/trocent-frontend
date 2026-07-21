import React, { useTransition } from "react";
import { MainLayout } from '../../layouts'
import { SideMenu, BillingFilterBar, CustomerBillingGroup } from "../../components";
import { Box, Button, CircularProgress, Grid, MenuItem, Pagination, Select } from "@mui/material";
import useStyles from './Invoicing.styles'
import { UnfoldMoreRounded, UnfoldLessRounded, ReceiptLongRounded } from '@mui/icons-material';
import OrderInvoicingCard from "./OrderInvoicingCard";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const data = [
    {
        customer_id: 1,
        customer_name: 'IAM INC',
        customer_account_number: 'ACC1003',
        orders: [
            {
                id: 1179922,
                order_number: '1179922',
                reference_numbers: 'CAS->FN QCPO006487 / BK533343',
                delivery_date: '2026-07-13',
                shipper_city: 'DORVAL',
                receiver_city: 'FARNHAM',
                freight_rate: 250.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 45.00,
                sub_total: 295.00,
                grand_total: 339.18,
            },
            {
                id: 1180928,
                order_number: '1180928',
                reference_numbers: 'OEL->FN PO#63944 / BK528927 / 8473653654 - 15 JUILLET 2026',
                delivery_date: '2026-07-15',
                shipper_city: 'ST LAURENT',
                receiver_city: 'FARNHAM',
                freight_rate: 250.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 0.00,
                sub_total: 250.00,
                grand_total: 287.44,
            },
            {
                id: 1178627,
                order_number: '1178627',
                reference_numbers: 'TRANS JULY 13TH',
                delivery_date: '2026-07-13',
                shipper_city: 'FARNHAM',
                receiver_city: 'ST-LAURENT',
                freight_rate: 450.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 0.00,
                sub_total: 450.00,
                grand_total: 517.39,
            },
            {
                id: 1180972,
                order_number: '1180972',
                reference_numbers: 'LOGIPRO->FN 64183 / SZ0067353 - 15 JUILLET 2026',
                delivery_date: '2026-07-15',
                shipper_city: 'POINTE CLAIRE',
                receiver_city: 'FARNHAM',
                freight_rate: 250.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 118.50,
                sub_total: 368.50,
                grand_total: 423.68,
            },
            {
                id: 1179691,
                order_number: '1179691',
                reference_numbers: 'CANNARA RTV JULY 13TH',
                delivery_date: '2026-07-13',
                shipper_city: 'ST-LAURENT',
                receiver_city: 'FARNHAM',
                freight_rate: 75.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 54.00,
                sub_total: 129.00,
                grand_total: 148.32,
            },
            {
                id: 1179759,
                order_number: '1179759',
                reference_numbers: 'OEL->FN QCPO0006229(27104) 8473654025 - 13 JUILLET 2026',
                delivery_date: '2026-07-13',
                shipper_city: 'ST LAURENT',
                receiver_city: 'FARNHAM',
                freight_rate: 250.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 0.00,
                sub_total: 250.00,
                grand_total: 287.44,
            },
            {
                id: 1179849,
                order_number: '1179849',
                reference_numbers: 'LOT RETURN JULY 14TH',
                delivery_date: '2026-07-14',
                shipper_city: 'ST-LAURENT',
                receiver_city: 'FARNHAM',
                freight_rate: 250.00,
                freight_fuel_surcharge: 0.00,
                total_accessorials: 62.50,
                sub_total: 312.50,
                grand_total: 359.30,
            },
        ]
    }
]

export default function InvoicingView() {

    const { classes, cx } = useStyles()
    const groupApis = React.useRef(new Map());
    const refCallbackCache = React.useRef(new Map())
    const orderRef = React.useRef()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const pageCount = Math.max(1, Math.ceil(data?.length / rowsPerPage));

    const handleSearch = React.useCallback((filters) => {
        // startTransition(() => {
        //     setAppliedFilters(filters);
        //     setPage(1);
        // });
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

    return (
        <MainLayout
            title='Invoicing'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Invoicing' }}
            grid noPanding
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <BillingFilterBar
                        isInvoicing
                        onSearch={handleSearch}
                    />
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
                                    OrderCard={OrderInvoicingCard}
                                    isInvoicing
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
            </Grid>
        </MainLayout>
    )

}