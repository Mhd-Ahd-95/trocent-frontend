import CustomAxios from './customAxios'

const getRateSheets = (pmode) => CustomAxios.get('/api/rate-sheets', { params: { ...pmode } })

const getRateSheet = rid => CustomAxios.get(`/api/rate-sheets/${rid}`)

const updateRateSheet = (rid, ab) => CustomAxios.put(`/api/rate-sheets/${rid}`, ab)

const createRateSheets = ab => CustomAxios.post('/api/rate-sheets/batch', ab)

const deleteRateSheetByBatchId = rid => CustomAxios.delete(`/api/rate-sheets/batch/${rid}`)

const deleteRateSheets = rids => CustomAxios.delete('/api/rate-sheets', { data: { rids } })

const getRateSheetsByCustomer = cid => CustomAxios.get(`/api/rate-sheets/customer/${cid}/batch`)

const loadCustomerRateSheets = cid => CustomAxios.get(`/api/rate-sheets/customer/${cid}/sheets`)

const loadRateSheetsByCustomerAndType = (cid, type) => CustomAxios.get(`/api/rate-sheets/customer/${cid}/type`)

export default {
    getRateSheet,
    getRateSheets,
    createRateSheets,
    updateRateSheet,
    deleteRateSheetByBatchId,
    deleteRateSheets,
    getRateSheetsByCustomer,
    loadCustomerRateSheets,
    loadRateSheetsByCustomerAndType
}
