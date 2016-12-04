import React from 'react';

const maxZoom = 19;

import Constants from "./Constants.jsx";

import Heatmap from "./Heatmap.jsx";


let Map = React.createClass({
// class Map extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            initialZoom: 10,
            map: null,
            lat: 52.5072111,
            lng: 13.1459675,
            markeroptions: {
                radius: 10
            }
        };
    },

    componentDidMount() {

        // init the map
        this.state.map = L.map('map').setView([this.state.lat, this.state.lng], this.state.initialZoom);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: maxZoom
        }).addTo(this.state.map);

        // TODO
        // this.map.on('zoomend', function() {
        //     let currentZoom = map.getZoom();
        //     this.markeroptions.radius = currentZoom * 0.9;
        //     // TODO
        //     // circleGroup.setStyle({radius: radius});
        // });

    },

    drawMarkers(dimension) {

        let _this = this;

        let markers = [];

        // map reset
        if (this.circleGroup) {
            this.state.map.removeLayer(this.circleGroup);
        }

        dimension.top(Infinity).forEach(function(car){

            // blurred circle
            // let blurmarker = L.circleMarker([car.latitude, car.longitude], {
            //         radius: 10,
            //         stroke: false,
            //         fill: true,
            //         fillOpacity: 0.2,
            //         className: 'blurCircle',
            //         carId: car.carId,
            //         fillColor: marker_colors[car.innerCleanliness]
            //     })

            // marker in the center
            let marker = L.circleMarker([car.latitude, car.longitude], {
                    radius: 6,
                    fill: true,
                    fillOpacity: 0.8,
                    stroke: false,
                    carId: car.carId,
                    // className: 'blurCircle',
                    color: Constants.marker_colors[car.innerCleanliness],
                    fillColor: Constants.marker_colors[car.innerCleanliness]
                })
                .on('click', _this.props.carClick)
                // .bindPopup(popup)

            markers.push(marker);
            // markers.push(blurmarker);
        });

        // group the circles
        this.circleGroup = L.featureGroup(markers);

        // add the layer to the map
        this.state.map.addLayer(this.circleGroup);

    },

    drawArcs() {
        // map reset
        if (this.arcGroup) {
            this.state.map.removeLayer(this.arcGroup);
        }
        let arcs = [];
        this.props.arcs.forEach(function(arc) {
            arcs.push(L.Polyline.Arc(arc.from, arc.to));
        });
        this.arcGroup = L.featureGroup(arcs);
        this.state.map.addLayer(this.arcGroup);
    },

    render() {
        //
        // draw the markers
        if (this.props.dimension.top !== undefined) {
            this.drawMarkers(this.props.dimension);
        }

        // draw the arcs
        if (this.props.arcs.length) {
            this.drawArcs();
        }

        return (
            <div style={{height:'99%',width:'100%'}}>
                <div id="map"></div>
                <Heatmap
                    map={this.state.map}
                    dimension={this.props.dimension}
                />
            </div>
        );
    }

});

module.exports = Map;
