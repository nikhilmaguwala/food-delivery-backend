module.exports = (sequelize, DataTypes) => {
    return sequelize.define("favourite", {

        },
        {
            freezeTableName: true,
            underscored: true
        });
};
