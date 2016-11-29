import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */


class Marker extends preact.Component {

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
