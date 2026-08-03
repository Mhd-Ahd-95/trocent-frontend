import React, { useTransition } from 'react'
import { Box, Button, CircularProgress, Grid, MenuItem, Pagination, Select } from '@mui/material'
import { MainLayout } from '../../layouts'
import { FilterPayDriverCommission, SideMenu, CustomerBillingGroup } from '../../components'
import { ReceiptLongRounded, UnfoldLessRounded, UnfoldMoreRounded } from '@mui/icons-material'
import useStyles from './DriverPay.styles'
import DateGroupedSummary from './DateGroupedSummary'

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const driverPays = {
    "data": [
        {
            "customer_id": 101,
            "customer_name": "IAM INC",
            "customer_account_number": "ACC1003",
            "orders": [
                {
                    "order_id": 5001,
                    'driver_payout': 543.75,
                    "customer_id": 101,
                    "create_date": '2026-07-30',
                    "order_number": "1",
                    "service_type": "Regular",
                    "references": "REF123",
                    "shipper_name": "Maple Distribution Ltd.",
                    "shipper_address": "245 Industrial Pkwy",
                    "shipper_no_waiting_time": false,
                    "shipper_city": "Mississauga",
                    "shipper_province": "ON",
                    "shipper_postal_code": "L5T 2N3",
                    "shipper_special_instructions": "Use dock door 4, call ahead 30 min.",
                    "pickup_date": "2026-07-28",
                    "pickup_time_from": "08:00",
                    "pickup_time_to": "12:00",
                    "pickup_in": "08:45",
                    "pickup_out": "09:10",
                    "pickup_driver_assigned": {
                        "id": 12,
                        "driver_number": "D-012",
                        "name": "MATT"
                    },
                    "receiver_name": "Eastview Retail Group",
                    "receiver_no_waiting_time": true,
                    "receiver_address": "78 Harbourfront Blvd",
                    "receiver_city": "Halifax",
                    "receiver_province": "NS",
                    "receiver_postal_code": "B3J 1S9",
                    "receiver_special_instructions": "Deliver to loading bay B, no liftgate needed.",
                    "delivery_date": "2026-07-30",
                    "delivery_time_from": "13:00",
                    "delivery_time_to": "17:00",
                    "delivery_in": '10:00',
                    "delivery_out": '10:20',
                    "delivery_driver_assigned": {
                        "id": 19,
                        "driver_number": "D-019",
                        "name": "JEFFER"
                    },
                    "pickup_driver": {
                        "id": 12,
                        "driver_pay_type": "commission",
                        "commission_percentage": 25,
                        "hourly_rate": null,
                        "rate_per_km": null,
                        "mileage_allotment": null,
                        "fuel_surcharge_type": "percentage"
                    },
                    "delivery_driver": {
                        "id": 19,
                        "driver_pay_type": "hourly",
                        "commission_percentage": null,
                        "hourly_rate": 28.5,
                        "rate_per_km": null,
                        "mileage_allotment": null,
                        "fuel_surcharge_type": "flat"
                    },
                    "freights": [
                        {
                            "id": 9001,
                            "type": "Skid",
                            "pieces": 4,
                            "description": "FAK",
                            "length": 48,
                            "width": 40,
                            "height": 36,
                            "unit": "in",
                            "unit_dim": "lbs"
                        }
                    ],
                    "total_actual_weight": 1250.0,
                    "total_chargeable_weight": 1300.0,
                    "total_pieces_skid": 4,
                    "total_volume_weight": 1180.0,
                    "freight_rate": 0.42,
                    "freight_fuel_surcharge": 62.5,
                    "sub_total": 546.0,
                    "order_notes": [
                        {
                            "id": 301,
                            "note_type": "dispatch",
                            "note": "Customer requested morning delivery only."
                        }
                    ],
                    "accessorials": [
                        {
                            "id": 501,
                            "access_id": 7,
                            "name": "Inside Delivery",
                            "charge_quantity": 1,
                            "charge_amount": 35.0
                        }
                    ],
                    "interliners": [
                        {
                            "id": 701,
                            "name": "AMAZON LOGISTICS",
                            "invoice": "INV-88213",
                            "charge_amount": 120.0,
                            "type": "delivery",
                            "is_billing": false
                        }
                    ],
                    "internal_note": "Verify customs paperwork before dispatch."
                },
                {
                    "order_id": 5002,
                    "customer_id": 101,
                    'driver_payout': 120.875,
                    "create_date": '2026-07-29',
                    "order_number": "2",
                    "service_type": "FTL",
                    "references": "PO-88245",
                    "shipper_name": "Prairie Supply Co.",
                    "shipper_address": "900 Rail Yard Rd",
                    "shipper_no_waiting_time": true,
                    "shipper_city": "Winnipeg",
                    "shipper_province": "MB",
                    "shipper_postal_code": "R2C 3G8",
                    "shipper_special_instructions": null,
                    "pickup_date": "2026-07-29",
                    "pickup_time_from": "09:00",
                    "pickup_time_to": "11:00",
                    "pickup_in": "2026-07-29 09:05:00",
                    "pickup_out": "2026-07-29 09:40:00",
                    "pickup_driver_assigned": {
                        "id": 12,
                        "driver_number": "D-012",
                        "name": "R. Belanger"
                    },
                    "receiver_name": "Coastal Warehouse Ltd.",
                    "receiver_no_waiting_time": false,
                    "receiver_address": "1210 Wharf St",
                    "receiver_city": "Vancouver",
                    "receiver_province": "BC",
                    "receiver_postal_code": "V6B 5K3",
                    "receiver_special_instructions": "Requires appointment, contact receiving 24h ahead.",
                    "delivery_date": "2026-08-01",
                    "delivery_time_from": "10:00",
                    "delivery_time_to": "14:00",
                    "delivery_in": null,
                    "delivery_out": null,
                    "delivery_driver_assigned": null,
                    "pickup_driver": {
                        "id": 12,
                        "driver_pay_type": "commission",
                        "commission_percentage": 25,
                        "hourly_rate": null,
                        "rate_per_km": null,
                        "mileage_allotment": null,
                        "fuel_surcharge_type": "percentage"
                    },
                    "delivery_driver": null,
                    "freights": [
                        {
                            "id": 9002,
                            "type": "Pallet",
                            "pieces": 12,
                            "description": "Packaged foodstuffs",
                            "length": 48,
                            "width": 48,
                            "height": 60,
                            "unit": "in",
                            "unit_dim": "lbs"
                        }
                    ],
                    "total_actual_weight": 8400.0,
                    "total_chargeable_weight": 8500.0,
                    "total_pieces_skid": 12,
                    "total_volume_weight": 8100.0,
                    "freight_rate": 2.15,
                    "freight_fuel_surcharge": 340.0,
                    "sub_total": 2515.0,
                    "order_notes": [],
                    "accessorials": [
                        {
                            "id": 502,
                            "access_id": 11,
                            "name": "Appointment Delivery",
                            "charge_quantity": 1,
                            "charge_amount": 50.0
                        }
                    ],
                    "interliners": [],
                    "internal_note": null
                }
            ]
        }
    ],
    "meta": {
        "total": 2,
        "page": 1,
        "pageSize": 10,
        "lastPage": 1
    }
}

export default function DriverPayCommission() {

    const { classes, cx } = useStyles()
    const groupApis = React.useRef(new Map());
    const refCallbackCache = React.useRef(new Map())
    const orderRef = React.useRef()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [appliedFilters, setAppliedFilters] = React.useState(null);

    // const { data: invoicing, isLoading, isError, error } = useInvoicing(appliedFilters, page, rowsPerPage)
    const data = driverPays.data || []
    console.log(data);
    const isLoading = false
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

    // React.useEffect(() => {
    //     if (isError && error) {
    //         const message = error.response?.data?.message;
    //         const status = error.response?.status;
    //         const errorMessage = message ? `${message} - ${status}` : error.message;
    //         enqueueSnackbar(errorMessage, { variant: 'error' });
    //     }
    // }, [isError, error])

    return (
        <MainLayout
            title='Driver Pay Commissions'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Commission' }}
            grid noPanding
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterPayDriverCommission onSearch={handleSearch} />
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
                                            OrderCard={DateGroupedSummary}
                                            isDriverPay
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
        </MainLayout>
    )

}