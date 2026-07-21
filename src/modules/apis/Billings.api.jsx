import CustomAxios from './customAxios'

const getOrdersForBilling = (params = {}) => CustomAxios.get('/api/billings', { params })

const getApprovedOrders = (params = {}) => CustomAxios.get('/api/billings/invoicing', { params })

const applyCustomerAccessorials = (oid, payload) => CustomAxios.put(`/api/billings/calculations/accessorials/order/${oid}`, payload)

export default {
    getOrdersForBilling,
    applyCustomerAccessorials,
    getApprovedOrders
}
