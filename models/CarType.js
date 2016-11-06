"use strict";

const Sequelize = require('sequelize');

// Sample:
// "carImageUrl": "https://prod.drive-now-content.com/fileadmin/user_upload_global/assets/cars/mini_3-tuerer/midnight_black_metallic/{density}/car.png",
// "group": "MINI",
// "make": "BMW",
// "modelIdentifier": "mini_3-tuerer",
// "modelName": "MINI 3-Door",
// "routingModelName": "mini-3-tuerer",
// "series": "MINI",
// "variant": "3-Tuerer"

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("CarType", {
		modelIdentifier: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},
		carImageUrl: {type: DataTypes.STRING},
		group: {type: DataTypes.STRING},
		make: {type: DataTypes.STRING},
		modelName: {type: DataTypes.STRING},
		routingModelName: {type: DataTypes.STRING},
		series: {type: DataTypes.STRING},
		variant: {type: DataTypes.STRING}
    });
};
