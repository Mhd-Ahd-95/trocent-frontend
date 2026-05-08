import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";

export function useUpdateOrderStatus() {

    const queryClient = useQueryClient();

    return async (trip = {}) => {

        let invalidateCompletedOrdersTrip = false

        const trip_type = trip?.trip_type
        const trip_id = trip?.trip_id
        const trip_status = trip?.trip_status
        const newDispatchedOrders = trip?.dispatchedOrders ?? []
        const orderIds = new Set(newDispatchedOrders.map(nd => nd.order_id))
        const invalidateInterliners = newDispatchedOrders.some(t => t.update_interliner)
        const key = dispatchKeys.trips(trip_type);
        const cachedTrips = queryClient.getQueryData(key);
        if (trip_status === 'completed') {
            if (cachedTrips) {
                queryClient.setQueryData(key, (old = []) => old.filter(o => Number(o.id) !== Number(trip_id)));
            }
            else {
                queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('driver') })
            }
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] })
        }
        else {
            if (cachedTrips) {
                queryClient.setQueryData(key, (old = []) => old.map(o => {
                    if (Number(o.id) === Number(trip_id)) {
                        let oldDispatchOrders = o.dispatched_orders ?? []
                        let oldTotalOrdersCompleted = Number(o.total_orders_completed)
                        for (let ndo of newDispatchedOrders) {
                            const newOrderStatus = ndo.order_status
                            if (newOrderStatus === 'completed') {
                                oldDispatchOrders = oldDispatchOrders.filter(od => Number(od.id) !== Number(ndo.id))
                                oldTotalOrdersCompleted += 1
                                invalidateCompletedOrdersTrip = true
                            }
                            if (newOrderStatus === 'picked up') {
                                oldDispatchOrders = oldDispatchOrders.map(od => Number(od.id) === Number(ndo.id) ? { ...od, ...ndo } : od)
                            }
                        }
                        return { ...o, total_orders_completed: oldTotalOrdersCompleted, dispatched_orders: oldDispatchOrders }
                    }
                    return o
                }));
            }
            else {
                queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('driver') })
            }
        }
        if (invalidateInterliners) {
            queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('interliner') })
        }
        if (invalidateCompletedOrdersTrip) {
            queryClient.invalidateQueries({ queryKey: ['dispatchedOrdersCompleted', Number(trip_id)], exact: true })
        }
        if (orderIds.size > 0) {
            for (let oid of orderIds) {
                queryClient.invalidateQueries({ queryKey: ['order', Number(oid)], exact: true })
            }
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    };
}