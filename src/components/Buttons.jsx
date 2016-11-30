import react from 'react';

import Button from "./Button.jsx";

const buttonStyle = {float:'left', marginLeft:'10px'};


class Buttons extends react.Component {

    constructor() {
        super();
        this.state.buttonStates = [];
    }

    // resetButtons(e) {
    //     // enable all buttons
    //     // console.log('this.buttons', this.state.buttons);
    //     this.state.buttons.forEach((btn) => {
    //         // console.log(btn);
    //         btn.setState({disabled:true});
    //     });
    // }

    componentWillReceiveProps() {
        // let buttonStates = this.props.timestamps.map((timestamp) => ());
        // this.setState({buttonStates});
    }

    buttonClick() {
        console.log('disable');
        console.log(this);


        // TODO: disable the clicked button

        

    }

    componentWillMount() {
        // initial button states
        for (let i=0, s=this.props.timestamps.length; i<s; i++) {
            this.state.buttonStates[this.props.timestamps[i]] = false; // disabled = off by default
        }
        // console.log('this.state.buttonStates', this.state.buttonStates);
    }

    render(props, state) {
        return (
			<div id="buttons">
			    {
                    this.props.timestamps.map((timestamp) => (
                            <Button
                                timestamp={timestamp}
                                disabled={this.state.buttonStates[timestamp] ? true : false}
                                buttonClick={this.buttonClick}
                            />
                        )
                    )
                }
			</div>
		);
    }
}

module.exports = Buttons;
