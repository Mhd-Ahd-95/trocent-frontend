import globalVariables from '../global'
import CustomAxios from './customAxios'

const getOrders = (payload) => CustomAxios.get('/api/orders', { data: { ...payload } })

const getOrderById = (oid) => CustomAxios.get(`/api/orders/${oid}`)

const createOrder = (payload) => CustomAxios.post('/api/orders', payload)

const uploadFile = (payload) => CustomAxios.post('/api/orders/upload-file', payload, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
})

const downloadFile = (fid) => CustomAxios.get(`/api/orders/file/download/${fid}`, { responseType: 'blob' })

const deleteFile = (fid) => CustomAxios.delete(`/api/orders/file/delete/${fid}`)

const updateOrder = (oid, payload) => {
    const authedUser = globalVariables.auth.user
    return CustomAxios.put(`/api/orders/${oid}/${authedUser.id}`, payload)
}

const duplicateOrder = (oid, uid) => CustomAxios.put(`/api/orders/${oid}/user/${uid}`)

const cancelOrder = (oid, uid, sts) => CustomAxios.patch(`/api/orders/${oid}/user/${uid}/status/${sts}`)

export default {
    getOrders,
    getOrderById,
    createOrder,
    uploadFile,
    downloadFile,
    deleteFile,
    updateOrder,
    cancelOrder,
    duplicateOrder
}