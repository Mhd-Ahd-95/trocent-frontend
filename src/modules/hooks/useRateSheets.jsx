import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import RateSheetsApi from "../apis/RateSheets.api";
import { useSnackbar } from "notistack";
import * as _ from 'lodash'

export function useRateSheets() {
    return useQuery({
        queryKey: ['rateSheets'],
        queryFn: async () => {
            const response = await RateSheetsApi.getRateSheets();
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

const format_rate_sheets_customer = (rsheets) => {
    const groupBy = _.groupBy(rsheets, rsheet => rsheet.batch_id)
    const csheets = Object.keys(groupBy).map(key => ({ id: key, imported_on: key.split('_')[0], type: groupBy[key][0]['type'], skid_by_weight: groupBy[key][0]['skid_by_weight'] }))
    return csheets
}

export function useRateSheetsCustomer(cid) {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: ['rateSheetsCustomer', cid],
        queryFn: async () => {
            const cachedSheets = queryClient.getQueryData(['rateSheets']) || []
            console.log(cachedSheets);
            const sheetsCustomer = cachedSheets.filter((rsc) => Number(rsc.customer_id) === Number(cid))
            if (sheetsCustomer.length > 0) return format_rate_sheets_customer(sheetsCustomer)
            const res = await RateSheetsApi.getRateSheetsByCustomer(cid)
            console.log(res.data);
            return format_rate_sheets_customer(res.data.data)
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    })
}


export function useRateSheet(iid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['rateSheet', iid],
        queryFn: async () => {
            const cachedRSheets = queryClient.getQueryData(['rateSheets']) || [];
            const cached = cachedRSheets.find(item => Number(item.id) === Number(iid));
            if (cached) return cached;
            const res = await RateSheetsApi.getRateSheet(iid);
            return res.data.data;
        },
        enabled: !!iid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
export function useRateSheetMutations() {
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
            const res = await RateSheetsApi.createRateSheets(payload);
            return res.data.data;
        },
        onSuccess: (newRateSheets) => {
            queryClient.setQueryData(['rateSheets'], (old = []) => {
                return [...newRateSheets, ...old]
            });
            enqueueSnackbar('Rate Sheets has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await RateSheetsApi.updateRateSheet(id, payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['rateSheets'], (old = []) =>
                    old.map((item) => (Number(item.id) === Number(updated.id) ? updated : item))
                );
                queryClient.setQueryData(['rateSheet', updated.id], updated);
                enqueueSnackbar('Rate Sheet has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (cid) => {
            const res = await RateSheetsApi.deleteRateSheetByCustomer(cid);
            return res.data
        },
        onSuccess: (res, cid) => {
            if (res) {
                queryClient.setQueryData(['rateSheets'], (old = []) =>
                    old.filter((item) => Number(item.customer_id) !== Number(cid))
                );
                enqueueSnackbar('Rate Sheets has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await RateSheetsApi.deleteRateSheets(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['rateSheets'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected Rate Sheets have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}