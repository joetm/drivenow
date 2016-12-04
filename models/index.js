const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}


let models = {
    sequelize: sequelize
};

// model configuration
// only prototype
// const models = require('./models/db');
// const models = require('./models');
// load the models
models.Car = sequelize.define("Car", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        name: {type: Sequelize.STRING},
        modelIdentifier: {
            type: Sequelize.STRING
            // references: {key: "modelIdentifier", model: 'cartypes'}
        },
        data: {type: Sequelize.STRING}
    });
models.CarType = sequelize.define("CarType", {
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
models.ChargingStation = sequelize.define("ChargingStation", {
        name: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        address: {type: Sequelize.STRING},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        organisation: {type: Sequelize.STRING}
    });
models.ParkingSpace = sequelize.define("ParkingSpace", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        fullStreet: {type: Sequelize.STRING},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        name: {type: Sequelize.STRING}
    });
models.PetrolStation = sequelize.define("PetrolStation", {
        name: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        address: {type: Sequelize.STRING},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        organisation: {type: Sequelize.STRING}
    });
// ------------------------------------
// models without sepcified primary key
// ------------------------------------
models.Position = sequelize.define("Position", {
        timestamp: {type: Sequelize.INTEGER},
        carId: {
            type: Sequelize.STRING
            // references: {key: "id", model: 'cars'}
        },
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        street: {type: Sequelize.STRING},
        city: {type: Sequelize.STRING}
    });
models.Scrape = sequelize.define("Scrape", {
        carId: {type: Sequelize.STRING},
        areaCode: {type: Sequelize.INTEGER},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        name: {type: Sequelize.STRING},
        data: {type: Sequelize.STRING}
    });
models.Status = sequelize.define("Status", {
        timestamp: {type: Sequelize.INTEGER},
        carId: {
            type: Sequelize.STRING
            // references: {key: "id", model: "cars"}
        },
        latitude: {type: Sequelize.STRING}, // dupes
        longitude: {type: Sequelize.STRING}, // dupes
        innerCleanliness: {type: Sequelize.STRING},
        isCharging: {type: Sequelize.BOOLEAN},
        isInParkingSpace: {type: Sequelize.BOOLEAN},
        parkingSpaceId: {
            type: Sequelize.STRING
            // references: {key: "id", model: "parkingspaces"}
        },
        isPreheatable: {type: Sequelize.BOOLEAN},
        fuelLevel: {type: Sequelize.FLOAT},
        fuelLevelInPercent: {type: Sequelize.INTEGER},
        estimatedRange: {type: Sequelize.INTEGER}
    });
// associate models
// CarType.hasOne(Car, {as: 'type', foreignKey: 'modelIdentifier'});
models.Car.belongsTo(models.CarType, {as: 'carType', foreignKey: 'modelIdentifier'});
models.Position.belongsTo(models.Car, {foreignKey: 'id'});
models.Status.belongsTo(models.Car, {foreignKey: 'id'});
models.Status.belongsTo(models.Position, {foreignKey: 'id'});

module.exports = models;
