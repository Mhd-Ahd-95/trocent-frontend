import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";

const mergeTrips = (cachedTrips = [], updatedTrip = {}) => {
    const merged = cachedTrips.map(t => updatedTrip.id === t.id ? ({ ...t, ...updatedTrip }) : t);
    return [...merged];
};

export function useDispatchScreenTripUpdated() {
    const queryClient = useQueryClient();

    return async (trip) => {
        const trip_type = trip?.trip_type
        if (trip_type) {
            const key = dispatchKeys.trips(trip_type);
            const cachedTrips = queryClient.getQueryData(key);
            const cachedDriverTrips = queryClient.getQueryData(['driverTrips', Number(trip.driver_id)])
            if (cachedTrips) {
                queryClient.setQueryData(key, mergeTrips(cachedTrips, trip));
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', trip_type] })
            }
            if (trip.trip_status === 'completed') {
                queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] })
            }
            if (cachedDriverTrips) {
                if (trip.trip_status === 'completed') {
                    queryClient.setQueryData(['driverTrips', Number(trip.id)], (old = []) => old.filter((o) => Number(o.id) !== Number(trip.id)))
                    queryClient.invalidateQueries({ queryKey: ['driverCompletedTrips'] })
                }
                else {
                    queryClient.setQueryData(['driverTrips', Number(trip.driver_id)], (old = []) => old.map((o) => Number(o.id) === Number(trip.id) ? trip : o))
                }
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['driverTrips'] })
                queryClient.invalidateQueries({ queryKey: ['driverCompletedTrips'] })
            }
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['order'] })
        }
        else {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'driver'] })
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'interliner'] })
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['order'] })
            queryClient.invalidateQueries({ queryKey: ['driverTrips'] })
            queryClient.invalidateQueries({ queryKey: ['driverCompletedTrips'] })
        }
    };
}