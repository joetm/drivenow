var React = require('react');
var Loading = require('react-loading');

export default React.createClass({
  render: function() {
    if (!this.props.visible) {
        return null;
    }
    return (
        <div className="valign-wrapper center-align" style={{position:'absolute',top:0,left:0,zIndex:9999,width:'100%',height:'100%'}}>
            <div className="valign center-align" style={{margin:'0 auto'}}>
                <Loading
                    id="loader"
                    type='spin'
                    width={400}
                    height={400}
                    color='#e3e3e3'
                />
            </div>
        </div>
    );
  }
});
