const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // },
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.partners = require("./partner.model.js")(sequelize, Sequelize);
db.restaurants = require("./restaurant.model.js")(sequelize, Sequelize);
db.categories = require("./category.model")(sequelize, Sequelize);
db.dishes = require("./dish.model.js")(sequelize, Sequelize);
db.addresses = require("./address.model.js")(sequelize, Sequelize);
db.orders = require("./order.model")(sequelize, Sequelize);


// Setting relationships
db.users.hasMany(db.addresses, { foreignKey : 'user_id' });
db.addresses.belongsTo(db.users, { foreignKey : 'user_id' });

db.restaurants.hasMany(db.dishes, { foreignKey: 'restaurant_id' });
db.dishes.belongsTo(db.restaurants, { foreignKey: 'restaurant_id' });

db.users.hasMany(db.orders, { foreignKey : 'user_id' });
db.orders.belongsTo(db.users, { foreignKey : 'user_id' });

db.dishes.belongsToMany(db.orders, {
    through: "order_dish",
    as: "orders",
    foreignKey: "dish_id",
});
db.orders.belongsToMany(db.dishes, {
    through: "order_dish",
    as: "dishes",
    foreignKey: "order_id",
});

db.restaurants.belongsToMany(db.categories, {
    through: "category_restaurant",
    as: "categories",
    foreignKey: "restaurant_id",
});
db.categories.belongsToMany(db.restaurants, {
    through: "category_restaurant",
    as: "restaurants",
    foreignKey: "category_id",
});

module.exports = db;
