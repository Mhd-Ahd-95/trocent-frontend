import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';
import { useUpdateTripUndispatchOrders } from './useUpdateTripUndispatchOrders';
import { useDispatchScreenTripUpdated } from './useDispatchScreenTripUpdated';
import { useUpdateOrderStatus } from './useUpdateOrderStatus';
import { useUpdateTerminalInUndispatchOrder } from './useUpdateTerminalInUndispatchOrder';
import { useReorderOrders } from './useReorderOrders';
import { useDriverUpdateTripOrders } from './useDriverUpdateTripOrders';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();
    const updateTripUndispatchOrders = useUpdateTripUndispatchOrders()
    const updateTrip = useDispatchScreenTripUpdated()
    const updateOrderStatus = useUpdateOrderStatus()
    const updateTerminal = useUpdateTerminalInUndispatchOrder()
    const reorderOrders = useReorderOrders()
    const driverUpdateOrders = useDriverUpdateTripOrders()

    useEffect(() => {

        const channel = window.Echo.channel('dispatch-screen');

        channel.listen('.dispatch.updated', (e) => {
            const { undispatched_orders, action, trips, orderId, freights } = e;
            updateDispatchCache({ orderId, trips, undispatchedOrders: undispatched_orders, action, freights });
        });

        channel.listen('.dispatch.screen.addOrCreate', ({ trip_id, oids }) => {
            updateTripUndispatchOrders(trip_id, oids);
        });

        channel.listen('.dispatch.screen.trip.updated', ({ trip }) => {
            updateTrip(trip)
        });

        channel.listen('.dispatch.trip.orderStatus', (trips) => {
            updateOrderStatus(trips)
        })

        channel.listen('.dispatch.undispatchOrder.terminal', (order) => {
            updateTerminal(order)
        })

        channel.listen('.dispatch.reorder.orders', (trip) => {
            reorderOrders(trip)
        })

        channel.listen('.dispatch.driver.orderStatus', (trip) => {
            driverUpdateOrders(trip)
        })

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}