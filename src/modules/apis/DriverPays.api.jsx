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

const payDriverHourlyRegister = (payload) => CustomAxios.put('/api/driver-pays/hourly-register', payload)

const batchPayDriverHourlyRegister = (payload) => CustomAxios.put('/api/driver-pays/batch-hourly-register', payload)

const downloadCompanyInvoice = async (payload) => {
    const response = await CustomAxios.post('/api/driver-pays/hourly-register', payload, { responseType: 'blob', });
    const blob = new Blob([response.data], { type: 'application/pdf', });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // console.log(response)
    // const contentDisposition = response.headers['content-disposition'];
    let filename = 'company-invoice.pdf';
    // if (contentDisposition) {
    //     const match = contentDisposition.match(/filename="?([^"]+)"?/);
    //     if (match) {
    //         filename = match[1];
    //     }
    // }
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

const loadDriverHourlyRegistered = async (params = {}) => CustomAxios.get('/api/driver-pays/driver-hourly-registered', { params })

const resendCompaniesinvoice = async (data) => CustomAxios.put('/api/driver-pays/resend-companies-invoice', data)

export default {
    getPendingCommissionDriverPay,
    getPendingHourlyDriverPay,
    getHourlyDriverPayDetails,
    approvedDriverPayHourly,
    loadApprovedDriverTotals,
    addExtraCharge,
    deleteExtraCharge,
    updateExtraCharge,
    saveDriverPayDailyAdjustment,
    payDriverHourlyRegister,
    batchPayDriverHourlyRegister,
    downloadCompanyInvoice,
    loadDriverHourlyRegistered,
    resendCompaniesinvoice
}