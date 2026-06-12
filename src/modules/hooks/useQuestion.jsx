import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import QuestionsApi from "../apis/Questions.api";
import { useSnackbar } from "notistack";


export function useSectionsWithQuestions({ enabled = false }) {
    return useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const response = await QuestionsApi.getSectionWithQuestions();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useQuestionMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const createSection = useMutation({
        mutationFn: async (payload) => {
            const res = await QuestionsApi.createSection(payload)
            return res.data
        },
        onSuccess: (newSection) => {
            queryClient.setQueryData(['questions'], (old = []) => [newSection, ...old])
            enqueueSnackbar('Section added successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const updateSection = useMutation({
        mutationFn: async ({ sid, payload }) => {
            const res = await QuestionsApi.updateSection(sid, payload)
            return res.data
        },
        onSuccess: (newSection) => {
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => Number(o.id) === Number(newSection.id) ? newSection : o))
            enqueueSnackbar('Section updated successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const deleteSection = useMutation({
        mutationFn: async ({ sid }) => {
            const res = await QuestionsApi.deleteSection(sid)
            return res.data
        },
        onSuccess: (newSection, { sid }) => {
            queryClient.setQueryData(['questions'], (old = []) => old.filter(o => Number(o.id) !== Number(sid)))
            enqueueSnackbar('Section Deleted successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const createQuestion = useMutation({
        mutationFn: async (payload) => {
            const res = await QuestionsApi.createQuestion(payload)
            return res.data
        },
        onSuccess: (newQuestion) => {
            const sid = newQuestion.section_id
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => {
                if (Number(o.id) === Number(sid)) {
                    return ({ ...o, questions: [newQuestion, ...(o?.questions ?? [])] })
                }
                return o
            }))
            enqueueSnackbar('Question added successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const updateQuestion = useMutation({
        mutationFn: async ({ qid, payload }) => {
            const res = await QuestionsApi.updateQuestion(qid, payload)
            return res.data
        },
        onSuccess: (newQuestion) => {
            const sid = newQuestion.section_id
            const qid = newQuestion.id
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => {
                if (Number(o.id) === Number(sid)) {
                    return ({ ...o, questions: o.questions.map(q => Number(q.id) === Number(qid) ? newQuestion : q) })
                }
                return o
            }))
            enqueueSnackbar('Question updated successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const deleteQuestion = useMutation({
        mutationFn: async ({ qid, sid }) => {
            const res = await QuestionsApi.deleteQuestion(qid)
            return res.data
        },
        onSuccess: (_, { sid, qid }) => {
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => {
                if (Number(o.id) === Number(sid)) {
                    return ({ ...o, questions: o.questions.filter(q => Number(q.id) !== Number(qid)) })
                }
                return o
            }))
            enqueueSnackbar('Question Deleted successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const deactivateQuestion = useMutation({
        mutationFn: async ({ qid, sid }) => {
            const res = await QuestionsApi.deactivateQuestion(qid)
            return res.data
        },
        onSuccess: (res, { sid, qid }) => {
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => {
                if (Number(o.id) === Number(sid)) {
                    return ({ ...o, questions: o.questions.map(q => Number(q.id) === Number(qid) ? { ...q, is_activated: res } : q) })
                }
                return o
            }))
            const val = res ? 'activated' : 'deactivated'
            enqueueSnackbar(`Question ${val} successfully`, { variant: 'success' })
        },
        onError: handleError
    })

    const reorderQuestion = useMutation({
        mutationFn: async (payload) => {
            const res = await QuestionsApi.reorderQuestions(payload)
            return res.data
        },
        onSuccess: (newQuestions, payload) => {
            const sectionId = payload.section_id
            queryClient.setQueryData(['questions'], (old = []) => old.map(o => {
                if (Number(o.id) === Number(sectionId)) {
                    return { ...o, questions: [...newQuestions] }
                }
                return o
            }))
            enqueueSnackbar('Question has been reordered successfully', { variant: 'success' })
        },
        onError: handleError
    })

    return { createSection, updateSection, deleteSection, createQuestion, updateQuestion, deleteQuestion, reorderQuestion, deactivateQuestion }
} 
