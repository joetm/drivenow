import react from 'react';

// TODO
// import Constants from "./Constants.jsx";

class LegendEntry extends react.Component {
    render(props, state) {
        return (
			<div class={"chip "+props.title} style={{"background-color": props.color}}>{props.title}</div>
		);
    }
}


// TODO
//						{Constants.marker_colors.map((lvl) => <LegendEntry key={'test'} item={lvl} />)}

class Legend extends react.Component {
    render(props, state) {
        return (
            <div id="legend">
                <div class="card darken-1">
                  <div class="card-content black-text">
                    <span class="card-title">Cleanliness</span>
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
