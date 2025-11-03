import CustomAxios from './customAxios'

const getNewCounter = () => CustomAxios.get('/api/counter')

const createCounter = counter => CustomAxios.post(`/api/counter`, counter)

export default {
    getNewCounter,
    createCounter
}
