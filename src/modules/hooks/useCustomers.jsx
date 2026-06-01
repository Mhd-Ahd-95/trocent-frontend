import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CustomersApi from "../apis/Customers.api";
import { useSnackbar } from "notistack";


export function useCustomers(p, ps) {
    const pageSize = Number(ps)
    const page = Number(p)
    return useQuery({
        queryKey: ['customers', page, pageSize],
        queryFn: async () => {
            const response = await CustomersApi.getCustomers({ page, pageSize });
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


export function useCustomer(cid) {
    return useQuery({
        queryKey: ['customer', Number(cid)],
        queryFn: async () => {
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
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['customersNames'],
        queryFn: async () => {
            const cachedCust = queryClient.getQueryData(['customers']) || [];
            const cached = cachedCust.map((cust) => ({ id: cust.id, name: cust.name, account_number: cust.account_number }))
            if (cached?.length > 0) return cached
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

export const useCustomerSearch = (search) => {
    const srch = String(search).toLowerCase().trim()
    return useQuery({
        queryKey: ['customerSearch', srch],
        queryFn: async () => {
            const res = await CustomersApi.customerSearch(srch)
            return res.data || []
        },
        enabled: srch.length >= 2,
        staleTime: 3 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    })
}


export function useCustomerMutation() {

    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' });
    };

    const updateAllCustomerPages = (updater) => {
        const entries = queryClient.getQueriesData({ queryKey: ['customers'] });
        for (const [key, data] of entries) {
            if (!data) continue;
            if (data?.data && Array.isArray(data.data)) {
                queryClient.setQueryData(key, { ...data, data: updater(data.data), });
            }
        }
    };

    const updateNamesCache = (updater) => {
        const cached = queryClient.getQueryData(['customersNames']);
        if (!cached) return;
        const list = Array.isArray(cached) ? cached : cached?.data;
        if (!list) return;
        const updated = updater(list);
        queryClient.setQueryData(['customersNames'], Array.isArray(cached) ? updated : { ...cached, data: updated });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await CustomersApi.createCustomer(payload);
            return res.data;
        },
        onSuccess: (newCust) => {
            const entries = queryClient.getQueriesData({ queryKey: ['customers'] });
            if (entries.length > 0) {
                for (const [key, data] of entries) {
                    if (!data) continue;
                    const [, page] = key;
                    if (page === 1) {
                        queryClient.setQueryData(key, (old = []) => [newCust, ...old]);
                    } else {
                        queryClient.invalidateQueries({ queryKey: key });
                    }
                }
            } else {
                queryClient.invalidateQueries({ queryKey: ['customers'] });
            }
            updateNamesCache((old) => [{ id: newCust.id, name: newCust.name, account_number: newCust.account_number }, ...old,]);
            queryClient.invalidateQueries({ queryKey: ['customerSearch'] });
            enqueueSnackbar('Customer has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await CustomersApi.updateCustomer(Number(id), payload);
            return res.data;
        },
        onSuccess: (updated) => {
            updateAllCustomerPages((old) => Array.isArray(old) ? old.map((item) => Number(item.id) === Number(updated.id) ? updated : item) : old);
            updateNamesCache((old) => old.map((item) => Number(item.id) === Number(updated.id) ? { id: updated.id, name: updated.name, account_number: updated.account_number } : item));
            queryClient.invalidateQueries({ queryKey: ['customerSearch'] });
            queryClient.invalidateQueries({ queryKey: ['customer', Number(updated.id)] });
            queryClient.invalidateQueries({ queryKey: ['order'] });
            enqueueSnackbar('Customer has been updated successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await CustomersApi.deleteCustomer(iid);
            return res.data;
        },
        onSuccess: (res, iid) => {
            if (!res) return;
            updateAllCustomerPages((old) => Array.isArray(old) ? old.filter((item) => item.id !== iid) : old);
            updateNamesCache((old) => old.filter((item) => item.id !== iid));
            queryClient.invalidateQueries({ queryKey: ['customerSearch'] });
            queryClient.invalidateQueries({ queryKey: ['customersRateSheets', Number(iid)] });
            enqueueSnackbar('Customer has been deleted successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await CustomersApi.deleteCustomers(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (!res) return;
            updateAllCustomerPages((old) => Array.isArray(old) ? old.filter((item) => !iids.includes(item.id)) : old);
            updateNamesCache((old) => old.filter((item) => !iids.includes(item.id)));
            for (const cid of iids) {
                queryClient.removeQueries({ queryKey: ['customersRateSheets', Number(cid)] });
                queryClient.removeQueries({ queryKey: ['rateSheetsCustomer', Number(cid)] });
            }
            queryClient.invalidateQueries({ queryKey: ['customerSearch'] });
            enqueueSnackbar('Selected Customers been deleted successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };
}