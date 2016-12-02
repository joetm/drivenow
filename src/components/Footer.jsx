import React from 'react';

import Legend from "./Legend.jsx";
import Buttons from "./Buttons.jsx";

import Constants from "./Constants.jsx";


// TODO
const timestamps = [1412345678, 1412345679];

// get the label keys
let keys = [];
Constants.marker_colors.forEach(function (item, key) {
    for (key in item) {
        keys.push(key);
    }
});


class Footer extends React.Component {
    render() {
        return (
            <div id="footer">
                <Legend
                    cleanlinessLevels={keys}
                />
                <Buttons timestamps={timestamps} />
            </div>
        );
    }
}

module.exports = Footer;
