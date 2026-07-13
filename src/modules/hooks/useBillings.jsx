import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import BillingsApi from "../apis/Billings.api";
import { useSnackbar } from "notistack";


export function useBillings() {
    return useQuery({
        queryKey: ['billings'],
        queryFn: async () => {
            const response = await BillingsApi.getOrdersForBilling();
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
            queryClient.setQueryData(['billings'], (old = []) => {
                return old.map(o =>
                    Number(o.customer_id) === Number(customer_id) ?
                        ({ ...o, orders: (o.orders || []).map(oo => Number(oo.order_id) === Number(order_id) ? ({ ...oo, accessorials, freight_fuel_surcharge, sub_total }) : oo) })
                        : o)
            })
            queryClient.invalidateQueries({ queryKey: ['order', Number(order_id)], exact: true })
            enqueueSnackbar('Accessorial Charges has been successfully applied', { variant: 'success' })
        },
        onError: handleError
    })

    return { applyAccessorials }
}
