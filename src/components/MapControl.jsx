import react from 'react';


import Map from "./Map.jsx";


class MapControl extends react.Component {

    constructor() {
        super();
        this.cars = [];
    }

    componentDidMount() {
        let _this = this;

        this.serverRequest = fetch('/cars')
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            // console.log('cars', json);
            _this.setState({cars: crossfilter(json)});

            // build an array of possible timestamp values
            let timestamps = [];
            this.dimensions.timestampDim.top(Infinity).forEach(function(car){
                if (timestamps.indexOf(car.timestamp) === -1) {
                    timestamps.push(car.timestamp);
                }
            });
            console.log('timestamps', timestamps);
            // if (!timestamps.length) {
            //     throw "No timestamps in data";
            // }

            // dimensions
            let dimensions = {
                cleanlinessDim: cars.dimension(d => d["innerCleanliness"]),
                locationDim: cars.dimension(d => [d["latitude"], d["longitude"]]),
                timestampDim: cars.dimension(d => d["timestamp"]),
                carIdDim: cars.dimension(d => d["carId"]),
                allDim: cars.dimension(d => d)
            };

            // only show the cars from the first timestamp
            timestampDim.filter(timestamps[0]);

            _this.setState({dimensions});

            // groupings of values
            let dimensionGroups = {
                locationGroup: locationDim.group(location => [ Math.round(location.latitude / 100), Math.round(location.longitude / 1000) ]),
                timestampGroup: timestampDim.group(timestamp => Math.round(timestamp / 1000)),
                allGroup: allDim.groupAll()
            }
            _this.setState({dimensionGroups});

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

    render(props, state) {
        return (
            <Map cars={this.state.cars} dimensions={this.state.dimensions} />
        );
    }

}

module.exports = Map;
