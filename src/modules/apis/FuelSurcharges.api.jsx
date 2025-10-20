import CustomAxios from './customAxios'

const getFuelSurcharges = () => CustomAxios.get('/api/fuel-surcharges')

const getFuelSurcharge = rid => CustomAxios.get(`/api/fuel-surcharges/${rid}`)

const updateFuelSurcharge = (rid, ab) => CustomAxios.put(`/api/fuel-surcharges/${rid}`, ab)

const createFuelSurcharge = ab => CustomAxios.post('/api/fuel-surcharges', ab)

const deleteFuelSurcharge = rid => CustomAxios.delete(`/api/fuel-surcharges/${rid}`)


const deleteFuelSurcharges = ids => CustomAxios.delete('/api/fuel-surcharges', { data: { ids } })

export default {
    getFuelSurcharge,
    getFuelSurcharges,
    createFuelSurcharge,
    updateFuelSurcharge,
    deleteFuelSurcharge,
    deleteFuelSurcharges
}
