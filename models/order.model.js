module.exports = (sequelize, Sequelize) => {
    return sequelize.define("order", {
        order_price: {
            type: Sequelize.FLOAT,
                allowNull: false,
        },
        delivery_price: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        tax_price: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        total_price: {
            type: Sequelize.FLOAT,
            allowNull: false,
        }
    });
};
