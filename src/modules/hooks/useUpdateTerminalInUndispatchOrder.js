import { useQueryClient } from "@tanstack/react-query";

export function useUpdateTerminalInUndispatchOrder() {

    const queryClient = useQueryClient();

    return async (order) => {
        const dispatch_id = order.undispatch_order_id;
        const newTerminal = order.terminal;
        const cachedUndispatched = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
        if (cachedUndispatched?.length > 0) {
            let orderData = null;
            for (let [key, undispatch] of cachedUndispatched) {
                const found = (undispatch?.data || []).find(o => Number(o.id) === Number(dispatch_id));
                if (found) {
                    orderData = found;
                    break;
                }
            }
            cachedUndispatched.forEach(([key, data]) => {
                const keyFilters = key[2] ?? {};
                const keyTerminal = keyFilters?.filters?.terminal ?? null;
                const currentList = data?.data || [];
                const existingIndex = currentList.findIndex(o => Number(o.id) === Number(dispatch_id));
                const alreadyExists = existingIndex !== -1;
                if (keyTerminal === newTerminal) {
                    queryClient.setQueryData(key, (prev = {}) => {
                        const list = prev?.data || [];
                        if (alreadyExists) {
                            return {
                                ...prev, data: list.map(o => Number(o.id) === Number(dispatch_id) ? { ...o, terminal: newTerminal } : o),
                            };
                        } else {
                            const updatedOrder = orderData ? { ...orderData, terminal: newTerminal } : null;
                            if (!updatedOrder) return prev;
                            return { ...prev, data: [updatedOrder, ...list].sort((a, b) => Number(b.order_number) - Number(a.order_number)), };
                        }
                    });
                }
                else if (keyTerminal !== null && keyTerminal !== newTerminal) {
                    if (alreadyExists) {
                        queryClient.setQueryData(key, (prev = {}) => ({ ...prev, data: (prev?.data || []).filter(o => Number(o.id) !== Number(dispatch_id)), }));
                    }
                }
                else if (keyTerminal === null) {
                    if (alreadyExists) {
                        queryClient.setQueryData(key, (prev = {}) => ({
                            ...prev, data: (prev?.data || []).map(o => Number(o.id) === Number(dispatch_id) ? { ...o, terminal: newTerminal } : o),
                        }));
                    }
                }
            });
        } else {
            queryClient.invalidateQueries({ queryKey: ['dispatch', 'undispatched'] });
        }
        queryClient.invalidateQueries({ queryKey: ['order'] });
    };
}