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
            is_paid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            is_delivered: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            is_cancelled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            freezeTableName: true,
            underscored: true
        });
};
