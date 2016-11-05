"use strict";

const Sequelize = require('sequelize');

const Car = require('./Car');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Position", {
        // foreign key (hasOne) relation to the Car
        car_id: {
            type: Sequelize.STRING,
            references: {key: "id", model: Car}
        },
		latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        street: {type: Sequelize.STRING},
        city: {type: Sequelize.STRING}
	});
};