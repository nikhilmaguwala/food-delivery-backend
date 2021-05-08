const jwt = require('jsonwebtoken');
const config = require('../../config/db.config');
const db = require("../../models");
const Users = db.users;
const Partners = db.partners;
const { roles } = require('../../utilities/constants');

exports.verifyJwtToken = (req, res, next) => {
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
        if (decoded.role === roles.DEFAULT)
        {
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
        }
        else if (decoded.role === roles.PARTNER)
        {
            Partners.findOne({
                where: {
                    id: decoded.id
                }
            }).then(partner => {
                if (!partner) {
                    return res.status(404).send('Partner Not Found.');
                }
                req.partnerId = decoded.id;
                req.role = decoded.role
                next();
            }).catch(err => {
                res.status(500).send('Error -> ' + err);
            });
        }
    });
}
