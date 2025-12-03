import CustomAxios from './customAxios'

const getOrders = () => CustomAxios.get('/api/orders')

const getOrderById = (oid) => CustomAxios.get(`/api/orders/${oid}`)

const createOrder = (payload) => CustomAxios.post('/api/orders', payload)

const uploadFile = (payload) => CustomAxios.post('/api/orders/upload-file', payload, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
})

const downloadFile = (fid) => CustomAxios.get(`/api/orders/file/download/${fid}`, { responseType: 'blob' })

const deleteFile = (fid) => CustomAxios.delete(`/api/orders/file/delete/${fid}`)

export default {
    getOrders,
    getOrderById,
    createOrder,
    uploadFile,
    downloadFile,
    deleteFile
}