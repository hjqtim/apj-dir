import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import { setMyBudgetHolder } from '../../../../../redux/webDP/webDP-actions';
import useSetApplyReqManBud from '../../../../../hooks/webDP/useSetApplyReqManBud';

const ExternalCompany = () => {
  const dispatch = useDispatch();
  const myBudgetHolder = useSelector((state) => state.webDP.myBudgetHolder);
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const applyReqManBudTouch = useSelector((state) => state.webDP.applyReqManBudTouch);
  const setApplyReqManBudByFiled = useSetApplyReqManBud();

  const setMyBudgetHolderByField = (field, value) => {
    const newMyBudgetHolder = {
      ...myBudgetHolder,
      [field]: value
    };
    dispatch(setMyBudgetHolder(newMyBudgetHolder));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} lg={3}>
          <WebdpTextField
            label="Company Name *"
            disabled={viewOnly}
            value={myBudgetHolder.extbillcompanyname}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcompanyname', e.target.value);
            }}
            onBlur={() => setApplyReqManBudByFiled('extbillcompanyname')}
            error={Boolean(
              !myBudgetHolder.extbillcompanyname && applyReqManBudTouch.extbillcompanyname
            )}
          />
        </Grid>
        <Grid item md={6} lg={2}>
          <WebdpTextField
            label="Contact Person *"
            disabled={viewOnly}
            value={myBudgetHolder.extbillcontactname}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcontactname', e.target.value);
            }}
            onBlur={() => setApplyReqManBudByFiled('extbillcontactname')}
            error={Boolean(
              !myBudgetHolder.extbillcontactname && applyReqManBudTouch.extbillcontactname
            )}
          />
        </Grid>
        <Grid item md={6} lg={2}>
          <WebdpTextField
            label="Phone *"
            disabled={viewOnly}
            value={myBudgetHolder.extbillcontactphone}
            onChange={(e) => {
              const { value } = e.target;
              if (/^[0-9]*$/.test(value) && value?.length <= 8) {
                setMyBudgetHolderByField('extbillcontactphone', value);
              }
            }}
            onBlur={() => setApplyReqManBudByFiled('extbillcontactphone')}
            error={Boolean(
              myBudgetHolder.extbillcontactphone?.length !== 8 &&
                applyReqManBudTouch.extbillcontactphone
            )}
          />
        </Grid>
        <Grid item md={6} lg={5}>
          <WebdpTextField
            label="Company Address *"
            disabled={viewOnly}
            value={myBudgetHolder.extbillcompanyadd}
            onChange={(e) => {
              setMyBudgetHolderByField('extbillcompanyadd', e.target.value);
            }}
            onBlur={() => setApplyReqManBudByFiled('extbillcompanyadd')}
            error={Boolean(
              !myBudgetHolder.extbillcompanyadd && applyReqManBudTouch.extbillcompanyadd
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(ExternalCompany);
