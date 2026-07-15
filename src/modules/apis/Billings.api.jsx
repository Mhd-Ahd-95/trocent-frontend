import CustomAxios from './customAxios'

const getOrdersForBilling = (params = {}) => CustomAxios.get('/api/billings', { params })

const applyCustomerAccessorials = (oid, payload) => CustomAxios.put(`/api/billings/calculations/accessorials/order/${oid}`, payload)

export default {
    getOrdersForBilling,
    applyCustomerAccessorials
}
