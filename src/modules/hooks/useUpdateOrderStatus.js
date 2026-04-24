import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return async (trip) => {
        const trip_type = trip?.trip_type
        const trip_id = trip?.trip_id
        const trip_status = trip?.trip_status
        const dispatchedOrder = trip?.dispatched_order
        const dispatchOrderStatus = dispatchedOrder?.order_status
        const orderId = dispatchedOrder.order_id
        const updateInterliner = trip.update_interliner
        const key = dispatchKeys.trips(trip_type);
        const cachedTrips = queryClient.getQueryData(key);
        if (trip_status === 'completed') {
            if (cachedTrips) {
                queryClient.setQueryData(key, (old = []) => old.filter(o => Number(o.id) !== Number(trip_id)));
            }
            else {
                queryClient.invalidateQueries({ queryKey: key })
            }
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'completed'] })
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
                    queryClient.invalidateQueries({ queryKey: key })
                }
                const cachedCompletedOrder = queryClient.getQueryData(['dispatchedOrdersCompleted', Number(trip_id)])
                if (cachedCompletedOrder) {
                    queryClient.setQueryData(['dispatchedOrdersCompleted', Number(trip_id)], (old = []) => ([dispatchedOrder, ...old]))
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['dispatchedOrdersCompleted', Number(trip_id)], exact: true })
                }
            }
            if (dispatchOrderStatus === 'picked up') {
                if (cachedTrips) {
                    queryClient.setQueryData(key, (old = []) => old.map(o => {
                        if (Number(o.id) === Number(trip_id)) {
                            const newDispatchedOrders = o.dispatched_orders.map(dpo => Number(dpo.id) === Number(dispatchedOrder.id) ? dispatchedOrder : dpo)
                            return ({ ...o, dispatched_orders: newDispatchedOrders })
                        }
                        return o
                    }));
                }
                else {
                    queryClient.invalidateQueries({ queryKey: key })
                }
            }
        }
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['order', Number(orderId)], exact: true })
        if (updateInterliner) {
            queryClient.invalidateQueries({ queryKey: dispatchKeys.trips('interliner') })
        }
    };
}