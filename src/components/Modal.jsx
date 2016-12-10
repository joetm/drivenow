import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class DialogModal extends React.Component {
  // state = {
  //   open: false,
  // };

  // handleOpen = () => {
  //   console.log('click');
  //   this.setState({open: true});
  // };

  // handleClose = () => {
  //   console.log('click');
  //   this.setState({open: false});
  // };

  render() {
    if (!this.props.open) {
        return null;
    }

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.props.closeModal}
      />
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={true}
          open={this.props.open}
        >
          {this.props.modalContent}
        </Dialog>
      </div>
    );
  }
}