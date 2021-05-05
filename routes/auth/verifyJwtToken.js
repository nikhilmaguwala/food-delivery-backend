const jwt = require('jsonwebtoken');
const config = require('../../config/db.config');
const db = require("../../models");
const Users = db.users;

exports.verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token){
        return res.status(403).send({
            auth: false, message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err){
            return res.status(500).send({
                auth: false,
                message: 'Fail to Authentication. Error -> ' + err
            });
        }

        Users.findOne({
            where: {
                id: decoded.id
            }
        }).then(user => {
            if (!user) {
                return res.status(404).send('User Not Found.');
            }
            req.userId = decoded.id;
            req.role = decoded.role
            next();
        }).catch(err => {
            res.status(500).send('Error -> ' + err);
        });
    });
}
