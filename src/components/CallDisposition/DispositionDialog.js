import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, withTaskContext } from '@twilio/flex-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class DispositionDialog extends React.Component {
  state = {
    callDisposition: ''
  }

  handleClose = () => {
    this.closeDialog();
  }

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'DispositionDialog',
      state: { isOpen: false }
    });
  }


  handleChange = e => {
    const value = e.target.value;
    this.setState({ callDisposition: value });
  }



  handleSaveDisposition = async () => {
    //save disposition
    console.log('Saving call disposition');
    console.log('task: ', this.props.task);
    let newAttributes = {...this.props.task.attributes};
    newAttributes.disposition = this.state.callDisposition;
    //insights outcome
    let conversations = this.props.task.attributes.conversations;
    let newConv = {};
    if (conversations) {
      newConv = {...conversations};
    }
    newConv.outcome = this.state.callDisposition;
    newAttributes.conversations = newConv;

    await this.props.task.setAttributes(newAttributes);
    //clear disposition
    this.setState({ callDisposition: '' });
    this.closeDialog();

  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen || false}
        onClose={this.handleClose}
      >
        <DialogContent>
          <DialogContentText>
            Please select the disposition value for the completed call.
          </DialogContentText>
          <Select
              value={this.state.callDisposition}
              onChange={this.handleChange}
              name="disposition"
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="CallBack">Call Back</MenuItem>
              <MenuItem value="Canceled">Canceled Service</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="NewService">New Service</MenuItem>
            </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleSaveDisposition}
            color="primary"
          >
            Save
          </Button>
          
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dispositionDialogState = componentViewStates && componentViewStates.DispositionDialog;
  const isOpen = dispositionDialogState && dispositionDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(withTaskContext(DispositionDialog)));
