import CustomAxios from "./customAxios";


const getPendingCommissionDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/commissions', { params })

const getPendingHourlyDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/hourly', { params })

const getHourlyDriverPayDetails = (did, params = {}) => CustomAxios.get(`/api/driver-pays/hourly/details/${did}`, { params })

export default {
    getPendingCommissionDriverPay,
    getPendingHourlyDriverPay,
    getHourlyDriverPayDetails
}