import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CompaniesApi from "../apis/Companies.api";
import { useSnackbar } from "notistack";


export function useCompanies() {
    return useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const response = await CompaniesApi.getCompanies();
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


export function useCompany(cid) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['company', Number(cid)],
        queryFn: async () => {

            const cachedCompanies = queryClient.getQueryData(['companies']) || [];
            const cached = cachedCompanies.find(item => item.id === Number(cid));
            if (cached) return cached;

            const res = await CompaniesApi.getCompany(Number(cid));
            return res.data.data;
        },
        enabled: !!cid,
        staleTime: 5 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
        // initialData: () => {
        //     const companies = queryClient.getQueryData(['companies']) || [];
        //     return companies.find(item => item.id === Number(cid));
        // }
    });
}


export function useCompanyMutation() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()

    const hasCachedList = queryClient.getQueryData(['companies'])

    const handleError = (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
    };

    const create = useMutation({
        mutationFn: async (payload) => {
            const res = await CompaniesApi.createCompany(payload);
            return res.data.data;
        },
        onSuccess: (newCompany) => {
            if (hasCachedList) {
                queryClient.setQueryData(['companies'], (old = []) => {
                    return [newCompany, ...old]
                });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ['companies'], exact: true })
            }
            enqueueSnackbar('Company has been created successfully', { variant: 'success' });
        },
        onError: handleError,
    });

    const update = useMutation(
        {
            mutationFn: async ({ id, payload }) => {
                const res = await CompaniesApi.updateCompany(Number(id), payload);
                return res.data.data;
            },
            onSuccess: (updated) => {
                if (hasCachedList) {
                    queryClient.setQueryData(['companies'], (old = []) =>
                        old.map((item) => item.id === Number(updated.id) ? updated : item)
                    );
                }
                else {
                    queryClient.invalidateQueries({ queryKey: ['companies'], exact: true })
                }
                queryClient.setQueryData(['company', Number(updated.id)], updated)
                enqueueSnackbar('Company has been updated successfully', { variant: 'success' });
            },
            onError: handleError,
        }
    );

    const remove = useMutation({
        mutationFn: async (iid) => {
            const res = await CompaniesApi.deleteCompany(iid);
            return res.data
        },
        onSuccess: (res, iid) => {
            if (res) {
                queryClient.setQueryData(['companies'], (old = []) =>
                    old.filter((item) => item.id !== iid)
                );
                enqueueSnackbar('Company has been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    const removeMany = useMutation({
        mutationFn: async (iids) => {
            const res = await CompaniesApi.deleteCompanies(iids);
            return res.data;
        },
        onSuccess: (res, iids) => {
            if (res) {
                queryClient.setQueryData(['companies'], (old = []) =>
                    old.filter((item) => !iids.includes(item.id))
                );
                enqueueSnackbar('Selected Companies have been deleted successfully', { variant: 'success' });
            }
        },
        onError: handleError,
    });

    return { create, update, removeMany, remove };

}