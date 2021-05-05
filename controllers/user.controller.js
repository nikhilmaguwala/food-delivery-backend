const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require("../models");
const config = require("../config/db.config");
const Users = db.users;
const Op = db.Sequelize.Op;


// Create and Save a new User
exports.signup = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Users.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            res.status(400).send({
                message: "User with E-Mail Id already exists!"
            });
            return;
        } else {
            Users.findOne({
                where: {
                    phone: req.body.phone
                }
            }).then(function(user) {
                if (user) {
                    res.status(400).send({
                        message: "User with Contact Number already exists!"
                    });
                    return;

                } else {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: bcrypt.hashSync(req.body.password)
                    }

                    // Save Users in the database
                    Users.create(user)
                        .then(data => {
                            res.send({
                                name: data.name,
                                email: data.email,
                                phone: data.phone
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while Adding the User."
                            });
                        });
                }
            });
        }
    });
};

// Allow User to Login
exports.signin = (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Users.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send('User Not Found.');
        }

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
        }

        let token = jwt.sign({ id: user.id, role: "default" }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, accessToken: token });

    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}
