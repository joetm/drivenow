"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Position", {
        // foreign key (hasOne) relation to the Car
        // car_id: {type: DataTypes.STRING},
        // car_id: {
        //     type: DataTypes.STRING,
        //     references: {key: "id", model: Car}
        // },
        car_id: {
            type: DataTypes.STRING,
            references: {key: "id", model: 'cars'}
        },
        latitude: {type: DataTypes.FLOAT},
        longitude: {type: DataTypes.FLOAT},
        street: {type: DataTypes.STRING},
        city: {type: DataTypes.STRING}
    });
};
