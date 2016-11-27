
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
        tpl += `<div class="chip ${key}" style="background-color:${item}">${key}</div>`;
    });
    $('#legend_cleanliness').html(tpl);
});


// Initialize the details side-nav
$(function() {
    $("#slide-out-btn").sideNav({
      // menuWidth: 300, // Default is 240
      edge: 'right',
      closeOnClick: true,
      draggable: false // for touch screens
    });
    let $slideout = $('#slide-out');
    $("#slide-out-btn").click(function () {
        console.log('sidenav-open', $slideout.data('sidenav-open'));
        if (!$slideout.data('sidenav-open')) {
            // the sidenav is opening
            $slideout.data('sidenav-open', true);
            // store state
        } else {
            // the sidenav is closing
            $slideout.data('sidenav-open', false);
            // reset the car filter
            carIdDim.filterAll();
            // redraw with filtered car data
            layers.cars = draw(carIdDim);
        }
    });
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

    let carId = e.target.options.carId;

    // filter the data by the dimension
    carIdDim.filter(carId);
    // redraw with filtered car data
    layers.cars = draw(carIdDim);

    // update the details box contents

    $detailsList = $('ul#details');

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



// heat map (experimental)
let heatmap = {
    intensities: [],
    // {0.1: '#ABEBC6', 0.3: '#58D68D', 0.6: '#F39C12', 1: '#FF5733'}
    gradient: {
        0: '#0000ff',
        1: '#0000DD'
    },
    reset: function() {
        this.intensities = [];
        if (layers.heat !== undefined) {
            map.removeLayer(layers.heat);
        }
    },
    render: function () {
        layers.heat = L.heatLayer(this.intensities, {
            radius: 40,
            maxZoom: 20,
            blur: 60,
            gradient: this.gradient
        }).addTo(map);
    }
}


function draw(dimension) {

    if (layers.cars) {
        // clear map
        map.removeLayer(layers.cars);
    }

    let markers = [];

    // reset heatmap;
    heatmap.reset();


    dimension.top(Infinity).forEach(function(car){

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

        heatmap.intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        // carMarkers.push(marker);
    });

    // group the circles
    // to change the circle size on zoom event
    let circleGroup = L.featureGroup(markers);

    heatmap.render();

    // add the layer to the map
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

        // console.log(json);

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
        timestampGroup = timestampDim.group(d3.timeMinute);
        carIdGroup = carIdDim.group();
        allGroup = allDim.groupAll();


        // TODO
        // const minDate = dateDim.bottom(1)[0]["timestamp"];
        // const maxDate = dateDim.top(1)[0]["timestamp"];


        // build an array of possible timestamp values (once)


        timestampDim.top(Infinity).forEach(function(car){
            if (timestamps.indexOf(car.timestamp) === -1) {
                timestamps.push(car.timestamp);
            }
        });
        console.log('timestamps', timestamps);

        // build the footer buttons (testing)
        let timestampButtons = [];
        $.each(timestamps, function (key, item) {
            timestampButtons.push(`<div class="btn" style="float:left;margin-left:10px;">${item}</div>`);
        });
        $('#footer #buttons').html(timestampButtons);




        layers.cars = draw(timestampDim);
        // console.log('layer', layers.cars);









        // button events
        $('#footer .btn').click(function () {
            let timestamp = +$(this).text();
            // alert('Filtering for timestamp: '+timestamp);
            timestampDim.filter(timestamp);
            // redraw with filtered data
            layers.cars = draw(timestampDim);
            //show reset button
            // $('body').append('<a id="reset-btn" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">close</i></a>');
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





        // init the date chart
        $(function() {

            // formatters
            // var formatNumber = d3.format(",d"),
            //     formatChange = d3.format("+,d"),
            //     formatDate = d3.time.format("%B %d, %Y"),
            //     formatTime = d3.time.format("%I:%M %p");

            // A nest operator, for grouping the cars
            var nestByDate = d3.nest()
                .key(function(d) { return d3.time.day(d.date); });

            let dateChart = barChart()
                .dimension(timestampDim)
                .group(timestampGroup)        //.round(d3.time.day.round)
              .x(d3.time.scale()
                .domain([new Date(2001, 0, 1), new Date(2001, 3, 1)]))
                //.rangeRound([0, 10 * 90]))
                //.filter([new Date(2001, 1, 1), new Date(2001, 2, 1)]);

            let charts = [dateChart];

            let chart = d3.selectAll(".chart")
                .data(charts)
                // .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });


            // Whenever the brush moves, re-rendering everything.
            function renderChart() {
                console.log('renderCHart');
                chart.each(render);
            }

            renderChart();

            window.filter = function(filters) {
                filters.forEach(function(d, i) {
                    charts[i].filter(d);
                });
                renderChart();
            };

            window.reset = function(i) {
                charts[i].filter(null);
                renderChart();
            };

        });


	// }).catch(function(ex) {
	// 	console.error('Error:', ex)
	});



  // see view-source:http://square.github.io/crossfilter/
  function barChart() {
    if (!barChart.id) {
        barChart.id = 0;
    }

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        x,
        y = d3.scaleLinear().range([100, 0]),
        id = barChart.id++,
        axis = d3.axisBottom(),
        // brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          // var gBrush = g.append("g").attr("class", "brush").call(brush);
          // gBrush.selectAll("rect").attr("height", height);
          // gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        // if (brushDirty) {
        //   brushDirty = false;
        //   g.selectAll(".brush").call(brush);
        //   div.select(".title a").style("display", brush.empty() ? "none" : null);
        //   if (brush.empty()) {
        //     g.selectAll("#clip-" + id + " rect")
        //         .attr("x", 0)
        //         .attr("width", width);
        //   } else {
        //     var extent = brush.extent();
        //     g.selectAll("#clip-" + id + " rect")
        //         .attr("x", x(extent[0]))
        //         .attr("width", x(extent[1]) - x(extent[0]));
        //   }
        // }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    // brush.on("brushstart.chart", function() {
    //   var div = d3.select(this.parentNode.parentNode.parentNode);
    //   div.select(".title a").style("display", null);
    // });

    // brush.on("brush.chart", function() {
    //   var g = d3.select(this.parentNode),
    //       extent = brush.extent();
    //   if (round) g.select(".brush")
    //       .call(brush.extent(extent = extent.map(round)))
    //     .selectAll(".resize")
    //       .style("display", null);
    //   g.select("#clip-" + id + " rect")
    //       .attr("x", x(extent[0]))
    //       .attr("width", x(extent[1]) - x(extent[0]));
    //   dimension.filterRange(extent);
    // });

    // brush.on("brushend.chart", function() {
    //   if (brush.empty()) {
    //     var div = d3.select(this.parentNode.parentNode.parentNode);
    //     div.select(".title a").style("display", "none");
    //     div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
    //     dimension.filterAll();
    //   }
    // });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      // brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        // brush.extent(_);
        dimension.filterRange(_);
      } else {
        // brush.clear();
        dimension.filterAll();
      }
      // brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    // return d3.rebind(chart, brush, "on");
    return d3.rebind(chart, null, "on");
  }
