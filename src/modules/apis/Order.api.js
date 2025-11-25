import CustomAxios from './customAxios'

const getOrders = () => CustomAxios.get('/api/orders')

const getOrderById = (oid) => CustomAxios.get(`/api/orders/${oid}`)

const createOrder = (payload) => {
    console.log('object: ', payload);
    return CustomAxios.post('/api/orders', payload)
}

export default {
    getOrders,
    getOrderById,
    createOrder
}