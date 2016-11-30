import react from 'react';


class Heatmap extends react.Component {

    constructor() {
        super();
        this.intensities = [];
        this.gradient: {
            0: '#0000ff',
            1: '#0000DD'
        };
        // {0.1: '#ABEBC6', 0.3: '#58D68D', 0.6: '#F39C12', 1: '#FF5733'}
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

    render(props, state) {
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
