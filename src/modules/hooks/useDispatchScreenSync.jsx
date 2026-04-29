import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';
import { useUpdateTripUndispatchOrders } from './useUpdateTripUndispatchOrders';
import { useDispatchScreenTripUpdated } from './useDispatchScreenTripUpdated';
import { useUpdateOrderStatus } from './useUpdateOrderStatus';
import { useUpdateTerminalInUndispatchOrder } from './useUpdateTerminalInUndispatchOrder';
import { useReorderOrders } from './useReorderOrders';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();
    const updateTripUndispatchOrders = useUpdateTripUndispatchOrders()
    const updateTrip = useDispatchScreenTripUpdated()
    const updateOrderStatus = useUpdateOrderStatus()
    const updateTerminal = useUpdateTerminalInUndispatchOrder()
    const reorderOrders = useReorderOrders()

    useEffect(() => {

        const channel = window.Echo.channel('dispatch-screen');

        channel.listen('.dispatch.updated', (e) => {
            const { undispatched_orders, action, trips, orderId } = e;
            updateDispatchCache({ orderId, trips, undispatchedOrders: undispatched_orders, action });
        });

        channel.listen('.dispatch.screen.addOrCreate', ({ trip_id, oids }) => {
            updateTripUndispatchOrders(trip_id, oids);
        });

        channel.listen('.dispatch.screen.trip.updated', ({ trip }) => {
            updateTrip(trip)
        });

        channel.listen('.dispatch.trip.orderStatus', (trip) => {
            updateOrderStatus(trip)
        })

        channel.listen('.dispatch.undispatchOrder.terminal', (order) => {
            updateTerminal(order)
        })

        channel.listen('.dispatch.reorder.orders', (trip) => {
            reorderOrders(trip)
        })

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}