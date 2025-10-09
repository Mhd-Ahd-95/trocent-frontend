import CustomAxios from './customAxios'

const getAccessorials = () => CustomAxios.get('/api/accessorials')

const getAccessorial = rid => CustomAxios.get(`/api/accessorials/${rid}`)

const updateAccessorial = (rid, ab) => CustomAxios.put(`/api/accessorials/${rid}`, ab)

const createAccessorial = ab => CustomAxios.post('/api/accessorials', ab)

const deleteAccessorial = rid => CustomAxios.delete(`/api/accessorials/${rid}`)


const deleteAccessorials = ids => CustomAxios.delete('/api/accessorials', { data: { ids } })

export default {
    getAccessorial,
    getAccessorials,
    createAccessorial,
    updateAccessorial,
    deleteAccessorial,
    deleteAccessorials
}
