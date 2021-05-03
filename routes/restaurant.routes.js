module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/", restaurant.create);

    // Retrieve all Restaurants
    router.get("/", restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", restaurant.createByLink);

    // Retrieve a single Restaurant with id
    router.get("/:id", restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", restaurant.delete);

    // Create a new Restaurant
    router.delete("/", restaurant.deleteAll);

    app.use('/api/restaurants', router);
};
