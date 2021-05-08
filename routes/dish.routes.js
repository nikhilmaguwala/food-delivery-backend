const authJwt = require('./auth/verifyJwtToken');
const { roles } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const dish = require("../controllers/dish.controller");

    const router = require("express").Router();

    // Create a new Dish
    router.post("/", [authJwt.verifyJwtToken, permit(roles.PARTNER)], dish.create);

    // Retrieve all Dishes
    router.get("/", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], dish.findAll);

    // Retrieve a single Dish with id
    router.get("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], dish.findOne);

    // Update a Dish with id
    router.put("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER)], dish.update);

    // Delete a Dish with id
    router.delete("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER)], dish.delete);

    // Create a new Dish
    router.delete("/", [authJwt.verifyJwtToken, permit(roles.PARTNER)], dish.deleteAll);

    app.use('/api/dish', router);
};
