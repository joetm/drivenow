
let map;


// cleanliness: ["REGULAR", "CLEAN", "VERY_CLEAN", "POOR"]
// marker colors
const marker_colors = {
    "VERY_CLEAN": '#ABEBC6',
    "CLEAN": '#58D68D',
    "REGULAR": '#F39C12',
    "POOR": '#FF5733'
}


function carClick(e) {

    let carId = e.target.options.carId;

    // reset the filters
    timestampDim.filterAll();
    carIdDim.filterAll();

    // filter the data by the carId
    // console.log('carIdDim:', carIdDim.top(Infinity));
    carIdDim.filter(carId);
    console.log('carIdDim.filter('+carId+'):', carIdDim.top(Infinity));

    // redraw with filtered car data
    layers.cars = draw(carIdDim); // TODO: replace this manual re-draw with d3

    // update the details box contents
    $detailsList = $('ul#details');
    // reset
    $detailsList.html('');
    let values = carIdDim.top(Infinity);
    // console.log('values', values);
    let detailsContent = [];
    if (values.length > 0) {
        $.each(values[0], function(key, val) {
            // skip some of the key-value pairs
            // if (['fuelLevel', 'fuelLevelInPercent', 'estimatedRange', 'isInParkingSpace', 'parkingSpaceId', 'isCharging', 'innerCleanliness', 'latitude', 'longitude', 'timestamp', 'createdAt', 'updatedAt'].indexOf(key) > -1) {
            // if (['carId'].indexOf(key) === -1) {
            //     return true; // continue
            // }
            detailsContent.push(`<li>${key}: ${val}</li>`);
        });
    }
    $detailsList.append(detailsContent);

    // show the side-nav
    $('#slide-out-btn').sideNav('show');
    $('#slide-out').data('sidenav-open', true);
}




function draw(dimension) {

    let markers = [];

    // map reset
    if (layers.cars) {
        // clear map
        map.removeLayer(layers.cars);
    }
    // reset heatmap;
    heatmap.reset();



    dimension.top(Infinity).forEach(function(car){

        // let popup = '';
        // $.each(car, function(key, val) {
        //     popup += `${key}: ${val}<br />`;
        // });

        // blurred circle
        // let blurmarker = L.circleMarker([car.latitude, car.longitude], {
        //         radius: 10,
        //         stroke: false,
        //         fill: true,
        //         fillOpacity: 0.2,
        //         className: 'blurCircle',
        //         carId: car.carId,
        //         fillColor: marker_colors[car.innerCleanliness]
        //     })

        // marker in the center
        let marker = L.circleMarker([car.latitude, car.longitude], {
                radius: 6,
                fill: true,
                fillOpacity: 0.8,
                stroke: false,
                carId: car.carId,
                // className: 'blurCircle',
                color: marker_colors[car.innerCleanliness],
                fillColor: marker_colors[car.innerCleanliness]
            })
            .on('click', carClick)
            // .bindPopup(popup)

        markers.push(marker);
        // markers.push(blurmarker);

        heatmap.intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        // carMarkers.push(marker);
    });

    // group the circles
    // to change the circle size on zoom event
    let circleGroup = L.featureGroup(markers);

    heatmap.render();

    // add the layer to the map
    map.addLayer(circleGroup);

    // remove loading overlay from sidenav
    $('#sidenav-overlay').hide();

    return circleGroup;
}


// load data
$(function() {



        // build the footer buttons (testing)
        let timestampButtons = [];
        $.each(timestamps, function (key, item) {
            timestampButtons.push(`<div class="btn btn-${item} waves-effect waves-light" style="float:left;margin-left:10px;">${item}</div>`);
        });
        $('#footer #buttons').html(timestampButtons);
        // disable the first button
        $('#footer .btn').first().attr('disabled', true);





        layers.cars = draw(timestampDim);
        // console.log('layer', layers.cars);





        // let markerLayer = L.LayerGroup(carMarkers)
        //     .addTo(map);

        // let carGroup = L.featureGroup([markers])
        //     .addTo(map);
            // .on('click', function() { alert('Clicked on a member of the group!'); })






        // init the date chart

            // formatters
            // var formatNumber = d3.format(",d"),
            //     formatChange = d3.format("+,d"),
            //     formatDate = d3.time.format("%B %d, %Y"),
            //     formatTime = d3.time.format("%I:%M %p");

            // // A nest operator, for grouping the cars
            // var nestByDate = d3.nest()
            //     .key(function(d) { return d3.time.day(d.date); });

            // let dateChart = barChart()
            //     .dimension(timestampDim)
            //     .group(timestampGroup)        //.round(d3.time.day.round)
            //   .x(d3.time.scale()
            //     .domain([new Date(2001, 0, 1), new Date(2001, 3, 1)]))
            //     //.rangeRound([0, 10 * 90]))
            //     //.filter([new Date(2001, 1, 1), new Date(2001, 2, 1)]);

            // let charts = [dateChart];

            // let chart = d3.selectAll(".chart")
            //     .data(charts)
            //     // .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });


            // // Whenever the brush moves, re-rendering everything.
            // function renderChart() {
            //     console.log('renderCHart');
            //     chart.each(render);
            // }

            // renderChart();

            // window.filter = function(filters) {
            //     filters.forEach(function(d, i) {
            //         charts[i].filter(d);
            //     });
            //     renderChart();
            // };

            // window.reset = function(i) {
            //     charts[i].filter(null);
            //     renderChart();
            // };




});

