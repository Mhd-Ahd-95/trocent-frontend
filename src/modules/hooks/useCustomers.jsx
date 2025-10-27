import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CustomersApi from "../apis/Customers.api";
import { useSnackbar } from "notistack";


export function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const response = await CustomersApi.getCustomers();
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


export function useCustomer(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['customer', Number(cid)],
        queryFn: async () => {

            const cachedCust = queryClient.getQueryData(['customers']) || [];
            const cached = cachedCust.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await CustomersApi.getCustomer(cid);
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export const useCustomersNames = () => {
    return useQuery({
        queryKey: ['customersNames'],
        queryFn: async () => {
            const response = await CustomersApi.getCustomersNames();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}


export function useCustomerMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueryData(['customers'])

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await CustomersApi.createCustomer(payload);
            return res.data.data;
        },
        onSuccess: (newCust) => {
            if (hasCachedList) {
                queryClient.setQueryData(['customers'], (old = []) => {
                    return [newDriver, ...old]
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['customers'], exact: true })
            }
            enqueueSnackbar('Customer has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await CustomersApi.updateCustomer(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                if (hasCachedList) {
                    queryClient.setQueryData(['customers'], (old = []) =>
                        old.map((item) => item.id === Number(updated.id) ? updated : item)
                    );
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['customers'], exact: true })
                }
                queryClient.setQueryData(['customer', Number(updated.id)], updated)
                enqueueSnackbar('Customer has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await CustomersApi.deleteCustomer(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['customers'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                queryClient.invalidateQueries({ queryKey: ['customersRateSheets', Number(iid)] })
                enqueueSnackbar('Customer has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await CustomersApi.deleteCustomers(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['customers'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                // customersNames
                queryClient.setQueryData(['customersNames'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                for (let cid of iids) {
                    queryClient.removeQueries({ queryKey: ['customersRateSheets', Number(cid)] });
                    queryClient.removeQueries({ queryKey: ['rateSheetsCustomer', Number(cid)] });
                }
                enqueueSnackbar('Selected Customers been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}