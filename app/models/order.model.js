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
        }
    },
    {
        freezeTableName: true
    });
};
