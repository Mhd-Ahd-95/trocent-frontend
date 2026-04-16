import { useQueryClient } from "@tanstack/react-query";
import { dispatchKeys } from "./useDispatchOrders";
import DispatchOrderAPI from '../apis/DispatchOrder.api'

const mergeTrips = (cachedTrips = [], updatedTrips = []) => {
    if (!cachedTrips) return updatedTrips;
    const updatedMap = new Map(updatedTrips.map(t => [t.id, t]));
    const existingIds = new Set(cachedTrips.map(t => t.id));
    const merged = cachedTrips.map(t => updatedMap.has(t.id) ? updatedMap.get(t.id) : t);
    const newTrips = updatedTrips.filter(t => !existingIds.has(t.id));
    return [...newTrips, ...merged];
};

const getPageNumber = (queryKey) =>
    queryKey.find(k => typeof k === 'object' && k !== null && 'page' in k)?.page ?? 1;

const invalidateFromPage = (queryClient, fromPage) => {
    const allEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
    allEntries.forEach(([key]) => {
        if (getPageNumber(key) >= fromPage) {
            queryClient.invalidateQueries({ queryKey: key });
        }
    });
};

export function useUpdateTripUndispatchOrders() {
    const queryClient = useQueryClient();

    return async (trip_id, oids = []) => {

        const updatedTrip = await DispatchOrderAPI.getTripById(trip_id)
        if (!updatedTrip) return
        const trip = updatedTrip.data
        const key = dispatchKeys.trips('driver');
        const cachedTrips = queryClient.getQueryData(key);
        queryClient.setQueryData(key, mergeTrips(cachedTrips, [trip]));

        if (oids.length === 0) return;

        const allUndispatchedEntries = queryClient.getQueriesData({ queryKey: ['dispatch', 'undispatched'] });
        if (allUndispatchedEntries.length === 0) return;

        const sortedEntries = [...allUndispatchedEntries].sort(
            ([a], [b]) => getPageNumber(a) - getPageNumber(b)
        );

        const affectedPages = sortedEntries
            .filter(([, cachedPage]) => {
                if (!cachedPage) return false;
                return (cachedPage.data ?? []).some(o => oids.includes(Number(o.id)));
            })
            .map(([key]) => getPageNumber(key));

        if (affectedPages.length === 0) {
            invalidateFromPage(queryClient, 1);
            return;
        }

        const lowestAffectedPage = Math.min(...affectedPages);
        const pageMap = new Map(sortedEntries.map(([key, data]) => [getPageNumber(key), { key, data }]));

        if (lowestAffectedPage > 1) {
            invalidateFromPage(queryClient, lowestAffectedPage);
            return;
        }

        const page1 = pageMap.get(1);
        const perPage = page1.data.perPage ?? 50;
        let page1Data = (page1.data.data ?? []).filter(o => !oids.includes(Number(o.id)));
        let lastFilledPage = 1;
        let nextPageNum = 2;

        while (page1Data.length < perPage) {
            const nextPage = pageMap.get(nextPageNum);
            if (!nextPage || !nextPage.data) {
                invalidateFromPage(queryClient, 1);
                return;
            }
            const nextPageData = nextPage.data.data ?? [];
            const needed = perPage - page1Data.length;
            if (nextPageData.length <= needed) {
                page1Data = [...page1Data, ...nextPageData];
                lastFilledPage = nextPageNum;
                nextPageNum++;
            } else {
                page1Data = [...page1Data, ...nextPageData.slice(0, needed)];
                lastFilledPage = nextPageNum;
                break;
            }
        }

        queryClient.setQueryData(page1.key, {
            ...page1.data,
            data: page1Data,
            total: (page1.data.total ?? 0) - oids.length,
        });
        invalidateFromPage(queryClient, lastFilledPage);
    };
}