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
// const __DEV__ = true;
const root = document.getElementById("app");
// if (__DEV__) {
//   const RedBox = require('redbox-react').default
//   try {
//     render(<App />, root);
//   } catch (e) {
//     render(<RedBox error={e} />, root)
//   }
// } else {
    render(<App />, root);
// }