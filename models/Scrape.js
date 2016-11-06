"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Scrape", {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},
		area_code: {type: DataTypes.INTEGER},
		latitude: {type: DataTypes.FLOAT},
		longitude: {type: DataTypes.FLOAT},
		name: {type: DataTypes.STRING},
	    data: {type: DataTypes.STRING}
    });
};