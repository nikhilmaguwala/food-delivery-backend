const authJwt = require('./auth/verifyJwtToken');

module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/",[authJwt.verifyToken], restaurant.create);

    // Retrieve all Restaurants
    router.get("/", [authJwt.verifyToken], restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", [authJwt.verifyToken], restaurant.createByLink);

    // Retrieve a single Restaurant with id
    router.get("/:id", [authJwt.verifyToken], restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", [authJwt.verifyToken], restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", [authJwt.verifyToken], restaurant.delete);

    // Create a new Restaurant
    router.delete("/", [authJwt.verifyToken], restaurant.deleteAll);

    app.use('/api/restaurants', router);
};
