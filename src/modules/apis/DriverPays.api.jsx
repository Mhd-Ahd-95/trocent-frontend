import CustomAxios from "./customAxios";


const getPendingCommissionDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/commissions', { params })

const getPendingHourlyDriverPay = (params = {}) => CustomAxios.get('/api/driver-pays/hourly', { params })

const getHourlyDriverPayDetails = (did, params = {}) => CustomAxios.get(`/api/driver-pays/hourly/details/${did}`, { params })

const approvedDriverPayHourly = (did, payload) => CustomAxios.put(`/api/driver-pays/hourly/status/${did}`, payload)

const loadApprovedDriverTotals = (params = {}) => CustomAxios.get(`/api/driver-pays/register/hourly`, { params })

const addExtraCharge = (dt) => CustomAxios.post(`/api/extra-company-charges`, dt)

const updateExtraCharge = (id, dt) => CustomAxios.put(`/api/extra-company-charges/${id}`, dt)

const deleteExtraCharge = (id) => CustomAxios.delete(`/api/extra-company-charges/${id}`)

const saveDriverPayDailyAdjustment = (did, payload) => CustomAxios.put(`/api/driver-pays/hourly/day-adjustment/${did}`, payload)

export default {
    getPendingCommissionDriverPay,
    getPendingHourlyDriverPay,
    getHourlyDriverPayDetails,
    approvedDriverPayHourly,
    loadApprovedDriverTotals,
    addExtraCharge,
    deleteExtraCharge,
    updateExtraCharge,
    saveDriverPayDailyAdjustment
}