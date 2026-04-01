import type { API } from "../zalo.js";
export type GetAliasResponse = {
    userId: string;
    alias: string;
} | null;
export declare const aliasCacheUpdater: WeakMap<API, (userId: string, alias: string | null) => void>;
export declare const getAliasFactory: (ctx: import("../context.js").ContextBase, api: API) => (idUser: string) => Promise<GetAliasResponse>;
