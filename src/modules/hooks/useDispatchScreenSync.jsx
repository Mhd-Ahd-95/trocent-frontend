import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();

    useEffect(() => {

        const channel = window.Echo.channel('dispatch-screen');

        channel.listen('.dispatch.updated', (e) => {
            const { undispatched_orders, action, trips, orderId } = e;
            updateDispatchCache({ orderId, trips, undispatchedOrders: undispatched_orders, action });
        });

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}