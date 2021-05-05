module.exports = (sequelize, Sequelize) => {
    return sequelize.define("partner", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            isEmail: true,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isValidPhoneNo: function(value) {
                    if (!value) return value;

                    let regexp = /^[0-9]+$/;
                    let values = (Array.isArray(value)) ? value : [value];

                    values.forEach(function(val) {
                        if (!regexp.test(val)) {
                            throw new Error("Number only is allowed.");
                        }
                    });
                    return value;
                }
            }
        },
        password: {
            type : Sequelize.STRING,
            allowNull: false
        },
        gstNumber: {
            type : Sequelize.STRING,
            allowNull: false
        },
        address: {
            type : Sequelize.STRING,
            allowNull: false
        },
        panCard: {
            type : Sequelize.STRING,
            allowNull: false
        }
    });
};
