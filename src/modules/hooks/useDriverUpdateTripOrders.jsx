import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";

export function useDriverUpdateTripOrders() {
    const queryClient = useQueryClient();

    return async (trip) => {
        const trip_id = trip?.trip_id
        const dispatchedOrders = trip?.dispatched_orders || []
        const key = dispatchKeys.trips('driver');
        const cachedTrips = queryClient.getQueryData(key);
        if (cachedTrips) {
            queryClient.setQueryData(key, (old = []) => old.map((o) => {
                if (Number(o.id) === Number(trip_id)) {
                    const tripOrders = o.dispatched_orders || []
                    const updatedOrders = tripOrders.map(to => {
                        const found = dispatchedOrders.find(no => Number(no.id) === Number(to.id))
                        if (found) {
                            return ({ ...to, ...found })
                        }
                        return to
                    }).sort((a, b) => Number(a.order_level) - Number(b.order_level))
                    return { ...o, dispatched_orders: updatedOrders }
                }
                return o
            }))
        }
        else {
            queryClient.invalidateQueries({ queryKey: key })
        }
        queryClient.invalidateQueries({ queryKey: ['tripActivities', Number(trip_id)] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['order'] })
    };
}