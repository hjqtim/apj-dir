import * as React from 'react';
import localStorage from 'localStorage';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import { host_camunda } from '../../api/constant';

export default class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      deployment_name: localStorage.getItem('deployment_name') || '',
      tenant_id: localStorage.getItem('tenant_id') || '',
      host_camunda
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = () => {
    // 这里应该先要验证，然后把数据转回给父组件处理
    this.props.handleForm(this.state);
  };

  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Save model</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="deployment-name"
              label="Deployment Name"
              type="text"
              fullWidth
              variant="standard"
              value={this.state.deployment_name}
              onChange={this.handleChange('deployment_name')}
            />
            <TextField
              margin="dense"
              id="tenant-id"
              label="Tenant ID"
              type="text"
              fullWidth
              variant="standard"
              value={this.state.tenant_id}
              onChange={this.handleChange('tenant_id')}
            />
            {/* <TextField */}
            {/*    margin="dense" */}
            {/*    id="endpoint" */}
            {/*    label="REST Endpoint" */}
            {/*    type="text" */}
            {/*    fullWidth */}
            {/*    variant="standard" */}
            {/*    value= {this.state.host_camunda} */}
            {/*    onChange={this.handleChange('host_camunda')} */}
            {/* /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={this.handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
