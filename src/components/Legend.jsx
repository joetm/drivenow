import React from 'react';

import Constants from "./Constants.jsx";


class LegendEntry extends React.Component {

    filter() {
        const cleanliness = this.btn.innerHTML;
        this.props.setFilterState(cleanliness);
        this.props.filterForCleanliness(cleanliness);
    }

    render() {
        return (
			<span
                className={"chip "+this.props.title}
                onClick={this.filter.bind(this)}
                ref={(btn) => {this.btn = btn;}}
                style={{cursor:'pointer',backgroundColor: this.props.color}}>
                    {this.props.title}
                </span>
		);
    }
}


// TODO
//						{Constants.marker_colors.map((lvl, this) => <LegendEntry key={'test'} item={lvl} />)}

class Legend extends React.Component {

    constructor() {
        super();
        this.state = {
            isFiltering: false
        }
    }

    setFilterState(c) {
        // console.log('isFiltering', c !== 'RESET');
        this.setState({
            isFiltering: c !== 'RESET'
        })
    }

    render() {

        // console.log(Constants.marker_colors);

        return (
            <div id="legend" style={{height:'auto'}}>
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    setFilterState={this.setFilterState.bind(this)}
                    title="VERY_CLEAN"
                    color="#ABEBC6" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    setFilterState={this.setFilterState.bind(this)}
                    title="CLEAN"
                    color="#58D68D" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    setFilterState={this.setFilterState.bind(this)}
                    title="REGULAR"
                    color="#F39C12" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    setFilterState={this.setFilterState.bind(this)}
                    title="POOR"
                    color="#FF5733" />
                {
                    this.state.isFiltering ?
                        <LegendEntry
                            setFilterState={this.setFilterState.bind(this)}
                            filterForCleanliness={this.props.filterForCleanliness}
                            title="RESET"
                            color="#AAAAAA" />
                    : ''
                }
            </div>
		);
    }
}

export default Legend;
