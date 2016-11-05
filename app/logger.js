const winston = require('winston');

winston.configure({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({filename: 'scrape.log'})
    ]
  });

module.exports = winston;