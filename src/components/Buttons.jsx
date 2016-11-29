import preact from 'preact';
// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */


const buttonStyle = {float:'left',marginLeft:'10px'};

class Button extends preact.Component {

    // componentWillReceiveProps(props) {
    //     this.setState({disabled: props.disabled});
    // }

    // timestamp button events
    // buttonClick(e) {
    //     console.log('e', e);
    //     this.props.disabledButton();
    //     // deactivate the button
    //     // this.setState({disabled:true});

    //     // TODO
    //         // // enable all buttons
    //         // $('#footer .btn').attr('disabled', false);
    //         // // disable the clicked button
    //         // $(this).attr('disabled', true);
    //         // // get the selected timestamp (as integer)
    //         // let timestamp = +$(this).text();
    //         // // alert('Filtering for timestamp: '+timestamp);
    //         // timestampDim.filter(timestamp);
    //         // // store this timestamp so that the view can be restored later
    //         // selectedTimestamp = timestamp;
    //         // // redraw with filtered data
    //         // layers.cars = draw(timestampDim); // TODO: use d3
    // }

    render(props, state) {
        let buttonClass = "btn waves-effect waves-light" + (this.props.disabled ? " disabled" : '');
        return (
        	<div onClick={this.props.disableButton.bind(this)} class={buttonClass} style={buttonStyle}>{props.timestamp}</div>
		);
    }

}

class Buttons extends preact.Component {

    // constructor() {
    //     super();
    //     this.state.buttons = [];
    // }

    // resetButtons(e) {
    //     // enable all buttons
    //     // console.log('this.buttons', this.state.buttons);
    //     this.state.buttons.forEach((btn) => {
    //         // console.log(btn);
    //         btn.setState({disabled:true});
    //     });
    // }

    disableButton() {
        console.log('disable');
        console.log(this);


        // TODO: disable the clicked button


        

    }

    componentDidMount() {

    }

    render(props, state) {
        return (
			<div id="buttons">
			    {
                    this.props.timestamps.map((timestamp) => (
                            <Button
                                timestamp={timestamp}
                                disableButton={this.disableButton}
                            />
                        )
                    )
                }
			</div>
		);
    }
}

module.exports = Buttons;
