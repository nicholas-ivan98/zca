import { apiFactory } from "../utils.js";
import type { API } from "../zalo.js";

export type GetAliasResponse = {
    userId: string;
    alias: string;
} | null;

type AliasCacheItem = {
    userId: string;
    alias: string;
};

const CACHE_REFRESH_INTERVAL = 5 * 60 * 1000;

export const aliasCacheUpdater = new WeakMap<API, (userId: string, alias: string | null) => void>();

export const getAliasFactory = apiFactory<GetAliasResponse>()((api, ctx, utils) => {
    const cache = new Map<string, AliasCacheItem>();

    aliasCacheUpdater.set(api, (userId, alias) => {
        if (alias) {
            cache.set(userId, { userId, alias });
        } else {
            cache.delete(userId);
        }
    });

    async function fetchAllAliases(page: number = 1, count: number = 100): Promise<AliasCacheItem[]> {
        const result = await api.getAliasList(count, page);
        if (!result || result.items.length === 0) return [];
        const items = result.items as AliasCacheItem[];
        if (items.length < count) return items;
        const nextItems = await fetchAllAliases(page + 1, count);
        return items.concat(nextItems);
    }

    async function refreshCache() {
        try {
            const allItems = await fetchAllAliases();
            cache.clear();
            for (const item of allItems) {
                cache.set(item.userId, item);
            }
        } catch {
            utils.logger.warn("Failed to refresh alias cache");
        }
    }

    void refreshCache();

    const timer = setInterval(refreshCache, CACHE_REFRESH_INTERVAL);
    (timer as NodeJS.Timeout & { unref?: () => void }).unref?.();

    /**
     * Get alias from cache by user ID.
     * Cache is populated on startup and refreshed every 5 minutes via getAliasList.
     *
     * @param idUser User ID
     * @returns Alias item or null if not found in cache
     */
    return async function getAlias(idUser: string): Promise<GetAliasResponse> {
        return cache.get(idUser) ?? null;
    };
});
