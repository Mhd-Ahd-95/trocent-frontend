import CustomAxios from './customAxios'

const getCustomers = () => CustomAxios.get('/api/customers')

const getCustomer = rid => CustomAxios.get(`/api/customers/${rid}`)

const updateCustomer = (rid, ab) => CustomAxios.put(`/api/customers/${rid}`, ab)

const createCustomer = ab => CustomAxios.post('/api/customers', ab,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
)

const deleteCustomer = rid => CustomAxios.delete(`/api/customers/${rid}`)

const deleteCustomers = ids => CustomAxios.delete('/api/customers', { data: { ids } })

const downloadFile = id => CustomAxios.get(`/api/customers/download-file/${id}`, { responseType: 'blob' })

const getCustomersNames = () => CustomAxios.get('/api/customers/names')

export default {
    getCustomer,
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    deleteCustomers,
    downloadFile,
    getCustomersNames
}
