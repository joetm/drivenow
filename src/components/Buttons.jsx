import React from 'react';

import Button from "./Button.jsx";

const buttonStyle = {float:'left', marginLeft:'10px'};


let Buttons = React.createClass({
// class Buttons extends React.Component {

    getInitialState() {
        // initialise the state (once)
        return {
            buttonStates: []
        };
    },

    // resetButtons(e) {
    //     // enable all buttons
    //     // console.log('this.buttons', this.state.buttons);
    //     this.state.buttons.forEach((btn) => {
    //         // console.log(btn);
    //         btn.setState({disabled:true});
    //     });
    // },

    //componentWillReceiveProps() {
        // let buttonStates = this.props.timestamps.map((timestamp, this) => ());
        // this.setState({buttonStates});
    //},

    disableButton() {
        console.log('disable');
        console.log(this);

    },

    buttonClick() {
        console.log('disable');
        console.log(this);

        // TODO: disable the clicked button


    },

    // TODO
    // componentWillMount() {
    //     // initial button states
    //     for (let i=0, s=this.props.timestamps.length; i<s; i++) {
    //         this.state.buttonStates[this.props.timestamps[i]] = false; // disabled = off by default
    //     }
    //     // console.log('this.state.buttonStates', this.state.buttonStates);
    // },

    render() {

// TODO
//                                disabled={this.props.buttonStates[timestamp] ? true : false}
// TODO
        return (
			<div id="buttons">
			    {
                    this.props.timestamps.map((timestamp) => (
                            <Button
                                key={'btn_'+timestamp}
                                timestamp={timestamp}
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
