import React from 'react';

import Button from "./Button.jsx";

const buttonStyle = {float:'left', marginLeft:'10px'};


let Buttons = React.createClass({
// class Buttons extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            buttonStates: {}
        };
    },

    resetButtons() {
    //     // enable all buttons
    //     // console.log('this.buttons', this.state.buttons);
    //     this.state.buttons.forEach((btn) => {
    //         // console.log(btn);
    //         btn.setState({disabled:true});
    //     });
    },

    disableButton() {
    	this.resetButtons();
        console.log('disable');

    },

    buttonClick() {
        console.log('disable');
        console.log(this);

        // TODO: disable the clicked button


    },

    componentWillMount() {
        // populate the initial button states
        let buttonStates = {};
        for (let i=0, s=this.props.timestamps.length; i < s; i++) {
            buttonStates[this.props.timestamps[i]] = false; // disabled == true
        }
        this.setState({buttonStates});
        console.log('this.state.buttonStates', this.state.buttonStates);
    },

    render() {

        //     disabled={this.props.buttonStates[timestamp] ? true : false}

        return (
			<div id="buttons">
			    {
                    this.props.timestamps.map((timestamp) => (
                            <Button
                                key={'btn_'+timestamp}
                                timestamp={timestamp}
                                disabled={this.state.buttonStates[timestamp] ? true : false}
                                buttonClick={this.buttonClick}
                                disableButton={this.disableButton}
                            />
                        )
                    )
                }
			</div>
		);
    }
});


module.exports = Buttons;
