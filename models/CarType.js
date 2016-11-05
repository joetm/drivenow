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
			type: Sequelize.STRING,
			primaryKey: true,
			autoIncrement: false
		},
		carImageUrl: {type: Sequelize.STRING},
		group: {type: Sequelize.STRING},
		make: {type: Sequelize.STRING},
		modelName: {type: Sequelize.STRING},
		routingModelName: {type: Sequelize.STRING},
		series: {type: Sequelize.STRING},
		variant: {type: Sequelize.STRING}
    });
};
