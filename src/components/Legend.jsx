import React from 'react';

// TODO
// import Constants from "./Constants.jsx";

class LegendEntry extends React.Component {
    render() {
        return (
			<span className={"chip "+this.props.title} style={{"backgroundColor": this.props.color}}>{this.props.title}</span>
		);
    }
}


// TODO
//						{Constants.marker_colors.map((lvl, this) => <LegendEntry key={'test'} item={lvl} />)}

class Legend extends React.Component {
    render() {
        return (
            <div id="legend">
                <div className="card darken-1">
                  <div className="card-content black-text">
                    <span className="card-title">Cleanliness</span>
                    <p id="legend_cleanliness">
	                    <LegendEntry title="VERY_CLEAN" color="#ABEBC6" />
	                    <LegendEntry title="CLEAN" color="#58D68D" />
	                    <LegendEntry title="REGULAR" color="#F39C12" />
	                    <LegendEntry title="POOR" color="#FF5733" />
                    </p>
                  </div>
                </div>
            </div>
		);
    }
}

export default Legend;
