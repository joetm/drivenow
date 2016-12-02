import React from 'react';
import { render } from 'react-dom'

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';
import MapControl from './MapControl.jsx';


let App = React.createClass({
// class App extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            timestamps: []
        };
    },

    setTimestamps(timestamps) {
      // console.log('App:timestamps', timestamps);
      this.setState({timestamps: timestamps});
    },

    render() {
        return (
            <div id="wrap">
                <SideNav />
                <MapControl
                  setTimestamps={this.setTimestamps}
                />
                <Footer
                  timestamps={this.state.timestamps}
                />
            </div>
        );
    }

});

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