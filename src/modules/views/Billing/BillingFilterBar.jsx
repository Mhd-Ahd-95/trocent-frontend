import React, { useState, useCallback } from 'react';
import { TextField, Button, MenuItem, Box, InputAdornment, IconButton, Collapse } from '@mui/material';
import { Search, CalendarTodayRounded, LocalShippingRounded, SortRounded, CloseRounded, TuneRounded, KeyboardArrowDownRounded } from '@mui/icons-material';
import useStyles from './Billing.styles';

export const CARRIER_TYPE_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'driver', label: 'Driver' },
    { value: 'interliner', label: 'Interliner' },
];

export const SORT_OPTIONS = [
    { value: 'order_date_desc', label: 'Order Date (Newest)' },
    { value: 'order_date_asc', label: 'Order Date (Oldest)' },
    { value: 'order_number_desc', label: 'Order Number (High-Low)' },
    { value: 'customer_name_asc', label: 'Client Name (A-Z)' },
    { value: 'amount_desc', label: 'Amount (High-Low)' },
];

const LabeledField = ({ label, icon, children, classes }) => (
    <Box>
        <Box className={classes.labelText}>
            {icon}
            {label}
        </Box>
        {children}
    </Box>
);

const EMPTY_FILTERS = {
    orderDateFrom: '',
    orderDateTo: '',
    keyword: '',
    carrierType: '',
    sortBy: SORT_OPTIONS[0].value,
};

const BillingFilterBar = React.memo(({ onSearch, defaultExpanded = false }) => {
    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const setField = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSearch = useCallback(() => onSearch?.(filters), [filters, onSearch]);

    const handleClear = useCallback(() => {
        setFilters(EMPTY_FILTERS);
        onSearch?.(EMPTY_FILTERS);
    }, [onSearch]);

    const activeCount = Object.entries(filters).filter(([k, v]) => k !== 'sortBy' && v).length;

    return (
        <Box className={classes.filterRoot}>
            <Box className={classes.filterHeader} onClick={() => setExpanded((p) => !p)}>
                <Box className={classes.filterHeaderLeft}>
                    <Box className={classes.filterIconBadge}>
                        <TuneRounded sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                    <Box className={classes.filterTitle}>Filters</Box>
                    {activeCount > 0 && <Box className={classes.filterCountChip}>{activeCount}</Box>}
                </Box>
                <Box className={cx(classes.filterChevron, expanded && classes.filterChevronOpen)}>
                    <KeyboardArrowDownRounded sx={{ fontSize: 17 }} />
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Box className={classes.filterBody}>
                    <Box className={classes.filterGrid}>
                        <LabeledField classes={classes} label="Order Date From" icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={filters.orderDateFrom}
                                onChange={(e) => setField('orderDateFrom', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Order Date To" icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={filters.orderDateTo}
                                onChange={(e) => setField('orderDateTo', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Keyword" icon={<Search sx={{ fontSize: 11 }} />}>
                            <TextField
                                size="small" fullWidth className={classes.inputRoot}
                                placeholder="Order number, client name..."
                                value={filters.keyword}
                                onChange={(e) => setField('keyword', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ fontSize: 16, opacity: 0.4 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: filters.keyword ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setField('keyword', '')}>
                                                <CloseRounded sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Carrier Type" icon={<LocalShippingRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                select size="small" fullWidth className={classes.inputRoot}
                                value={filters.carrierType}
                                onChange={(e) => setField('carrierType', e.target.value)}
                            >
                                {CARRIER_TYPE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </LabeledField>

                        <LabeledField classes={classes} label="Sort By" icon={<SortRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                select size="small" fullWidth className={classes.inputRoot}
                                value={filters.sortBy}
                                onChange={(e) => setField('sortBy', e.target.value)}
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </LabeledField>
                    </Box>

                    <Box className={classes.filterActionsRow}>
                        {activeCount > 0 && (
                            <Button className={classes.clearButton} color="inherit" onClick={handleClear} startIcon={<CloseRounded sx={{ fontSize: 14 }} />}>
                                Clear ({activeCount})
                            </Button>
                        )}
                        <Button className={classes.searchButton} variant="contained" onClick={handleSearch} startIcon={<Search sx={{ fontSize: 16 }} />}>
                            Search
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
});

BillingFilterBar.displayName = 'BillingFilterBar';
export default BillingFilterBar;