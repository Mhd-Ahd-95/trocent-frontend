import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import VehicleTypeAPI from '../apis/VehicleTypes.api'
import { useSnackbar } from "notistack";


export function useVehicleTypes() {
    return useQuery({
        queryKey: ['vehicleTypes'],
        queryFn: async () => {
            const response = await VehicleTypeAPI.getVehicleTypes();
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


export function useVehicleType(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['vehicleType', Number(cid)],
        queryFn: async () => {

            const cachedVehicleTypes = queryClient.getQueryData(['vehicleType']) || [];
            const cached = cachedVehicleTypes.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await VehicleTypeAPI.getVehicleType(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useVehicleTypeMutations() {
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
            const res = await VehicleTypeAPI.createVehicleType(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['vehicleTypes'], (old = []) => {
                return [newDriver, ...old]
            });
            enqueueSnackbar('Vehicle Type has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await VehicleTypeAPI.updateVehicleType(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['vehicleTypes'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
                enqueueSnackbar('Vehicle Type has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await VehicleTypeAPI.deleteVehicleType(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['vehicleTypes'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Vehicle Type has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await VehicleTypeAPI.deleteVehicleTypes(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['vehicleTypes'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected Vehicle Types have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, removeMany, remove };

}