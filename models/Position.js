"use strict";

const models = require("./index");

module.exports = function(sequelize, DataTypes) {
    const Position = sequelize.define("Position", {
        timestamp: {type: DataTypes.INTEGER},
        car_id: {
            type: DataTypes.STRING,
            references: {key: "id", model: 'cars'}
        },
        latitude: {type: DataTypes.FLOAT},
        longitude: {type: DataTypes.FLOAT},
        street: {type: DataTypes.STRING},
        city: {type: DataTypes.STRING}
    }, {
        classMethods: {
          associate: function (models) {
            Position.belongsTo(models.Car);
          }
        }
    });
    return Position;
};
