import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import InterlinersApi from "../apis/Interliners.api";
import { useSnackbar } from "notistack";


export function useInterliners(enabled = true) {
    return useQuery({
        queryKey: ['interliners'],
        queryFn: async () => {
            const response = await InterlinersApi.getInterliners();
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: enabled
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}


export function useInterliner(iid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['interliner', Number(iid)],
        queryFn: async () => {
            const cachedInterliners = queryClient.getQueryData(['interliners']) || [];
            const cached = cachedInterliners.find(item => item.id === iid);
            if (cached) return cached;
            const res = await InterlinersApi.getInterliner(Number(iid));
            return res.data.data;
        },
        enabled: !!iid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
export function useInterlinerMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueryData(['interliners']);

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await InterlinersApi.createInterliner(payload);
            return res.data.data;
        },
        onSuccess: (newInterliner) => {
            if (hasCachedList) {
                queryClient.setQueryData(['interliners'], (old = []) => {
                    return [newInterliner, ...old]
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: 'interliners', exact: true })
            }
            enqueueSnackbar('Interliner has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await InterlinersApi.updateInterliner(id, payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                if (hasCachedList) {
                    queryClient.setQueryData(['interliners'], (old = []) =>
                        old.map((item) => (item.id === updated.id ? updated : item))
                    )
                }
                else {
                    queryClient.invalidateQueries({ queryKey: 'interliners', exact: true })
                }
                queryClient.setQueryData(['interliner', Number(updated.id)], updated);
                enqueueSnackbar('Interliner has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await InterlinersApi.deleteInterliner(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['interliners'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Interliner has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await InterlinersApi.deleteInterliners(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['interliners'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected interliners have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, removeMany, remove };

}