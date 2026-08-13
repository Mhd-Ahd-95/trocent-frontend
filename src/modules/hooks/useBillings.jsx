import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import BillingsApi from "../apis/Billings.api";
import { useSnackbar } from "notistack";
import DriverPaysApi from "../apis/DriverPays.api";


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

export function useCommissionDrivers(filters = {}, page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ['commissionDrivers', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await DriverPaysApi.getPendingCommissionDriverPay({ ...filters, page, pageSize });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useHourlyDrivers(filters = {}, page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ['hourlyDrivers', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await DriverPaysApi.getPendingHourlyDriverPay({ ...filters, page, pageSize });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useHourlyDriverDetails(driver_id, filters = {}) {
    const did = Number(driver_id)
    return useQuery({
        queryKey: ['hourlyDriversDetails', { filters: JSON.stringify(filters), driver_id: did }],
        queryFn: async () => {
            const response = await DriverPaysApi.getHourlyDriverPayDetails(did, filters);
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

    const updateOrderStatus = useMutation({
        mutationFn: async (payload) => {
            const res = await BillingsApi.updateOrderStatusToBilled(payload)
            return res.data
        },
        onSuccess: (res, payload) => {
            if (res) {
                const cid = payload.customer_id
                const oids = payload.orders
                queryClient.setQueriesData({ queryKey: ['invoicing'] }, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.reduce((acc, group) => {
                            if (Number(group.customer_id) !== Number(cid)) {
                                acc.push(group)
                                return acc
                            }
                            const remainingOrders = group.orders.filter(order => !oids.includes(Number(order.order_id)))
                            if (remainingOrders.length > 0) {
                                acc.push({ ...group, orders: remainingOrders })
                            }
                            return acc
                        }, [])
                    }
                })
            }
        },
        onError: handleError
    })

    return { applyAccessorials, driverPayout, updateInterlinerAmounts, updateOrderStatus }
}
