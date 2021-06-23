const db = require("../models");
const bcrypt = require('bcryptjs');

const User = db.user;
const Partner = db.partner;
const Address = db.address;
const Category = db.category;
const Restaurant = db.restaurant;
const Dish = db.dish;

const UserData = require("../db_seed/user_seed");
const PartnerData = require("../db_seed/partner_seed");
const AddressData = require("../db_seed/address_seed");
const CategoryData = require("../db_seed/category_seed");
const RestaurantData = require("../db_seed/restaurant_seed");
const DishData = require("../db_seed/dish_seed");

// Reset Database
exports.reset = async (req, res) => {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Dropped DB and Re-sync It');
        res.send({
            message: "Database Reset Successful"
        });
    });
};

// Seed Database
exports.seed = async (req, res) => {

    const errors = []

    // Users Seeding
    try {
        for (let user of UserData)
        {
            await User.create(user);
        }
    }
    catch (e) {
        console.log('Error seeding users', e);
        errors.push("Users")
    }

    // Partners Seeding
    try {
        for (let partner of PartnerData)
        {
            partner.password = bcrypt.hashSync(partner.password)
            await Partner.create(partner);
        }
    }
    catch (e) {
        console.log('Error seeding partners', e);
        errors.push("Partners")
    }

    // Address Seeding
    try {
        for (let address of AddressData)
        {
            await Address.create(address);
        }
    }
    catch (e) {
        console.log('Error seeding address', e);
        errors.push("Address")
    }

    // Category Seeding
    try {
        for (let category of CategoryData)
        {
            await Category.create(category);
        }
    }
    catch (e) {
        console.log('Error seeding address', e);
        errors.push("Category")
    }

    // Restaurant Seeding
    try {
        for (let restaurant of RestaurantData)
        {
            let newRes = await Restaurant.create(restaurant);
            let category = await Category.findByPk(Math.floor(Math.random() * CategoryData.length))
            newRes.addCategory(category);
            category = await Category.findByPk(Math.floor(Math.random() * CategoryData.length))
            newRes.addCategory(category);
        }
    }
    catch (e) {
        console.log('Error seeding restaurants', e);
        errors.push("Restaurants")
    }

    // Dish Seeding
    try {
        for (let dish of DishData)
        {
            await Dish.create(dish);
        }
    }
    catch (e) {
        console.log('Error seeding dishes', e);
        errors.push("Dishes")
    }

    if(errors.length == 0){
        res.send({
            message: "Database seed successfully"
        })
    } else {
        res.send({
            message: "Failed to seed Database",
            description: "Error occurred while seeding " + errors.join(", ")
        })
    }
};
