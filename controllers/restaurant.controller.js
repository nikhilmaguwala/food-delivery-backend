const db = require("../models");
const Restaurant = db.restaurants;
const Dishes = db.dishes;
const Op = db.Sequelize.Op;
const scrapRestaurant = require('../service/scrapping')

// Create and Save a new Restaurant
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.category || !req.body.rating || !req.body.location) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const existRes = await Restaurant.findOne({
        where: {
            name: req.body.name,
        }
    })

    if(existRes) {
        res.status(400).send({
            message: "Restaurant is already exist!"
        });
        return;
    }

    // Create a Restaurant
    const restaurant = {
        name: req.body.name,
        category: req.body.category,
        location: req.body.location,
        rating: req.body.rating,
        partnerId: req.partnerId
    };

    // Save Restaurant in the database
    Restaurant.create(restaurant)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Adding the Restaurant."
            });
        });
};

// Retrieve all Restaurants from the database.
exports.findAll = (req, res) => {
    const title = req.query.name;
    const condition = title ? { name: { [Op.iLike]: `%${title}%` } } : null;

    Restaurant.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants."
            });
        });
};

// Find a single Restaurant with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Restaurant.findByPk(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({
                    message: `Restaurant with id=${id} was not found`
                });
            }
            else {
                res.send(data);
            }
        })
        .catch(err => {
            console.log("hel"+err)
            res.status(500).send({
                message: "Error retrieving Restaurant with id=" + id
            });
        });
};

// Update a Restaurant by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Restaurant.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Restaurant was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Restaurant with id=" + id
            });
        });
};

// Delete a Restaurant with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Restaurant.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Restaurant was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Restaurant with id=${id}. Maybe Restaurant was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Restaurant with id=" + id
            });
        });
};

// Delete all Restaurants from the database.
exports.deleteAll = (req, res) => {
    Restaurant.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Restaurants were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Restaurants."
            });
        });
};

exports.createByLink = async (req, res) => {
    const restaurant = await scrapRestaurant(req.body.url);
    if(restaurant.error) {
        res.status(500).send({
            message: "Invalid Link, Please check link and try again!"
        });
        return;
    }
    let res_id;
    let error = '';

    const existRes = await Restaurant.findOne({
        where: {
            name: restaurant.name,
        }
    });

    if(existRes) {
        res_id = parseInt(existRes.id);
    } else {
        // Create a Restaurant
        const newRestaurant = {
            name: restaurant.name,
            category: restaurant.categories,
            location: restaurant.location,
            rating: parseFloat(restaurant.rating),
            city: restaurant.city,
            partnerId: req.partnerId
        };

        // Save Restaurant in the database
        await Restaurant.create(newRestaurant)
            .then(data => {
                res_id = data.dataValues.id
            })
            .catch(err => {
                console.log(err)
                error = "Some error occurred while Adding the Restaurant.";
            });
    }

    if(error !== '' || res_id === null) {
        res.status(500).send({
            message: error
        });
        return;
    }

    try {
        await restaurant.items.filter((my_dish) => {
            let existDish = true;
            Dishes.findOne({
                where: {
                    dish_name: my_dish.name,
                    resId: res_id,
                }
            }).then(() => {
                existDish = false;
            }).catch(() => {
                existDish = true;
            })
            return existDish;
        }).map((my_dish) => {
            const new_dish = {
                dish_name: my_dish.name,
                dish_type: my_dish.type,
                dish_price: my_dish.price,
                resId: res_id,
            }

            Dishes.create(new_dish).then().catch();
        })
        res.status(200).send({
            success: "Adding Restaurant is Successful..!"
        });
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while Adding the Dish."
        });
    }
}
