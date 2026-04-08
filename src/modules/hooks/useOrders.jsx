import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import OrderApi from "../apis/Order.api";
import { useSnackbar } from "notistack";
import { useDispatchCacheUpdate } from "./useDispatchCacheUpdate";

export function useOrderPagination(page = 1, pageSize = 50) {
    return useQuery({
        queryKey: ['orders', page, pageSize],
        queryFn: async () => {
            const res = await OrderApi.getOrders({ page, pageSize });
            return res.data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useOrder(oid) {
    return useQuery({
        queryKey: ['order', Number(oid)],
        queryFn: async () => {
            const res = await OrderApi.getOrderById(oid)
            return res.data;
        },
        enabled: !!oid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

export function useOrderMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const updateDispatchCache = useDispatchCacheUpdate();

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await OrderApi.createOrder(payload)
            return res.data;
        },
        onSuccess: (response) => {
            const { order } = response
            const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
            if (cachedList.length > 0) {
                cachedList.forEach(([key, old]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: [order, ...(prev.data || [])],
                        meta: { ...prev.meta, total: (prev.meta?.total || 0) + 1 },
                    }));
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
            enqueueSnackbar('Order has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const uploadFile = useMutation({
        mutationFn: async (payload) => {
            const res = await OrderApi.uploadFile(payload)
            return res.data
        },
        onSuccess: (newFiles, payload) => {
            const order_id = payload.get('order_id')
            queryClient.setQueryData(['order', Number(order_id)], (old = {}) => {
                return ({ ...old, files: newFiles })
            })
            enqueueSnackbar('File has been successully uploaded', { variant: 'success' });
        },
        onError: handleError,
    })

    const deleteFile = useMutation({
        mutationFn: async ({ fid, oid }) => {
            const res = await OrderApi.deleteFile(Number(fid));
            return res.data
        },
        onSuccess: (newFiles, payload) => {
            const order_id = payload.oid
            queryClient.setQueryData(['order', Number(order_id)], (old = {}) => {
                return ({ ...old, files: newFiles })
            })
            enqueueSnackbar('File has been successully deleted', { variant: 'success' });
        },
        onError: handleError,
    })

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await OrderApi.updateOrder(id, payload)
                return res.data;
            },
            onSuccess: (response) => {
                const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
                const { order } = response
                if (order) {
                    const orderUpdated = order
                    if (cachedList.length > 0) {
                        cachedList.forEach(([key, old]) => {
                            queryClient.setQueryData(key, (prev = {}) => ({
                                ...prev,
                                data: (prev.data || []).map(item => item.id === Number(order.id) ? orderUpdated : item)
                            }));
                        });
                    }
                    else {
                        queryClient.invalidateQueries({ queryKey: ['orders'] })
                    }
                    queryClient.invalidateQueries(['order', Number(order.id)])
                    enqueueSnackbar('Order has been updated successfully', { variant: 'success' });
                }
            },
            onError: handleError,
        }
    );

    const patchStatus = useMutation({
        mutationFn: async ({ id, uid, sts }) => {
            const res = await OrderApi.cancelOrder(id, uid, sts)
            return res.data
        },
        onSuccess: (updated, payload) => {
            const { id, sts } = payload
            const hasCachedOrderId = queryClient.getQueryData(['order', Number(id)])
            const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
            if (updated && updated.length > 0) {
                if (cachedList) {
                    cachedList.forEach(([key, old]) => {
                        queryClient.setQueryData(key, (prev = {}) => ({
                            ...prev,
                            data: (prev.data || []).map(item => item.id === Number(id) ? { ...item, order_status: sts } : item)
                        }));
                    });
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                }
                if (hasCachedOrderId) {
                    queryClient.setQueryData(['order', Number(id)], (old = {}) => {
                        return ({ ...old, order_status: sts, order_updates: updated })
                    })
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['order', Number(id)], exact: true })
                }
                enqueueSnackbar(`Order has been ${sts} successfully`, { variant: 'success' });
            }
        },
        onError: handleError,
    })

    const duplicateOrder = useMutation({
        mutationFn: async ({ id, user_id }) => {
            const res = await OrderApi.duplicateOrder(id, user_id)
            return res.data.data;
        },
        onSuccess: (newOrder, payload) => {
            const { id } = payload
            const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
            if (cachedList) {
                cachedList.forEach(([key, old]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: [newOrder, ...(prev.data || [])],
                        meta: { ...prev.meta, total: (prev.meta?.total || 0) + 1 },
                    }));
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
            queryClient.invalidateQueries({ queryKey: ['order', Number(id)], exact: true })
            enqueueSnackbar('Order has been duplicated successfully', { variant: 'success' });
        },
        onError: handleError,
    })

    const updateTerminal = useMutation({
        mutationFn: async ({ oid, terminal }) => {
            const res = await OrderApi.updateTerminal(oid, terminal)
            return res.data
        },
        onSuccess: (dos, { oid, terminal }) => {
            const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
            if (cachedList?.length > 0) {
                cachedList.forEach(([key]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: (prev.data || []).map(o => Number(o.id) === Number(oid) ? { ...o, terminal } : o),
                    }));
                });
            } else {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
            const cachedUndispatched = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] })
            const cachedTripDrivers = queryClient.getQueryData(['dispatch', 'trips', 'driver'])
            const cachedTripInterliners = queryClient.getQueryData(['dispatch', 'trips', 'interliner'])

            for (const { id, trip_id } of dos) {
                if (trip_id) {
                    if (cachedTripDrivers) {
                        queryClient.setQueryData(['dispatch', 'trips', 'driver'], (old = []) =>
                            old.map(t => Number(t.id) === Number(trip_id) ? { ...t, dispatched_orders: t.dispatched_orders.map(o => Number(o.id) === Number(id) ? { ...o, terminal } : o), } : t)
                        )
                    }
                    if (cachedTripInterliners) {
                        queryClient.setQueryData(['dispatch', 'trips', 'interliner'], (old = []) =>
                            old.map(t => Number(t.id) === Number(trip_id) ? { ...t, dispatched_orders: t.dispatched_orders.map(o => Number(o.id) === Number(id) ? { ...o, terminal } : o), } : t)
                        )
                    }
                    if (!cachedTripDrivers) queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'driver'] })
                    if (!cachedTripInterliners) queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips', 'interliner'] })

                } else {
                    if (cachedUndispatched?.length > 0) {
                        cachedUndispatched.forEach(([key]) => {
                            queryClient.setQueryData(key, (prev = {}) => ({
                                ...prev,
                                data: (prev.data || []).map(o => Number(o.id) === Number(id) ? { ...o, terminal } : o),
                            }));
                        });
                    } else {
                        queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] })
                    }
                }
            }
            queryClient.setQueryData(['order', Number(oid)], (old) => old ? { ...old, terminal } : old)
            enqueueSnackbar('Terminal has been updated successfully', { variant: 'success' })
        },
        onError: handleError,
    })

    return { create, uploadFile, deleteFile, update, patchStatus, duplicateOrder, updateTerminal };

}