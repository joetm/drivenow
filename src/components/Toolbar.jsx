import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
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
            selectedView: 'cars',
            modalOpen: false
        };
    }

    handleViewChange = (event, index, value) => {
        if (this.state.selectedView !== value) {
            console.log('switch to view', value);
            // set the selected view to the new value of the dropdown menu
            this.setState({selectedView: value});
            // execute the view switch
            switch (value) {
                case 'cars':
                    this.props.initialFilter();
                break;
                case 'cleanups':
                    this.props.drawCleanupMovements();
                break;
            }
        }
    }

    // Modals
    closeModal = (event, index, value) => this.setState({modalOpen:false});
    openAbout = (event, index, value) => this.setState({modalOpen:true});

    // formatDate(theDate) {
    //     let da = new Date(theDate);
    //     let str = `${da.getFullYear()}-${da.getMonth()}-${da.getDate()} ${da.getHours()}:${da.getMinutes()}:${da.getSeconds()}`;
    //     return str;
    // }

    getAboutContent() {
        return (
            <div>
                <h2 style={{fontSize:'1.5em'}}>Visualisation of DriveNow cars</h2>
            </div>
        );
                //<div>
                //    Data scraped from {this.props.startDate} to {this.props.endDate}.
                //</div>
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
                    primaryText={this.props.title}
                    disabled={true}
                    style={{cursor:'default'}}
                />
                <ToolbarSeparator
                    style={{marginLeft:'24px'}}
                />
                <DropDownMenu
	            	value={this.state.selectedView}
    	        	onChange={this.handleViewChange}
                    iconStyle={{color:'#101010', fill: '#101010'}}
                    style={{lineHeight:'48px'}}
                    autoWidth={true}
                    className={'dropDownMenu'}
        	    >
                    <MenuItem
                        value={'cars'} primaryText="All Cars"
                    />
	                <MenuItem
                        value={'cleanups'} primaryText="Car Cleanups"
                    />
    	        </DropDownMenu>
                <ToolbarSeparator
                    style={{marginRight:'24px'}}
                />
                <MenuItem
                    secondaryText={this.props.numCars}
                    disabled={true}
                    style={{cursor:'default'}}
                    title={'Number of visible cars'}
                />
                <ToolbarSeparator
                    style={{marginLeft:'24px',marginRight:'24px'}}
                />
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