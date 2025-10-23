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
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}

export function useRateSheetPagination(paginationMode) {
    console.log(paginationMode);
    return useQuery({
        queryKey: ['rateSheetsPagination', paginationMode],
        queryFn: async () => {
            const response = await RateSheetsApi.getRateSheets(paginationMode)
            console.log(response);
            return response.data
        },
        enabled: !!paginationMode,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        keepPreviousData: true
    })
}

const format_rate_sheets_customer = (rsheets) => {
    const groupBy = _.groupBy(rsheets, rsheet => rsheet.batch_id)
    const csheets = Object.keys(groupBy).map(key => ({ id: key, imported_on: key.split('_')[0], type: groupBy[key][0]['type'], skid_by_weight: groupBy[key][0]['skid_by_weight'] }))
    return csheets
}

export function useRateSheetsCustomer(cid) {
    return useQuery({
        queryKey: ['rateSheetsCustomer', Number(cid)],
        queryFn: async () => {
            const res = await RateSheetsApi.getRateSheetsByCustomer(Number(cid))
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
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['rateSheet', Number(iid)],
        queryFn: async () => {
            const cachedRSheets = queryClient.getQueryData(['rateSheetsPagination']) || [];
            const cached = cachedRSheets.find(item => Number(item.id) === Number(iid));
            if (cached) return cached;
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

const updateCachedList = (cachedList, updated, queryClient) => {
    cachedList.forEach((rsp) => {
        const data = rsp[1] || {}
        const findSheet = data?.data.find(sheet => Number(sheet.id) === Number(updated.id))
        if (findSheet) {
            const updatedPagination = rsp[0][1]
            const updatedData = data?.data.map((rs) => (Number(rs.id) === Number(updated.id) ? updated : rs))
            queryClient.setQueryData(['rateSheetsPagination', updatedPagination], { ...data, data: updatedData })
        }
    })
}

export function useRateSheetMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueriesData({ queryKey: ['rateSheetsPagination'] });

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
            console.log('customerId: ', customerId);
            console.log('New: ', newRateSheets);
            queryClient.setQueryData(['rateSheetsCustomer', Number(customerId)], (old = []) => {
                return [newRateSheets, ...old];
            });
            queryClient.invalidateQueries({ queryKey: ['rateSheetsPagination'] });
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
                if (hasCachedList && hasCachedList?.length > 0) {
                    updateCachedList(hasCachedList, updated, queryClient)
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['rateSheetsPagination'] })
                }
                queryClient.setQueryData(['rateSheet', Number(updated.id)], updated)
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
            console.log(customer_id);
            console.log(bid);
            if (res) {
                queryClient.setQueryData(['rateSheetsCustomer', Number(customer_id)], (old = []) => {
                    const filtered = old.filter(rsc => (rsc.id) !== bid)
                    return [...filtered]
                })
                queryClient.invalidateQueries({ queryKey: ['rateSheetsPagination'] });
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
                enqueueSnackbar('Selected Rate Sheets have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany };

}