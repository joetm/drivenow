/* eslint no-console: 0 */

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const series = require('async/series');

const apiconf = require('./config/api.json');
const models = require('./models');
const log = require('./app/logger');

// scrape configuration
// ----------------------------------------------------
const interval = 5 * 60 * 1000;
const stop_after_milliseconds = 7 * 24 * 60 * 60 * 1000;
var intervalId;
const start_date = new Date();
// ----------------------------------------------------

function remove_obj_keys(items, obj) {
    items.forEach(function (item) {
        if (obj.hasOwnProperty(item)) {
            delete obj[item];
        }
    });
    return obj;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


var run_scrape = function () {

    // abort condition
    var date_now = new Date();
    var timeDiff = Math.abs(date_now.getTime() - start_date.getTime());
    if (timeDiff > stop_after_milliseconds) {
        clearInterval(intervalId);
        return;
    }

    fetch(apiconf.endpoint, {headers: apiconf.headers})
        .then(function(res) {
            log.info("Scrape", res.statusText, "("+res.status+")");
            // console.log(res.headers.raw());
            // console.log(res.headers.get('content-type'));
            return res.json();
        }).then(function(json) {

            // console.log(json);

            // -1-----------------------
            // save scraped raw data to disk
            var timestamp = Math.floor(Date.now());
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

            var fns = [];

            // persist the car types
            // -------------------------
            var carTypes = clone(json.carTypes.items);
            fns.push.apply(fns, carTypes.map(function (ct) {
                return function(callback) {
                    models.CarType.findOrCreate({where: ct})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created cartype: ' + model.modelName);
                        // } else {
                        //     log.info('Cartype ' + model.modelName + ' already exists');
                        }
                        callback(null);
                    });
                };
            }));

            // persist the cars
            // -------------------------
            var cars = clone(json.cars.items);
            cars = cars.map(function (c) {
                // remove dynamic data
                var filtered_car = remove_obj_keys([
                    'innerCleanliness',
                    'isCharging',
                    'isInParkingSpace',
                    'isPreheatable',
                    'fuelLevel',
                    'fuelLevelInPercent',
                    'estimatedRange',
                    'latitude',
                    'longitude',
                    'address'
                ], c);
                return {
                    id: c.id,
                    modelIdentifier: c.modelIdentifier,
                    data: JSON.stringify(filtered_car)
                };
            });
            fns.push.apply(fns, cars.map(function (c) {
                return function(callback) {
                    // console.log('saving car');
                    //save the car
                    models.Car.findOrCreate({where: c})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created car.');
                        }
                        callback(null);
                    }).catch(function(error) {
                        // console.log(error);
                        throw error;
                    });
                };
            }));

            // persist the status of the car in separate table
            // -------------------------
            var statii = clone(json.cars.items);
            statii = statii.map(function (car) {
                // console.log('STATII');
                // console.log(car);
                // console.log('STATII');
                var car_status = {};
                [
                    'innerCleanliness',
                    'isCharging',
                    'isInParkingSpace',
                    'isPreheatable',
                    'fuelLevel',
                    'fuelLevelInPercent',
                    'estimatedRange'
                ].forEach(function (item) {
                    // if (car.hasOwnProperty(item)) {
                        car_status[item] = car[item];
                    // }
                });
                // foreign key
                car_status.car_id = car.id;
                return car_status;
            });
            fns.push.apply(fns, statii.map(function (car_status) {
                console.log(car_status);
                return function(callback) {
                    // save the new status
                    models.Status.create(car_status)
                    .then(function(data) {
                        // log.info('Status saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        // console.log(error);
                        throw error;
                    });
                };
            }));

            // persist the positions
            // -------------------------
            var positions = clone(json.cars.items);
            positions = positions.map(function (car) {
                var pos = {
                    car_id: car.id,
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
            fns.push.apply(fns, positions.map(function (pos) {
                return function(callback) {
                    // save the new status
                    models.Position.create(pos)
                    .then(function(data) {
                        // log.info('Position saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        // console.log(error);
                        throw error;
                    });
                };
            }));

            // persist the full scrape data
            // -------------------------
            fns.push(
                function(callback) {
                    // save the scrape
                    models.Scrape.create({
                        id: timestamp,
                        data: JSON.stringify(json)
                    })
                    .then(function(data) {
                        // log.info('Scrape saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                }
            );

            log.info("# DB actions: " + fns.length);

            // execute the series of database tasks
            // -------------------------
            series(fns);

        }).catch(function(err) {
            log.error(err);
        });
};


var start_scrape = function () {
    // start immediately
    run_scrape();
    // continue to run in intervals
    intervalId = setInterval(run_scrape, interval);
};


// start app
// this will create the database tables on the first run
models.sequelize.sync({ force: true }).then(start_scrape);


// (optional:) allow re-use of scrape function
module.exports = run_scrape;
