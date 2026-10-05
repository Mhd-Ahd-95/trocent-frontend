import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AccountingApi from "../apis/Accounting.api";
import { useSnackbar } from "notistack";



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

    const downloadExcel = async (rows, auditNumber) => {
        const XLSX = await import('xlsx');
        const header = ['Customer Number', 'Order Number', 'Invoice Date', 'Sub Total', 'Federal Tax', 'Provincial Tax', 'Grand Total'];
        const toYYMMDD = (d) => (d ? `${d.slice(2, 4)}${d.slice(5, 7)}${d.slice(8, 10)}` : '');
        const body = rows.map((r) => [
            r.customer_number,
            r.order_number,
            toYYMMDD(r.billing_invoice_date),
            Number(r.sub_total) || 0,
            Number(r.federal_tax) || 0,
            Number(r.provincial_tax) || 0,
            Number(r.grand_total) || 0,
        ]);
        const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
        for (let R = 1; R <= body.length; R++) {
            for (let C = 3; C <= 6; C++) {
                const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell) cell.z = '#,##0.00';
            }
        }
        ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Billing Register');
        XLSX.writeFile(wb, `BillingRegister${auditNumber}.xlsx`);
    }

    const registerInvoices = useMutation({
        mutationFn: async (rows) => {
            console.log(rows);
            const res = await AccountingApi.registerInvoices(rows.map(({ id, type }) => ({ id, type })));
            return res.data;
        },
        onSuccess: async (res, rows) => {
            console.log(res);
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

    return { registerInvoices }

}