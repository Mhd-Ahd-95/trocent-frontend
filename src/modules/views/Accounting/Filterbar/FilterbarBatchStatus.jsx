import React, { useState, useCallback } from 'react';
import { TextField, Button, MenuItem, Box, InputAdornment, IconButton, Collapse, useTheme, alpha } from '@mui/material';
import { Search, CalendarTodayRounded, LocalShippingRounded, SortRounded, CloseRounded, TuneRounded, KeyboardArrowDownRounded } from '@mui/icons-material';
import useStyles from './Filterbar.styles';
import { CalendarIcon } from '@mui/x-date-pickers';


const LabeledField = ({ label, icon, children, classes }) => (
    <Box>
        <Box className={classes.labelText}>
            {icon}
            {label}
        </Box>
        {children}
    </Box>
);

const FilterBarRegisterBatch = React.memo(({ EMPTY_FILTERS = {}, onSearch, defaultExpanded = false }) => {

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;

    const { classes, cx } = useStyles({ registered: true });
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const setField = useCallback((key, value, isSeacrh = false) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        if (isSeacrh) {
            onSearch?.({ ...filters, [key]: value })
        }
    }, []);

    const handleSearch = useCallback(() => onSearch?.(filters), [filters, onSearch]);

    const handleClear = useCallback(() => {
        setFilters(EMPTY_FILTERS);
        onSearch?.(EMPTY_FILTERS);
    }, [onSearch]);

    const activeCount = Object.entries(filters).filter(([k, v]) => v).length;

    const PillToggle = ({ value, label, active, onClick, activeColor }) => {
        const ac = activeColor || primary;
        return (
            <Box
                onClick={onClick}
                sx={{
                    flex: 1, height: 40, borderRadius: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', userSelect: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.18s ease', border: '1.5px solid',
                    ...(active ? { background: ac, borderColor: ac, color: '#fff', boxShadow: `0 3px 10px ${alpha(ac, 0.35)}`, } : {
                        background: isDark ? alpha('#fff', 0.04) : alpha(ac, 0.06), borderColor: isDark ? alpha('#fff', 0.1) : alpha(ac, 0.2), color: isDark ? alpha('#fff', 0.7) : ac,
                        '&:hover': { background: isDark ? alpha('#fff', 0.08) : alpha(ac, 0.12), borderColor: alpha(ac, 0.4), },
                    }),
                }}
            >
                <Box sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', lineHeight: 1.3 }}>
                    {label}
                </Box>
            </Box>
        );
    };

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
                        <LabeledField classes={classes} label="Pay Date From" icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={filters.payDateFrom}
                                onChange={(e) => setField('payDateFrom', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Pay Date To" icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={filters.payDateTo}
                                onChange={(e) => setField('payDateTo', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Batch Number" icon={<Search sx={{ fontSize: 11 }} />}>
                            <TextField
                                size="small" fullWidth className={classes.inputRoot}
                                placeholder="#Batch Number..."
                                value={filters.batch_number}
                                onChange={(e) => setField('batch_number', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ fontSize: 16, opacity: 0.4 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: filters.keyword ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setField('batch_number', '')}>
                                                <CloseRounded sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                }}
                            />
                        </LabeledField>

                        {/* <LabeledField classes={classes} label="Status" icon={<LocalShippingRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                select size="small" fullWidth className={classes.inputRoot}
                                value={filters.status}
                                sx={{ textTransform: 'capitalize' }}
                                onChange={(e) => setField('status', e.target.value, true)}
                            >
                                {['registered', "unregistered"].map((sts) => (
                                    <MenuItem key={sts} value={sts} sx={{ textTransform: 'capitalize' }}>{sts}</MenuItem>
                                ))}
                            </TextField>
                        </LabeledField> */}

                        <LabeledField classes={classes} label="Keyword" icon={<Search sx={{ fontSize: 11 }} />}>
                            <TextField
                                size="small" fullWidth className={classes.inputRoot}
                                placeholder="#Driver, Driver name, Company..."
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

                        {/* <LabeledField classes={classes} label="Sort By" icon={<SortRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                select size="small" fullWidth className={classes.inputRoot}
                                value={filters.sortBy}
                                onChange={(e) => setField('sortBy', e.target.value, true)}
                            >
                                <MenuItem value={''}>All</MenuItem>
                                {SORT_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </LabeledField> */}
                        <LabeledField classes={classes} label="Quick Filter" icon={<CalendarIcon sx={{ fontSize: 11 }} />}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {[{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }].map(({ value, label }) => (
                                    <PillToggle
                                        key={value}
                                        value={value}
                                        label={label}
                                        active={filters.quickFilter === value}
                                        activeColor={primary}
                                        onClick={() => setField('quickFilter', filters.quickFilter === value ? null : value, true)}
                                    />
                                ))}
                            </Box>
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

FilterBarRegisterBatch.displayName = 'FilterBarRegisterBatch';
export default FilterBarRegisterBatch;