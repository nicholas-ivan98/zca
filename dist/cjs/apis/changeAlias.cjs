'use strict';

var utils = require('../utils.cjs');
var getAlias = require('./getAlias.cjs');

const changeAliasFactory = utils.apiFactory()((api, ctx, utils) => {
    return async function changeAlias(friendId, alias) {
        var _a;
        (_a = getAlias.aliasCacheUpdater.get(api)) === null || _a === void 0 ? void 0 : _a(friendId, alias || null);
        return "";
    };
});

exports.changeAliasFactory = changeAliasFactory;
