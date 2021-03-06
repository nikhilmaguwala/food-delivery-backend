const db = require("../models");

const Dish = db.dish;
const Order = db.order;
const Address = db.address;

// Create and Save a new Order
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.dishes || !req.body.order_price || !req.body.delivery_price || !req.body.tax_price || !req.body.total_price || !req.body.address_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const address = await Address.findOne({
        where: {
            id: req.body.address_id,
            user_id: req.userId
        }
    });

    if (address) {
        // Create a Order
        const order = {
            order_price: req.body.order_price,
            delivery_price: req.body.delivery_price,
            tax_price: req.body.tax_price,
            total_price: req.body.total_price,
            user_id: req.userId,
            address_id: req.body.address_id
        };

        const dishes = []
        const notFoundDishes = []
        for (let i=0; i<req.body.dishes.length; i++)
        {
            const dish = await Dish.findOne({
                where: {id: req.body.dishes[i]}
            });

            if (dish) {
                dishes.push(dish);
            }
            else {
                notFoundDishes.push(req.body.dishes[i]);
            }
        }

        if (notFoundDishes.length === 0) {
            // Save Order in the database
            try {
                const new_order = await Order.create(order)
                dishes.map((dish) => {
                    new_order.addDish(dish);
                });
                return res.status(200).send(new_order);
            }
            catch (err) {
                return res.status(500).send({
                    message: "Some error occurred while Adding the Order.",
                    description: err
                });
            }
        }
        else {
            return res.status(404).send({
                message: "One or More Dishes not found",
                description: { dishes: notFoundDishes }
            });
        }
    }
    else {
        return res.status(404).send({
            message: "Address not found",
            description: `Address with id: ${req.body.address_id} and User id: ${req.userId} was not Found`
        });
    }
};

// Retrieve all Order from the database.
exports.findAll = async (req, res) => {

    try {
        const data = await Order.findAll({
            where: {}
        });

        return res.send(data);
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while retrieving orders.",
            description: err
        });
    }
};

// Find a single Order with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const order = await Order.findOne({
            where: {id: id},
            include: [{
                model: Dish
            },
            {
                model: Address
            }]
        });

        if(!order)
        {
            return res.status(404).send({
                message: `Order with id=${id} was not found`
            });
        }
        else {
            return res.send(order);
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Error retrieving Order with id=" + id,
            description: err
        });
    }
};

// Delete a Order with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Order.destroy({
            where: { id: id }
        });

        if (num === 1) {
            return res.send({
                message: "Order was deleted successfully!"
            });
        } else {
            return res.send({
                message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Could not delete Order with id=" + id,
            description: err
        });
    }
};

// Delete all Orders from the database.
exports.deleteAll = async (req, res) => {

    try {
        const nums = await Order.destroy({
            where: {},
            truncate: false
        });

        return res.send({ message: `${nums} Orders were deleted successfully!` });
    }
    catch (err) {
        return res.status(500).send({
            message:"Some error occurred while removing all Orders.",
            description: err
        });
    }
};
