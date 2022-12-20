import React, { useState, memo } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
// import {
//   // useHistory,
//   useParams
// } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import {
  // Loading, CommonTip,
  WarningDialog
} from '../../../../../components';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
// import resourceMXAPI from '../../../../../api/resourceManage/index';

const HandleApproval = (props) => {
  const { formStatus, handleSave } = props;
  // const { requestNo } = useParams();
  // const history = useHistory();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleRequest = () => {
    setOpen(false);
    console.log('handleSave');
    handleSave();
  };

  return (
    <Grid container>
      <Grid {...FormControlProps} xs={12}>
        <Typography variant="h6">
          <strong style={{ color: useWebDPColor().title }}> </strong>
        </Typography>
      </Grid>

      <Grid {...FormControlProps} xs={12}>
        <Button
          variant="contained"
          color="primary"
          disabled={formStatus === 1}
          style={{ fontWeight: 'bold' }}
          onClick={() => {
            setState(true);
            handleClickOpen();
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          // disabled={formStatus === 1 || remark === ''}
          onClick={() => {
            setState(false);
            handleClickOpen();
          }}
          style={{ marginLeft: '1rem', fontWeight: 'bold' }}
        >
          Cancel
        </Button>

        <WarningDialog
          open={open}
          handleConfirm={() => {
            // handleClickUpdate();
            // setTimeout(() => {
            handleRequest();
            // }, 1500);
          }}
          handleClose={() => {
            setOpen(false);
          }}
          content={`Are you sure to ${state ? 'save' : 'cancel'} the record?`}
        />
      </Grid>
    </Grid>
  );
};

export default memo(HandleApproval);
