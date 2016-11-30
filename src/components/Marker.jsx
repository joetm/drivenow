import react from 'react';


class Marker extends react.Component {

    constructor() {
        super();
    }

    componentDidMount() {

    }

    render(props, state) {
        return (
            <div id="map"></div>
        );
    }

}

module.exports = Marker;
