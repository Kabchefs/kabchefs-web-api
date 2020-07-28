// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant("public")
        .readAny("article")

    ac.grant("teamMember")
        .readOwn("profile")
        .createOwn('profile')
        .updateOwn("profile")
        .updateAny("article")
        .createAny("article")
        .readAny("article")
        .deleteAny('article')
    ac.grant("admin")
        .extend('teamMember')
        .readAny("profile")
        .createAny('profile')
        .updateAny("profile")
        .deleteAny('profile')

    return ac;
})();