"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Scrape", {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},
	    data: {type: DataTypes.STRING}
    });
};