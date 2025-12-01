import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import DriversApi from "../apis/Drivers.api";
import { useSnackbar } from "notistack";


export function useDrivers() {
    return useQuery({
        queryKey: ['drivers'],
        queryFn: async () => {
            const response = await DriversApi.getDrivers();
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


export function useDriver(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['driver', Number(cid)],
        queryFn: async () => {

            const cachedDrivers = queryClient.getQueryData(['drivers']) || [];
            const cached = cachedDrivers.find(item => Number(item.id) === Number(cid));
            if (cached) return cached;

            const res = await DriversApi.getDriver(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useDriverMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueryData(['drivers'])

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const createDriverLogin = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await DriversApi.create_driver_login(id, payload);
            return res.data.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['drivers'], (old = []) =>
                old.map((item) => item.id === Number(updated.id) ? updated : item)
            );
            queryClient.invalidateQueries({
                queryKey: ['users'],
                exact: true
            })
            enqueueSnackbar('Driver has been successfully create a login', { variant: 'success' });
        },
        onError: handleError,
    });

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await DriversApi.createDriver(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            if (hasCachedList) {
                queryClient.setQueryData(['drivers'], (old = []) => {
                    return [newDriver, ...old]
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['drivers'], exact: true })
            }
            enqueueSnackbar('Driver has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await DriversApi.updateDriver(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                if (hasCachedList) {
                    queryClient.setQueryData(['drivers'], (old = []) =>
                        old.map((item) => item.id === Number(updated.id) ? updated : item)
                    );
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['drivers'], exact: true })
                }
                queryClient.setQueryData(['driver', Number(updated.id)], updated)
                enqueueSnackbar('Driver has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await DriversApi.deletDriver(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['drivers'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Driver has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await DriversApi.deletDrivers(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['drivers'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected Drivers have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, removeMany, remove, createDriverLogin };

}