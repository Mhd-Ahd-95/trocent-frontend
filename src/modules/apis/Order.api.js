import globalVariables from '../global'
import CustomAxios from './customAxios'

const getOrders = (params = {}) => CustomAxios.get('/api/orders', { params })

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

const updateTerminal = (oid, t, l) => CustomAxios.patch(`/api/orders/order/${oid}/terminal/${t}/leg/${l}`)

const addNote = (payload) => CustomAxios.post('/api/orders/order/add-note', payload)

const getNotes = (oid) => CustomAxios.get(`/api/orders/order/${oid}/notes`)

export default {
    getOrders,
    getOrderById,
    createOrder,
    uploadFile,
    downloadFile,
    deleteFile,
    updateOrder,
    cancelOrder,
    duplicateOrder,
    updateTerminal,
    getNotes,
    addNote
}