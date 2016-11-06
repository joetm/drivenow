"use strict";

// const Car = require('./Car');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Status", {
        car_id: {
            type: DataTypes.STRING,
            references: {key: "id", model: "cars"}
        },
        innerCleanliness: {type: DataTypes.STRING},
        isCharging: {type: DataTypes.BOOLEAN},
        isInParkingSpace: {type: DataTypes.BOOLEAN},
        parkingSpaceId: {
            type: DataTypes.STRING,
            references: {key: "id", model: "parkingspaces"}
        },
        isPreheatable: {type: DataTypes.BOOLEAN},
        fuelLevel: {type: DataTypes.FLOAT},
        fuelLevelInPercent: {type: DataTypes.INTEGER},
        estimatedRange: {type: DataTypes.INTEGER}
	});
};

