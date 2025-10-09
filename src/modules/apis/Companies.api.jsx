import CustomAxios from './customAxios'

const getCompanies = () => CustomAxios.get('/api/companies')

const getCompany = cid => CustomAxios.get(`/api/companies/${cid}`)

const updateCompany = (cid, comp) => CustomAxios.put(`/api/companies/${cid}`, comp)

const createCompany = comp => CustomAxios.post('/api/companies', comp)

const deleteCompany = cid => CustomAxios.delete(`/api/companies/${cid}`)

const deleteCompanies = ids => CustomAxios.delete('/api/companies', { data: { ids } })

export default {
    getCompany,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    deleteCompanies
}
