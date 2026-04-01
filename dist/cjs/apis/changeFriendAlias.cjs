'use strict';

var ZaloApiError = require('../Errors/ZaloApiError.cjs');
var utils = require('../utils.cjs');
var getAlias = require('./getAlias.cjs');

const changeFriendAliasFactory = utils.apiFactory()((api, ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.alias[0]}/api/alias/update`);
    /**
     * Change friend's alias
     *
     * @param alias new alias (nickname - bietdanh)
     * @param friendId friend id
     *
     * @throws {ZaloApiError}
     */
    return async function changeFriendAlias(alias, friendId) {
        var _a;
        const params = {
            friendId: friendId,
            alias: alias,
            imei: ctx.imei,
        };
        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams)
            throw new ZaloApiError.ZaloApiError("Failed to encrypt params");
        const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
            method: "GET",
        });
        (_a = getAlias.aliasCacheUpdater.get(api)) === null || _a === void 0 ? void 0 : _a(friendId, alias || null);
        return utils.resolve(response);
    };
});

exports.changeFriendAliasFactory = changeFriendAliasFactory;
