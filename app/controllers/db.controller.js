const db = require("../models");

// Reset Database
exports.reset = async (req, res) => {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Dropped DB and Re-sync It');
        res.send({
            message: "Database Reset Successful"
        });
    });
};

// Seed Database
exports.seed = async (req, res) => {
    res.send({
        description: "Not Implemented"
    })
};
