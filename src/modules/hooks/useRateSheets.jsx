import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import RateSheetsApi from "../apis/RateSheets.api";
import { useSnackbar } from "notistack";
import * as _ from 'lodash'

export function useCustomersRateSheets(cid) {
    return useQuery({
        queryKey: ['customersRateSheets', Number(cid)],
        queryFn: async () => {
            const response = await RateSheetsApi.loadCustomerRateSheets(Number(cid));
            return response.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useBatchCustomerRateSheets(cid) {
    return useQuery({
        queryKey: ['batchCustomerRateSheets', Number(cid)],
        queryFn: async () => {
            const res = await RateSheetsApi.getBatchCustomerRateSheet(Number(cid))
            return res.data
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    })
}


export function useRateSheet(iid) {
    return useQuery({
        queryKey: ['rateSheet', Number(iid)],
        queryFn: async () => {
            const res = await RateSheetsApi.getRateSheet(Number(iid));
            return res.data;
        },
        enabled: !!iid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useRateSheetsByCustomerAndCities(cid, sc, rc) {
    const trimmedSC = sc?.trim();
    const trimmedRC = rc?.trim();
    return useQuery({
        queryKey: ['rateSheetsByCustomerAndCities', Number(cid), trimmedSC, trimmedRC],
        queryFn: async () => {
            const res = await RateSheetsApi.loadRateSheetsByCustomerAndCities(Number(cid), trimmedSC, trimmedRC);
            return res.data;
        },
        enabled: !!cid && !!trimmedSC && !!trimmedRC,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
export function useRateSheetMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueriesData({ queryKey: ['customersRateSheets'] });

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await RateSheetsApi.createRateSheets(payload);
            return res.data;
        },
        onSuccess: (newRateSheets, pload) => {
            const customerId = pload[0]['customer_id']
            queryClient.setQueryData(['batchCustomerRateSheets', Number(customerId)], (old = []) => {
                return [newRateSheets, ...old];
            });
            queryClient.invalidateQueries({ queryKey: ['customersRateSheets'] });
            queryClient.invalidateQueries({ queryKey: ['rateSheetsByCustomerAndCities'] });
            enqueueSnackbar('Rate Sheets has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ cid, id, payload }) => {
                const res = await RateSheetsApi.updateRateSheet(id, payload);
                return res.data;
            },
            onSuccess: (updated, { cid }) => {
                if (hasCachedList && hasCachedList?.length > 0) {
                    delete updated['brackets']
                    queryClient.setQueryData(['customersRateSheets', Number(cid)], (old = []) => {
                        return old.map((it) => Number(it.id) === Number(updated.id) ? updated : it)
                    })
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['customersRateSheets', Number(cid)] })
                }
                queryClient.setQueryData(['rateSheet', Number(updated.id)], updated)
                queryClient.invalidateQueries({ queryKey: ['rateSheetsByCustomerAndCities'] });
                enqueueSnackbar('Rate Sheet has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async ({ bid, customer_id }) => {
            const res = await RateSheetsApi.deleteRateSheetByBatchId(bid);
            return res.data
        },
        onSuccess: (res, params) => {
            const { bid, customer_id } = params
            if (res) {
                queryClient.setQueryData(['batchCustomerRateSheets', Number(customer_id)], (old = []) => {
                    const filtered = old.filter(rsc => (rsc.id) !== bid)
                    return [...filtered]
                })
                queryClient.invalidateQueries({ queryKey: ['customersRateSheets', Number(customer_id)] });
                queryClient.invalidateQueries({ queryKey: ['rateSheetsByCustomerAndCities'] });
                enqueueSnackbar('Rate Sheets has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async ({ cid, iids }) => {
            const res = await RateSheetsApi.deleteRateSheets(iids);
            return res.data;
        },
        onSuccess: (res, { cid, iids }) => {
            if (res) {
                queryClient.setQueryData(['customersRateSheets', Number(cid)], (old = []) => {
                    return old.filter((item) => !iids.includes(item.id))
                })
                queryClient.invalidateQueries({ queryKey: ['batchCustomerRateSheets', Number(cid)] })
                queryClient.invalidateQueries({ queryKey: ['rateSheetsByCustomerAndCities'] });
                enqueueSnackbar('Selected Rate Sheets have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}