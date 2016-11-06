"use strict";

const Sequelize = require('sequelize');

// Sample:
// {
// "cars": items: [
// ...
// ],
// "fullStreet": "Zufahrt zum Flughafen Tegel 1",
// "id": "162856",
// "latitude": 52.550425,
// "longitude": 13.297382,
// "name": "Flughafen Berlin Tegel ARWE Tankstelle",
// "openingHours": []
// }

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ParkingSpace", {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},
    	fullStreet: {type: DataTypes.STRING},
		latitude: {type: DataTypes.FLOAT},
		longitude: {type: DataTypes.FLOAT},
		name: {type: DataTypes.STRING}
    });
};
