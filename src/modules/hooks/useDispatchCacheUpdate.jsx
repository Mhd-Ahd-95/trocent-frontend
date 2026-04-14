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

const PER_PAGE = 50;

const getPageNumber = (queryKey) => queryKey.find(k => typeof k === 'object' && k !== null && 'page' in k)?.page ?? 1;

const invalidateFromPage = (queryClient, fromPage) => {
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    allEntries.forEach(([key]) => {
        if (getPageNumber(key) >= fromPage) {
            queryClient.invalidateQueries({ queryKey: key });
        }
    });
};

const handleCreatedUndispatched = (queryClient, newUndispatchedOrders) => {
    if (!newUndispatchedOrders || newUndispatchedOrders.length === 0) return;
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    const page1Entry = allEntries.find(([key]) => {
        const queryKeyObj = key.find(k => typeof k === 'object' && k !== null && 'page' in k);
        return queryKeyObj?.page === 1;
    });
    if (!page1Entry) {
        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        return;
    }
    const [page1Key, page1Data] = page1Entry;
    if (!page1Data) {
        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        return;
    }
    const currentData = page1Data.data ?? [];
    const newCount = newUndispatchedOrders.length;
    const perPage = page1Data.perPage ?? PER_PAGE;

    let updatedData;
    if (currentData.length + newCount > perPage) {
        const trimmed = currentData.slice(0, perPage - newCount);
        updatedData = [...newUndispatchedOrders, ...trimmed];
    } else {
        updatedData = [...newUndispatchedOrders, ...currentData];
    }
    const addedCount = newUndispatchedOrders.length;
    queryClient.setQueryData(page1Key, { ...page1Data, data: updatedData, total: (page1Data.total ?? 0) + addedCount, });

    allEntries.forEach(([key]) => {
        if (key === page1Key) return;
        const queryKeyObj = key.find(k => typeof k === 'object' && k !== null && 'page' in k);
        if (queryKeyObj?.page !== 1) {
            queryClient.invalidateQueries({ queryKey: key });
        }
    });
};

const handleUpdatedUndispatched = (queryClient, orderId, newUndispatchedOrders) => {
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    let foundInAnyPage = false;
    allEntries.forEach(([key, cachedPage]) => {
        if (!cachedPage) return;
        const currentData = cachedPage.data ?? [];
        const matchingRows = currentData.filter(o => Number(o.order_id) === Number(orderId));
        if (matchingRows.length === 0) return;
        foundInAnyPage = true;
        const withoutOld = currentData.filter(o => Number(o.order_id) !== Number(orderId));
        const removedCount = matchingRows.length;
        if (!newUndispatchedOrders || newUndispatchedOrders.length === 0) {
            invalidateFromPage(queryClient, getPageNumber(key));
            return;
        }
        const perPage = cachedPage.perPage ?? PER_PAGE;
        const newCount = newUndispatchedOrders.length;
        const firstMatchIndex = currentData.findIndex(o => Number(o.order_id) === Number(orderId));

        let updatedData;
        if (withoutOld.length + newCount > perPage) {
            const beforeInsert = withoutOld.slice(0, firstMatchIndex);
            const afterInsert = withoutOld.slice(firstMatchIndex);
            const merged = [...beforeInsert, ...newUndispatchedOrders, ...afterInsert];
            updatedData = merged.slice(0, perPage);
            const allEntriesForInvalidation = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
            allEntriesForInvalidation.forEach(([otherKey]) => {
                if (otherKey === key) return;
                queryClient.invalidateQueries({ queryKey: otherKey });
            });
        } else {
            if (newCount === removedCount) {
                const beforeInsert = withoutOld.slice(0, firstMatchIndex);
                const afterInsert = withoutOld.slice(firstMatchIndex);
                updatedData = [...beforeInsert, ...newUndispatchedOrders, ...afterInsert];
            }
            else {
                invalidateFromPage(queryClient, getPageNumber(key));
                return;
            }
        }

        const totalDiff = newCount - removedCount;

        queryClient.setQueryData(key, {
            ...cachedPage,
            data: updatedData,
            total: (cachedPage.total ?? 0) + totalDiff,
        });
    });

    if (!foundInAnyPage) {
        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
    }
};

export function useDispatchCacheUpdate() {
    const queryClient = useQueryClient();

    const updateCache = useCallback(({ order = {}, trips = [], undispatchedOrders = [], action = 'created' }) => {
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
        if (action === 'created') {
            handleCreatedUndispatched(queryClient, undispatchedOrders);
        } else if (action === 'updated') {
            handleUpdatedUndispatched(queryClient, orderId, undispatchedOrders);
        }
        if (trips.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] });
        }
    }, [queryClient]);

    return updateCache;
}