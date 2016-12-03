import React from 'react';

import 'whatwg-fetch';
import crossfilter from 'crossfilter';

import Map from "./Map.jsx";
// import Heatmap from "./Heatmap.jsx";



let MapControl = React.createClass({
// class MapControl extends React.Component {

    render() {
        return (
            <Map
                cars={this.props.cars}
                dimension={this.props.dimension}
            />
        );
    }

});

module.exports = MapControl;
