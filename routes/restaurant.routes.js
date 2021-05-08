const authJwt = require('./auth/verifyJwtToken');
const { roles } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/",[authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.create);

    // Retrieve all Restaurants
    router.get("/", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.createByLink);

    // Retrieve a single Restaurant with id
    router.get("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.delete);

    // Create a new Restaurant
    router.delete("/", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.deleteAll);

    app.use('/api/restaurants', router);
};
