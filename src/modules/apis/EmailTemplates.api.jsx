import CustomAxios from './customAxios'

const getEmails = () => CustomAxios.get('/api/email-templates')

const createEmail = email => CustomAxios.post(`/api/email-templates`, email)

const updateEmail = (tid, payload) => CustomAxios.put(`/api/email-templates/${tid}`, payload)

const deleteEmail = (tid) => CustomAxios.delete(`/api/email-templates/${tid}`)

export default {
    getEmails,
    createEmail,
    updateEmail,
    deleteEmail
}
