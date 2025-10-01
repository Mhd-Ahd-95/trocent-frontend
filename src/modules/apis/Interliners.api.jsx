import CustomAxios from './customAxios'

const getInterliners = () => CustomAxios.get('/api/interliners')

const getInterliner = iid => CustomAxios.get(`/api/interliners/${iid}`)

const updateInterliner = (iid, ab) => CustomAxios.put(`/api/interliners/${iid}`, ab)

const createInterliner = ab => CustomAxios.post('/api/interliners', ab)

const deleteInterliner = iid => CustomAxios.delete(`/api/interliners/${iid}`)


const deleteInterliners = ids => CustomAxios.delete('/api/interliners', { data: { ids } })

export default {
    getInterliner,
    getInterliners,
    createInterliner,
    updateInterliner,
    deleteInterliner,
    deleteInterliners
}
