const authJwt = require('./auth/verifyJwtToken');

module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/",[authJwt.verifyPartnerToken], restaurant.create);

    // Retrieve all Restaurants
    router.get("/", [authJwt.verifyToken], restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", [authJwt.verifyPartnerToken], restaurant.createByLink);

    // Retrieve a single Restaurant with id
    router.get("/:id", [authJwt.verifyToken], restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", [authJwt.verifyPartnerToken], restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", [authJwt.verifyPartnerToken], restaurant.delete);

    // Create a new Restaurant
    router.delete("/", [authJwt.verifyPartnerToken], restaurant.deleteAll);

    app.use('/api/restaurants', router);
};
