import React, { useState, useCallback } from 'react';
import { TextField, Button, IconButton, Collapse, Box, InputAdornment, } from '@mui/material';
import { Search, TuneRounded, KeyboardArrowDownRounded, CalendarTodayRounded, LocalShippingRounded, PinDropRounded, CloseRounded, } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme, alpha } from '@mui/material/styles';
import moment from 'moment';

const terminalConfig = {
  'TERM-MTL': { label: 'Montréal', color: '#2980b9' },
  'TERM-OTT': { label: 'Ottawa', color: '#e67e22' },
  'TERM-TOR': { label: 'Toronto', color: '#27ae60' },
};

const LabeledField = ({ label, icon, children }) => (
  <Box>
    <Box sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.75, display: 'flex', alignItems: 'center', gap: 0.4, opacity: 0.7, minHeight: 14, }}    >
      {icon}
      {label}
    </Box>
    {children}
  </Box>
);

const MiniChip = ({ label, color }) => (
  <Box
    sx={{ px: 1, height: 20, borderRadius: '5px', background: alpha(color, 0.12), color: color, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', letterSpacing: '0.04em', }}
  >
    {label}
  </Box>
);

const FilterBar = ({ onSearch, showSearchButton = false, onFilterChange, defaultExpanded = true, placeholderSearch, ftDate}) => {

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paperBg = theme.palette.background.paper;
  const defaultBg = theme.palette.background.default;

  const quickFilter = ftDate ? [{ value: 'yesterday', label: 'YESTERDAY' }, { value: 'today', label: 'TODAY' }] : [{ value: 'today', label: 'TODAY' }, { value: 'tomorrow', label: 'TOMORROW' }]

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [filters, setFilters] = useState({ pickupDate: null, deliveryDate: null, searchInput: '', quickFilter: null, terminal: null, tripType: null});

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        onFilterChange?.(next);
        return next;
      });
    },
    [onFilterChange]
  );

  const clearAll = () => {
    const cleared = { pickupDate: null, deliveryDate: null, searchInput: '', quickFilter: null, terminal: null };
    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px',
      backgroundColor: isDark ? alpha('#fff', 0.05) : paperBg,
      fontSize: 13,
      height: 40,
      fontWeight: 500,
      transition: 'box-shadow 0.2s',
      '& fieldset': {
        borderColor: isDark ? alpha('#fff', 0.12) : alpha(secondary, 0.18),
        borderWidth: '1.5px',
      },
      '&:hover fieldset': {
        borderColor: alpha(primary, 0.55),
      },
      '&.Mui-focused fieldset': {
        borderColor: primary,
        boxShadow: `0 0 0 3px ${alpha(primary, 0.15)}`,
      },
    },
    '& .MuiInputBase-input': {
      '&::placeholder': { opacity: 0.45 },
    },
  };

  const PillToggle = ({ value, label, sublabel, active, onClick, activeColor }) => {
    const ac = activeColor || primary;
    return (
      <Box
        onClick={onClick}
        sx={{
          flex: 1, height: 40, borderRadius: '10px', display: 'flex', flexDirection: sublabel ? 'column' : 'row', alignItems: 'center', justifyContent: 'center',
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
        {sublabel && (
          <Box sx={{ fontSize: 9, fontWeight: 500, opacity: active ? 0.85 : 0.6, lineHeight: 1 }}>
            {sublabel}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        borderRadius: '16px', border: '1.5px solid', borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.14), backgroundColor: isDark ? alpha(secondary, 0.25) : alpha(defaultBg, 0.9), overflow: 'hidden',
        fontFamily: 'Inter, sans-serif', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : `0 2px 12px ${alpha(secondary, 0.08)}`,
      }}
    >
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          px: 2.5, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none', borderBottom: expanded ? '1.5px solid' : 'none',
          borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1),
          '&:hover': { background: isDark ? alpha('#fff', 0.03) : alpha(primary, 0.04), },
          transition: 'background 0.15s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '9px', background: `linear-gradient(135deg, ${primary} 0%, ${alpha(primary, 0.7)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${alpha(primary, 0.4)}`, flexShrink: 0,
            }}
          >
            <TuneRounded sx={{ fontSize: 16, color: '#fff' }} />
          </Box>

          <Box sx={{ fontSize: 13, fontWeight: 700, color: isDark ? '#fff' : secondary, letterSpacing: '-0.01em', }}          >
            Filters
          </Box>
          {activeCount > 0 && (
            <Box sx={{ px: 0.9, height: 18, borderRadius: '6px', background: primary, color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', }}>
              {activeCount}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!expanded && activeCount > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {filters.quickFilter && (
                <MiniChip
                  label={filters.quickFilter === 'today' ? 'Today' : filters.quickFilter === 'yesterday' ? 'YESTERDAY' : 'Tomorrow'}
                  color={primary}
                />
              )}
              {filters.terminal && (
                <MiniChip
                  label={filters.terminal}
                  color={terminalConfig[filters.terminal]?.color || secondary}
                />
              )}
              {filters.tripType && (
                <MiniChip
                  label={String(filters.tripType)?.toUpperCase()}
                  color={filters.tripType === 'interliner' ? '#8e44ad' : primary}
                />
              )}
              {filters.searchInput && (
                <MiniChip label={`"${filters.searchInput}"`} color={secondary} />
              )}
            </Box>
          )}
          <Box
            sx={{
              width: 26, height: 26, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isDark ? alpha('#fff', 0.07) : alpha(secondary, 0.07), transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease, background 0.15s',
              '&:hover': { background: isDark ? alpha('#fff', 0.13) : alpha(primary, 0.12), },
              flexShrink: 0,
            }}
          >
            <KeyboardArrowDownRounded
              sx={{ fontSize: 17, color: isDark ? alpha('#fff', 0.7) : secondary }}
            />
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2.5, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: showSearchButton ? { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } : { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, }}          >
            <LabeledField label={ftDate ? 'From Date' : "Pickup Date"} icon={<CalendarTodayRounded sx={{ fontSize: 11, color: primary }} />}>
              <DatePicker
                value={filters.pickupDate || null}
                onChange={(d) => handleFilterChange('pickupDate', d ? moment(d) : null)}
                slotProps={{ textField: { size: 'small', fullWidth: true, sx: inputSx } }}
              />
            </LabeledField>
            <LabeledField label={ftDate ? 'To Date' : "Delivery Date"} icon={ftDate ? <CalendarTodayRounded sx={{ fontSize: 11, color: primary }} /> : <LocalShippingRounded sx={{ fontSize: 11, color: '#e67e22' }} />}>
              <DatePicker
                value={filters.deliveryDate || null}
                onChange={(d) => handleFilterChange('deliveryDate', d ? moment(d) : null)}
                slotProps={{ textField: { size: 'small', fullWidth: true, sx: inputSx } }}
              />
            </LabeledField>
            <LabeledField label="Search" icon={<Search sx={{ fontSize: 11 }} />}>
              <TextField
                size="small"
                fullWidth
                placeholder={placeholderSearch ? placeholderSearch : "Driver #, Trip #, Order #..."}
                value={filters.searchInput}
                onChange={(e) => handleFilterChange('searchInput', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch?.(filters)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{ fontSize: 16, color: isDark ? alpha('#fff', 0.35) : alpha(secondary, 0.4), }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: filters.searchInput ? (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end" onClick={() => handleFilterChange('searchInput', '')}                      >
                        <CloseRounded sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{ ...inputSx }}
              />
            </LabeledField>
            {showSearchButton && (
              <LabeledField label=" ">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search sx={{ fontSize: 16 }} />}
                  onClick={() => onSearch?.(filters)}
                  sx={{
                    height: 40, borderRadius: '10px', background: primary, color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'none', letterSpacing: '-0.01em', boxShadow: `0 3px 10px ${alpha(primary, 0.4)}`,
                    '&:hover': { background: theme.palette.primary.hover || primary, boxShadow: `0 5px 16px ${alpha(primary, 0.5)}`, transform: 'translateY(-1px)', },
                    transition: 'all 0.18s ease',
                  }}
                >
                  Search
                </Button>
              </LabeledField>
            )}
          </Box>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: ftDate ? '1fr 1.6fr 1fr' : '1fr 1.6fr' }, gap: 2, }}          >
            <LabeledField label="Quick Filter">
              <Box sx={{ display: 'flex', gap: 1 }}>
                {quickFilter.map(({ value, label }) => (
                  <PillToggle
                    key={value}
                    value={value}
                    label={label}
                    active={filters.quickFilter === value}
                    activeColor={primary}
                    onClick={() => handleFilterChange('quickFilter', filters.quickFilter === value ? null : value)}
                  />
                ))}
              </Box>
            </LabeledField>
            <LabeledField label="Terminal" icon={<PinDropRounded sx={{ fontSize: 11, color: isDark ? alpha('#fff', 0.5) : alpha(secondary, 0.55), }} />}            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.entries(terminalConfig).map(([code, cfg]) => (
                  <PillToggle
                    key={code}
                    value={code}
                    label={code}
                    // sublabel={cfg.label}
                    active={filters.terminal === code}
                    activeColor={cfg.color}
                    onClick={() => handleFilterChange('terminal', filters.terminal === code ? null : code)}
                  />
                ))}
              </Box>
            </LabeledField>
            {ftDate && (
            <LabeledField label="Trip Type">
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[{ value: 'driver', label: 'DRIVER', color: primary }, { value: 'interliner', label: 'INTERLINER', color: '#8e44ad' },].map(({ value, label, color }) => (
                  <PillToggle
                    key={value}
                    value={value}
                    label={label}
                    active={filters.tripType === value}
                    activeColor={color}
                    onClick={() => handleFilterChange('tripType', filters.tripType === value ? null : value)}
                  />
                ))}
              </Box>
            </LabeledField>
            )}
          </Box>
          {activeCount > 0 && (
            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                onClick={clearAll}
                sx={{
                  fontSize: 12, fontWeight: 600, color: isDark ? alpha('#fff', 0.45) : alpha(secondary, 0.5), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.4, borderRadius: '7px', transition: 'all 0.15s',
                  '&:hover': { color: theme.palette.error.main, background: alpha(theme.palette.error.main, 0.08), },
                }}
              >
                <CloseRounded sx={{ fontSize: 12 }} />
                Clear all
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default React.memo(FilterBar);