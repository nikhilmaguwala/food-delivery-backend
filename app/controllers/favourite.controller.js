const db = require("../models");

const User = db.user;
const Restaurant = db.restaurant;

// Create and Save a new Favourite
exports.create = async (req, res) => {

    // Validate request
    if (!req.body.restaurant_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    try {

        const user = await User.findOne({
            where: {
                id: req.userId
            }
        });

        const restaurant = await Restaurant.findOne({
            where: {
                id: req.body.restaurant_id
            }
        });

        if (!restaurant)
        {
            res.status(404).send({
                message: `Restaurant with id=${req.body.restaurant_id} was not found`
            });
        }
        else
        {
            user.addRestaurant(restaurant);

            res.status(200).send({
                message: "Restaurant added to favourites successfully"
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while Adding the Restaurant to favourites.",
            description: err
        });
    }
};

// Retrieve all Favourites from the database.
exports.findAll = async (req, res) => {

    try {
        const data = await User.findOne({
            where: {id: req.userId},
            include: [{
                model: Restaurant
            }]
        });

        return res.send(data);

    } catch (err) {
        return res.status(500).send({
            message: "Some error occurred while retrieving favourites.",
            description: err
        });
    }
};

// Delete a Favourite with the specified id in the request
exports.delete = async (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    try {

        const user = await User.findOne({
            where: {
                id: req.userId
            }
        });

        const restaurant = await Restaurant.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!restaurant)
        {
            res.status(404).send({
                message: `Restaurant with id=${req.body.restaurant_id} was not found`
            });
        }
        else
        {
            user.removeRestaurant(restaurant);

            res.status(200).send({
                message: "Restaurant removed from favourites successfully"
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while Removing the Restaurant from favourites.",
            description: err
        });
    }
};

