import React from 'react';

import Drawer from 'material-ui/Drawer';
// import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import Stepper from './Stepper.jsx';


class SideNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  // handleToggle = () => this.setState({open: !this.state.open});

//onTouchTap={this.handleToggle}

  render() {

    if (this.props.carData) {
        //console.log(this.props.carData);




    }

    return (
      <div>
        <Drawer
            open={this.props.visible}
            openSecondary={true}
            style={{zIndex:9999}}
            containerStyle={{height:'auto',marginTop:'56px',marginBottom:'56px'}}
        >
            <RaisedButton
                label="Close"
                onTouchTap={this.props.closeSideNav}
            />
            {
                this.props.carData ?
                    (
                        <ul style={{padding:'0 1em'}}>
                            <li>ID: {this.props.carData[0].carId}</li>
                        </ul>
                    )
                    : ""
            }

            <Stepper
                carData={this.props.carData}
            />

        </Drawer>
      </div>
    );
  }
}

export default SideNav;
