module.exports = (sequelize, Sequelize) => {
    return sequelize.define("address", {
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            // validate: {
            //     validateType: function(value) {
            //         if(value==="ALL" || value==="COD" || value==="")
            //     }
            // }
        },
        location: {
            type: Sequelize.STRING,
            isEmail: true,
            allowNull: false,
        }
    });
};
