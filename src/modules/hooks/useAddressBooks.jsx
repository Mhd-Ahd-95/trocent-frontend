import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AddressBooksApi from "../apis/AddressBooks.api";
import { useSnackbar } from "notistack";


export function useAddressBooks() {
    return useQuery({
        queryKey: ['addressBooks'],
        queryFn: async () => {
            const response = await AddressBooksApi.getAddressBooks();
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}


export function useAddressBook(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['addressBook', Number(cid)],
        queryFn: async () => {

            const cachedAcess = queryClient.getQueryData(['addressBooks']) || [];
            const cached = cachedAcess.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await AddressBooksApi.getAddressBook(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}


export function useAddressBookMutations() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await AddressBooksApi.createAddressBook(payload);
            return res.data.data;
        },
        onSuccess: (newDriver) => {
            queryClient.setQueryData(['addressBooks'], (old = []) => {
                return [newDriver, ...old]
            });
            enqueueSnackbar('Address Book has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await AddressBooksApi.updateAddressBook(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                queryClient.setQueryData(['addressBooks'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
                queryClient.setQueryData(['addressBook', Number(updated.id)], updated)
                enqueueSnackbar('Address Book has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const patch = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await AddressBooksApi.patchABook(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                console.log(updated);
                queryClient.setQueryData(['addressBooks'], (old = []) =>
                    old.map((item) => item.id === Number(updated.id) ? updated : item)
                );
                queryClient.setQueryData(['addressBook', Number(updated.id)], updated)
                // enqueueSnackbar(`${updated.name} updated`, { variant: 'success' });
            },
            onError: handleError,
        }
    );


    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await AddressBooksApi.deleteAddressBook(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['accessorials'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Address Book has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await AddressBooksApi.deleteAddressBooks(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['addressBooks'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected Address Books been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, remove, removeMany, patch };

}