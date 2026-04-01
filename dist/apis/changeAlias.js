import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
import { aliasCacheUpdater } from "./getAlias.js";
export const changeAliasFactory = apiFactory()((api, ctx, utils) => {
    return async function changeAlias(friendId, alias) {
        var _a;
        (_a = aliasCacheUpdater.get(api)) === null || _a === void 0 ? void 0 : _a(friendId, alias || null);
        return "";
    };
});
