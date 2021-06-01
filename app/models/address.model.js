module.exports = (sequelize, DataTypes) => {
    return sequelize.define("address", {
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
