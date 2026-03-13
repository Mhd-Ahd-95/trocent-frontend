import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dispatchKeys } from './useDispatchOrders';

const mergeTrips = (cachedTrips = [], updatedTrips = []) => {
    if (!cachedTrips) return updatedTrips;
    const updatedMap = new Map(updatedTrips.map(t => [t.id, t]));
    const existingIds = new Set(cachedTrips.map(t => t.id));
    const merged = cachedTrips.map(t => updatedMap.has(t.id) ? updatedMap.get(t.id) : t);
    const newTrips = updatedTrips.filter(t => !existingIds.has(t.id));
    return [...newTrips, ...merged];
};


const mergeUndispatched = (orderId, cachedPage, updatedUndispatched = []) => {
    if (!cachedPage) return null;
    const cachedData = cachedPage.data ?? [];
    const withoutOldOrderRows = cachedData.filter(o => Number(o.order_id) !== Number(orderId));
    const newUndispatchedRows = updatedUndispatched.filter(o => o.trip_id === null);
    const newData = [...newUndispatchedRows, ...withoutOldOrderRows];
    const removedCount = cachedData.length - withoutOldOrderRows.length;
    const addedCount = newUndispatchedRows.length;

    return {
        ...cachedPage,
        data: newData,
        meta: { ...cachedPage.meta, total: (cachedPage.meta?.total ?? 0) - removedCount + addedCount, },
    };
};

export function useDispatchCacheUpdate() {
    const queryClient = useQueryClient();

    const updateCache = useCallback(({ order = {}, trips = [], undispatchedOrders = [] }) => {
        const orderId = order?.id;
        if (!orderId) return;

        const driverTrips = trips.filter(t => t.trip_type === 'driver');
        if (driverTrips.length > 0) {
            const key = dispatchKeys.trips('driver');
            const cached = queryClient.getQueryData(key);
            if (cached !== undefined) {
                queryClient.setQueryData(key, mergeTrips(cached, driverTrips));
            } else {
                queryClient.invalidateQueries({ queryKey: key });
            }
        }

        const interlinerTrips = trips.filter(t => t.trip_type === 'interliner');
        if (interlinerTrips.length > 0) {
            const key = dispatchKeys.trips('interliner');
            const cached = queryClient.getQueryData(key);
            if (cached !== undefined) {
                queryClient.setQueryData(key, mergeTrips(cached, interlinerTrips));
            } else {
                queryClient.invalidateQueries({ queryKey: key });
            }
        }

        const allUndispatchedEntries = queryClient.getQueriesData({
            queryKey: ['dispatch', 'undispatched'],
        });

        if (allUndispatchedEntries.length > 0) {
            allUndispatchedEntries.forEach(([key, cachedPage]) => {
                if (!cachedPage) return;
                const updated = mergeUndispatched(orderId, cachedPage, undispatchedOrders);
                if (updated) {
                    queryClient.setQueryData(key, updated);
                }
            });
        } else {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        }

        if (trips.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] });
        }

    }, [queryClient]);

    return updateCache;
}