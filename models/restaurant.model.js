module.exports = (sequelize, Sequelize) => {
    return sequelize.define("restaurant", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        rating: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        accepts_order: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        restaurant_latitude: {
            type: Sequelize.FLOAT,
        },
        restaurant_longitude: {
            type: Sequelize.FLOAT,
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        partnerId: {
            type: Sequelize.INTEGER,
        },
        verifiedStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        city: {
            type: Sequelize.STRING,
        },
        image_url: {
            type: Sequelize.TEXT,
            defaultValue: ''
        }
    });
};
