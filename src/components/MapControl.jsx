import React from 'react';

import 'whatwg-fetch';

import Constants from "./Constants.jsx";

import Map from "./Map.jsx";
// import Heatmap from "./Heatmap.jsx";


class MapControl extends React.Component {

    getInitialState() {
        console.log('??????????????????');








        // initialise the state (once)
        return {
            cars: [],
            layers: {}
        };
    }

    componentDidMount() {

        console.log('??????????????????');











        let _this = this;

        this.serverRequest = fetch('/cars')
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            // console.log('cars', json);
            let cars = crossfilter(json);

            // dimensions
            let dimensions = {
                cleanlinessDim: cars.dimension(d => d["innerCleanliness"]),
                locationDim: cars.dimension(d => [d["latitude"], d["longitude"]]),
                timestampDim: cars.dimension(d => d["timestamp"]),
                carIdDim: cars.dimension(d => d["carId"]),
                allDim: cars.dimension(d => d)
            };

            // groupings (clustering) of values
            let dimensionGroups = {
                locationGroup: locationDim.group(location => [ Math.round(location.latitude / 100), Math.round(location.longitude / 1000) ]),
                timestampGroup: timestampDim.group(timestamp => Math.round(timestamp / 1000)),
                allGroup: allDim.groupAll()
            }

            // build an array of possible timestamp values
            let timestamps = [];
            dimensions.timestampDim.top(Infinity).forEach(function(car){
                if (timestamps.indexOf(car.timestamp) === -1) {
                    timestamps.push(car.timestamp);
                }
            });
            console.log('timestamps', timestamps);
            // if (!timestamps.length) {
            //     throw "No timestamps in data";
            // }

            // filter: only show the cars from the first timestamp
            if (timestamps[0] !== undefined) {
                dimensions.timestampDim.filter(timestamps[0]);
            }

            // setting state will trigger a re-render (in componentDidMount)
            _this.setState({
                cars: crossfilter(json),
                dimensions: dimensions,
                dimensionGroups: dimensionGroups
            });

        // }).catch(function(ex) {
        //     console.error('Error:', ex)
        });
    }

    // abort the running request if component is unmounted
    componentWillUnmount() {
        if (this.serverRequest) {
            this.serverRequest.abort();
        }
    }

    drawMarkers(dimension) {

        let markers = [];

        // TODO
        // // map reset
        // if (this.state.layers.cars) {
        //     // clear map
        //     map.removeLayer(layers.cars);
        // }

        // TODO
        // reset heatmap;
        // heatmap.reset();

        dimension.top(Infinity).forEach(function(car){

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
                    color: Constants.marker_colors[car.innerCleanliness],
                    fillColor: Constants.marker_colors[car.innerCleanliness]
                })
                // .on('click', carClick)
                // .bindPopup(popup)

            markers.push(marker);
            // markers.push(blurmarker);

            // TODO
            // heatmap.intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        });

        // group the circles
        // to change the circle size on zoom event
        this.circleGroup = L.featureGroup(markers);

        // TODO
        // heatmap.render();

        // add the layer to the map
        map.addLayer(this.circleGroup);

        // remove loading overlay from sidenav
        // $('#sidenav-overlay').hide();

        return circleGroup;
    }

    render() {

        console.log('??????????????????');














        // TODO
        // console.log('draw markers');
        // _this.drawMarkers(timestampDim);

        return (
            <Map
                cars={this.state.cars}
                dimensions={this.state.dimensions}
            />
        );
    }

}

module.exports = Map;
