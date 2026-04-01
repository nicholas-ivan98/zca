import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
import { aliasCacheUpdater } from "./getAlias.js";

export type ChangeAliasResponse = "";

export const changeAliasFactory = apiFactory<ChangeAliasResponse>()((api, ctx, utils) => {
    return async function changeAlias(friendId: string, alias: string) {
        aliasCacheUpdater.get(api)?.(friendId, alias || null);
        return "";
    };
});
