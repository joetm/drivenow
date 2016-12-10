import React from 'react';

import 'whatwg-fetch';

import Constants from "./Constants.jsx";

import Heatmap from "./Heatmap.jsx";

const maxZoom = 19;


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

        // draw the business area
        this.drawGeschaeftsgebiet();

        // draw the boroughs
        this.drawBezirke();

    },

    drawMarkers(dimension) {

        let _this = this;

        let markers = [];

        // map reset
        if (this.markerGroup) {
            this.state.map.removeLayer(this.markerGroup);
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
                .on('click', _this.props.carClick);

            markers.push(marker);
            // markers.push(blurmarker);
        });

        // group the circles
        this.markerGroup = L.featureGroup(markers);

        // add the layer to the map
        this.state.map.addLayer(this.markerGroup);

    },

    drawArcs() {
        // map reset
        if (this.arcGroup) {
            this.state.map.removeLayer(this.arcGroup);
        }
        let arcs = [];
        this.props.arcs.forEach(function(arc) {
            arcs.push(L.Polyline.Arc(arc.from, arc.to, {color: arc.color}));
        });
        this.arcGroup = L.featureGroup(arcs);
        this.state.map.addLayer(this.arcGroup);
    },

    drawGeschaeftsgebiet() {

        let _this = this;

        this.serverRequest = fetch('./geschaeftsgebiet.json')
        .then(function(response) {
            return response.json();
        }).then(function(gb) {
            // console.log(gb);
            L.geoJSON(gb, {
                style: function (feature) {
                    return {
                        fillColor: '#CCCCCC',
                        color: '#BBBBBB'
                    }; //feature.properties.color
                }
            }).addTo(_this.state.map);
        });

    },

    drawBezirke() {

        let _this = this;

        this.serverRequest = fetch('./Berlin-Ortsteile.json')
        .then(function(response) {
            return response.json();
        }).then(function(ot) {
            L.geoJSON(ot, {
                style: function (feature) {
                    return {
                        fillColor: '#AADDDD',
                        color: '#AADDDD',
                        opacity: 0.65
                    };
                },
                onEachFeature: function (feature, layer) {
                    // console.log(feature.properties);
                    layer.bindPopup(feature.properties.name); // html: feature.properties.description
                }
            }).addTo(_this.state.map);
        });

    },

    render() {
        //
        // draw the markers
        if (this.props.dimension.top !== undefined) {
            this.drawMarkers(this.props.dimension);
        }

        // draw the arcs
        if (this.state.map) {
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
