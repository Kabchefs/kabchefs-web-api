// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant("public")
        .readOwn("profile")
        .readAny("article")

    ac.grant("teamMember")
        .extend("public")
        .readAny("profile")
        .updateOwn("profile")
        .updateAny("article")
        .createOwn("profile")
        .createAny("article")

    ac.grant("admin")
        .updateAny("profile")
        .deleteAny("profile")
        .createAny("profile")
        .readAny("profile")
        .updateAny("article")
        .deleteAny("article")
        .createAny("article")
        .readAny("article")

    return ac;
})();