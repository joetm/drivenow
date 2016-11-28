import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */

import 'whatwg-fetch';
import crossfilter from "crossfilter";

import Map from './Map.jsx';
import Footer from './Footer.jsx';
import SideNav from './SideNav.jsx';

class App extends preact.Component {

    constructor() {
        super();
        this.state.cars = [];
    }

    componentDidMount() {

        fetch('/cars')
        .then(function(response) {
            return response.json();
        }).then(function(json) {

            console.log('App', this);
	        this.setState({cars: crossfilter(json)});



        });

    }

    render(props, state) {
        return (
            <div id="wrap">
                <SideNav />
                <Map />
                <Footer />
            </div>
        );
    }
}

// render the App
preact.render(<App />, document.body);
