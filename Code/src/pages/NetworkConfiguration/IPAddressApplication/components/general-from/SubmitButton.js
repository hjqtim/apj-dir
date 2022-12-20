import React, { useState, memo } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import { WarningDialog, CommonTip, Loading } from '../../../../../components';
import useValidationIPForm from './useValidationIPForm';
import TouchModel, { itemTouch } from '../../../../../models/ipaddr/TouchModel';
import { setTouch } from '../../../../../redux/IPAdreess/ipaddrActions';
import ipassignAPI from '../../../../../api/ipassign';
import { handleValidation } from '../../../../../utils/tools';

const SubmitButton = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const titleColor = useWebDPColor().typography;
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const errors = useValidationIPForm() || {};
  const IPAdreess = useSelector((state) => state.IPAdreess) || {};
  const itemsData = useSelector((state) => state.IPAdreess?.items) || [];

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const { requester, contactPerson, projectInfo } = IPAdreess;
    // 设置 touches
    const touchesData = new TouchModel(true).genData();
    touchesData.items = [];
    itemsData.forEach(() => {
      touchesData.items.push(itemTouch(true));
    });
    dispatch(setTouch({ field: '', data: touchesData }));

    let itemErrorFlag = true;
    errors.items?.forEach((item) => {
      if (!_.isEmpty(item)) {
        itemErrorFlag = false;
      }
    });
    // 检测 errors
    if (
      _.isEmpty(errors.requesterInfo) &&
      _.isEmpty(errors.contactPerson) &&
      _.isEmpty(errors.projectInfo) &&
      itemErrorFlag
    ) {
      const data = {
        ...requester,
        ...contactPerson,
        ...projectInfo,
        ipRequestDetailsList: itemsData
      };
      Loading.show();
      ipassignAPI
        .saveIpReqeust(data)
        .then((res) => {
          if (res?.data.code === 200) {
            history.push('/request');
            CommonTip.success('Success');
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else {
      handleValidation();
    }
    setOpen(false);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" style={{ color: titleColor, margin: 15 }}>
          You will be informed of these IP Addresses on or before{' '}
          {dayjs().add(7, 'day').format('DD-MMM-YYYY')}.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          style={{
            fontWeight: 'bold',
            margin: 15
          }}
          onClick={handleClickOpen}
        >
          Submit
        </Button>

        {/* <Button
          variant="contained"
          startIcon={<SaveIcon />}
          style={{ fontWeight: 'bold' }}
          onClick={() => {}}
        >
          Save
        </Button> */}

        <WarningDialog
          open={open}
          title="Submitting Application"
          handleConfirm={formSubmitHandler}
          handleClose={handleClose}
          ConfirmText="Submit"
          content="Submit the application."
        />
      </Grid>
    </>
  );
};

export default memo(SubmitButton);
