module.exports = app => {
    const partner = require("../controllers/partner.controller");

    const router = require("express").Router();

    // Create a new Partner
    router.post("/signup", partner.signup);

    // Partner SignIn
    router.post("/signin", partner.signin);

    // Delete a Partner with id
    router.delete("/:id", partner.delete);

    // Delete all Partners
    router.delete("/", partner.deleteAll);

    app.use('/api/partner', router);
};
