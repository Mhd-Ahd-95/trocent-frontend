import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserAPI from "../apis/User.api";
import { useSnackbar } from "notistack";


export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await UserAPI.getUsers();
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


export function useUser(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['user', cid],
        queryFn: async () => {

            const cachedUsers = queryClient.getQueryData(['user']) || [];
            const cached = cachedUsers.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await UserAPI.getUser(cid);
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useUserMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const createDriverLogin = useMutation({
        mutationFn: async (payload) => {
            const res = await UserAPI.createUser(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['users'], (old = []) => {
                return [newDriver, ...old]
            });
            queryClient.invalidateQueries(['users'])
            enqueueSnackbar('User has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await UserAPI.createUser(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['users'], (old = []) => {
                return [newDriver, ...old]
            });
            enqueueSnackbar('User has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await UserAPI.updateUser(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['users'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
                enqueueSnackbar('User has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await UserAPI.deleteUser(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['users'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('User has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, createDriverLogin };

}