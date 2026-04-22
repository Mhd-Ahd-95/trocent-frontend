import CustomAxios from './customAxios'

const getTerminals = () => CustomAxios.get('/api/terminals')

const createTermianl = terms => CustomAxios.post(`/api/terminals`, terms)

const deleteTerminal = tid => CustomAxios.delete(`/api/terminals/${tid}`)

export default {
    getTerminals,
    createTermianl,
    deleteTerminal
}
