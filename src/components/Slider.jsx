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
            initialValue: 0,
            stepSize: 0.1
        }
    }

    componentWillReceiveProps(props) {
        // console.log(props.timestamps);
        if (props.timestamps.length) {
            let min = props.timestamps.min();
            let max = props.timestamps.max();
            let initialValue = min;
            let stepSize = Math.floor((max - min) / props.timestamps.length, 0);
            // console.log(min, max, initialValue, stepSize);
            this.setState({
                min: min,
                max: max,
                initialValue: initialValue,
                stepSize: stepSize
            });            
        }
    }

    render() {
        return (
            <Slider
                style={{marginRight:'35%'}}
                max={this.state.max}
                min={this.state.min}
                step={this.state.stepSize}
                value={this.state.initialValue}
            />
        );
    }

}

export default SteppedSlider;
