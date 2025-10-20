import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import FuelSurchargesApi from "../apis/FuelSurcharges.api";
import { useSnackbar } from "notistack";


export function useFuelSurcharges() {
    return useQuery({
        queryKey: ['fuelSurcharges'],
        queryFn: async () => {
            const response = await FuelSurchargesApi.getFuelSurcharges();
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


export function useFuelSurcharge(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['fuelSurcharge', Number(cid)],
        queryFn: async () => {

            const cachedSurcharges = queryClient.getQueryData(['fuelSurcharges']) || [];
            const cached = cachedSurcharges.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await FuelSurchargesApi.getFuelSurcharge(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useFuelSurchargeMutations() {
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
            const res = await FuelSurchargesApi.createFuelSurcharge(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['fuelSurcharges'], (old = []) => {
                return [newDriver, ...old]
            });
            enqueueSnackbar('Fuel Surcharge has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await FuelSurchargesApi.updateFuelSurcharge(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['fuelSurcharges'], (old = []) =>
                    old.map((item) => Number(item.id) === Number(updated.id) ? updated : item)
                );
                enqueueSnackbar('Fuel Surcharge has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await FuelSurchargesApi.deleteFuelSurcharge(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['fuelSurcharges'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Fuel Surcharge has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await FuelSurchargesApi.deleteFuelSurcharges(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['fuelSurcharges'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected fuel surcharges been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}