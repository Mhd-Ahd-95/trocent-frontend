import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";


export function useReorderOrders() {
    const queryClient = useQueryClient();

    return async (trip) => {
        const trip_type = trip?.trip_type
        const orders = trip.dispatchedOrders || []
        const tripId = trip.trip_id
        if (trip_type && tripId) {
            const key = dispatchKeys.trips(trip_type);
            const cachedTrips = queryClient.getQueryData(key);
            if (cachedTrips) {
                queryClient.setQueryData(key, (old = []) => old.map(o => {
                    if (Number(o.id) === Number(tripId)) {
                        return ({
                            ...o,
                            dispatched_orders: o.dispatched_orders.map(d => {
                                const found = orders.find(no => Number(no.id) === Number(d.id))
                                if (found) {
                                    return ({ ...d, ...found })
                                }
                                return d
                            })
                        })
                    }
                    return o
                }));
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', trip_type] })
            }
        }
        else {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'driver'] })
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'interliner'] })
        }
    };
}