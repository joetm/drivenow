import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Modal from "./Modal.jsx";
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
            modalOpen: false,
            startDate: null,
            endDate: null
        };
    }

    handleChange = (event, index, value) => this.setState({value});

    // Modals
    closeModal = (event, index, value) => this.setState({modalOpen:false});
    openAbout = (event, index, value) => this.setState({modalOpen:true});

    componentWillReceiveProps(props) {
        if (!this.state.startDate && !this.state.endDate) {
            const startDate = this.formatDate(props.startDate);
            const endDate = this.formatDate(props.endDate);
            this.setState({
                startDate,
                endDate
            });
        }
    }

    formatDate(theDate) {
        let da = new Date(theDate);
        let str = `${da.getFullYear()}-${da.getMonth()}-${da.getDate()} ${da.getHours()}:${da.getMinutes()}:${da.getSeconds()}`;
        return str;
    }

    getAboutContent() {
        return (
            <div>
                <h2 style={{fontSize:'1.5em'}}>Visualisation of DriveNow cars</h2>
                <div>
                    Data scraped from {this.state.startDate} to {this.state.endDate}.
                </div>
            </div>
        );
    }


    render() {
        return (
          <div>
            <Toolbar>
              <ToolbarGroup firstChild={true}>
                    <ToolbarTitle
                        text="Berlin"
                        style={{marginLeft: '0.6em'}}
                    />
              </ToolbarGroup>
              <ToolbarGroup>
                <MenuItem
                    value={3}
                    primaryText={this.props.title}
                />
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
                      primaryText="Stats"
                  />
                  <MenuItem
                  	  primaryText="About"
                  	  onTouchTap={this.openAbout}
                  />
                </IconMenu>
              </ToolbarGroup>
            </Toolbar>
            <Modal
                open={this.state.modalOpen}
                closeModal={this.closeModal.bind(this)}
                modalContent={this.getAboutContent()}
            />
          </div>
        );
    }
}