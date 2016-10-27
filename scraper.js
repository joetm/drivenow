/* eslint no-console: 0 */

const path = require('path');
const apiconf = require('./api-config.js');

const https = require('https');
const fs = require('fs');

var callback = function(res) {

  // var str = '';

  // //another chunk of data has been recieved, so append it to `str`
  // res.on('data', function (chunk) {
  //   str += chunk;
  // });

  // //the whole response has been recieved, so we just print it out here
  // res.on('end', function () {
  //   console.log(str);
  // });

  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

  console.log(' ');

}

// make periodical requests and store the results

https.get(apiconf.options, callback).on('error', (e) => {
  console.error(e);
});

