import CustomAxios from "./customAxios";


const loadBillingUnregister = (params = {}) => CustomAxios.get('/api/accounting/billing-unregister', { params })

const loadBillingRegistered = (params = {}) => CustomAxios.get('/api/accounting/billing-registered', { params })

const registerInvoices = (payload) => CustomAxios.put('/api/accounting/register-invoices', payload)

const resendCustomerInvoices = payload => CustomAxios.put('/api/accounting/registered/resend-invoices', payload)


export default {
    loadBillingRegistered,
    loadBillingUnregister,
    registerInvoices,
    resendCustomerInvoices
}