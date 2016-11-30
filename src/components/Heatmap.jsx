import React from 'react';


class Heatmap extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            intensities: [],
            gradient: {
                0: '#0000ff',
                1: '#0000DD'
            }
        };
    }

    componentDidMount() {

    }


    reset() {
        // TODO
        // this.intensities = [];
        // if (layers.heat !== undefined) {
        //     map.removeLayer(layers.heat);
        //     delete layers.heat;
        // }
    }

    render() {
        // layers.heat = L.heatLayer(this.intensities, {
        //     radius: 40,
        //     maxZoom: 20,
        //     blur: 60,
        //     gradient: this.gradient
        // }).addTo(map);
       return (
            TODO
        );
    }

}

module.exports = Heatmap;
