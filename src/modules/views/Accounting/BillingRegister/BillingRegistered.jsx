import React, { useTransition, useState, useCallback, useMemo, useEffect } from "react";
import { Grid, Box, CircularProgress, Typography, Button, Pagination, Select, MenuItem } from "@mui/material";
import { Breadcrumbs, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegister from "../Filterbar/Filterbar";
import { ReceiptLongRounded, PictureAsPdfRounded, SendRounded } from "@mui/icons-material";
import useStyles from './Billing.styles'
import { useSnackbar } from "notistack";
import BillingRowCard from "./BillingRowCard";
import { useAccountingMutation, useBillingRegistered } from "../../../hooks/useAccounting";
import AccountingApi from "../../../apis/Accounting.api";
import { downloadExcel } from '../../Utils/BillingRegister';

const rowKey = (r) => `${r.type}-${r.id}`;
const PAGE_SIZE_OPTIONS = [50, 100, 150];
const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

const groupByCustomer = (rows) => {
    const map = new Map();
    rows.forEach((r) => {
        if (!map.has(r.customer_id)) {
            map.set(r.customer_id, {
                customer_id: r.customer_id,
                customer_name: r.customer_name,
                customer_number: r.customer_number,
                rows: [],
            });
        }
        const g = map.get(r.customer_id);
        g.rows.push(r);
    });
    return [...map.values()];
};

const toResendPayload = (rows) => rows.map(({ type, customer_id, id }) => ({ type, customer_id, id }));

export default function BillingRegistered() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [isDownloading, setIsDownloading] = useState(false);
    const { resendInvoices } = useAccountingMutation()

    const { data: registered, isLoading, isFetching, isError, error } = useBillingRegistered(appliedFilters, page, rowsPerPage)

    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const data = registered?.data || []
    const meta = registered?.meta ?? {};
    const pageCount = Math.max(1, meta.lastPage || 1);

    const groups = useMemo(() => groupByCustomer(data), [data]);
    const auditFilter = (appliedFilters?.audit_number || '').trim();

    const handleSearch = useCallback((filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setSelectedIds(new Set());
            setPage(1)
        });
    }, []);

    const handleRowsPerPageChange = useCallback((count) => {
        setRowsPerPage(count);
        setPage(1);
        setSelectedIds(new Set());
    }, []);

    const handlePageChange = useCallback((_, newPage) => {
        setPage(newPage);
        setSelectedIds(new Set());
    }, []);

    const handleToggleRow = useCallback((row) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            const key = rowKey(row);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }, []);

    const handleToggleGroup = useCallback((group) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            const keys = group.rows.map(rowKey);
            const all = keys.every(k => next.has(k));
            keys.forEach(k => (all ? next.delete(k) : next.add(k)));
            return next;
        });
    }, []);

    const handleResend = async (e, rows) => {
        e.preventDefault()
        const payload = toResendPayload(rows);
        await resendInvoices.mutateAsync(payload)
        setSelectedIds(new Set())
    }

    const handleResendRow = async (e, row) => await handleResend(e, [row])

    const handleDownloadXl = async (e) => {
        e.preventDefault()
        if (!auditFilter) return;
        setIsDownloading(true);
        try {
            const res = await AccountingApi.loadBillingRegistered({ audit_number: auditFilter, export: 1 });
            const rows = res.data?.data ?? [];
            if (rows.length === 0) {
                enqueueSnackbar('No data found for this audit number', { variant: 'warning' });
                return;
            }
            await downloadExcel(rows, auditFilter);
        } catch (err) {
            const message = err.response?.data?.message;
            enqueueSnackbar(message || err.message, { variant: 'error' });
        } finally {
            setIsDownloading(false);
        }
    }

    useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <MainLayout
            title='Billing Registered'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Billing Register' }}
            grid
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Billing Register', url: '/accounting/billing-register' }, { text: 'Billing Registered' }]}
                />}
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegister
                        EMPTY_FILTERS={{ invoice_date_from: '', invoice_date_to: '', keyword: '', audit_number: '' }}
                        billingRegister
                        billingRegistered
                        onSearch={handleSearch}
                    />
                </Grid>
                {auditFilter && !isLoading && !isFetching && data.length > 0 && (
                    <Grid size={12}>
                        <Box className={classes.selectionBar}>
                            <Typography className={classes.selectionBarText}>
                                # Audit: <strong style={{ paddingLeft: 5, color: '#000', fontSize: 15 }}>{auditFilter}</strong>
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDownloadXl}
                                disabled={isDownloading}
                                startIcon={isDownloading ? <CircularProgress size={18} /> : <PictureAsPdfRounded sx={{ fontSize: 18 }} />}
                                sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                Download XL
                            </Button>
                        </Box>
                    </Grid>
                )}
                {isLoading || isFetching ? (
                    <Grid container component={Box} justifyContent={'center'} width={'100%'} py={15}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <>
                        <Grid size={12}>
                            {data.length === 0 ? (
                                <Box className={classes.emptyState}>
                                    <ReceiptLongRounded sx={{ fontSize: 48, opacity: 0.35, mb: 1 }} />
                                    <Box sx={{ fontWeight: 700 }}>No orders match your filters</Box>
                                    <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword.</Box>
                                </Box>
                            ) : (
                                <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                    {groups.map((g) => {
                                        const selectedRows = g.rows.filter(r => selectedIds.has(rowKey(r)));
                                        const allSelected = selectedRows.length === g.rows.length;
                                        return (
                                            <Box key={g.customer_id} className={classes.group}>
                                                <Box className={classes.groupHeader}>
                                                    <Box>
                                                        <Typography className={classes.groupName}>{g.customer_name}</Typography>
                                                        <Typography className={classes.groupMeta}>
                                                            #{g.customer_number} · {g.rows.length} invoice{g.rows.length === 1 ? '' : 's'}
                                                        </Typography>
                                                    </Box>
                                                    <Box className={classes.groupActions}>
                                                        {selectedRows.length > 0 && (
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                disabled={resendInvoices.isPending}
                                                                startIcon={<SendRounded sx={{ fontSize: 16 }} />}
                                                                onClick={(e) => handleResend(e, selectedRows)}
                                                                sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                                                            >
                                                                Re-send Invoices ({selectedRows.length})
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleToggleGroup(g)}
                                                            sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                                                        >
                                                            {allSelected ? 'Deselect all' : 'Select all'}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                <Box className={classes.groupRows}>
                                                    {g.rows.map((row) => (
                                                        <BillingRowCard
                                                            key={rowKey(row)}
                                                            row={row}
                                                            audit
                                                            selected={selectedIds.has(rowKey(row))}
                                                            onToggle={handleToggleRow}
                                                            disabled={resendInvoices.isPending}
                                                            onResend={handleResendRow}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        );
                                    })}
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
                                    <span>· {meta.total ?? 0} invoice{meta.total !== 1 ? 's' : ''} total</span>
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
                )}
            </Grid>
        </MainLayout >
    )
}