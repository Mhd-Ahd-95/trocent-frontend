import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import OrderApi from "../apis/Order.api";
import { useSnackbar } from "notistack";
import { useDispatchCacheUpdate } from "./useDispatchCacheUpdate";

export function useOrderPagination(page = 1, pageSize = 50) {
    return useQuery({
        queryKey: ['orders', page, pageSize],
        queryFn: async () => {
            const res = await OrderApi.getOrders({ page, pageSize });
            console.log(res);
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

            // const cachedOrders = queryClient.getQueryData(['orders']) || [];
            // const cached = cachedOrders.find(item => Number(item.id) === Number(oid));
            // if (cached) return cached;

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

const updateOrders = (updated) => {
    return ({
        id: updated.id,
        order_number: updated.order_number,
        order_status: updated.order_status,
        customer_name: updated.customer.account_number + ' ' + updated.customer.name,
        shipper_name: updated.shipper_name,
        shipper_address: updated.shipper_address,
        shipper_city: updated.shipper_city,
        shipper_province: updated.shipper_province,
        shipper_postal_code: updated.shipper_postal_code,
        receiver_name: updated.receiver_name,
        receiver_address: updated.receiver_address,
        receiver_city: updated.receiver_city,
        receiver_province: updated.receiver_province,
        receiver_postal_code: updated.receiver_postal_code,
        reference_numbers: updated.reference_numbers,
        pickup_date: updated.pickup_date,
        delivery_date: updated.delivery_date,
        create_date: updated.create_date,
    })
}

// const handle_dispatch_undispatch_orders = (trips = [], undispatchedOrder = [], order) => {
//     const queryClient = useQueryClient()
//     const driverTrips = queryClient.getQueryData({ queryKey: ['dispatch', 'trips', 'driver'] });
//     const interlinerTrips = queryClient.getQueryData({ queryKey: ['dispatch', 'trips', 'interliner'] });
//     const allUndispatched = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
//     const hasInterlinerTrip = trips.some(t => t.trip_type === 'interliner')
//     const hasDriverTrip = trips.some(t => t.trip_type === 'driver')
//     const hasUndispatched = undispatchedOrder.some((disp) => disp.trip_id === null)

//     if (hasInterlinerTrip) {
//         if (interlinerTrips) {
//             queryClient.setQueryData()
//         }
//         else {

//         }
//     }
// }


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
            const { order, trips, undispatched_orders } = response
            console.log(response);
            const cachedList = queryClient.getQueriesData({ queryKey: ['orders'] })
            if (cachedList.length > 0) {
                console.log(cachedList);
                cachedList.forEach(([key, old]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: [order, ...(prev.data || [])],
                        meta: { ...prev.meta, total: (prev.meta?.total || 0) + 1 },
                    }));
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['orders']})
            }
            updateDispatchCache({ trips: trips, undispatchedOrders: undispatched_orders, });
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
                const { order, trips, undispatched_orders } = response
                if (order) {
                    const orderUpdated = updateOrders(order)
                    if (cachedList.length > 0) {
                        cachedList.forEach(([key, old]) => {
                            queryClient.setQueryData(key, (prev = {}) => ({
                                ...prev,
                                data: (prev.data || []).map(item => item.id === Number(order.id) ? orderUpdated : item)
                            }));
                        });
                    }
                    else {
                        queryClient.invalidateQueries({ queryKey: ['orders']})
                    }
                    queryClient.setQueryData(['order', Number(order.id)], order)
                    enqueueSnackbar('Order has been updated successfully', { variant: 'success' });
                }
                updateDispatchCache({ order, trips: trips, undispatchedOrders: undispatched_orders, });
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
                    queryClient.invalidateQueries({ queryKey: ['orders']})
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
                queryClient.invalidateQueries({ queryKey: ['orders']})
            }
            queryClient.invalidateQueries({ queryKey: ['order', Number(id)], exact: true })
            enqueueSnackbar('Order has been duplicated successfully', { variant: 'success' });
        },
        onError: handleError,
    })

    // const remove = useMutation({
    //     mutationFn: async (iid) => {
    //         const res = await DriversApi.deletDriver(iid);
    //         return res.data
    //     },
    //     onSuccess: (res, iid) => {
    //         if (res) {
    //             queryClient.setQueryData(['drivers'], (old = []) =>
    //                 old.filter((item) => item.id !== iid)
    //             );
    //             enqueueSnackbar('Driver has been deleted successfully', { variant: 'success' });
    //         }
    //     },
    //     onError: handleError,
    // });

    // const removeMany = useMutation({
    //     mutationFn: async (iids) => {
    //         const res = await DriversApi.deletDrivers(iids);
    //         return res.data;
    //     },
    //     onSuccess: (res, iids) => {
    //         if (res) {
    //             queryClient.setQueryData(['drivers'], (old = []) =>
    //                 old.filter((item) => !iids.includes(item.id))
    //             );
    //             enqueueSnackbar('Selected Drivers have been deleted successfully', { variant: 'success' });
    //         }
    //     },
    //     onError: handleError,
    // });

    return { create, uploadFile, deleteFile, update, patchStatus, duplicateOrder };

}