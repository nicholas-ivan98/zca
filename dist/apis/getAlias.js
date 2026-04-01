import { apiFactory } from "../utils.js";
const CACHE_REFRESH_INTERVAL = 5 * 60 * 1000;
export const aliasCacheUpdater = new WeakMap();
export const getAliasFactory = apiFactory()((api, ctx, utils) => {
    var _a, _b;
    const cache = new Map();
    aliasCacheUpdater.set(api, (userId, alias) => {
        if (alias) {
            cache.set(userId, { userId, alias });
        }
        else {
            cache.delete(userId);
        }
    });
    async function fetchAllAliases(page = 1, count = 100) {
        const result = await api.getAliasList(count, page);
        if (!result || result.items.length === 0)
            return [];
        const items = result.items;
        if (items.length < count)
            return items;
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
        }
        catch (_a) {
            utils.logger.warn("Failed to refresh alias cache");
        }
    }
    void refreshCache();
    const timer = setInterval(refreshCache, CACHE_REFRESH_INTERVAL);
    (_b = (_a = timer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
    /**
     * Get alias from cache by user ID.
     * Cache is populated on startup and refreshed every 5 minutes via getAliasList.
     *
     * @param idUser User ID
     * @returns Alias item or null if not found in cache
     */
    return async function getAlias(idUser) {
        var _a;
        return (_a = cache.get(idUser)) !== null && _a !== void 0 ? _a : null;
    };
});
