import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import LogoApi from "../apis/Logo.api";
import { useSnackbar } from "notistack";

export function useDefaultLogo({ enabled = false }) {
    return useQuery({
        queryKey: ['defaultLogo'],
        queryFn: async () => {
            const response = await LogoApi.loadDefaultLogo();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useDefaultAddress({ enabled = false }) {
    return useQuery({
        queryKey: ['defaultAddress'],
        queryFn: async () => {
            const response = await LogoApi.getDefaultAddress();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useSmtpMail({ enabled = false }) {
    return useQuery({
        queryKey: ['smtpMail'],
        queryFn: async () => {
            const response = await LogoApi.getSmtp();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useLogoAddressMutation() {

    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
    };

    const uploadLogo = useMutation({
        mutationFn: async (dt) => await LogoApi.uploadDefaultLogo(dt),
        onSuccess: (res, dt) => {
            if (res) {
                queryClient.setQueryData(['defaultLogo'], dt.image)
                enqueueSnackbar('Logo uploaded successfully', { variant: 'success' })
            }
        },
        onError: handleError
    })

    const removeDefaultLogo = useMutation({
        mutationFn: async () => await LogoApi.removeLogo(),
        onSuccess: (res) => {
            queryClient.setQueryData(['defaultLogo'], null)
            enqueueSnackbar('Logo removed successfully', { variant: 'info' })
        },
        onError: handleError
    })

    const createDefaultAddress = useMutation({
        mutationFn: async (data) => await LogoApi.createDefaultAddress(data),
        onSuccess: (res) => {
            queryClient.setQueryData(['defaultAddress'], res)
            enqueueSnackbar('Default address created successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const updateDefaultAddress = useMutation({
        mutationFn: async ({ id, data }) => await LogoApi.updateDefaultAddress(id, data),
        onSuccess: (res) => {
            queryClient.setQueryData(['defaultAddress'], res)
            enqueueSnackbar('Default address updated successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const deleteDefaultAddress = useMutation({
        mutationFn: async (id) => await LogoApi.deleteDefaultAddress(id),
        onSuccess: (res) => {
            queryClient.setQueryData(['defaultAddress'], null)
            enqueueSnackbar('Default address deleted successfully', { variant: 'info' })
        },
        onError: handleError
    })

    const findOrCreateSmtp = useMutation({
        mutationFn: async (data) => await LogoApi.findOrCreateSmtp(data),
        onSuccess: (res) => {
            queryClient.setQueryData(['smtpMail'], res.data)
            enqueueSnackbar('Smtp Mail Configuration has been successfully assigned', { variant: 'info' })
        },
        onError: handleError
    })

    const deleteSmtp = useMutation({
        mutationFn: async () => await LogoApi.deleteSmtp(),
        onSuccess: (res) => {
            if (res) {
                queryClient.setQueryData(['smtpMail'], null)
                enqueueSnackbar('Smtp Mail Configuration has been successfully deleted', { variant: 'info' })
            }
        },
        onError: handleError
    })

    return { uploadLogo, removeDefaultLogo, createDefaultAddress, updateDefaultAddress, deleteDefaultAddress, findOrCreateSmtp, deleteSmtp }

}