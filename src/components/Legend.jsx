import React from 'react';


class LegendEntry extends React.Component {

    filter() {
        const cleanliness = this.btn.innerHTML;
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

    render() {
        return (
            <div id="legend" style={{height:'auto'}}>
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    title="VERY_CLEAN"
                    color="#ABEBC6" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    title="CLEAN"
                    color="#58D68D" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    title="REGULAR"
                    color="#F39C12" />
                <LegendEntry
                    filterForCleanliness={this.props.filterForCleanliness}
                    title="POOR"
                    color="#FF5733" />
            </div>
		);
    }
}

export default Legend;
