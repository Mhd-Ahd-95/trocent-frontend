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

export function useTripById(id, isDriver = false) {
    return useQuery({
        queryKey: ['trip', Number(id)],
        queryFn: async () => {
            const response = await DispatchOrderApi.getTripById(id, isDriver);
            return response.data;
        },
        enabled: !!id,
        ...BASE_QUERY_CONFIG,
    });
}

export function useDriverTripsById(id) {
    return useQuery({
        queryKey: ['driverTrips', Number(id)],
        queryFn: async () => {
            const response = await DispatchOrderApi.getDriverTripsById(id);
            return response.data;
        },
        enabled: !!id,
        ...BASE_QUERY_CONFIG,
    });
}


export function useCompletedDriverTrips(id) {
    return useQuery({
        queryKey: ['driverCompletedTrips', Number(id)],
        queryFn: async () => {
            const response = await DispatchOrderApi.countDriverCompletedTrips(id);
            return response.data;
        },
        enabled: !!id,
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


export function useDispatchedOrdersCompleted(tid, enabled) {
    const { enqueueSnackbar } = useSnackbar();

    return useQuery({
        queryKey: ['dispatchedOrdersCompleted', Number(tid)],
        queryFn: async () => {
            const response = await DispatchOrderApi.getCompletedOrders(tid);
            if (response.data?.status && response.data.status !== 200) {
                enqueueSnackbar(response.data.message || 'Something went wrong', { variant: 'error' });
            }
            return response.data;
        },
        enabled: !!tid && enabled,
        ...BASE_QUERY_CONFIG,
        throwOnError: false,
        meta: {
            onError: (error) => {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        }
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
        },
        onError: handleError,
    });

    const addOrdersToTrip = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await DispatchOrderApi.addOrdersToTrip(id, payload);
            return res.data;
        },
        onSuccess: (tripUpdate, { id, payload }) => {
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
        mutationFn: async (payload) => {
            console.log(payload);
            const res = await DispatchOrderApi.updateTrip(payload.trip_id, payload.payload)
            return res.data
        },
        onSuccess: (updated) => {
            if (updated) {
            }
            enqueueSnackbar('Trip has been successfully updated', { variant: 'success' })
        },
        onError: handleError
    })

    const reorderDispatchedOrders = useMutation({
        mutationFn: async ({ tripId, payload }) => {
            const res = await DispatchOrderApi.reorderOrders(tripId, payload)
            return res.data
        },
        onSuccess: (res) => {
            enqueueSnackbar('Reorder order updated successfully', { variant: 'success' })
        },
        onError: handleError
    })

    return { createTrip, addOrdersToTrip, undispatchOrder, updateTrip, reorderDispatchedOrders }

}