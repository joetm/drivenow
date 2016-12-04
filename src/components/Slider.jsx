import React from 'react';
import Slider from 'material-ui/Slider';


// http://stackoverflow.com/a/1669212/426266
Array.prototype.min = function(comparer) {
    if (this.length === 0) return null;
    if (this.length === 1) return this[0];
    comparer = (comparer || Math.min);
    var v = this[0];
    for (var i = 1; i < this.length; i++) {
        v = comparer(this[i], v);    
    }
    return v;
}
Array.prototype.max = function(comparer) {
    if (this.length === 0) return null;
    if (this.length === 1) return this[0];
    comparer = (comparer || Math.max);
    var v = this[0];
    for (var i = 1; i < this.length; i++) {
        v = comparer(this[i], v);    
    }
    return v;
}


class SteppedSlider extends React.Component {

    constructor() {
        super();
        // initial state
        this.state = {
            min: 0,
            max: 1,
            initialIndex: 0,
            stepSize: 1
        }
    }

    componentWillReceiveProps(props) {
        // console.log(props.timestamps);
        if (props.timestamps.length) {
            // let min = 0; // props.timestamps.min();
            let max = props.timestamps.length - 1; // props.timestamps.max();
            // let stepSize = 1; // Math.floor((max - min) / props.timestamps.length, 0);
            // console.log(min, max, initialValue, stepSize);
            this.setState({
                // min: min,
                max: max
                // stepSize: stepSize
            });            
        }
    }

    sliderChanged(event, index) {
        console.log('slider:', index);
        // console.log('slider val in timestamps: ', this.props.timestamps.indexOf(this.props.timestamps[index]) !== -1);
        this.props.selectTimeDimension(this.props.timestamps[index]);
    }

    render() {
        return (
            <Slider
                style={{marginRight:'35%'}}
                min={this.state.min}
                max={this.state.max}
                step={this.state.stepSize}
                value={this.state.initialIndex}
                onChange={this.sliderChanged.bind(this)}
            />
        );
    }

}

export default SteppedSlider;
