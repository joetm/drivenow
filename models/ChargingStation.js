"use strict";

// Sample:
// {
//     "address": [
//         "be emobil Spandauer Straße 2"
//     ],
//     "latitude": 52.520963,
//     "longitude": 13.403915,
//     "name": "ES1",
//     "organisation": "be emobil"
// }

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ChargingStation", {
        address: {type: DataTypes.STRING},
        latitude: {type: DataTypes.FLOAT},
        longitude: {type: DataTypes.FLOAT},
        name: {type: DataTypes.STRING},
        organisation: {type: DataTypes.STRING}
    });
};
