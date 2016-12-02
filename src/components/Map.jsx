import React from 'react';

const maxZoom = 19;

import Constants from "./Constants.jsx";


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

        // // map reset
        // if (this.state.layers.cars) {
        //     // clear map
        //     map.removeLayer(layers.cars);
        // }
        if (this.circleGroup) {
            // this.state.map.eachLayer(function (layer) {
            //     console.log(layer);
            //     _this.state.map.removeLayer(layer);
            // });
            this.state.map.removeLayer(this.circleGroup);
        }

        // TODO
        // reset heatmap;
        // heatmap.reset();


        // console.log('dimension', dimension);

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
                // .on('click', carClick)
                // .bindPopup(popup)

            markers.push(marker);
            // markers.push(blurmarker);

            // TODO
            // heatmap.intensities.push([car.latitude, car.longitude]); // marker_intensities[car.innerCleanliness]

        });

        // group the circles
        // to change the circle size on zoom event
        this.circleGroup = L.featureGroup(markers);

        // TODO
        // heatmap.render();

        // add the layer to the map
        this.state.map.addLayer(this.circleGroup);

        // remove loading overlay from sidenav
        // $('#sidenav-overlay').hide();

        // return this.circleGroup;

    },

    render() {

        // TODO
        // console.log('draw markers');
        if (this.props.dimension.top !== undefined) {
            this.drawMarkers(this.props.dimension);
        }

        return (
            <div id="map"></div>
        );
    }

});

module.exports = Map;
