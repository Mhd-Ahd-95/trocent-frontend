import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';
import { useUpdateTripUndispatchOrders } from './useUpdateTripUndispatchOrders';
import { useDispatchScreenTripUpdated } from './useDispatchScreenTripUpdated';
import { useUpdateOrderStatus } from './useUpdateOrderStatus';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();
    const updateTripUndispatchOrders = useUpdateTripUndispatchOrders()
    const updateTrip = useDispatchScreenTripUpdated()
    const updateOrderStatus = useUpdateOrderStatus()

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
            console.log(trip);
            updateOrderStatus(trip)
        })

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}