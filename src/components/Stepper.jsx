import React from 'react';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


class VerticalNonLinear extends React.Component {

  state = {
    stepIndex: 0,
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  render() {
    const {stepIndex} = this.state;

    // console.log('carData', this.props.carData);

    let steps = [];
    let car;
    if (this.props.carData) {
        for (let i=0, s=this.props.carData.length; i<s; i++) {
            car = this.props.carData[i];
            steps.push(
              <Step key={'pos_'+i}>
                <StepButton onTouchTap={() => this.setState({stepIndex: i})}>
                  {car.createdAt}
                </StepButton>
                <StepContent>
                  <p>
                    estimatedRange: {car.estimatedRange}<br />
                    fuelLevel: {car.fuelLevel}<br />
                    fuelLevelInPercent: {car.fuelLevelInPercent}<br />
                    {car.isCharging ? 'isCharging: '+car.isCharging + '<br />':''}
                    {car.isInParkingSpace ? 'isInParkingSpace: '+car.isInParkingSpace + '<br />':''}
                  </p>
                </StepContent>
              </Step>
            );
        }
    }
    // console.log('steps', steps);

    return (
      <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          {steps}
        </Stepper>
      </div>
    );
  }
}

export default VerticalNonLinear;