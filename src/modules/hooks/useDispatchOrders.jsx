import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DispatchOrderApi from "../apis/DispatchOrder.api";
import { useSnackbar } from "notistack";

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

export function useUndispatchedDriversCount({ enabled }) {
    return useQuery({
        queryKey: ['undispatchedDriversCount'],
        queryFn: async () => {
            const response = await DispatchOrderApi.getUndispatchedDrivers();
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

export function useDispatchOrderMutation() {

    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

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
            enqueueSnackbar('Trip has been successfully created', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['order'] })
            queryClient.invalidateQueries({ queryKey: ['undispatchedDriversCount'], exact: true })
        },
        onError: handleError,
    });

    const addOrdersToTrip = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await DispatchOrderApi.addOrdersToTrip(id, payload);
            return res.data;
        },
        onSuccess: (tripUpdate, { id, payload }) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['order'] })
            queryClient.invalidateQueries({ queryKey: ['undispatchedDriversCount'], exact: true })
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
                queryClient.invalidateQueries({ queryKey: ['orders'] })
                queryClient.invalidateQueries({ queryKey: ['undispatchedDriversCount'], exact: true })
                queryClient.invalidateQueries({ queryKey: ['order'] })
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
                queryClient.invalidateQueries({ queryKey: ['order'] });
            }
            queryClient.invalidateQueries({ queryKey: ['undispatchedDriversCount'], exact: true })
            enqueueSnackbar('Trip has been successfully updated', { variant: 'success' })
        },
        onError: handleError
    })

    return { createTrip, addOrdersToTrip, undispatchOrder, updateTrip }

}