import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';
import { useUpdateTripUndispatchOrders } from './useUpdateTripUndispatchOrders';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();
    const updateTripUndispatchOrders = useUpdateTripUndispatchOrders()

    useEffect(() => {

        const channel = window.Echo.channel('dispatch-screen');

        channel.listen('.dispatch.updated', (e) => {
            const { undispatched_orders, action, trips, orderId } = e;
            updateDispatchCache({ orderId, trips, undispatchedOrders: undispatched_orders, action });
        });

        channel.listen('.dispatch.screen.updated', ({ trip_id, oids }) => {
            updateTripUndispatchOrders(trip_id, oids);
        });

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}