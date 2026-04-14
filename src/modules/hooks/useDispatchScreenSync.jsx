import { useEffect } from 'react';
import { useDispatchCacheUpdate } from './useDispatchCacheUpdate';

export function useDispatchScreenSync() {

    const updateDispatchCache = useDispatchCacheUpdate();

    useEffect(() => {

        const channel = window.Echo.channel('dispatch-screen');

        channel.listen('.dispatch.updated', (e) => {
            const { trips, undispatched_orders, order, action } = e;
            console.log(e);
            updateDispatchCache({ order, trips, undispatchedOrders: undispatched_orders, action });
        });

        return () => {
            window.Echo.leaveChannel('dispatch-screen');
        };

    }, []);
}