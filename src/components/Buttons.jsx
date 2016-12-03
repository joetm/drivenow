import React from 'react';

import Button from "./Button.jsx";

const buttonStyle = {float:'left', marginLeft:'10px'};


let Buttons = React.createClass({
// class Buttons extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            buttonDisabledStates: {}
        };
    },

    resetButtons(setState = true) {
        // enable all buttons
        let buttonDisabledStates = {};
        // console.log(this.props.timestamps);
        for (let i=0, s=this.props.timestamps.length; i < s; i++) {
            buttonDisabledStates[this.props.timestamps[i]] = false; // disabled == true
        }
        // console.log('buttonDisabledStates', buttonDisabledStates);
        if (setState === true) {
            this.setState({buttonDisabledStates});
        } else {
            return buttonDisabledStates;
        }
    },

    clickButton(e) {
        let clickedTimestamp = e.props.timestamp;
        // enable all buttons
    	let buttonDisabledStates = this.resetButtons(false);
        // disable the clicked button
        buttonDisabledStates[clickedTimestamp] = true;
        // set the new button states
        this.setState({buttonDisabledStates});
        // change layer
        // console.log('change layer');
        this.props.selectTimeDimension(clickedTimestamp);
    },

    render() {
        return (
			<div id="buttons">
			    {
                    this.props.timestamps.map((timestamp) => (
                            <Button
                                key={`btn_${timestamp}`}
                                timestamp={timestamp}
                                disabled={this.state.buttonDisabledStates[timestamp] ? true : false}
                                clickButton={this.clickButton}
                            />
                        )
                    )
                }
			</div>
		);
    }
});


module.exports = Buttons;
