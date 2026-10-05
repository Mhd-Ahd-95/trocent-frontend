import React, { useTransition, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, CircularProgress, Typography, Checkbox, Button } from "@mui/material";
import { SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegister from "../Filterbar/Filterbar";
import { ReceiptLongRounded, PictureAsPdfRounded } from "@mui/icons-material";
import useStyles from './Billing.styles'
import { useSnackbar } from "notistack";
import BillingRowCard from "./BillingRowCard";
import { useAccountingMutation, useBillingUnregister } from "../../../hooks/useAccounting";

const rowKey = (r) => `${r.type}-${r.id}`;

export default function BillingRegister() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition();
    const [appliedFilters, setAppliedFilters] = useState(null);

    const { data = [], isLoading, isFetching, isError, error } = useBillingUnregister(appliedFilters)
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const { registerInvoices } = useAccountingMutation()

    const handleSearch = useCallback((filters) => {
        startTransition(() => {
            setAppliedFilters(filters);
            setSelectedIds(new Set());
        });
    }, []);

    const allSelected = data.length > 0 && selectedIds.size === data.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    const handleToggleSelectAll = useCallback(() => {
        setSelectedIds(prev => (prev.size === data.length ? new Set() : new Set(data.map(rowKey))));
    }, [data]);

    const handleToggleRow = useCallback((row) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            const key = rowKey(row);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault()
        const rows = data.filter(r => selectedIds.has(rowKey(r))).map((d) => ({ ...d }));
        try {
            await registerInvoices.mutateAsync(rows)
            setSelectedIds(new Set())
        }
        catch (err) {
            //
        }
    }

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
            title='Billing Register'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Billing Register' }}
            button
            grid
            btnProps={{ label: 'Registered', onClick: () => navigate('/accounting/billing-registered'), icon: <ReceiptLongRounded /> }}
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegister
                        EMPTY_FILTERS={{ invoice_date_from: '', invoice_date_to: '', keyword: '' }}
                        billingRegister
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
                                    onClick={handleRegister}
                                    disabled={registerInvoices.isPending}
                                    startIcon={registerInvoices.isPending ? <CircularProgress size={18} /> : <PictureAsPdfRounded sx={{ fontSize: 18 }} />}
                                    sx={{ textTransform: 'capitalize', fontWeight: 'bold', borderRadius: 2 }}
                                >
                                    Register & Download XL ({selectedIds.size})
                                </Button>
                            )}
                        </Box>
                    </Grid>
                )}

                {isLoading || isFetching ? (
                    <Grid container component={Box} justifyContent={'center'} width={'100%'} py={15}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <Grid size={12}>
                        {data.length === 0 ? (
                            <Box className={classes.emptyState}>
                                <ReceiptLongRounded sx={{ fontSize: 48, opacity: 0.35, mb: 1 }} />
                                <Box sx={{ fontWeight: 700 }}>No orders match your filters</Box>
                                <Box sx={{ fontSize: 13, mt: 0.5 }}>Try widening the date range or clearing the keyword.</Box>
                            </Box>
                        ) : (
                            <Box className={`${classes.listWrap} ${isPending ? classes.listWrapFetching : ''}`}>
                                {data.map(row => (
                                    <BillingRowCard
                                        key={rowKey(row)}
                                        row={row}
                                        selected={selectedIds.has(rowKey(row))}
                                        onToggle={handleToggleRow}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                )}
            </Grid>
        </MainLayout>
    )
}