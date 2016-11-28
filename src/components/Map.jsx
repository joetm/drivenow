import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */


class Map extends preact.Component {

    constructor() {
        super();
        this.initialZoom = 10;
        this.coordinates = [52.5072111,13.1459675];
        this.map;
    }

    componentDidMount() {

        this.map = L.map('map').setView(this.coordinates, this.initialZoom);

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

    }

    render(props, state) {
        return (
            <div id="map"></div>
        );
    }

}

module.exports = Map;
