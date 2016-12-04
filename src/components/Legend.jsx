import React from 'react';


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
            <div id="legend" style={{height:'auto'}}>
                <LegendEntry title="VERY_CLEAN" color="#ABEBC6" />
                <LegendEntry title="CLEAN" color="#58D68D" />
                <LegendEntry title="REGULAR" color="#F39C12" />
                <LegendEntry title="POOR" color="#FF5733" />
            </div>
		);
    }
}

export default Legend;
