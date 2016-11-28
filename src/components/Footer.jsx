import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */

import Legend from "./Legend.jsx";
import Buttons from "./Buttons.jsx";

// TODO
const timestamps = ['A', 'V'];

class Footer extends preact.Component {
    render(props, state) {
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
