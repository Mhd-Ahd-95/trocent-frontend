import CustomAxios from './customAxios';

const loadTripAndUndispatched = (type, params = {}) =>    CustomAxios.get('/api/dispatch-orders/trip-undispatched', {params: { trip_type: type, ...params }});

const getUndispatchedOrders = (params = {}) =>    CustomAxios.get('/api/dispatch-orders/undispatched', { params });

const getTripsByType = (type) =>    CustomAxios.get('/api/dispatch-orders/active-trips', {params: { trip_type: type }});

const loadCompletedTrips = (params = {}) =>    CustomAxios.get('/api/dispatch-orders/completed', { params });

const createTrip = (payload) => CustomAxios.post('/api/trips', payload)

const addOrdersToTrip = (tid, payload) => CustomAxios.put(`/api/trips/${tid}`, payload)

const updateTrip = (tid, payload) => CustomAxios.put(`/api/trips/update/${tid}`, payload)

const removeOrderFromTrip = (tid, oid) => CustomAxios.put(`/api/trips/${tid}/undispatch-order/${oid}`)

export default {
    loadTripAndUndispatched,
    getUndispatchedOrders,
    getTripsByType,
    loadCompletedTrips,
    createTrip,
    addOrdersToTrip,
    updateTrip,
    removeOrderFromTrip
};