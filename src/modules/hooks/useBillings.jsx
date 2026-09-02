import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import BillingsApi from "../apis/Billings.api";
import { useSnackbar } from "notistack";
import DriverPaysApi from "../apis/DriverPays.api";
import moment from "moment";


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
    const hasDateRange = Boolean(filters?.start_date || filters?.end_date);
    const keyword = filters?.keyword ? filters.keyword.split(',') : []
    return useQuery({
        queryKey: ['hourlyDrivers', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await DriverPaysApi.getPendingHourlyDriverPay({ ...filters, keyword, page, pageSize });
            return response.data;
        },
        enabled: hasDateRange,
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

export function useApprovedDriverHourlyTotals(filters = {}, page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ['approvedDriverHourlyTotals', { filters: JSON.stringify(filters), page, pageSize }],
        queryFn: async () => {
            const response = await DriverPaysApi.loadApprovedDriverTotals({ ...filters, page, pageSize });
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
                queryClient.invalidateQueries({ queryKey: ['commissionDrivers'] })
                queryClient.invalidateQueries({ queryKey: ['hourlyDrivers'] })
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
        },
        onError: handleError
    })

    const updateInterlinerAmounts = useMutation({
        mutationFn: async ({ payload, cid, oid }) => {
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
                queryClient.invalidateQueries({ queryKey: ['order'] })
                queryClient.invalidateQueries({ queryKey: ['commissionDrivers'] })
                queryClient.invalidateQueries({ queryKey: ['hourlyDrivers'] })
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
        },
        onError: handleError
    })

    const approvedDriverPayHourly = useMutation({
        mutationFn: async ({ did, payload }) => {
            const res = await DriverPaysApi.approvedDriverPayHourly(did, payload)
            return res.data
        },
        onSuccess: (res, { did, cid }) => {
            if (!res) return

            queryClient.setQueriesData({ queryKey: ['hourlyDrivers'] }, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(company => Number(company.company_id) === Number(cid) ? { ...company, drivers: company.drivers.filter(driver => Number(driver.driver_id) !== Number(did)) } : company)
                        .filter(company => company.drivers.length > 0)
                }
            }
            )
            queryClient.invalidateQueries({ queryKey: ['hourlyDriversDetails'] })
            queryClient.invalidateQueries({ queryKey: ['approvedDriverHourlyTotals'] })
        },
        onError: handleError
    })

    const saveDriverPayDailyAdjustment = useMutation({
        mutationFn: async ({ did, payload }) => {
            const res = await DriverPaysApi.saveDriverPayDailyAdjustment(did, payload)
            return res.data
        },
        onSuccess: (res, { did, cid }) => {
            const { note, adjustment_hours, total_km } = res
            queryClient.setQueriesData({ queryKey: ['hourlyDrivers'] }, (old) => {
                if (!old?.data) return
                return {
                    ...old,
                    data: old.data.map(o => {
                        if (Number(o.company_id) === Number(cid)) {
                            return {
                                ...o,
                                drivers: o.drivers.map(d => {
                                    if (Number(d.driver_id) === Number(did)) {
                                        return {
                                            ...d,
                                            days: d.days.map(dy => {
                                                if (dy.date === res.date) {
                                                    return { ...dy, note, hour_adjustment: Math.round((Number(adjustment_hours) / 3600) * 100) / 100, km_adjustment: total_km }
                                                }
                                                return dy
                                            })
                                        }
                                    }
                                    return d
                                })
                            }
                        }
                        return o
                    })
                }
            })
            queryClient.invalidateQueries({ queryKey: ['hourlyDriversDetails'] })
        },
        onError: handleError
    })

    const addExtraCharge = useMutation({
        mutationFn: async (dt) => {
            const res = await DriverPaysApi.addExtraCharge(dt)
            return res.data
        },
        onSuccess: (res) => {
            queryClient.setQueriesData({ queryKey: ['hourlyDrivers'] }, (old) => {
                if (!old?.data) return
                return {
                    ...old,
                    data: old.data.map(o => Number(o.company_id) === Number(res.company_id) ? { ...o, extra_charges: [res, ...o.extra_charges] } : o)
                }
            })
            enqueueSnackbar('Extra Charge added successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const updateExtraCharge = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await DriverPaysApi.updateExtraCharge(id, payload)
            return res.data
        },
        onSuccess: (res) => {
            const cachedHourlyDrivers = queryClient.getQueriesData({ queryKey: ['hourlyDrivers'] })
            const cachedHourlyDriversRegister = queryClient.getQueriesData({ queryKey: ['approvedDriverHourlyTotals'] })
            if (cachedHourlyDrivers) {
                queryClient.setQueriesData({ queryKey: ['hourlyDrivers'] }, (old) => {
                    if (!old?.data) return
                    return {
                        ...old,
                        data: old.data.map(o => Number(o.company_id) === Number(res.company_id) ? { ...o, extra_charges: o.extra_charges.map(ex => Number(ex.id) === Number(res.id) ? res : ex) } : o)
                    }
                })
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['hourlyDrivers'] })
            }
            if (cachedHourlyDriversRegister) {
                queryClient.setQueriesData({ queryKey: ['approvedDriverHourlyTotals'] }, (old) => {
                    if (!old?.data) return
                    return {
                        ...old,
                        data: old.data.map(o => {
                            if (Number(o.company_id) === Number(res.company_id)) {
                                const newExtraCharges = o.extra_charges.map(ex => Number(ex.id) === Number(res.id) ? res : ex)
                                return { ...o, extra_charges: newExtraCharges, extra_charges_pay: newExtraCharges.reduce((a, ex) => a = a + Number(ex.price), 0) }
                            }
                            return o
                        })
                    }
                })
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['hourlyDrivers'] })
            }
            enqueueSnackbar('Extra Charge updated successfully', { variant: 'success' })
        },
        onError: handleError
    })

    const deleteExtraCharge = useMutation({
        mutationFn: async ({ id, cid }) => {
            const res = await DriverPaysApi.deleteExtraCharge(id)
            return res.data
        },
        onSuccess: (res, { id, cid }) => {
            if (res) {
                queryClient.setQueriesData({ queryKey: ['hourlyDrivers'] }, (old) => {
                    if (!old?.data) return
                    return {
                        ...old,
                        data: old.data.map(o => Number(o.company_id) === Number(cid) ? { ...o, extra_charges: o.extra_charges.filter(ex => Number(ex.id) !== Number(id)) } : o)
                    }
                })
            }
            enqueueSnackbar('Extra Charge deleted successfully', { variant: 'success' })
        },
        onError: handleError
    })

    return { applyAccessorials, driverPayout, updateInterlinerAmounts, updateOrderStatus, approvedDriverPayHourly, addExtraCharge, deleteExtraCharge, updateExtraCharge, saveDriverPayDailyAdjustment }
}
