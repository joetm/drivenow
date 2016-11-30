import React from 'react';


class SideNav extends React.Component {
    render() {
        return (
            <div id="slide-out" className="side-nav" data-sidenav-open="false">
                <a href="#" id="slide-out-btn" className="button-collapse" data-activates="slide-out">
                	<i className="material-icons">close</i>
                </a>
                <ul id="details"></ul>
            </div>
        );
    }
}

module.exports = SideNav;
