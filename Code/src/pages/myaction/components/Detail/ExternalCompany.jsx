import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import { setMyBudgetHolderByMyAction } from '../../../../redux/myAction/my-action-actions';
import useSetReqManBudTouch from '../../../../hooks/webDP/useSetReqManBudTouch';

const ExternalCompany = (props) => {
  const { disabled = false } = props;
  const dispatch = useDispatch();
  const setReqManBudTouchByFiled = useSetReqManBudTouch();
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);

  const setMyBudgetHolderByField = (field, value) => {
    const newMyBudgetHolder = {
      ...myBudgetHolder,
      [field]: value
    };
    dispatch(setMyBudgetHolderByMyAction(newMyBudgetHolder));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} lg={3}>
          <WebdpTextField
            label="Company Name *"
            disabled={disabled}
            value={myBudgetHolder.extbillcompanyname}
            onBlur={() => setReqManBudTouchByFiled('extbillcompanyname')}
            error={Boolean(!myBudgetHolder.extbillcompanyname && reqManBudTouch.extbillcompanyname)}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcompanyname', e.target.value);
            }}
          />
        </Grid>
        <Grid item md={6} lg={2}>
          <WebdpTextField
            label="Contact Person *"
            value={myBudgetHolder.extbillcontactname}
            disabled={disabled}
            onBlur={() => setReqManBudTouchByFiled('extbillcontactname')}
            error={Boolean(!myBudgetHolder.extbillcontactname && reqManBudTouch.extbillcontactname)}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcontactname', e.target.value);
            }}
          />
        </Grid>
        <Grid item md={6} lg={2}>
          <WebdpTextField
            label="Phone *"
            value={myBudgetHolder.extbillcontactphone}
            disabled={disabled}
            onBlur={() => setReqManBudTouchByFiled('extbillcontactphone')}
            error={Boolean(
              myBudgetHolder.extbillcontactphone?.length !== 8 && reqManBudTouch.extbillcontactphone
            )}
            onChange={(e) => {
              const { value } = e.target;
              if (/^[0-9]*$/.test(value) && value?.length <= 8) {
                setMyBudgetHolderByField('extbillcontactphone', value);
              }
            }}
          />
        </Grid>
        <Grid item md={6} lg={5}>
          <WebdpTextField
            label="Company Address *"
            value={myBudgetHolder.extbillcompanyadd}
            disabled={disabled}
            onBlur={() => setReqManBudTouchByFiled('extbillcompanyadd')}
            error={Boolean(!myBudgetHolder.extbillcompanyadd && reqManBudTouch.extbillcompanyadd)}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcompanyadd', e.target.value);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(ExternalCompany);
