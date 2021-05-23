const db = require("../models");

const Dish = db.dish;
const Order = db.order;

// Create and Save a new Order
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.dishes || !req.body.order_price || !req.body.delivery_price || !req.body.tax_price || !req.body.total_price) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Order
    const order = {
        order_price: req.body.order_price,
        delivery_price: req.body.delivery_price,
        tax_price: req.body.tax_price,
        total_price: req.body.total_price,
        user_id: req.userId
    };

    const dishes = []
    const notFoundDishes = []
    for (let i=0; i<req.body.dishes.length; i++)
    {
        await Dish.findOne({
            where: {id: req.body.dishes[i]}
        }).then((dish) => {
            if (dish) {
                dishes.push(dish);
            } else {
                notFoundDishes.push(req.body.dishes[i]);
            }
        });
    }

    if (notFoundDishes.length === 0) {
        // Save Order in the database
        Order.create(order)
            .then(new_order => {
                dishes.map((dish) => {
                    new_order.addDish(dish);
                })
                return res.status(200).send(new_order);
            })
            .catch(err => {
                return res.status(500).send({
                    message: "Some error occurred while Adding the Order.",
                    description: err
                });
            });
    }
    else {
        return res.status(404).send({
            message: "One or More Dishes not found",
            description: { dishes: notFoundDishes }
        });
    }
};

// Retrieve all Order from the database.
exports.findAll = (req, res) => {

    Order.findAll({
        where: {}
    }).then(data => {
        res.send(data);
    }).catch(err => {
        return res.status(500).send({
            message: "Some error occurred while retrieving orders.",
            description: err
        });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Order.findOne({
        where: {id: id},
        include: [{
            model: Dish
        }]
    }).then(data => {
        if(!data)
        {
            res.status(404).send({
                message: `Order with id=${id} was not found`
            });
        }
        else {
            res.send(data);
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Order with id=" + id,
                description: err
            });
        });
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Order.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Order was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Order with id=" + id,
                description: err
            });
        });
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
    Order.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Orders were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:"Some error occurred while removing all Orders.",
                description: err
            });
        });
};
