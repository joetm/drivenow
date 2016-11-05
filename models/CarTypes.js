"use strict";

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("CarTypes", {
		modelIdentifier: {
			type: Sequelize.STRING,
			primaryKey: true,
			autoIncrement: false
		}
    });
};