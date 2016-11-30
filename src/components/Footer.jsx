import React from 'react';

import Legend from "./Legend.jsx";
import Buttons from "./Buttons.jsx";

// TODO
const timestamps = ['A', 'V'];

class Footer extends React.Component {
    render() {
        return (
            <div id="footer">
                <Legend
                    cleanlinessLevels={["VERY_CLEAN","CLEAN","REGULAR","POOR"]}
                />
                <Buttons timestamps={timestamps} />
            </div>
        );
    }
}

module.exports = Footer;
