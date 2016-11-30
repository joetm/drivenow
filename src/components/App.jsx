import react from 'react';

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';
import MapControl from './MapControl.jsx';

class App extends react.Component {

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
