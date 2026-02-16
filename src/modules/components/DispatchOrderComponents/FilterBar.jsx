import React, { useState, useCallback } from 'react';
import {
  Paper,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Collapse,
  Box,
  Stack,
  Grid
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FilterBar = ({ onSearch, showSearchButton = false, onFilterChange, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [filters, setFilters] = useState({
    pickupDate: null,
    deliveryDate: null,
    searchInput: '',
    quickFilter: null,
    terminal: null,
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  const handleSearch = useCallback(() => {
    onSearch?.(filters);
  }, [filters, onSearch]);

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <span style={{ fontWeight: 600 }}>Filters</span>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 0 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Pickup Date"
                value={filters.pickupDate}
                onChange={(date) => handleFilterChange('pickupDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Delivery Date"
                value={filters.deliveryDate}
                onChange={(date) => handleFilterChange('deliveryDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Driver #, Trip #, Order #"
                value={filters.searchInput}
                onChange={(e) => handleFilterChange('searchInput', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            {showSearchButton && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  sx={{ height: 40 }}
                >
                  Search
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, md: showSearchButton ? 6 : 3 }}>
              <ToggleButtonGroup
                size="small"
                fullWidth
                exclusive
                value={filters.quickFilter}
                onChange={(e, value) => handleFilterChange('quickFilter', value)}
              >
                <ToggleButton value="today">TODAY</ToggleButton>
                <ToggleButton value="tomorrow">TOMORROW</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid size={{ xs: 12, md: showSearchButton ? 6 : 3 }}>
              <ToggleButtonGroup
                size="small"
                fullWidth
                exclusive
                value={filters.terminal}
                onChange={(e, value) => handleFilterChange('terminal', value)}
              >
                <ToggleButton value="MTL">TERM-MTL</ToggleButton>
                <ToggleButton value="OTT">TERM-OTT</ToggleButton>
                <ToggleButton value="TOR">TERM-TOR</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default React.memo(FilterBar);