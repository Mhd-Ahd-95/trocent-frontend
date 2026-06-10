import CustomAxios from './customAxios'

const getSectionWithQuestions = () => CustomAxios.get('/api/questions/sections/questions')

const createSection = section => CustomAxios.post(`/api/questions/sections`, section)

const updateSection = (sid, section) => CustomAxios.put(`/api/questions/sections/${sid}`, section)

const deleteSection = (sid) => CustomAxios.delete(`/api/questions/sections/${sid}`)

const createQuestion = (q) => CustomAxios.post(`/api/questions`, q)

const updateQuestion = (qid, q) => CustomAxios.put(`/api/questions/${qid}`, q)

const deleteQuestion = (id) => CustomAxios.delete(`/api/questions/${id}`)

const checkTripInChecklist = (tid, did) => CustomAxios.get(`/api/questions/checklist/${tid}/driver/${did}`)

const reorderQuestions = (payload) => CustomAxios.put('/api/questions/reorder-questions', payload)

const answerQuestion = (cid, qid, an) => CustomAxios.post(`/api/questions/checklist/${cid}/question/${qid}/answer/${an}`)

const completeQuestionTrip = (tid, did) => CustomAxios.put(`/api/questions/complete-question-trip/${tid}/driver/${did}`)

export default {
    getSectionWithQuestions,
    createSection,
    updateSection,
    deleteSection,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    checkTripInChecklist,
    reorderQuestions,
    answerQuestion,
    completeQuestionTrip
}
