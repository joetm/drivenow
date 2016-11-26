
let map = L.map('map').setView([52.5072111,13.1459675], 10);


let layers = {};
let timestamps = [];

let cars;

// dimensions
let cleanlinessDim;
let carIdDim;
let locationDim;
let timestampDim;
let allDim;
// ---
let cleanlinessGroup;
let carIdGroup;
let locationGroup;
let timestampGroup;
let allGroup;



// cleanliness: ["REGULAR", "CLEAN", "VERY_CLEAN", "POOR"]
// marker colors
const marker_colors = {
    "VERY_CLEAN": '#ABEBC6',
    "CLEAN": '#58D68D',
    "REGULAR": '#F39C12',
    "POOR": '#FF5733'
}

// build the legend
$(function() {
    tpl = '';
    $.each(marker_colors, function (key, item) {
        tpl += `<div><div class="chip ${key}" style="background-color:${item}">${key}</div></div>`;
    });
    $('#legend_cleanliness').html(tpl);
});


function bindClick(e) {
    //     if (e.target.options.carId === undefined) {
    //         return;
    //     }
    //     console.log('car id: ', e.target.options.carId);
    //     // query data
    //     fetch('/cars')
    //         .then(function(response) {
    //             return response.json();
    //         }).then(function(json) {
    //         // let cars = crossfilter(json);
    //         layers.cars = draw(timestampDim, timestamps);
    //     });

    // filter the data by the dimension
    carIdDim.filter(e.target.options.carId);
    // redraw with filtered car data
    layers.cars = draw(carIdDim, timestamps);
}


function draw(timestampDim) {

    if (layers.cars) {
        // clear map
        map.removeLayer(layers.cars);
    }

    let markers = [];

    // let marker_intensities = {
    //     "VERY_CLEAN": 0.1,
    //     "CLEAN": 0.3,
    //     "REGULAR": 0.6,
    //     "POOR": 1
    // }

    // heatmap intensities
    let intensities = [];

    timestampDim.top(Infinity).forEach(function(car){

        // build an array of possible timestamp values (once)
        if (!timestamps.length) {
            if (timestamps.indexOf(car.timestamp) === -1) {
                timestamps.push(car.timestamp);
            }
        }

        let popup = '';
        $.each(car, function(key, val) {
            popup += `${key}: ${val}<br />`;
        });

        // blurred circle
        let blurmarker = L.circleMarker([car.latitude, car.longitude], {
                radius: 10,
                stroke: false,
                fill: true,
                fillOpacity: 0.2,
                className: 'blurCircle',
                carId: car.id,
                fillColor: marker_colors[car.innerCleanliness]
            })
            .on('click', bindClick)

        // marker in the center
        let marker = L.circleMarker([car.latitude, car.longitude], {
                radius: 2,
                carId: car.id,
                color: marker_colors[car.innerCleanliness],
                fillColor: marker_colors[car.innerCleanliness]
            })
            // .bindPopup(popup)

        markers.push(marker);
        markers.push(blurmarker);

        intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        // carMarkers.push(marker);
    });

    // group the circles
    // to change the circle size on zoom event
    let circleGroup = L.featureGroup(markers);

    // add the layer to the map
    map.addLayer(circleGroup);

    // heat map (experimental)
    // let heatmap = {0.1: '#ABEBC6', 0.3: '#58D68D', 0.6: '#F39C12', 1: '#FF5733'};
    let heatmap = {0: '#0000ff', 1: '#0000DD'};
    if (layers.heat !== undefined) {
        map.removeLayer(layers.heat);
    }
    layers.heat = L.heatLayer(intensities, {
        radius: 40,
        maxZoom: 20,
        blur: 60,
        gradient: heatmap
    }).addTo(map);

    return circleGroup;
}

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

        let tpl = '';
        let layer;


        cars = crossfilter(json);

        // dimensions
        cleanlinessDim = cars.dimension(d => d["innerCleanliness"]);
        locationDim = cars.dimension(d => [d["latitude"], d["longitude"]]);
        timestampDim = cars.dimension(d => d["timestamp"]);
        carIdDim = cars.dimension(d => d["id"]);
        allDim = cars.dimension(d => d);

        // groups
        cleanlinessGroup = cleanlinessDim.group();
        locationGroup = locationDim.group();
        timestampGroup = timestampDim.group();
        carIdGroup = carIdDim.group();
        allGroup = allDim.groupAll();


        // TODO
        // const minDate = dateDim.bottom(1)[0]["timestamp"];
        // const maxDate = dateDim.top(1)[0]["timestamp"];



        layers.cars = draw(timestampDim, timestamps);
        console.log('layer', layers.cars);




        // build the footer buttons (testing)
        console.log('timestamps', timestamps);
        tpl = '';
        $.each(timestamps, function (key, item) {
            tpl += `<div class="btn" style="float:left;margin-left:10px;">${item}</div>`;
        });
        $('#footer').html(tpl);




        // button events
        $('#footer .btn').click(function () {
            let timestamp = +$(this).text();
            // alert('Filtering for timestamp: '+timestamp);
            timestampDim.filter(timestamp);
            // redraw with filtered data
            layers.cars = draw(timestampDim, timestamps);
        });








        // let markerLayer = L.LayerGroup(carMarkers)
        //     .addTo(map);

        // let carGroup = L.featureGroup([markers])
        //     .addTo(map);
            // .on('click', function() { alert('Clicked on a member of the group!'); })



        map.on('zoomend', function() {
            let currentZoom = map.getZoom(),
                radius = currentZoom * 0.9;
            // TODO
            // circleGroup.setStyle({radius: radius});
        });


	}).catch(function(ex) {
		console.error('Error:', ex)
	});

