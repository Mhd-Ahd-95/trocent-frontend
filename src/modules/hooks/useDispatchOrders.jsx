import { useQuery } from "@tanstack/react-query";
import DispatchOrderApi from "../apis/DispatchOrder.api";

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

export function useDriverTrips({enabled = false}) {
    return useQuery({
        queryKey: dispatchKeys.trips('driver'),
        queryFn: async () => {
            const response = await DispatchOrderApi.getTripsByType('driver');
            console.log(response.data);
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
            console.log(response.data);
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
            console.log(response.data);
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
            console.log(response.data);
            return response.data;
        },
        enabled,
        ...BASE_QUERY_CONFIG,
        placeholderData: (prev) => prev,
    });
}