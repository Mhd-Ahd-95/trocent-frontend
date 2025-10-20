import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AccessorialAPI from '../apis/Accessorials.api'
import { useSnackbar } from "notistack";


export function useAccessorials() {
    return useQuery({
        queryKey: ['accessorials'],
        queryFn: async () => {
            const response = await AccessorialAPI.getAccessorials();
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}


export function useAccessorial(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['accessorial', Number(cid)],
        queryFn: async () => {

            const cachedAcess = queryClient.getQueryData(['accessorials']) || [];
            const cached = cachedAcess.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await AccessorialAPI.getAccessorial(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useAccessorialMutations() {
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
            const res = await AccessorialAPI.createAccessorial(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['accessorials'], (old = []) => {
                return [newDriver, ...old]
            });
            enqueueSnackbar('Accessorial has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await AccessorialAPI.updateAccessorial(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['accessorials'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
                queryClient.setQueryData(['accessorial', Number(updated.id)], updated)
                enqueueSnackbar('Accessorial has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await AccessorialAPI.deleteAccessorial(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['accessorials'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Accessorial has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await AccessorialAPI.deleteAccessorials(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['accessorials'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected accessorials been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}