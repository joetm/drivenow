import React from 'react';
import { render } from 'react-dom'

import 'whatwg-fetch';

import crossfilter from "crossfilter";
const emptyCrossfilter = crossfilter([]);

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Map from './Map.jsx';
import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';
import Toolbar from './Toolbar.jsx';
import Loader from './Loader.jsx';

import Constants from "./Constants.jsx";

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


// see http://stackoverflow.com/a/14853974/426266
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});



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
            },
            sideNavVisible: false,
            selectedCar: null,
            arcs: [],
            loading: true,
            toolbarTitle: "Loading..."
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
            dimensions.timestampDim.bottom(Infinity).forEach(function(car){
                if (timestamps.indexOf(car.timestamp) === -1) {
                    timestamps.push(car.timestamp);
                }
            });

            let activeTimestamp = timestamps[0];

            // setting state will trigger a re-render (in componentDidMount)
            _this.setState({
                cars: crossfilter(json),
                activeDimension: dimensions.timestampDim.filter(activeTimestamp),
                dimensions: dimensions,
                dimensionGroups: dimensionGroups,
                timestamps: timestamps,
                loading: false,
                toolbarTitle: `Showing: ${_this.timestampToDate(activeTimestamp)}`
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

    updateArcs() {
        //
        if (!this.state.activeDimension) {
            return;
        }

        let previousPosition = null;
        let arcs = [];
        this.state.activeDimension.bottom(Infinity).forEach(function(car){
            if (!previousPosition) {
                // init the previous position once
                previousPosition = [car.latitude, car.longitude];
            } else {
                let currentPosition = [car.latitude, car.longitude];
                let arcColor = Constants.marker_colors[car.innerCleanliness];
                if (!currentPosition.equals(previousPosition)) {
                    arcs.push({from:previousPosition, to:currentPosition, color:arcColor});
                }
                // update the previous position
                previousPosition = currentPosition;
            }
        });
        // console.log('arcs', arcs);
        if (arcs.length) {
            this.setState({arcs});
        }
    },

    resetArcs() {
        this.setState({arcs: []});
    },

    timestampToDate(timestamp) {
        const newDate = new Date(timestamp);
        return `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    },

    changeToolbarTitle(timestamp) {
        let title = `Showing: ${this.timestampToDate(timestamp)}`;
        this.setState({
            toolbarTitle: title
        });  
    },

    selectTimeDimension(timestamp) {
        this.changeToolbarTitle(timestamp);
        let dimensions = this.state.dimensions;
        const activeDim = dimensions.timestampDim.filter(timestamp);
        dimensions.activeDimension = activeDim;
        this.setState({
            dimensions: dimensions,
            activeDimension: activeDim
        });
        // console.log('selectTimeDimension', activeDim.top(Infinity));
    },

    // resetLayers(dimensions) {
    //     // reset the filters
    //     dimensions.timestampDim.filterAll();
    //     dimensions.carIdDim.filterAll();
    // }

    carClick(e) {
        //
        console.log('car click:', e.target.options.carId);

        const carId = e.target.options.carId;

        let dimensions = this.state.dimensions;

        dimensions.timestampDim.filterAll();
        dimensions.carIdDim.filterAll();

        // filter the data by the carId
        // console.log('carIdDim:', carIdDim.top(Infinity));
        dimensions.carIdDim.filter(carId);

        // set the new dimension state
        this.setState({
            activeDimension: dimensions.carIdDim,
            dimensions: dimensions,
            sideNavVisible: true,
            selectedCar: dimensions.carIdDim.top(Infinity)
        });

        // draw arcs between the cars
        this.updateArcs();
    },

    closeSideNav() {
        // reset layer
        let dimensions = this.state.dimensions;
        dimensions.timestampDim.filterAll();
        dimensions.carIdDim.filterAll();

        this.setState({
            dimensions: dimensions,
            activeDimension: dimensions.timestampDim.filter(this.state.timestamps[0]),
            sideNavVisible: false,
            selectedCar: null,
            arcs: []
        });
    },

    render() {
        return (
             <MuiThemeProvider>
                <div id="wrap">
                    <Loader
                        visible={this.state.loading}
                    />
                    <Toolbar
                        title={this.state.toolbarTitle}
                    />
                    <SideNav
                      closeSideNav={this.closeSideNav}
                      visible={this.state.sideNavVisible}
                      carData={this.state.selectedCar}
                    />
                    <Map
                      dimension={this.state.activeDimension}
                      cars={this.state.cars}
                      carClick={this.carClick}
                      arcs={this.state.arcs}
                    />
                    <Footer
                      timestamps={this.state.timestamps}
                      selectTimeDimension={this.selectTimeDimension}
                    />
                </div>
            </MuiThemeProvider>
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