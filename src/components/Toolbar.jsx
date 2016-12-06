import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Legend from "./Legend.jsx";
import Constants from "./Constants.jsx";
// get the label keys
let colorKeys = [];
for (let key in Constants.marker_colors) {
    if (Constants.marker_colors.hasOwnProperty(key)) {
        colorKeys.push(key);
    }
}


export default class AppToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
            <MenuItem
                value={3}
                primaryText={this.props.title}
            />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Berlin" />
          <ToolbarSeparator />
          <Legend
              filterForCleanliness={this.props.filterForCleanliness}
              cleanlinessLevels={colorKeys}
          />
          <ToolbarSeparator />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem
            	primaryText="TODO"
            />
            <MenuItem
              primaryText="TODO"
            />
            <MenuItem
            	primaryText="About"
            />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}