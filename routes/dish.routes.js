module.exports = app => {
    const dish = require("../controllers/dish.controller");

    const router = require("express").Router();

    // Create a new Dish
    router.post("/", dish.create);

    // Retrieve all Dishes
    router.get("/", dish.findAll);

    // Retrieve a single Dish with id
    router.get("/:id", dish.findOne);

    // Update a Dish with id
    router.put("/:id", dish.update);

    // Delete a Dish with id
    router.delete("/:id", dish.delete);

    // Create a new Dish
    router.delete("/", dish.deleteAll);

    app.use('/api/dish', router);
};
