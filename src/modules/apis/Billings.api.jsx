import CustomAxios from './customAxios'

const getOrdersForBilling = () => CustomAxios.get('/api/billings')

const applyCustomerAccessorials = (oid, payload) => CustomAxios.put(`/api/billings/calculations/accessorials/order/${oid}`, payload)

export default {
    getOrdersForBilling,
    applyCustomerAccessorials
}
