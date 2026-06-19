import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import EmailTemplatesApi from "../apis/EmailTemplates.api";
import { useSnackbar } from "notistack";


export function useEmailTemplates({ enabled = true }) {
    return useQuery({
        queryKey: ['emailTemplates'],
        queryFn: async () => {
            const response = await EmailTemplatesApi.getEmails();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useEmailTemplateMutation() {

    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await EmailTemplatesApi.createEmail(payload);
            return res.data;
        },
        onSuccess: (newEmail) => {
            queryClient.setQueryData(['emailTemplates'], (old = []) => {
                return [newEmail, ...old]
            });
            enqueueSnackbar('Email Template has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await EmailTemplatesApi.updateEmail(id, payload);
            return res.data;
        },
        onSuccess: (newEmail) => {
            queryClient.setQueryData(['emailTemplates'], (old = []) => old.map(o => Number(o.id) === Number(newEmail.id) ? newEmail : o));
            enqueueSnackbar('Email Template has been updated successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const destroy = useMutation({
        mutationFn: async (id) => {
            const res = await EmailTemplatesApi.deleteEmail(id);
            return res.data;
        },
        onSuccess: (res, id) => {
            queryClient.setQueryData(['emailTemplates'], (old = []) => old.filter(o => Number(o.id) !== Number(id)));
            enqueueSnackbar('Email Template has been updated successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    return { create, update, destroy }
}