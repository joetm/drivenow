
var map = L.map('map').setView([52.5072111,13.1459675], 10);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

// load data
fetch('/cars')
	.then(function(response) {
		return response.json();
	}).then(function(json) {
		// console.log('parsed json', cars[0])
        // let markers = [];

        let cars = crossfilter(json);

        // dimensions
        let cleanliness = cars.dimension(function(d) { return d["innerCleanliness"]; });
        let location = cars.dimension(function(d) { return [d["latitude"], d["longitude"]]; });
        let all = cars.dimension(function(d) {return d;});

        // groups
        let cleanlinessGroup = cleanliness.group();
        let locationGroup = location.group();
        let allGroup = all.groupAll();

        // TODO
        // const minDate = dateDim.bottom(1)[0]["timestamp"];
        // const maxDate = dateDim.top(1)[0]["timestamp"];




		// cleanliness: ["REGULAR", "CLEAN", "VERY_CLEAN", "POOR"]
        // marker colors
        let marker_colors = {
            "VERY_CLEAN": '#ABEBC6',
            "CLEAN": '#58D68D',
            "REGULAR": '#F39C12',
            "POOR": '#FF5733'
        }

        // let carMarkers = [];
        all.top(Infinity).forEach(function(car){

            let marker = L.circleMarker([car.latitude, car.longitude], {
                    radius: 2,
                    color: marker_colors[car.innerCleanliness],
                    fillColor: marker_colors[car.innerCleanliness]
                })
                .bindPopup("Id: " + car.car_id + "<br />" + "Cleanliness: " + car.innerCleanliness)
                .addTo(map);
            // carMarkers.push(marker);
        });

        // let markerLayer = L.LayerGroup(carMarkers)
        //     .addTo(map);

        // let carGroup = L.featureGroup([markers])
        //     .addTo(map);
            // .on('click', function() { alert('Clicked on a member of the group!'); })

	}).catch(function(ex) {
		console.error('parsing failed:', ex)
	});

