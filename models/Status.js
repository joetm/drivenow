"use strict";

module.exports = function(sequelize, DataTypes) {
    const Status = sequelize.define("Status", {
        timestamp: {type: DataTypes.INTEGER},
        carId: {
            type: DataTypes.STRING,
            references: {key: "id", model: "cars"}
        },
        latitude: {type: DataTypes.STRING}, // dupes
        longitude: {type: DataTypes.STRING}, // dupes
        innerCleanliness: {type: DataTypes.STRING},
        isCharging: {type: DataTypes.BOOLEAN},
        isInParkingSpace: {type: DataTypes.BOOLEAN},
        parkingSpaceId: {
            type: DataTypes.STRING,
            references: {key: "id", model: "parkingspaces"}
        },
        isPreheatable: {type: DataTypes.BOOLEAN},
        fuelLevel: {type: DataTypes.FLOAT},
        fuelLevelInPercent: {type: DataTypes.INTEGER},
        estimatedRange: {type: DataTypes.INTEGER}
    // }, {
    //     classMethods: {
    //       associate: function (models) {
    //         Status.belongsTo(models.Car, {targetKey: 'id'});
    //         Status.belongsTo(models.Position);
    //       }
    //     }
    });
    return Status;
};
