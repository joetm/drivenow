import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import MapControl from './MapControl.jsx';
import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';

class App extends preact.Component {

    constructor() {
        super();
        this.state.cars = [];
    }

    render(props, state) {
        return (
            <div id="wrap">
                <SideNav />
                <MapControl />
                <Footer />
            </div>
        );
    }
}

// render the App
preact.render(<App />, document.body);
