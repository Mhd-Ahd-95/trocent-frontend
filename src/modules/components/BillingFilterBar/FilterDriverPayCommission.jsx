import React, { useState, useCallback } from 'react';
import { TextField, Button, Box, InputAdornment, IconButton, Collapse } from '@mui/material';
import { Search, CalendarTodayRounded, CloseRounded, TuneRounded, KeyboardArrowDownRounded } from '@mui/icons-material';
import useStyles from './Filter.styles';

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
    payDateFrom: '',
    payDateTo: '',
    keyword: '',
};

const FilterDriverPayCommission = React.memo(({ onSearch, defaultExpanded = false, isHourly }) => {

    const { classes, cx } = useStyles({ commission: true });
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [filters, setFilters] = useState(isHourly ? { start_date: '', end_date: '', keyword: '' } : EMPTY_FILTERS);

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
                        <LabeledField classes={classes} label={isHourly ? 'Start Date' : "Pay Date From"} icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={isHourly ? filters.start_date : filters.payDateFrom}
                                onChange={(e) => setField(isHourly ? 'start_date' : 'payDateFrom', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label={isHourly ? 'End Date' : "Pay Date To"} icon={<CalendarTodayRounded sx={{ fontSize: 11 }} />}>
                            <TextField
                                type="date" size="small" fullWidth className={classes.inputRoot}
                                value={isHourly ? filters.end_date : filters.payDateTo}
                                onChange={(e) => setField(isHourly ? 'end_date' : 'payDateTo', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </LabeledField>

                        <LabeledField classes={classes} label="Keyword" icon={<Search sx={{ fontSize: 11 }} />}>
                            <TextField
                                size="small" fullWidth className={classes.inputRoot}
                                placeholder={isHourly ? '#driver' : "#order, #driver, driver name..."}
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

FilterDriverPayCommission.displayName = 'FilterDriverPayCommission';
export default FilterDriverPayCommission;