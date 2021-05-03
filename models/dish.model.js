module.exports = (sequelize, Sequelize) => {
    return sequelize.define("dish", {
        dish_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        dish_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        dish_price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        availability: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        availability_time: {
            type : Sequelize.INTEGER,
        },
        resId : {
            type : Sequelize.INTEGER,
            allowNull: false,
            onDelete : 'CASCADE',
            references : {
                model : 'restaurants',
                key : 'id',
                as : 'resId'
            },
        },
    });
};
