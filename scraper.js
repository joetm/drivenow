/* eslint no-console: 0 */

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');

const apiconf = require('./config/api.json');
const models = require('./models');

const interval = 5 * 60 * 1000;
var refreshIntervalId;
const start_date = new Date();
const stop_after_milliseconds = 0.5 * 60 * 60 * 1000;


var fetch_api = function () {

    // abort condition
    var date_now = new Date();
    var timeDiff = Math.abs(date_now.getTime() - start_date.getTime());
    if (timeDiff > stop_after_milliseconds) {
        clearInterval(refreshIntervalId);
        return;
    }

    fetch(apiconf.endpoint, {headers: apiconf.headers})
        .then(function(res) {
            console.log("Scrape", res.statusText, "("+res.status+")");
            // console.log(res.headers.raw());
            // console.log(res.headers.get('content-type'));
            return res.json();
        }).then(function(json) {
            // console.log(json);
            // -1-----------------------
            // save scraped data to disk
            var timestamp = ""+Math.floor(Date.now() / 1000);
            fs.writeFile(path.join('scrapes', timestamp + '.json'), JSON.stringify(json, null, 4), function(err) {
              if (err) throw err;
              console.log('Scrape saved to disk.');
            });
            // -2-----------------------
            // save data to db
            var scrapeinfo = {
                cartypes: json.carTypes.items,
                cars: json.cars.items,
                timestamp: timestamp
            }
            models.Scrape.create(scrapeinfo)
                         .then(function(data) {
                             console.log('Scrape saved to db.');
                         }).catch(function(error) {
                             console.log(error);
                         });

        }).catch(function(err) {
            console.log(err);
        });
};

var run_scrape = function () {

  refreshIntervalId = setInterval(fetch_api, interval);

};

models.sequelize.sync().then(run_scrape);
