import CustomAxios from './customAxios';

const loadTripAndUndispatched = (type, params = {}) =>    CustomAxios.get('/api/dispatch-orders/trip-undispatched', {params: { trip_type: type, ...params }});

const getUndispatchedOrders = (params = {}) =>    CustomAxios.get('/api/dispatch-orders/undispatched', { params });

const getTripsByType = (type) =>    CustomAxios.get('/api/dispatch-orders/active-trips', {params: { trip_type: type }});

const loadCompletedTrips = (params = {}) =>    CustomAxios.get('/api/dispatch-orders/completed', { params });

export default {
    loadTripAndUndispatched,
    getUndispatchedOrders,
    getTripsByType,
    loadCompletedTrips,
};