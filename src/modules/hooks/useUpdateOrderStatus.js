import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return async (trips = []) => {

        let invalidateDriverTrip = false
        let invalidateCompletedTrip = false
        let tripIds = new Set()
        let invalidateInterliners = trips.some(t => t.update_interliner)
        let orderIds = new Set()
        let driverIds = new Set()

        for (let trip of trips) {
            const trip_type = trip?.trip_type
            const trip_id = trip?.trip_id
            const trip_status = trip?.trip_status
            const dispatchedOrder = trip?.dispatched_order
            const dispatchOrderStatus = dispatchedOrder?.order_status
            const orderId = dispatchedOrder.order_id
            orderIds.add(orderId)
            driverIds.add(trip.driver_id)
            const key = dispatchKeys.trips(trip_type);
            const cachedTrips = queryClient.getQueryData(key);
            if (trip_status === 'completed') {
                if (cachedTrips) {
                    queryClient.setQueryData(key, (old = []) => old.filter(o => Number(o.id) !== Number(trip_id)));
                }
                else {
                    invalidateDriverTrip = true
                }
                invalidateCompletedTrip = true
            }
            else {
                if (dispatchOrderStatus === 'completed') {
                    if (cachedTrips) {
                        queryClient.setQueryData(key, (old = []) => old.map(o => {
                            if (Number(o.id) === Number(trip_id)) {
                                const newDispatchedOrders = o.dispatched_orders.filter(dpo => Number(dpo.id) !== Number(dispatchedOrder.id))
                                const total_orders_completed = Number(o.total_orders_completed) + 1
                                return ({ ...o, total_orders_completed, dispatched_orders: newDispatchedOrders })
                            }
                            return o
                        }));
                    }
                    else {
                        invalidateDriverTrip = true
                    }
                    tripIds.add(trip_id)
                }
                if (dispatchOrderStatus === 'picked up') {
                    if (cachedTrips) {
                        queryClient.setQueryData(key, (old = []) => old.map(o => {
                            if (Number(o.id) === Number(trip_id)) {
                                const newDispatchedOrders = o.dispatched_orders.map(dpo => Number(dpo.id) === Number(dispatchedOrder.id) ? { ...dpo, ...dispatchedOrder } : dpo)
                                return ({ ...o, dispatched_orders: newDispatchedOrders })
                            }
                            return o
                        }));
                    }
                    else {
                        invalidateDriverTrip = true
                    }
                }
            }
        }
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        if (orderIds.size > 0) {
            for (let id of orderIds) {
                queryClient.invalidateQueries({ queryKey: ['order', Number(id)], exact: true })
            }
        }
        if (invalidateInterliners) {
            queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('interliner') })
        }
        if (invalidateDriverTrip) {
            queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('driver') })
        }
        if (invalidateCompletedTrip) {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] })
        }
        if (driverIds.size > 0) {
            for (let did of driverIds) {
                queryClient.invalidateQueries({ queryKey: ['driverTrips', Number(did)], exact: true })
            }
        }
        if (tripIds.size > 0) {
            for (let trip_id of tripIds) {
                queryClient.invalidateQueries({ queryKey: ['dispatchedOrdersCompleted', Number(trip_id)], exact: true })
            }
        }
    };
}