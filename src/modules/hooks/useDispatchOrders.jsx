import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DispatchOrderApi from "../apis/DispatchOrder.api";
import { useSnackbar } from "notistack";
import { useDispatchCacheUpdate } from "./useDispatchCacheUpdate";

export const dispatchKeys = {
    trips: (type) => ['dispatch', 'trips', type],
    undispatched: (filters, page, perPage) => ['dispatch', 'undispatched', { filters, page, perPage }],
    completed: (filters, page, perPage) => ['dispatch', 'completed', { filters, page, perPage }],
};

const BASE_QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
};

export function useDriverTrips({ enabled = false }) {
    return useQuery({
        queryKey: dispatchKeys.trips('driver'),
        queryFn: async () => {
            const response = await DispatchOrderApi.getTripsByType('driver');
            return response.data;
        },
        enabled,
        ...BASE_QUERY_CONFIG,
    });
}

export function useInterlinerTrips({ enabled = false } = {}) {
    return useQuery({
        queryKey: dispatchKeys.trips('interliner'),
        queryFn: async () => {
            const response = await DispatchOrderApi.getTripsByType('interliner');
            return response.data;
        },
        enabled,
        ...BASE_QUERY_CONFIG,
    });
}

export function useUndispatchedOrders(filters = {}, page = 1, perPage = 50) {
    return useQuery({
        queryKey: dispatchKeys.undispatched(filters, page, perPage),
        queryFn: async () => {
            const response = await DispatchOrderApi.getUndispatchedOrders({ ...filters, page, per_page: perPage, });
            return response.data;
        },
        ...BASE_QUERY_CONFIG,
        placeholderData: (prev) => prev,
    });
}

export function useCompletedTrips(filters = {}, page = 1, perPage = 50, { enabled = false } = {}) {
    return useQuery({
        queryKey: dispatchKeys.completed(filters, page, perPage),
        queryFn: async () => {
            const response = await DispatchOrderApi.loadCompletedTrips({ ...filters, page, per_page: perPage, });
            return response.data;
        },
        enabled,
        ...BASE_QUERY_CONFIG,
        placeholderData: (prev) => prev,
    });
}

const removeTrips = (cachedTrips = [], tripId) => {
    if (!cachedTrips) return [];
    const filteredTrips = cachedTrips.filter(t => Number(t.id) !== Number(tripId))
    return filteredTrips
}

const mergeTrips = (cachedTrips = [], updatedTrips = []) => {
    if (!cachedTrips) return updatedTrips;
    const updatedMap = new Map(updatedTrips.map(t => [t.id, t]));
    const existingIds = new Set(cachedTrips.map(t => t.id));
    const merged = cachedTrips.map(t => updatedMap.has(t.id) ? updatedMap.get(t.id) : t);
    const newTrips = updatedTrips.filter(t => !existingIds.has(t.id));
    return [...newTrips, ...merged];
};

const getPageNumber = (queryKey) => queryKey.find(k => typeof k === 'object' && k !== null && 'page' in k)?.page ?? 1;

const invalidateFromPage = (queryClient, fromPage) => {
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    allEntries.forEach(([key]) => {
        if (getPageNumber(key) >= fromPage) {
            queryClient.invalidateQueries({ queryKey: key });
        }
    });
};

const updateDispatchOrdersCache = (queryClient, trip, oids = []) => {
    const key = dispatchKeys.trips('driver');
    const cachedTrips = queryClient.getQueryData(key);
    queryClient.setQueryData(key, mergeTrips(cachedTrips, [trip]));
    if (oids.length === 0) return;

    const allUndispatchedEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    if (allUndispatchedEntries.length === 0) return;
    const sortedEntries = [...allUndispatchedEntries].sort(([a], [b]) => getPageNumber(a) - getPageNumber(b));
    const affectedPages = sortedEntries
        .filter(([, cachedPage]) => {
            if (!cachedPage) return false;
            return (cachedPage.data ?? []).some(o => oids.includes(Number(o.id)));
        }).map(([key]) => getPageNumber(key));

    if (affectedPages.length === 0) {
        invalidateFromPage(queryClient, 1);
        return;
    }
    const lowestAffectedPage = Math.min(...affectedPages);
    const pageMap = new Map(sortedEntries.map(([key, data]) => [getPageNumber(key), { key, data }]));
    if (lowestAffectedPage > 1) {
        invalidateFromPage(queryClient, lowestAffectedPage);
        return;
    }
    const page1 = pageMap.get(1);
    const perPage = page1.data.perPage ?? 50;
    let page1Data = (page1.data.data ?? []).filter(o => !oids.includes(Number(o.id)));
    let lastFilledPage = 1;
    let nextPageNum = 2;
    while (page1Data.length < perPage) {
        const nextPage = pageMap.get(nextPageNum);
        if (!nextPage || !nextPage.data) {
            invalidateFromPage(queryClient, 1);
            return;
        }
        const nextPageData = nextPage.data.data ?? [];
        const needed = perPage - page1Data.length;
        if (nextPageData.length <= needed) {
            page1Data = [...page1Data, ...nextPageData];
            lastFilledPage = nextPageNum;
            nextPageNum++;
        } else {
            page1Data = [...page1Data, ...nextPageData.slice(0, needed)];
            lastFilledPage = nextPageNum;
            break;
        }
    }
    queryClient.setQueryData(page1.key, { ...page1.data, data: page1Data, total: (page1.data.total ?? 0) - oids.length, });
    invalidateFromPage(queryClient, lastFilledPage);
};

export function useDispatchOrderMutation() {

    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const updateDispatchCache = useDispatchCacheUpdate();

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const createTrip = useMutation({
        mutationFn: async ({ payload }) => {
            const res = await DispatchOrderApi.createTrip(payload);
            return res.data;
        },
        onSuccess: (newTrip) => {
            const oids = newTrip.dispatched_orders.map(o => Number(o.id))
            updateDispatchOrdersCache(queryClient, newTrip, oids)
            enqueueSnackbar('Trip has been successfully created', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: handleError,
    });

    const addOrdersToTrip = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await DispatchOrderApi.addOrdersToTrip(id, payload);
            return res.data;
        },
        onSuccess: (tripUpdate, { id, payload }) => {
            const oids = payload
            updateDispatchOrdersCache(queryClient, tripUpdate, oids)
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            enqueueSnackbar('New Orders has been sucessfully added to trip', { variant: 'success' });
        },
        onError: handleError,
    });

    const undispatchOrder = useMutation({
        mutationFn: async ({ id, oid }) => {
            const res = await DispatchOrderApi.removeOrderFromTrip(id, oid)
            return res.data
        },
        onSuccess: (updated) => {
            if (updated) {
                const { trip, undispatch_order } = updated
                const orderId = undispatch_order ? undispatch_order.order_id : null
                const order = { id: orderId, order_status: 'Entered' }
                const hasCachedOrderList = queryClient.getQueriesData({ queryKey: 'orders' })
                if (orderId) {
                    updateDispatchCache({ order, trips: [trip], undispatchedOrders: [undispatch_order] });
                    if (hasCachedOrderList.length > 0) {
                        hasCachedOrderList.forEach(([key, old]) => {
                            queryClient.setQueryData(key, (prev = {}) => ({
                                ...prev,
                                data: (prev.data || []).map(item => item.id === Number(order.id) ? { ...item, ...order } : item)
                            }));
                        });
                    }
                    else queryClient.invalidateQueries({ queryKey: ['orders'] })
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'driver'] })
                    queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] })
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                }
            }
            enqueueSnackbar('Order has been successfully undispatched', { variant: 'success' })
        },
        onError: handleError,
    })

    const updateTrip = useMutation({
        mutationFn: async ({ trip_id, payload }) => {
            const res = await DispatchOrderApi.updateTrip(trip_id, payload)
            return res.data
        },
        onSuccess: (updated) => {
            if (updated) {
                const tripStatus = updated.trip_status
                const tripType = updated.trip_type
                const key = ['dispatch', 'trips', tripType]
                const cachedTrips = queryClient.getQueryData(key)
                if (tripStatus === 'completed') {
                    queryClient.setQueryData(key, removeTrips(cachedTrips, updated.id))
                    queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] });
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                }
                else {
                    queryClient.setQueryData(key, mergeTrips(cachedTrips, [updated]))
                }
            }
            enqueueSnackbar('Trip has been successfully updated', { variant: 'success' })
        },
        onError: handleError
    })

    return { createTrip, addOrdersToTrip, undispatchOrder, updateTrip }

}