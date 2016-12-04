import React from 'react';


const options = {
    radius: 40,
    maxZoom: 20,
    blur: 60
};


// http://stackoverflow.com/a/33526955/426266
class Heatmap extends React.Component {

    constructor(props) {
        super(props);
        this.layer = null;
        this.gradient = {
            0: '#0000ff',
            1: '#0000DD'
        };
        // initial state
        this.state = {
            intensities: []
        };
    }

    reset() {
        // this.setState({intensities: []});
        if (this.layer) {
            this.props.map.removeLayer(this.layer);
        }
    }

    componentWillReceiveProps(props) {
        //
        this.reset();

        let intensities = [];

        props.dimension.top(Infinity).forEach(function(car){
            intensities.push([car.latitude, car.longitude]);
        });

        this.setState({intensities});
    }

    render() {

        if (this.props.map) {
            this.layer = L.heatLayer(this.state.intensities, {
                radius: options.radius,
                maxZoom: options.maxZoom,
                blur: options.blur,
                gradient: this.gradient
            }).addTo(this.props.map);
        }
        return null;
    }

};

module.exports = Heatmap;
