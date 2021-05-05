const authJwt = require('./auth/verifyJwtToken');

module.exports = app => {
    const dish = require("../controllers/dish.controller");

    const router = require("express").Router();

    // Create a new Dish
    router.post("/", [authJwt.verifyToken], dish.create);

    // Retrieve all Dishes
    router.get("/", [authJwt.verifyToken], dish.findAll);

    // Retrieve a single Dish with id
    router.get("/:id", [authJwt.verifyToken], dish.findOne);

    // Update a Dish with id
    router.put("/:id", [authJwt.verifyToken], dish.update);

    // Delete a Dish with id
    router.delete("/:id", [authJwt.verifyToken], dish.delete);

    // Create a new Dish
    router.delete("/", [authJwt.verifyToken], dish.deleteAll);

    app.use('/api/dish', router);
};
