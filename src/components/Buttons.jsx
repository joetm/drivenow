import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */


const buttonStyle = {float:'left',marginLeft:'10px'};

class Button extends preact.Component {
    render(props, state) {
        return (
        	<div class="btn waves-effect waves-light" style={buttonStyle}>{props.timestamp}</div>
		);
    }
}

class Buttons extends preact.Component {
    render(props, state) {
        return (
			<div id="buttons">
			    {props.timestamps.map((timestamp) => <Button timestamp={timestamp} />)}
			</div>
		);
    }
}

module.exports = Buttons;
