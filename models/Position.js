"use strict";

const Cars = require('./Cars');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Position", {
        // foreign key (hasOne)
        car_id: {
            type: Sequelize.STRING,
            references: Cars,
            referencesKey: "id"
        },
		latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT}
	});
};