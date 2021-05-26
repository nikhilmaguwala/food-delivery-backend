const { ADDRESS_TYPES } = require("../utilities/constants");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("address", {
        type: {
            type: DataTypes.ENUM,
            values: [ ADDRESS_TYPES.BILLING, ADDRESS_TYPES.SHIPPING ],
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });
};
