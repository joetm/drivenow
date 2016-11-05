"use strict";

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Scrape", {
	    data: {type: Sequelize.STRING}
    });
};