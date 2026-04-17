import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';
import { useUpdateTripUndispatchOrders } from './useUpdateTripUndispatchOrders';
import { useDispatchScreenTripUpdated } from './useDispatchScreenTripUpdated';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();
    const updateTripUndispatchOrders = useUpdateTripUndispatchOrders()
    const updateTrip = useDispatchScreenTripUpdated()

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

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}