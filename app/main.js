
let map = L.map('map').setView([52.5072111,13.1459675], 10);


function draw(timestampDim, marker_colors, intensities, timestamps) {

    let markers = [];

    timestampDim.top(Infinity).forEach(function(car){

        if (timestamps.indexOf(car.timestamp) === -1) {
            timestamps.push(car.timestamp);
        }

        let popup = '';
        $.each(car, function(key, val) {
            popup += `${key}: ${val}<br />`;
        });

        // marker in the center
        let marker = L.circleMarker([car.latitude, car.longitude], {
                radius: 2,
                color: marker_colors[car.innerCleanliness],
                fillColor: marker_colors[car.innerCleanliness]
            })
            // .addTo(map);

        // blurred circle
        let blurmarker = L.circleMarker([car.latitude, car.longitude], {
                radius: 10,
                stroke: false,
                fill: true,
                fillOpacity: 0.2,
                className: 'blurCircle',
                fillColor: marker_colors[car.innerCleanliness]
            })
            .bindPopup(popup)
            // .addTo(map);

        markers.push(marker);
        markers.push(blurmarker);

        intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        // carMarkers.push(marker);
    });

    // group the circles
    // to change the circle size on zoom event
    let circleGroup = L.featureGroup(markers);

    map.addLayer(circleGroup);

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


        // cleanliness: ["REGULAR", "CLEAN", "VERY_CLEAN", "POOR"]
        // marker colors
        let marker_colors = {
            "VERY_CLEAN": '#ABEBC6',
            "CLEAN": '#58D68D',
            "REGULAR": '#F39C12',
            "POOR": '#FF5733'
        }

        // let marker_intensities = {
        //     "VERY_CLEAN": 0.1,
        //     "CLEAN": 0.3,
        //     "REGULAR": 0.6,
        //     "POOR": 1
        // }
        let intensities = [];

        let timestamps = [];


        // build the legend
        tpl = '';
        $.each(marker_colors, function (key, item) {
            tpl += `<div><div class="chip ${key}" style="background-color:${item}">${key}</div></div>`;
        });
        $('#legend_cleanliness').html(tpl);


        let cars = crossfilter(json);

        // dimensions
        let cleanlinessDim = cars.dimension(d => d["innerCleanliness"]);
        let locationDim = cars.dimension(d => [d["latitude"], d["longitude"]]);
        let timestampDim = cars.dimension(d => d["timestamp"]);
        let allDim = cars.dimension(d => d);

        // groups
        let cleanlinessGroup = cleanlinessDim.group();
        let locationGroup = locationDim.group();
        let timestampGroup = timestampDim.group();
        let allGroup = allDim.groupAll();


        // TODO
        // const minDate = dateDim.bottom(1)[0]["timestamp"];
        // const maxDate = dateDim.top(1)[0]["timestamp"];



        layer = draw(timestampDim, marker_colors, intensities, timestamps);
        console.log('layer', layer);







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

            // clear map
            map.removeLayer(layer);
            // redraw with filtered data
            layer = draw(timestampDim, marker_colors, intensities, timestamps);



        });





        // heat map (experimental)
        // let heatmap = {0.1: '#ABEBC6', 0.3: '#58D68D', 0.6: '#F39C12', 1: '#FF5733'};
        let heatmap = {0: '#0000ff', 1: '#0000DD'};
        var heat = L.heatLayer(intensities, {
            radius: 40,
            maxZoom: 20,
            blur: 60,
            gradient: heatmap
        }).addTo(map);



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

