import CustomAxios from './customAxios'

const getDrivers = () => CustomAxios.get('/api/drivers')

const getDriver = rid => CustomAxios.get(`/api/drivers/${rid}`)

const updateDriver = (rid, ab) => CustomAxios.put(`/api/drivers/${rid}`, ab)

const createDriver = ab => CustomAxios.post('/api/drivers', ab)

const deletDriver = rid => CustomAxios.delete(`/api/drivers/${rid}`)


const deletDrivers = ids => CustomAxios.delete('/api/drivers', { data: { ids } })

export default {
    getDriver,
    getDrivers,
    createDriver,
    updateDriver,
    deletDriver,
    deletDrivers
}
