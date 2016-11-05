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

            var fns = [];

            // persist the car types
            fns.push(function (callback) {log.info('Creating car types'); callback(null);});
            fns.push.apply(fns, json.carTypes.items.map(function (ct) {
                return function(callback) {
                    models.CarType.findOrCreate({where: ct})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created cartype: ' + model.modelName);
                        }
                        callback(null);
                    });
                };
            }));

            // persist the cars
            fns.push(function (callback) {log.info('Creating cars'); callback(null);});
            var cars = json.cars.items.map(function (car) {
                var filtered_car = car;
                // remove dynamic data
                filtered_car = remove_obj_keys([
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
                ], filtered_car);
                return {
                    id: car.id,
                    modelIdentifier: car.modelIdentifier,
                    data: JSON.stringify(filtered_car)
                };
            });
            fns.push.apply(fns, cars.map(function (c) {
                return function(callback) {
                    //save the car
                    models.Car.findOrCreate({where: c})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created car: ' + model.name);
                        }
                        callback(null);
                    });
                };
            }));

            // persist the status of the car in separate table
            fns.push(function (callback) {log.info('Saving car statii'); callback(null);});
            var statii = json.cars.items.map(function (car) {
                var car_status = {};
                [
                    'id',
                    'innerCleanliness',
                    'isCharging',
                    'isInParkingSpace',
                    'isPreheatable',
                    'fuelLevel',
                    'fuelLevelInPercent',
                    'estimatedRange'
                ].forEach(function (item) {
                    car_status[item] = car[item];
                });
                return function(callback) {
                    models.Status.create(car_status)
                    .then(function(data) {
                        log.info('Status saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        // console.log(error);
                        throw error;
                    });
                };
            });
            fns.push.apply(fns, statii);

            // persist the positions
            fns.push(function (callback) {log.info('Saving car positions'); callback(null);});
            var positions = json.cars.items.map(function (car) {
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
                return function(callback) {
                    models.Position.create(pos)
                    .then(function(data) {
                        log.info('Position saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        // console.log(error);
                        throw error;
                    });
                };
            });
            fns.push.apply(fns, positions);

            // persist the full scrape data
            fns.push(
                function(callback) {
                    models.Scrape.create({
                        id: timestamp,
                        data: JSON.stringify(json)
                    })
                    .then(function(data) {
                        log.info('Scrape saved to db.');
                        callback(null);
                    }).catch(function(error) {
                        throw error;
                    });
                }
            );

            // execute the series of database tasks
            series(fns);

        }).catch(function(err) {
            // console.log(err);
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
models.sequelize.sync().then(start_scrape);


// (optional:) allow re-use of scrape function
module.exports = run_scrape;
