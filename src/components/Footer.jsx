import React from 'react';

import Legend from "./Legend.jsx";
import Buttons from "./Buttons.jsx";

import Constants from "./Constants.jsx";

import Slider from "./Slider.jsx";


// get the label keys
let colorKeys = [];
for (let key in Constants.marker_colors) {
    if (Constants.marker_colors.hasOwnProperty(key)) {
        colorKeys.push(key);
    }
}


let Footer = React.createClass({
// class Footer extends React.Component {

//                <Buttons
//                   timestamps={this.props.timestamps}
//                    selectTimeDimension={this.props.selectTimeDimension}
//                />

    render() {
        return (
            <div id="footer">
                <Legend
                    cleanlinessLevels={colorKeys}
                />
                <Slider
                    timestamps={this.props.timestamps}
                    selectTimeDimension={this.props.selectTimeDimension}
                />
            </div>
        );
    }
});

module.exports = Footer;
