const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 3000000,
        idle: 500000
    }
};
