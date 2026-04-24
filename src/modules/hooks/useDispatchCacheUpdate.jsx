import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dispatchKeys } from './useDispatchOrders';


const PER_PAGE = 50;

const isEmptyFilters = (filters) => !filters || Object.keys(filters).length === 0;

const getKeyMeta = (queryKey) => {
    const obj = queryKey.find((k) => typeof k === 'object' && k !== null && 'page' in k);
    return { page: obj?.page ?? 1, filters: obj?.filters ?? {} };
};

const trimByOrderNumber = (rows, perPage) => [...rows].sort((a, b) => Number(b.order_number) - Number(a.order_number)).slice(0, perPage);


const mergeTrips = (cachedTrips = [], updatedTrips = [], orderId) => {
    if (!cachedTrips) return updatedTrips;
    const updatedMap = new Map(updatedTrips.map((t) => [t.id, t]));
    const existingIds = new Set(cachedTrips.map((t) => t.id));
    const merged = cachedTrips.map((t) => {
        if (updatedMap.has(t.id)) {
            const updatedTrip = updatedMap.get(t.id);
            const updatedDispatchedOrders = updatedTrip?.dispatched_orders ?? [];
            const oldOrdersWithoutUpdated =
                t?.dispatched_orders.filter((o) => o.order_id !== orderId) ?? [];
            const newDispatchedOrders = [
                ...oldOrdersWithoutUpdated,
                ...updatedDispatchedOrders,
            ].sort((a, b) => a.order_level - b.order_level);
            return { ...updatedTrip, dispatched_orders: newDispatchedOrders };
        }
        return t;
    });
    const newTrips = updatedTrips.filter((t) => !existingIds.has(t.id));
    return [...newTrips, ...merged].filter(t => t.trip_status !== 'completed');
};


const handleCreatedUndispatched = (queryClient, newUndispatchedOrders) => {
    if (!newUndispatchedOrders?.length) return;

    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'], });

    const page1Entry = allEntries.find(([key]) => {
        const { page, filters } = getKeyMeta(key);
        return page === 1 && isEmptyFilters(filters);
    });

    if (!page1Entry || !page1Entry[1]) {
        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        return;
    }

    const [page1Key, page1Data] = page1Entry;
    const currentData = page1Data.data ?? [];
    const perPage = page1Data.perPage ?? PER_PAGE;

    const merged = [...newUndispatchedOrders, ...currentData];
    const updatedData = merged.length > perPage ? trimByOrderNumber(merged, perPage) : merged;

    const addedCount = newUndispatchedOrders.length;

    queryClient.setQueryData(page1Key, { ...page1Data, data: updatedData, total: (page1Data.total ?? 0) + addedCount });

    allEntries.forEach(([key]) => {
        if (key === page1Key) return;
        queryClient.invalidateQueries({ queryKey: key });
    });
};


const handleUpdatedUndispatched = (queryClient, orderId, newUndispatchedOrders) => {
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });

    const noFilterEntries = allEntries.filter(([key]) => isEmptyFilters(getKeyMeta(key).filters));
    const otherEntries = allEntries.filter(([key]) => !isEmptyFilters(getKeyMeta(key).filters));
    let foundInAnyPage = false;
    const updatedKeys = new Set();

    noFilterEntries.forEach(([key, cachedPage]) => {
        if (!cachedPage) return;

        const currentData = cachedPage.data ?? [];
        const matchingRows = currentData.filter((o) => Number(o.order_id) === Number(orderId));
        if (matchingRows.length === 0) return;

        foundInAnyPage = true;
        const perPage = cachedPage.perPage ?? PER_PAGE;
        const removedCount = matchingRows.length;

        const withoutOld = currentData.filter((o) => Number(o.order_id) !== Number(orderId));
        let updatedData;
        if (!newUndispatchedOrders?.length) {
            updatedData = withoutOld;
        } else {
            const insertAt = currentData.findIndex((o) => Number(o.order_id) === Number(orderId));
            const before = withoutOld.slice(0, insertAt);
            const after = withoutOld.slice(insertAt);
            const merged = [...before, ...newUndispatchedOrders, ...after];

            updatedData = merged.length > perPage ? trimByOrderNumber(merged, perPage) : merged;
        }
        const newCount = newUndispatchedOrders?.length ?? 0;
        const totalDiff = newCount - removedCount;
        queryClient.setQueryData(key, { ...cachedPage, data: updatedData, total: (cachedPage.total ?? 0) + totalDiff, });

        updatedKeys.add(key);
    });

    if (!foundInAnyPage) {
        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        return;
    }
    noFilterEntries.forEach(([key]) => {
        if (updatedKeys.has(key)) return;
        queryClient.invalidateQueries({ queryKey: key });
    });
    otherEntries.forEach(([key]) => {
        queryClient.invalidateQueries({ queryKey: key });
    });
};


const handleRemoveDispatchOrder = (queryClient, newUndispatchedOrders) => {
    if (!newUndispatchedOrders?.length) return;
    const newOrder = newUndispatchedOrders[0];
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'], });
    const noFilterPages = allEntries.filter(([key]) => isEmptyFilters(getKeyMeta(key).filters)).sort(([a], [b]) => getKeyMeta(a).page - getKeyMeta(b).page);
    const filteredEntries = allEntries.filter(([key]) => !isEmptyFilters(getKeyMeta(key).filters));
    filteredEntries.forEach(([key]) => { queryClient.invalidateQueries({ queryKey: key }); });

    let insertedIndex = -1;
    for (let i = 0; i < noFilterPages.length; i++) {
        const [key, page] = noFilterPages[i];
        const data = page?.data ?? [];
        const perPage = page?.perPage ?? PER_PAGE;
        if (!data.length) continue;
        const first = data[0];
        const last = data[data.length - 1];
        const n = Number(newOrder.order_number);
        const belongs = n <= Number(first.order_number) && n >= Number(last.order_number);
        if (!belongs) continue;
        const updated = [...data, newOrder].sort((a, b) => Number(b.order_number) - Number(a.order_number)).slice(0, perPage);
        queryClient.setQueryData(key, { ...page, data: updated, total: (page.total ?? 0) + 1, });
        insertedIndex = i;
        break;
    }
    if (insertedIndex === -1) {
        noFilterPages.forEach(([key]) => {
            queryClient.invalidateQueries({ queryKey: key });
        });
        return;
    }

    for (let i = insertedIndex + 1; i < noFilterPages.length; i++) {
        queryClient.invalidateQueries({ queryKey: noFilterPages[i][0] });
    }
};

export function useDispatchCacheUpdate() {
    const queryClient = useQueryClient();

    const updateCache = useCallback(
        ({ orderId, trips = [], undispatchedOrders = [], action = 'created' }) => {
            if (!orderId) return;
            const driverTrips = trips.filter((t) => t.trip_type === 'driver');
            if (driverTrips.length > 0) {
                const key = dispatchKeys.trips('driver');
                const cached = queryClient.getQueryData(key);
                if (cached !== undefined) {
                    queryClient.setQueryData(key, mergeTrips(cached, driverTrips, orderId));
                } else {
                    queryClient.invalidateQueries({ queryKey: key });
                }
            }
            const interlinerTrips = trips.filter((t) => t.trip_type === 'interliner');
            if (interlinerTrips.length > 0) {
                const key = dispatchKeys.trips('interliner');
                const cached = queryClient.getQueryData(key);
                if (cached !== undefined) {
                    queryClient.setQueryData(key, mergeTrips(cached, interlinerTrips, orderId));
                } else {
                    queryClient.invalidateQueries({ queryKey: key });
                }
            }
            if (action === 'created') {
                handleCreatedUndispatched(queryClient, undispatchedOrders);
            } else if (action === 'updated') {
                handleUpdatedUndispatched(queryClient, orderId, undispatchedOrders);
            } else if (action === 'removed') {
                handleRemoveDispatchOrder(queryClient, undispatchedOrders);
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                queryClient.invalidateQueries({ queryKey: ['order'] });
                queryClient.invalidateQueries({ queryKey: ['undispatchedDriversCount'], exact: true });
            }

            if (trips.length > 0) {
                queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] });
            }
        },
        [queryClient]
    );

    return updateCache;
}