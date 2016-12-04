import React from 'react';

import Buttons from "./Buttons.jsx";
import Slider from "./Slider.jsx";

// const {Grid, Row, Col} = require('react-flexbox-grid');



let Footer = React.createClass({
// class Footer extends React.Component {

    //                <Buttons
    //                   timestamps={this.props.timestamps}
    //                    selectTimeDimension={this.props.selectTimeDimension}
    //                />

    render() {
        return (
            <div id="footer">
                <Slider
                    timestamps={this.props.timestamps}
                    selectTimeDimension={this.props.selectTimeDimension}
                />
            </div>
        );
    }
});

module.exports = Footer;
