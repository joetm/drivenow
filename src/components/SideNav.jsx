import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */

class SideNav extends preact.Component {
    render(props, state) {
        return (
            <div id="slide-out" class="side-nav" data-sidenav-open="false">
                <a href="#" id="slide-out-btn" data-activates="slide-out" class="button-collapse"><i class="material-icons">close</i></a>
                <ul id="details"></ul>
            </div>
        );
    }
}

module.exports = SideNav;
