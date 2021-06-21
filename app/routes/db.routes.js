module.exports = app => {
    const db = require("../controllers/db.controller");

    const router = require("express").Router();

    // Resets the Database
    router.post("/reset", db.reset);

    // Seed the Database
    router.post("/seed", db.seed);

    app.use('/api/db', router);
};
