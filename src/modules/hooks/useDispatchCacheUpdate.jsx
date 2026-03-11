import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { dispatchKeys } from './useDispatchOrders';


const mergeTrips = (cachedTrips = [], updatedTrips = []) => {
    if (!cachedTrips) return updatedTrips;
    const updatedMap = new Map(updatedTrips.map(t => [t.id, t]));
    const existingIds = new Set(cachedTrips.map(t => t.id));
    const merged = cachedTrips.map(t => updatedMap.has(t.id) ? updatedMap.get(t.id) : t);
    const newTrips = updatedTrips.filter(t => !existingIds.has(t.id));
    return [...newTrips, ...merged];
};

const mergeUndispatched = (cachedPage, updatedUndispatched = []) => {
    if (!cachedPage) return null;
    const updatedMap = new Map(updatedUndispatched.map(o => [o.id, o]));
    const dispatchedIds = new Set(updatedUndispatched.filter(o => o.trip_id !== null).map(o => o.id));

    const filtered = (cachedPage.data ?? [])
        .filter(o => !dispatchedIds.has(o.id))
        .map(o => updatedMap.has(o.id) ? updatedMap.get(o.id) : o);

    const existingIds = new Set(cachedPage.data?.map(o => o.id) ?? []);
    const newUndispatched = updatedUndispatched.filter(o => o.trip_id === null && !existingIds.has(o.id));

    const newData = [...newUndispatched, ...filtered];
    const removedCount = (cachedPage.data ?? []).filter(o => dispatchedIds.has(o.id)).length;
    const addedCount = newUndispatched.length;

    return {
        ...cachedPage,
        data: newData,
        meta: { ...cachedPage.meta, total: (cachedPage.meta?.total ?? 0) - removedCount + addedCount, }
    };
};

export function useDispatchCacheUpdate() {
    const queryClient = useQueryClient();
    const updateCache = useCallback(({ trips = [], undispatchedOrders = [] }) => {

        const driverTrips = trips.filter(t => t.trip_type === 'driver');
        if (driverTrips.length > 0) {
            const driverCacheKey = dispatchKeys.trips('driver');
            const cachedDriverTrips = queryClient.getQueryData(driverCacheKey);
            if (cachedDriverTrips !== undefined) {
                queryClient.setQueryData(driverCacheKey, mergeTrips(cachedDriverTrips, driverTrips));
            } else {
                queryClient.invalidateQueries({ queryKey: driverCacheKey });
            }
        }

        const interlinerTrips = trips.filter(t => t.trip_type === 'interliner');
        if (interlinerTrips.length > 0) {
            const interlinerCacheKey = dispatchKeys.trips('interliner');
            const cachedInterlinerTrips = queryClient.getQueryData(interlinerCacheKey);
            if (cachedInterlinerTrips !== undefined) {
                queryClient.setQueryData(interlinerCacheKey, mergeTrips(cachedInterlinerTrips, interlinerTrips));
            } else {
                queryClient.invalidateQueries({ queryKey: interlinerCacheKey });
            }
        }

        const allUndispatchedKeys = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'], });
        if (allUndispatchedKeys.length > 0) {
            allUndispatchedKeys.forEach(([key, cachedPage]) => {
                if (!cachedPage) return;
                const updated = mergeUndispatched(cachedPage, undispatchedOrders);
                if (updated) {
                    queryClient.setQueryData(key, updated);
                }
            });
        } else if (undispatchedOrders.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        }

        if (trips.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] });
        }

    }, [queryClient]);

    return updateCache;
}