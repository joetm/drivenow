/* eslint no-console: 0 */

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const series = require('async/series');

const apiconf = require('./config/api.json');
const log = require('./app/logger');

// sequelize is annoying
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(path.join(__dirname, 'config/config.json'))[env];
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// only prototype
// const models = require('./models/db');
// const models = require('./models');
// load the models
let Car = sequelize.define("Car", {
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
let CarType = sequelize.define("CarType", {
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
let ChargingStation = sequelize.define("ChargingStation", {
        address: {type: Sequelize.STRING},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        name: {type: Sequelize.STRING},
        organisation: {type: Sequelize.STRING}
    });
let ParkingSpace = sequelize.define("ParkingSpace", {
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
let PetrolStation = sequelize.define("PetrolStation", {
        address: {type: Sequelize.STRING},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        name: {type: Sequelize.STRING},
        organisation: {type: Sequelize.STRING}
    });
let Position = sequelize.define("Position", {
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
let Scrape = sequelize.define("Scrape", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        carId: {type: Sequelize.STRING},
        areaCode: {type: Sequelize.INTEGER},
        latitude: {type: Sequelize.FLOAT},
        longitude: {type: Sequelize.FLOAT},
        name: {type: Sequelize.STRING},
        data: {type: Sequelize.STRING}
    });
let Status = sequelize.define("Status", {
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
Car.belongsTo(CarType, {as: 'carType', foreignKey: 'modelIdentifier'});
Position.belongsTo(Car, {foreignKey: 'id'});
Status.belongsTo(Car, {foreignKey: 'id'});
Status.belongsTo(Position, {foreignKey: 'id'});



// scrape configuration
// ----------------------------------------------------
const minutes = 60 * 1000;
const hours = 60 * minutes;
const interval = 3 * minutes;
const stopAfter = 7 * 24 * hours;
let intervalId;
const startDate = new Date();
const timestamp = Math.floor(Date.now());
// ----------------------------------------------------

function removeObjKeys(items, obj) {
    items.forEach(function(item) {
        if (obj.hasOwnProperty(item)) {
            delete obj[item];
        }
    });
    return obj;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function runScrape() {
    //
    // console.log(json);
    log.info("Running scrape...");
    //

    // abort condition
    const dateNow = new Date();
    const timeDiff = Math.abs(dateNow.getTime() - startDate.getTime());
    if (timeDiff > stopAfter) {
        clearInterval(intervalId);
        return;
    }

    fetch(apiconf.endpoint, {headers: apiconf.headers})
        .then(function(res) {
            log.info("Scrape", res.statusText, "(" + res.status + ")");
            // console.log(res.headers.raw());
            // console.log(res.headers.get('content-type'));
            return res.json();
        }).then(function(json) {
            //
            // -1-----------------------
            // save scraped raw data to disk
            fs.writeFile(path.join('scrapes', timestamp / 1000 + '.json'), JSON.stringify(json, null, 4), function(err) {
                if (err) {
                    throw err;
                }
                log.info('Scrape saved to disk.');
            });

            // -2-----------------------
            // save data to db
            // sqlite only allows one operation at a time
            // hence: operations are executed in series

            let fns = [];

            // persist the car types
            // -------------------------
            // var carTypes = clone(json.carTypes.items);
            fns.push.apply(fns, json.carTypes.items.map(function(ct) {
                return function(callback) {
                    CarType.findOrCreate({where: ct})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created cartype: ' + model.modelName);
                        }
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));

            // persist the charging stations
            // -------------------------
            // var chargingstations = clone(json.chargingStations.items);
            fns.push.apply(fns, json.chargingStations.items.map(function(cs) {
                cs.address = cs.address[0]; // string conversion
                return function(callback) {
                    ChargingStation.findOrCreate({where: cs})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created charging station: ' + model.name);
                        }
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));
            // persist the petrol stations
            // -------------------------
            // var petrolstations = clone(json.petrolStations.items);
            fns.push.apply(fns, json.petrolStations.items.map(function(ps) {
                ps.address = ps.address[0]; // string conversion
                return function(callback) {
                    PetrolStation.findOrCreate({where: ps})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created petrol station: ' + model.name);
                        }
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));
            // persist the parkingspaces
            // -------------------------
            // var parkingspaces = clone(json.parkingSpaces);
            fns.push.apply(fns, json.parkingSpaces.items.map(function(ps) {
                delete ps.cars; // dupe
                delete ps.count;
                delete ps.openingHours;
                return function(callback) {
                    ParkingSpace.findOrCreate({where: ps})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created parking space: ' + model.name);
                        }
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));

            // persist the cars
            // -------------------------
            let cars = clone(json.cars.items);
            cars = cars.map(function(c) {
                // remove dynamic data
                const filteredCar = removeObjKeys([
                    'innerCleanliness',
                    'isCharging',
                    'isInParkingSpace',
                    'parkingSpaceId',
                    'fuelLevel',
                    'fuelLevelInPercent',
                    'estimatedRange',
                    'latitude',
                    'longitude',
                    'address'
                ], c);
                return {
                    id: c.id,
                    name: c.name,
                    modelIdentifier: c.modelIdentifier,
                    data: JSON.stringify(filteredCar)
                };
            });
            fns.push.apply(fns, cars.map(function(c) {
                return function(callback) {
                    Car.findOrCreate({where: c})
                    .spread(function(model, created) {
                        if (model && created) {
                            log.info('Created car ' + model.name);
                        }
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));

            // persist the status of the car in separate table
            // -------------------------
            let statii = clone(json.cars.items);
            statii = statii.map(function(car) {
                let carStatus = {};
                [
                    'innerCleanliness',
                    'latitude',
                    'longitude',
                    'isCharging',
                    'isInParkingSpace',
                    'parkingSpaceId',
                    'isPreheatable',
                    'fuelLevel',
                    'fuelLevelInPercent',
                    'estimatedRange'
                ].forEach(function(item) {
                    carStatus[item] = car[item];
                });
                carStatus.timestamp = timestamp;
                // foreign key
                carStatus.carId = car.id;
                return carStatus;
            });
            fns.push.apply(fns, statii.map(function(carStatus) {
                // console.log(carStatus);
                return function(callback) {
                    // save the new status
                    Status.create(carStatus)
                    .then(function() {
                        // log.info('Status saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));

            // persist the positions
            // -------------------------
            let positions = clone(json.cars.items);
            positions = positions.map(function(car) {
                const pos = {
                    timestamp: timestamp,
                    carId: car.id,
                    latitude: car.latitude,
                    longitude: car.longitude
                };
                if (car.address) {
                    if (car.address[0] !== undefined) {
                        pos.street = car.address[0];
                    }
                    if (car.address[1] !== undefined) {
                        pos.city = car.address[1];
                    }
                }
                return pos;
            });
            fns.push.apply(fns, positions.map(function(pos) {
                return function(callback) {
                    // save the new status
                    Position.create(pos)
                    .then(function() {
                        // log.info('Position saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                };
            }));

            // persist the full scrape data
            // -------------------------
            // fns.push(
            //     function(callback) {
            //         // save the scrape
            //         Scrape.create({
            //             id: timestamp,
            //             name: json.name,
            //             areaCode: json.id,
            //             latitude: json.latitude,
            //             longitude: json.longitude,
            //             data: JSON.stringify(json)
            //         })
            //         .then(function() {
            //             // log.info('Scrape saved to db.');
            //             callback(null);
            //         }).catch(function(error) {
            //             throw error;
            //         });
            //     }
            // );

            log.info("# DB actions: " + fns.length);

            fns.push(function(callback) {
                log.info("Running next scrape in " + interval / 1000 / 60 + " minutes.");
                callback(null);
            });

            // execute the series of database tasks
            // -------------------------
            series(fns);
            //
        }).catch(function(err) {
            log.error(err);
        });
}


function startScrape() {
    // start immediately
    runScrape();
    // continue to run in intervals
    intervalId = setInterval(runScrape, interval);
}


// start app
// this will create the database tables on the first run
sequelize.sync({
    force: false, // do not start fresh
    pool: false
}).then(startScrape);


// (optional:) allow re-use of scrape function
// module.exports = runScrape;

module.exports = timestamp;
