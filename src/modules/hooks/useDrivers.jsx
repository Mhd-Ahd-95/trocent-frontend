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
        queryKey: ['driver', cid],
        queryFn: async () => {

            const cachedDrivers = queryClient.getQueryData(['driver']) || [];
            const cached = cachedDrivers.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await DriversApi.getDriver(cid);
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

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await DriversApi.createDriver(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['drivers'], (old = []) => {
                return [newDriver, ...old]
            });
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
                queryClient.setQueryData(['drivers'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
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

    return { create, update, removeMany, remove };

}