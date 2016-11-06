"use strict";

// Sample:
// {
// "address": [
//     "Shell Rothenbachstraße 1"
// ],
// "latitude": 52.571553,
// "longitude": 13.429597,
// "name": "FS1",
// "organisation": "Shell"
// }

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("PetrolStation", {
        address: {type: DataTypes.STRING},
        latitude: {type: DataTypes.FLOAT},
        longitude: {type: DataTypes.FLOAT},
        name: {type: DataTypes.STRING},
        organisation: {type: DataTypes.STRING}
    });
};
