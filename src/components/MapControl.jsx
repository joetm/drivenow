import React from 'react';

import 'whatwg-fetch';
import crossfilter from 'crossfilter';

import Map from "./Map.jsx";
// import Heatmap from "./Heatmap.jsx";


const emptyCrossfilter = crossfilter([]);


let MapControl = React.createClass({
// class MapControl extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            cars: emptyCrossfilter,
            layers: {},
            dimensions: {
                cleanlinessDim: emptyCrossfilter,
                locationDim: emptyCrossfilter,
                timestampDim: emptyCrossfilter,
                carIdDim: emptyCrossfilter,
                allDim: emptyCrossfilter
            },
            dimensionGroups: {
                locationGroup: emptyCrossfilter,
                timestampGroup: emptyCrossfilter,
                allGroup: emptyCrossfilter
            }
        };
    },

    componentDidMount() {
        //
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
                locationGroup: dimensions.locationDim.group(location => [ Math.round(location.latitude / 100), Math.round(location.longitude / 1000) ]),
                timestampGroup: dimensions.timestampDim.group(timestamp => Math.round(timestamp / 1000)),
                allGroup: dimensions.allDim.groupAll()
            }

            // build an array of possible timestamp values
            let timestamps = [];
            dimensions.timestampDim.top(Infinity).forEach(function(car){
                if (timestamps.indexOf(car.timestamp) === -1) {
                    timestamps.push(car.timestamp);
                }
            });
            // console.log('MapControl:timestamps', timestamps);
            _this.props.setTimestamps(timestamps);

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
    },

    // abort the running request if component is unmounted
    componentWillUnmount() {
        if (this.serverRequest) {
            this.serverRequest.abort();
        }
    },

    render() {

        return (
            <Map
                cars={this.state.cars}
                dimension={this.state.dimensions.timestampDim}
            />
        );
    }

});

module.exports = MapControl;
