import React from 'react';
import { render } from 'react-dom'

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import Map from './Map.jsx';
import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';


const emptyCrossfilter = crossfilter([]);


let App = React.createClass({
// class App extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            timestamps: [],
            cars: emptyCrossfilter,
            activeDimension: emptyCrossfilter,
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

    componentWillMount() {
        //
        let _this = this;

        this.serverRequest = fetch('/cars')
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            //
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

            // setting state will trigger a re-render (in componentDidMount)
            _this.setState({
                cars: crossfilter(json),
                activeDimension: dimensions.timestampDim.filter(timestamps[0]),
                dimensions: dimensions,
                dimensionGroups: dimensionGroups,
                timestamps: timestamps
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

    selectTimeDimension(timestamp) {
        // console.log('selectTimeDimension');
        this.setState({activeDimension: this.state.dimensions.timestampDim.filter(timestamp)});
    },

    carClick(e) {

        console.log('car click:', e.target.options.carId);

        let carId = e.target.options.carId;

        let dimensions = this.state.dimensions;

        // reset the filters
        dimensions.timestampDim.filterAll();
        dimensions.carIdDim.filterAll();

        // filter the data by the carId
        // console.log('carIdDim:', carIdDim.top(Infinity));
        dimensions.carIdDim.filter(carId);

        // // update the details box contents
        // $detailsList = $('ul#details');
        // // reset
        // $detailsList.html('');
        // let values = carIdDim.top(Infinity);
        // // console.log('values', values);
        // let detailsContent = [];
        // if (values.length > 0) {
        //     $.each(values[0], function(key, val) {
        //         // skip some of the key-value pairs
        //         // if (['fuelLevel', 'fuelLevelInPercent', 'estimatedRange', 'isInParkingSpace', 'parkingSpaceId', 'isCharging', 'innerCleanliness', 'latitude', 'longitude', 'timestamp', 'createdAt', 'updatedAt'].indexOf(key) > -1) {
        //         // if (['carId'].indexOf(key) === -1) {
        //         //     return true; // continue
        //         // }
        //         detailsContent.push(`<li>${key}: ${val}</li>`);
        //     });
        // }
        // $detailsList.append(detailsContent);

        // // show the side-nav
        // $('#slide-out-btn').sideNav('show');
        // $('#slide-out').data('sidenav-open', true);

        // set the new dimension state
        this.setState({
            activeDimension: dimensions.carIdDim,
            dimensions: dimensions
        });
    },

    render() {
        return (
             <div id="wrap">
                <SideNav
                  key={'SideNav'}
                />
                <Map
                  key={'MapControl'}
                  dimension={this.state.activeDimension}
                  cars={this.state.cars}
                  carClick={this.carClick}
                />
                <Footer
                  key={'Footer'}
                  timestamps={this.state.timestamps}
                  selectTimeDimension={this.selectTimeDimension}
                />
            </div>
        );
    }

});

// render the App
// const __DEV__ = true;
const root = document.getElementById("app");
// if (__DEV__) {
//   const RedBox = require('redbox-react').default
//   try {
//     render(<App />, root);
//   } catch (e) {
//     render(<RedBox error={e} />, root)
//   }
// } else {
    render(<App />, root);
// }