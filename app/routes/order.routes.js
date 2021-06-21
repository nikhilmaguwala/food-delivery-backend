const authJwt = require('./auth/verifyJwtToken');
const {ROLES} = require("../utilities/constants");
const {permit} = require("./auth/authPermissions");

module.exports = app => {
    const order = require("../controllers/order.controller");

    const router = require("express").Router();

    // Create a new Order
    router.post("/", [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], order.create);

    // Set Order Delivery Status
    router.post("/:id/delivery", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], order.setDeliveryStatus);

    // Set Order Paid Status
    router.post("/:id/paid", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], order.setPaidStatus);

    // Set Order Cancel Cancel Status
    router.post("/:id/cancel", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], order.setCancelStatus);

    // Retrieve all Orders
    router.get("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], order.findAll);

    // Retrieve a single Order with id
    router.get("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], order.findOne);

    // Delete a Order with id
    router.delete("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], order.delete);

    // Delete all Orders
    router.delete("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], order.deleteAll);

    app.use('/api/order', router);
};
