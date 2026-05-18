import CustomAxios from './customAxios';

const loadTripAndUndispatched = (type, params = {}) => CustomAxios.get('/api/dispatch-orders/trip-undispatched', { params: { trip_type: type, ...params } });

const getUndispatchedOrders = (params = {}) => CustomAxios.get('/api/dispatch-orders/undispatched', { params });

const getTripsByType = (type) => CustomAxios.get('/api/dispatch-orders/active-trips', { params: { trip_type: type } });

const loadCompletedTrips = (params = {}) => CustomAxios.get('/api/dispatch-orders/completed', { params });

const getUndispatchedDrivers = () => CustomAxios.get('/api/dispatch-orders/undispatched-drivers');

const createTrip = (payload) => CustomAxios.post('/api/trips', payload)

const addOrdersToTrip = (tid, payload) => CustomAxios.put(`/api/trips/${tid}`, payload)

const updateTrip = (tid, payload) => CustomAxios.put(`/api/trips/update/${tid}/trip`, payload)

const acknowlegeTrip = (tid) => CustomAxios.put(`/api/trips/acknowlege-trip/${tid}`)

const removeOrderFromTrip = (tid, oid) => CustomAxios.put(`/api/trips/${tid}/undispatch-order/${oid}`)

const getTripById = (tid, isDriver = false) => CustomAxios.get(`/api/trips/${tid}/${isDriver}`)

const getCompletedOrders = (tid) => CustomAxios.get(`/api/dispatch-orders/dispatched-orders/trip/${tid}`)

const reorderOrders = (tid, payload) => CustomAxios.put(`/api/trips/reorder/trip/${tid}`, payload)

const getDriverTripsById = (did) => CustomAxios.get(`/api/dispatch-orders/trips/driver/${did}`)

const getStopAction = (did, lt) => CustomAxios.get(`/api/dispatch-orders/driver/stop-action/${did}/${lt}`)

const countDriverCompletedTrips = (did) => CustomAxios.get(`/api/dispatch-orders/completed-trips/driver/${did}`)

const driverUpdateStatus = (payload) => CustomAxios.put('/api/orders/dispatched-orders/driver/update/orders', payload)

const driverPickupDeliveryOrders = (payload) => CustomAxios.put('/api/orders/dispatched-orders/driver/pickup-delivery/orders', payload)

const getDriverFreightOrder = (params) => CustomAxios.get('/api/dispatch-orders/freight-order/driver', { params: { ids: params } })

const getTripActivities = (tid) => CustomAxios.get(`/api/trips/driver-activities/${tid}` )

export default {
    loadTripAndUndispatched,
    getUndispatchedOrders,
    getTripsByType,
    loadCompletedTrips,
    createTrip,
    addOrdersToTrip,
    updateTrip,
    getUndispatchedDrivers,
    removeOrderFromTrip,
    getTripById,
    getCompletedOrders,
    reorderOrders,
    getDriverTripsById,
    countDriverCompletedTrips,
    getStopAction,
    driverUpdateStatus,
    getDriverFreightOrder,
    driverPickupDeliveryOrders,
    acknowlegeTrip,
    getTripActivities
};