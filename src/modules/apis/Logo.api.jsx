import CustomAxios from './customAxios'

const loadDefaultLogo = () => CustomAxios.get('/api/logo')

const uploadDefaultLogo = (payload) => CustomAxios.post(`/api/logo`, payload)

const removeLogo = () => CustomAxios.delete(`/api/logo/`)

export default {
    loadDefaultLogo,
    uploadDefaultLogo,
    removeLogo
}
