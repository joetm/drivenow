"use strict";

// Sample:
/*
    {
        "address": [
            "Weigandufer ",
            "12059 Berlin"
        ],
        "carImageBaseUrl": "https://prod.drive-now-content.com/fileadmin/user_upload_global/assets/cars/{model}/{color}/{density}/car.png",
        "carImageUrl": "https://prod.drive-now-content.com/fileadmin/user_upload_global/assets/cars/mini_3-tuerer/midnight_black_metallic/{density}/car.png",
        "color": "midnight_black",
        "equipment": [],
        "estimatedRange": 556,
        "fuelLevel": 0.95,
        "fuelLevelInPercent": 95,
        "fuelType": "P",
        "group": "MINI",
        "id": "WMWXM510X03B80617",
        "innerCleanliness": "REGULAR",
        "isCharging": false,
        "isInParkingSpace": false,
        "isPreheatable": false,
        "latitude": 52.482801,
        "licensePlate": "M-DX7226",
        "longitude": 13.447977,
        "make": "BMW",
        "modelIdentifier": "mini_3-tuerer",
        "modelName": "MINI 3-Door",
        "name": "Sybil",
        "parkingSpaceId": null,
        "rentalPrice": {
            "drivePrice": {
                "amount": 31,
                "currencyUnit": "ct/min",
                "formattedPrice": "31 ct/min"
            },
            "parkPrice": {
                "amount": 15,
                "currencyUnit": "ct/min",
                "formattedPrice": "15 ct/min"
            },
            "paidReservationPrice": {
                "amount": 10,
                "currencyUnit": "ct/min",
                "formattedPrice": "10 ct/min"
            },
            "isOfferDrivePriceActive": false
        },
        "routingModelName": "mini-3-tuerer",
        "series": "MINI",
        "transmission": "M",
        "variant": "3-Tuerer"
    }
*/

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Car", {
		id: {
			type: Sequelize.STRING,
			primaryKey: true,
			autoIncrement: false
		},
		data: {type: Sequelize.STRING}
	});
};