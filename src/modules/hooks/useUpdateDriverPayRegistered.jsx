import { useQueryClient } from "@tanstack/react-query";

export function useDriverPayRegistered() {
    const queryClient = useQueryClient();

    return async (register) => {
        
        const queryKey = ['driverPayHourlyRegistered'];
        const queries = queryClient.getQueriesData({ queryKey });
        const hasCachedData = queries.some(([, data]) => data?.data);

        if (hasCachedData) {
            queryClient.setQueriesData({ queryKey }, (old) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: old.data.map(o =>
                        Number(o.id) === Number(register.id) ? { ...o, ...register } : o
                    ),
                };
            });
        } else {
            await queryClient.invalidateQueries({ queryKey });
        }
    };
}