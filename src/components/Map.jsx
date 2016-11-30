import react from 'react';


class Map extends react.Component {

    constructor() {
        super();
        this.initialZoom = 10;
        this.map;
        this.state = {
            lat: 52.5072111,
            lng: 13.1459675
        };
        this.markeroptions = {
            radius: 10
        };
    }

    componentDidMount() {

        // init the map
        this.map = L.map('map').setView([this.state.lat, this.state.lng], this.initialZoom);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // this.map.on('zoomend', function() {
        //     let currentZoom = map.getZoom();
        //     this.markeroptions.radius = currentZoom * 0.9;
        //     // TODO
        //     // circleGroup.setStyle({radius: radius});
        // });

    }

    drawMarkers() {

    }

    render(props, state) {
        return (
            <div id="map"></div>
        );
    }

}

module.exports = Map;
