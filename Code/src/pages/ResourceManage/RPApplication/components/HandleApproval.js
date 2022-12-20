import React, { useState, memo, useRef } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading, CommonTip, WarningDialog } from '../../../../components';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import resourceMXAPI from '../../../../api/resourceManage/index';

const HandleApproval = (props) => {
  const {
    isApproval,
    formStatus,
    toSave
    // isDetail,
    // values,
  } = props;
  const { requestNo } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const [remark, setRemark] = useState('');
  const remarkRef = useRef();
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus); // state 来判断 流程的进度
  // const moreInfo = useSelector((state) => state.resourceMX.moreInfo); // load from redux

  const handleChangeRemark = (e) => {
    setRemark(e.target.value);
  };

  const handleClickOpen = () => setOpen(true);

  const handleRequest = () => {
    setOpen(false);
    console.log('approval');
    const obj = {};
    if (state === false && remark === '') {
      CommonTip.warning('Please remark a reason');
    } else {
      obj.flag = state;
      obj.remark = remark;
      obj.requestNo = requestNo;
      // console.log('handleRequest Approval', obj);
      Loading.show();
      resourceMXAPI
        .doN3Examine(obj)
        .then((res) => {
          // console.log('doN3Examine', res);
          if (res?.data?.code === 200) {
            let todoName = 'Approved';
            if (state === false) {
              todoName = 'Rejected';
            }
            CommonTip.success(todoName);
            history.push('/action');
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };
  const handleClickUpdate = () => {
    remarkRef?.current?.focus();
    setTimeout(() => {
      // console.log('handleClickUpdate', moreInfo);
      toSave('', 'approval');
    }, 1000);
  };

  return (
    <Grid container>
      <Grid {...FormControlProps} xs={12}>
        <Typography variant="h6">
          <strong style={{ color: useWebDPColor().title }}> </strong>
        </Typography>
      </Grid>
      {isApproval ? (
        <Grid {...FormControlProps} xs={12}>
          <TextField
            style={{ width: '99%', marginLeft: '0.5%' }}
            variant="outlined"
            label="Remarks"
            multiline
            fullWidth
            minRows={5}
            name="remark"
            value={remark || ''}
            onChange={(e) => handleChangeRemark(e)}
            inputRef={remarkRef}
            disabled={resourceStatus === 'detailApproved'}
          />
        </Grid>
      ) : null}

      {isApproval && (
        <Grid {...FormControlProps} xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={formStatus === 1}
            style={{ fontWeight: 'bold', marginLeft: '0.5%' }}
            onClick={() => {
              setState(true);
              handleClickOpen();
            }}
          >
            Approval
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={formStatus === 1 || remark === ''}
            onClick={() => {
              setState(false);
              handleClickOpen();
            }}
            style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={formStatus === 1}
            style={{ fontWeight: 'bold', marginLeft: '0.5%' }}
            onClick={() => {
              setState(false);
              handleClickUpdate();
            }}
          >
            Update
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
            content={`Are you sure to ${state ? 'accept' : 'reject'} the request?`}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default memo(HandleApproval);
