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

    return { applyAccessorials }
}
