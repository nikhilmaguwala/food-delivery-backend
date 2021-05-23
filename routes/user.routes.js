module.exports = app => {
    const user = require("../controllers/user.controller");

    const router = require("express").Router();

    // Create a new User
    router.post("/signup", user.signup);
    router.post("/signin", user.signin);

    app.use('/api/user', router);
};
