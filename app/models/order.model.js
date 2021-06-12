module.exports = (sequelize, DataTypes) => {
    return sequelize.define("order", {
        order_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        delivery_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tax_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.STRING,
            allowNull: false // require: true
        },
        status: {
            type: DataTypes.STRING, // completed or pending
            default: "pending"
        }
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
