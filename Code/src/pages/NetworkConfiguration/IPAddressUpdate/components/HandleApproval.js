import React, { useState, memo } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, WarningDialog, CommonTip } from '../../../../components';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import ipassignAPI from '../../../../api/ipassign';

const HandleApproval = ({ handleChange, remark, isApproval, isDetail, formStatus, values }) => {
  const { requestNo } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);

  const handleClickOpen = () => setOpen(true);

  // console.log('formStatus', isApproval, formStatus);

  const handleRequest = () => {
    // console.log('handleRequest', state, values);
    if (state) {
      // Approval 前如果 有修改 先提交 独立接口，再自动 approval

      let newArr = [];
      // const newArr2 = [];
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].ipAddress !== '' && values[i].macAddress !== '') {
          newArr = [...newArr, values[i]];
        }
      }
      newArr.forEach((item) => {
        item.ipAddress = item.ip;
        Reflect.deleteProperty(item, 'hospital');
        Reflect.deleteProperty(item, 'blockName');
        Reflect.deleteProperty(item, 'block');
        Reflect.deleteProperty(item, 'floor');
      });
      // console.log('newArr : ', newArr);

      const obj = {};
      obj.detailsParamList = newArr;
      obj.requestNo = requestNo;

      Loading.show();
      ipassignAPI.ipUpdateN3Save(obj).then((result) => {
        if (result.data.code === 200) {
          ipassignAPI
            .ipUpdateApproval({ requestNo, remark, flag: state })
            .then((res) => {
              if (res?.data?.code === 200) {
                console.log('es?.data?: ', res?.data?.data);
                history.push('/action');
                CommonTip.success('Success');
              }
            })
            .finally(() => {
              Loading.hide();
            });
        }
      });
    } else {
      // rejuect
      if (remark === '' || remark === null) {
        // console.log('remark ...null', remark);
        CommonTip.warning('Please make remark for reject');
        setOpen(false);
        return;
      }
      if (remark !== '' && remark !== null) {
        // console.log('remark: good', remark);
        Loading.show();
        ipassignAPI
          .ipUpdateApproval({ requestNo, remark, flag: state })
          .then((res) => {
            if (res?.data?.code === 200) {
              // console.log('es?.data?: ', res?.data?.data);
              history.push('/action');
              CommonTip.success('Success');
            }
          })
          .finally(() => {
            Loading.hide();
          });
      }
    }
  };

  return (
    <Grid container>
      <Grid {...FormControlProps} xs={12}>
        <Typography variant="h6">
          <strong style={{ color: useWebDPColor().title }}> </strong>
        </Typography>
      </Grid>
      <Grid {...FormControlProps} xs={12}>
        <TextField
          variant="outlined"
          label="Remarks"
          multiline
          fullWidth
          disabled={isDetail || formStatus === 1}
          minRows={5}
          name="remark"
          value={remark || ''}
          onChange={handleChange}
        />
      </Grid>

      {isApproval && (
        <Grid {...FormControlProps} xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={formStatus === 1}
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              handleClickOpen();
              setState(true);
            }}
          >
            Approval
          </Button>

          <Button
            variant="contained"
            color="secondary"
            disabled={formStatus === 1 || remark === ''}
            onClick={() => {
              handleClickOpen();
              setState(false);
            }}
            style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}
          >
            Reject
          </Button>

          <WarningDialog
            open={open}
            handleConfirm={handleRequest}
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
