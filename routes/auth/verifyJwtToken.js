const jwt = require('jsonwebtoken');
const config = require('../../config/db.config');
const db = require("../../models");
const Users = db.users;
const Partners = db.partners;

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

exports.verifyPartnerToken = (req, res, next) => {
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
        console.log(decoded)

        Partners.findOne({
            where: {
                id: decoded.id
            }
        }).then(user => {
            if (!user || decoded.role !== 'partner') {
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
