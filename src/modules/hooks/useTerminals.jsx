import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import TerminalsApi from "../apis/Terminals.api";


export function useTerminals() {
    return useQuery({
        queryKey: ['terminals'],
        queryFn: async () => {
            const response = await TerminalsApi.getTerminals();
            return response.data;
        },
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        // refetchOnReconnect: false,
        // refetchOnMount: false,
    });
}


export function useTerminalsMutation() {
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
            const res = await TerminalsApi.createTermianl(payload);
            return res.data;
        },
        onSuccess: (newValue) => {
            queryClient.setQueryData(['terminals'], (old = []) => {
                return [newValue, ...old]
            });
            enqueueSnackbar('Terminals has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await TerminalsApi.deleteTerminal(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['terminals'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Terminal has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, remove };

}