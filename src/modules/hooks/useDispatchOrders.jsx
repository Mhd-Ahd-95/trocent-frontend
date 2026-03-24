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

const updateDispatchOrdersCache = (queryClient, trip, created = false, oids = []) => {
    const key = dispatchKeys.trips('driver');
    const allUndispatchedEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    if (created) {
        queryClient.setQueryData(key, (old = []) => ([trip, ...old]));
    }
    else {
        queryClient.setQueryData(key, (old = []) => old.map(t => Number(t.id) === Number(trip.id)) ? trip : t);
    }
    allUndispatchedEntries.forEach(([key, cachedPage]) => {
        if (!cachedPage) return;
        const newData = (cachedPage?.data ?? []).filter(o => !oids.includes(Number(o.id)))
        const updated = {
            ...cachedPage,
            data: newData,
            meta: { ...cachedPage.meta, total: (cachedPage.meta?.total ?? 0) - oids.length },
        };
        queryClient.setQueryData(key, updated);
    });
}

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
            updateDispatchOrdersCache(queryClient, newTrip, true, oids)
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
            updateDispatchOrdersCache(queryClient, tripUpdate, false, oids)
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
            console.log(updated);
            if (updated) {
                const { trips, undispatched_orders } = updated
                const orderId = undispatched_orders?.length > 0 ? undispatched_orders[0].order_id : 0
                const order = { id: orderId, order_status: 'Entered' }
                const hasCachedOrderList = queryClient.getQueriesData({ queryKey: 'orders' })
                if (orderId) {
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
                updateDispatchCache({ order, trips: trips, undispatchedOrders: undispatched_orders });
            }
            enqueueSnackbar('Order has been successfully undispatched', { variant: 'success' })
        },
        onError: handleError,
    })

    return { createTrip, addOrdersToTrip, undispatchOrder }

}