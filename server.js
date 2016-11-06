/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const models = require('./models');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

const app = express();

// static files
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/node_modules/whatwg-fetch', express.static(path.join(__dirname, 'node_modules/whatwg-fetch')));
app.use('/node_modules/crossfilter', express.static(path.join(__dirname, 'node_modules/crossfilter')));

// routes
app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/cars', function response(req, res) {
	// get the car statii
	models.Status.findAll({
        // include: [
        //     {
        //         model: models.Car
        //     }
        // ]
	}).then(function (carStatii) {
		res.status(200).json(carStatii);
	});
});

function startServer() {
	// server
	let server = app.listen(port, '0.0.0.0', function onStart(err) {
	    if (err) {
	        console.log(err);
	    }
	    console.info('==> 🌎  Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
	});
}

models.sequelize.sync({
    pool: false
}).then(startServer);

