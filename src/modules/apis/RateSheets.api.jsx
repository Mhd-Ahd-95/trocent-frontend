import CustomAxios from './customAxios'

const getRateSheets = () => CustomAxios.get('/api/rate-sheets')

const getRateSheet = rid => CustomAxios.get(`/api/rate-sheets/${rid}`)

const updateRateSheet = (rid, ab) => CustomAxios.put(`/api/rate-sheets/${rid}`, ab)

const createRateSheets = ab => CustomAxios.post('/api/rate-sheets/batch', ab)

const deleteRateSheetByCustomer = rid => CustomAxios.delete(`/api/rate-sheets/${rid}`)

const deleteRateSheets = rids => CustomAxios.delete('/api/rate-sheets', { data: { rids } })

const getRateSheetsByCustomer = cid => CustomAxios.get(`/api/rate-sheets/customer/${cid}`)

export default {
    getRateSheet,
    getRateSheets,
    createRateSheets,
    updateRateSheet,
    deleteRateSheetByCustomer,
    deleteRateSheets,
    getRateSheetsByCustomer
}
