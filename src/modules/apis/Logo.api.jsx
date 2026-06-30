import CustomAxios from './customAxios'

const loadDefaultLogo = () => CustomAxios.get('/api/logo')

const uploadDefaultLogo = (payload) => CustomAxios.post(`/api/logo`, payload)

const removeLogo = () => CustomAxios.delete(`/api/logo/`)

const getDefaultAddress = () => CustomAxios.get('/api/default-address')

const createDefaultAddress = (data) => CustomAxios.post('/api/default-address', data)

const updateDefaultAddress = (id, dt) => CustomAxios.put(`/api/default-address/${id}`, dt)

const deleteDefaultAddress = (id) => CustomAxios.delete(`/api/default-address/${id}`)

const getSmtp = () => CustomAxios.get('/api/smtp-mail')

const findOrCreateSmtp = (data) => CustomAxios.post('/api/smtp-mail', data)

const deleteSmtp = () => CustomAxios.delete('/api/smtp-mail')

export default {
    loadDefaultLogo,
    uploadDefaultLogo,
    removeLogo,
    getDefaultAddress,
    deleteDefaultAddress,
    createDefaultAddress,
    updateDefaultAddress,
    getSmtp,
    findOrCreateSmtp,
    deleteSmtp
}
