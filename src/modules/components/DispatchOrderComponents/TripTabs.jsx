import React, { useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Business, PersonOutline, CheckCircle } from '@mui/icons-material';
import { FilterBar, TripsList, Tabs } from '../../components';
import { useCompletedTrips } from '../../hooks/useDispatchOrders';
import CompletedTripsList from './CompletedTripList';
import * as _ from 'lodash'
import moment from 'moment';

export const TabLoadingState = ({ textLoading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">{textLoading ? textLoading : 'Loading trips…'}</Typography>
    </Box>
);

const DriverTabContent = React.memo(({ tripAction, trips = [], isLoading }) => {

    const [filters, setFilters] = useState({});
    const handleFilterChange = useCallback(_.debounce((f) => {
        setFilters(f)
    }, 500), [trips]);

    if (isLoading) return <TabLoadingState textLoading={'Loading Driver Trips...'} />;

    return (
        <>
            <Box sx={{ bgcolor: 'grey.50' }}>
                <FilterBar
                    onFilterChange={handleFilterChange}
                    defaultExpanded={false}
                />
            </Box>
            <Box sx={{ p: 2 }}>
                <TripsList trips={trips ?? []} filters={filters} tripAction={tripAction} />
            </Box>
        </>
    );
});

const InterlinerTabContent = React.memo(({ tripAction, trips = [], isLoading }) => {

    const [filters, setFilters] = useState({});
    const handleFilterChange = useCallback(_.debounce((f) => {
        setFilters(f)
    }, 500), [trips]);

    if (isLoading) return <TabLoadingState textLoading={'Loading Interliner Trips...'} />;

    return (
        <>
            <Box sx={{ bgcolor: 'grey.50' }}>
                <FilterBar onFilterChange={handleFilterChange} defaultExpanded={false} placeholderSearch={'Order #, Trip #, Interliner...'} />
            </Box>
            <Box sx={{ p: 2 }}>
                <TripsList trips={trips} filters={filters} isInterliner tripAction={tripAction} />
            </Box>
        </>
    );
});

const CompletedTabContent = React.memo(({ enabled }) => {

    const [appliedFilters, setAppliedFilters] = useState({ quickFilter: 'today' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const { data, isLoading, isFetching } = useCompletedTrips(appliedFilters, page + 1, rowsPerPage, { enabled });

    const trips = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleSearch = useCallback((searchFilters) => {
        const formatted = { ...searchFilters }
        if (formatted.pickupDate) {
            formatted.pickupDate = moment(formatted.pickupDate).format('YYYY-MM-DD 00:00:00');
        }
        if (formatted.deliveryDate) {
            formatted.deliveryDate = moment(formatted.deliveryDate).format('YYYY-MM-DD 23:59:59');
        }
        setAppliedFilters(formatted);
        setPage(0);
    }, []);

    const handlePageChange = useCallback((_, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    }, []);

    if (isLoading) return <TabLoadingState textLoading={'Loading Completed Trips...'} />;

    return (
        <>
            <Box sx={{ bgcolor: 'grey.50' }}>
                <FilterBar onSearch={handleSearch} defaultExpanded={false} showSearchButton placeholderSearch={'Driver #, Order #, Trip #, Interliner...'} ftDate />
            </Box>
            <Box sx={{ p: 2 }}>
                <CompletedTripsList
                    trips={trips}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    isFetching={isFetching || isLoading}
                />
            </Box>
        </>
    );
});

export default function TripTabs({ tripAction, trips, isLoading, onTabChange, activatedTab }) {

    const handleTabChange = useCallback((tabIndex) => {
        onTabChange(tabIndex)
    }, []);

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <Tabs
                    labels={['Drivers', 'Interliners', 'Completed']}
                    icons={[
                        <PersonOutline fontSize="small" />,
                        <Business fontSize="small" />,
                        <CheckCircle fontSize="small" />,
                    ]}
                    onTabChange={handleTabChange}
                    contents={[
                        <DriverTabContent
                            key="driver"
                            tripAction={tripAction}
                            trips={trips}
                            isLoading={isLoading}
                        />,
                        <InterlinerTabContent
                            key="interliner"
                            tripAction={tripAction}
                            trips={trips}
                            isLoading={isLoading}
                        />,
                        <CompletedTabContent
                            key="completed"
                            enabled={activatedTab === 2}
                        />,
                    ]}
                />
            </Box>
        </Box>
    );
}