import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import BillingsApi from "../apis/Billings.api";
import { useSnackbar } from "notistack";


export function useBillings(filters = {}, page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ['billings', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await BillingsApi.getOrdersForBilling({ ...filters, page, pageSize });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useInvoicing(filters = {}, page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ['invoicing', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await BillingsApi.getApprovedOrders({ ...filters, page, pageSize });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useBillingMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const applyAccessorials = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await BillingsApi.applyCustomerAccessorials(id, payload)
            return res.data
        },
        onSuccess: (res) => {
            const { customer_id, accessorials, sub_total, freight_fuel_surcharge, order_id } = res
            queryClient.setQueriesData({ queryKey: ['billings'] }, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(group =>
                        Number(group.customer_id) === Number(customer_id)
                            ? {
                                ...group,
                                orders: group.orders.map(order =>
                                    Number(order.order_id) === Number(order_id)
                                        ? { ...order, accessorials, sub_total, freight_fuel_surcharge }
                                        : order
                                )
                            }
                            : group
                    )
                }
            })
            queryClient.invalidateQueries({ queryKey: ['order', Number(order_id)], exact: true })
            enqueueSnackbar('Accessorial Charges has been successfully applied', { variant: 'success' })
        },
        onError: handleError
    })

    const driverPayout = useMutation({
        mutationFn: async ({ payload, cid }) => {
            const res = await BillingsApi.driverPayout(payload)
            return res
        },
        onSuccess: (res, { payload, cid }) => {
            if (res.data) {
                queryClient.setQueriesData({ queryKey: ['billings'] }, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.reduce((acc, group) => {
                            if (Number(group.customer_id) !== Number(cid)) {
                                acc.push(group)
                                return acc
                            }
                            const remainingOrders = group.orders.filter(order => Number(order.order_id) !== Number(payload.order_id))
                            if (remainingOrders.length > 0) {
                                acc.push({ ...group, orders: remainingOrders })
                            }
                            return acc
                        }, [])
                    }
                })
                queryClient.invalidateQueries({ queryKey: ['order', Number(payload.order_id)], exact: true })
                queryClient.invalidateQueries({ queryKey: ['invoicing'] })
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
        },
        onError: handleError
    })

    const updateInterlinerAmounts = useMutation({
        mutationFn: async ({ payload, cid, oid }) => {
            console.log(payload);
            const res = await BillingsApi.updateInterlinerAmounts(payload)
            return res
        },
        onSuccess: (res, { payload, cid, oid }) => {
            const interliners = res.data
            console.log(interliners);
            queryClient.setQueriesData({ queryKey: ['billings'] }, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(group =>
                        Number(group.customer_id) === Number(cid)
                            ? {
                                ...group,
                                orders: group.orders.map(order =>
                                    Number(order.order_id) === Number(oid)
                                        ? { ...order, interliners }
                                        : order
                                )
                            }
                            : group
                    )
                }
            })
            queryClient.invalidateQueries({ queryKey: ['order', Number(oid)], exact: true })
        },
        onError: handleError
    })

    return { applyAccessorials, driverPayout, updateInterlinerAmounts }
}
