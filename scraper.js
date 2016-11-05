/* eslint no-console: 0 */

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');

const apiconf = require('./config/api.json');
const models = require('./models');
const log = require('./app/logger');


// scrape configuration
// ----------------------------------------------------
const interval = 5 * 60 * 1000;
var refreshIntervalId;
const start_date = new Date();
const stop_after_milliseconds = 0.5 * 60 * 60 * 1000;
// ----------------------------------------------------


var run_scrape = function () {

    // abort condition
    var date_now = new Date();
    var timeDiff = Math.abs(date_now.getTime() - start_date.getTime());
    if (timeDiff > stop_after_milliseconds) {
        clearInterval(refreshIntervalId);
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
            var timestamp = ""+Math.floor(Date.now() / 1000);
            fs.writeFile(path.join('scrapes', timestamp + '.json'), JSON.stringify(json, null, 4), function(err) {
                if (err) {
                    throw err;
                }
                log.info('Scrape saved to disk.');
            });

            // -2-----------------------
            // save data to db
            // persist the car types
            var carTypes = json.carTypes.items;
            if (carTypes) {
              carTypes.forEach(function(cartype){
                  models.CarTypes.findOrCreate({where: cartype})
                    .spread(function(model, created) {
                        if (created && model) {
                            log.info('Created cartype' + model.modelName);
                        }
                    });
              });
            }//end if
            // persist the cars

            // TODO


            // persist the full scrape data
            models.Scrape.create(json)
                         .then(function(data) {
                             log.info('Scrape saved to db.');
                         }).catch(function(error) {
                             // console.log(error);
                             throw error;
                         });

        }).catch(function(err) {
            // console.log(err);
            log.error(err);
        });
};

var start_scrape = function () {
    // start immediately
    run_scrape();
    // continue to run in intervals
    refreshIntervalId = setInterval(run_scrape, interval);
};

// start app
models.sequelize.sync().then(start_scrape);

// (optional) allow re-use of scrape function
module.exports = run_scrape;
