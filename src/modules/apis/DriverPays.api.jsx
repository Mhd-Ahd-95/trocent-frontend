import CustomAxios from "./customAxios";


const getPendingCommissionDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/commissions', { params })

const getPendingHourlyDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/hourly', { params })

const getHourlyDriverPayDetails = (did, params = {}) => CustomAxios.get(`/api/driver-pays/hourly/details/${did}`, { params })

const approvedDriverPayHourly = (did, payload) => CustomAxios.put(`/api/driver-pays/hourly/status/${did}`, payload)

const loadApprovedDriverTotals = (params = {}) => CustomAxios.get(`/api/driver-pays/register/hourly`, { params })

export default {
    getPendingCommissionDriverPay,
    getPendingHourlyDriverPay,
    getHourlyDriverPayDetails,
    approvedDriverPayHourly,
    loadApprovedDriverTotals
}