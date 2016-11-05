"use strict";

const Sequelize = require('sequelize');

const Car = require('./Car');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Status", {
        // foreign key (hasOne) relation to the Car
        car_id: {
            type: Sequelize.STRING,
            references: {key: "id", model: Car}
        },
        innerCleanliness: {type: Sequelize.STRING},
        isCharging: {type: Sequelize.STRING},
        isInParkingSpace: {type: Sequelize.STRING},
        isPreheatable: {type: Sequelize.STRING},
        fuelLevel: {type: Sequelize.FLOAT},
        fuelLevelInPercent: {type: Sequelize.INTEGER},
        estimatedRange: {type: Sequelize.INTEGER}
	});
};