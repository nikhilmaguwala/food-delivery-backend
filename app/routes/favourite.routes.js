const authJwt = require('./auth/verifyJwtToken');
const {ROLES} = require("../utilities/constants");
const {permit} = require("./auth/authPermissions");

module.exports = app => {
    const favourite = require("../controllers/favourite.controller");

    const router = require("express").Router();

    // Create a new Favourite
    router.post("/", [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], favourite.create);

    // Get User's all Favourite
    router.get("/", [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], favourite.findAll);

    // Delete a Favourite
    router.delete("/:id", [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], favourite.delete);

    app.use('/api/favourite', router);
};
