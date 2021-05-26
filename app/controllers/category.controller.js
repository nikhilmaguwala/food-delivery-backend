const db = require("../models");

const Category = db.category;
const Op = db.Sequelize.Op;

// Create and Save a new Category
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const existCategory = await Category.findOne({
        where: {
            name: req.body.name,
        }
    })

    if(existCategory) {
        res.status(400).send({
            message: "Category already exist"
        });
        return;
    }

    // Create a Category
    const category = {
        name: req.body.name,
    };

    // Save Category in the database
    Category.create(category)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while Adding the Category.",
                description: err
            });
        });
};

// Retrieve all Categories from the database.
exports.findAll = (req, res) => {
    const title = req.query.name;
    const condition = title ? { name: { [Op.iLike]: `%${title}%` } } : null;

    Category.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while Retrieving the Categories.",
                description: err
            });
        });
};

// Find a single Category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Category.findByPk(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({
                    message: `Category with id=${id} was not found`
                });
            }
            else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Category with id=" + id,
                description: err
            });
        });
};

// Update a Category by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Category.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Category was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Category with id=" + id,
                description: err
            });
        });
};

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Category.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Category was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Category with id=" + id,
                description: err
            });
        });
};

// Delete all Categories from the database.
exports.deleteAll = (req, res) => {
    Category.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Categories were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while removing all Categories.",
                description: err
            });
        });
};
