import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import OrderApi from "../apis/Order.api";
import { useSnackbar } from "notistack";


// export function useOrders() {
//     return useQuery({
//         queryKey: ['orders'],
//         queryFn: async () => {
//             const response = await OrderApi.getOrders()
//             return response.data.data;
//         },
//         staleTime: 5 * 60 * 1000,
//         gcTime: 60 * 60 * 1000,
//         refetchOnWindowFocus: false,
//         retry: 0,
//         // refetchOnReconnect: false,
//         // refetchOnMount: false,
//     });
// }

export function useOrderPagination(page = 1, pageSize = 10) {
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


export function useOrderMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const hasCachedList = queryClient.getQueriesData({ queryKey: ['orders'] })

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await OrderApi.createOrder(payload)
            return res.data.data;
        },
        onSuccess: (newOrder) => {
            if (hasCachedList.length > 0) {
                hasCachedList.forEach(([key, old]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: [newOrder, ...(prev.data || [])],
                        meta: { ...prev.meta, total: (prev.meta?.total || 0) + 1 },
                    }));
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
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
            onSuccess: (updated) => {
                if (updated) {
                    const orderUpdated = updateOrders(updated)
                    if (hasCachedList.length > 0) {
                        hasCachedList.forEach(([key, old]) => {
                            queryClient.setQueryData(key, (prev = {}) => ({
                                ...prev,
                                data: (prev.data || []).map(item => item.id === Number(updated.id) ? orderUpdated : item)
                            }));
                        });
                    }
                    else {
                        queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
                    }
                    queryClient.setQueryData(['order', Number(updated.id)], updated)
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
            if (updated && updated.length > 0) {
                if (hasCachedList) {
                    hasCachedList.forEach(([key, old]) => {
                        queryClient.setQueryData(key, (prev = {}) => ({
                            ...prev,
                            data: (prev.data || []).map(item => item.id === Number(id) ? { ...item, order_status: sts } : item)
                        }));
                    });
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
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
            if (hasCachedList) {
                hasCachedList.forEach(([key, old]) => {
                    queryClient.setQueryData(key, (prev = {}) => ({
                        ...prev,
                        data: [newOrder, ...(prev.data || [])],
                        meta: { ...prev.meta, total: (prev.meta?.total || 0) + 1 },
                    }));
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
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