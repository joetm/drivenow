import React from 'react';
import { render } from 'react-dom'

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';
import MapControl from './MapControl.jsx';


class App extends React.Component {

    render() {
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
render(<App />,
    document.getElementById("app")
);
