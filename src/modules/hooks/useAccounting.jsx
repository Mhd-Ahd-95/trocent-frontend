import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AccountingApi from "../apis/Accounting.api";
import { useSnackbar } from "notistack";
import { downloadExcel } from "../views/Utils/BillingRegister";


export function useBillingUnregister(filters = {}) {
    return useQuery({
        queryKey: ['billingUnregister', { filters: JSON.stringify(filters) }],
        queryFn: async () => {
            const response = await AccountingApi.loadBillingUnregister({ ...filters });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useBillingRegistered(filters = {}, page, pageSize) {
    return useQuery({
        queryKey: ['billingRegistered', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await AccountingApi.loadBillingRegistered({ ...filters, page, pageSize });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useAccountingMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const rowKey = (r) => `${r.type}-${r.id}`;

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const registerInvoices = useMutation({
        mutationFn: async (rows) => {
            console.log(rows);
            const res = await AccountingApi.registerInvoices(rows.map(({ id, type }) => ({ id, type })));
            return res.data;
        },
        onSuccess: async (res, rows) => {
            const done = new Set(rows.map(rowKey));
            queryClient.setQueriesData({ queryKey: ['billingUnregister'] }, (old) => Array.isArray(old) ? old.filter((o) => !done.has(rowKey(o))) : old);
            queryClient.invalidateQueries({ queryKey: ['billingRegistered'] });
            enqueueSnackbar(`Registered under ${res.audit_number}`, { variant: 'success' });
            try {
                await downloadExcel(rows, res.audit_number);
            } catch {
                enqueueSnackbar('Registered, but the Excel download failed.', { variant: 'warning' });
            }
        },
        onError: handleError,
    });

    const resendInvoices = useMutation({
        mutationFn: async (payload) => (await AccountingApi.resendCustomerInvoices(payload)).data,
        onSuccess: () => enqueueSnackbar('Invoices are being sent', { variant: 'success' }),
        onError: handleError,
    });

    return { registerInvoices, resendInvoices }

}