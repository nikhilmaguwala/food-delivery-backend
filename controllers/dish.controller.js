const db = require("../models");
const Restaurant = db.restaurants;
const Dishes = db.dishes;
const Op = db.Sequelize.Op;

// Create and Save a new Dish
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.dish_name || !req.body.dish_type || !req.body.dish_price || !req.body.restaurant_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    let res_id;

    const ExistRes = await Restaurant.findByPk(req.body.restaurant_id)

    if(!ExistRes) {
        res.status(400).send({
            message: "Restaurant not Exist!"
        });
        return;
    }

    const existDish = await Dishes.findOne({
        where: {
            dish_name: req.body.dish_name,
            resId: req.body.restaurant_id,
        }
    })

    if(existDish) {
        res.status(400).send({
            message: "Dish in Restaurant already exist"
        });
        return;
    }

    // Create a Dish
    const dish = {
        dish_name: req.body.dish_name,
        dish_type: req.body.dish_type,
        dish_price: req.body.dish_price,
        resId: req.body.restaurant_id,
    };

    // Save Dishes in the database
    Dishes.create(dish)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Adding the Dish."
            });
        });
};

// Retrieve all Dishes from the database.
exports.findAll = (req, res) => {
    const title = req.query.dish_name;
    const condition = title ? { dish_name: { [Op.iLike]: `%${title}%` } } : null;

    Dishes.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving dishes."
            });
        });
};

// Find a single Dish with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Dishes.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Dish with id=" + id
            });
        });
};

// Update a Dish by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Dishes.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Dish was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update dish with id=${id}. Maybe Dish was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Dish with id=" + id
            });
        });
};

// Delete a Dish with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Dishes.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Dish was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Dish with id=${id}. Maybe Dish was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Dish with id=" + id
            });
        });
};

// Delete all Dishes from the database.
exports.deleteAll = (req, res) => {
    Dishes.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Dishes were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all dishes."
            });
        });
};
