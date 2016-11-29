
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

    fetch('/cars')
	.then(function(response) {
		return response.json();
	}).then(function(json) {

        // console.log(json);



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



        map.on('zoomend', function() {
            let currentZoom = map.getZoom(),
                radius = currentZoom * 0.9;
            // TODO
            // circleGroup.setStyle({radius: radius});
        });





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



	// }).catch(function(ex) {
	// 	console.error('Error:', ex)
	});

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
