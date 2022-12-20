import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import CombinededForm from '../../../webdp/Application/components';
import ControlToolbar from '../../../../components/Webdp/ControlToolbar';
import Loading from '../Loading';
import ProgressBar from '../../../../components/Webdp/ProgressBar';
import ActionLog from '../../../../components/Webdp/ActionLog';
import FormHeader from '../../../../components/Webdp/FormHeader';
import CostEstimation from '../../../myaction/components/Detail/CostEstimation';

import { setForm, setViewOnly } from '../../../../redux/webDP/webDP-actions';

const WebdpDetail = (props) => {
  // get request Id from path var
  let { apptype } = useParams();
  const [loading, setLoading] = useState(true);
  const status = useSelector((state) => state.webDP.status);
  let requestNo = useSelector((state) => state.webDP.requestNo);
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );

  const appTypeProps = props.apptype;
  const requestNoProps = props.requestNo;
  // console.log('WebdpDetail', appTypeProps, requestNoProps);
  if (typeof requestNoProps !== 'undefined') {
    apptype = appTypeProps;
    requestNo = requestNoProps;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    // fetch form data from api with the request id
    // dispatch the data to redux store
    // dispatch();

    // 初始化 ↓↓↓↓↓↓↓
    dispatch(setViewOnly(true)); // detail page can not edit
    dispatch(setForm(apptype));
    // 初始化 ↑↑↑↑↑↑↑↑↑

    // Loading finished
    setLoading(false);
  }, []);

  const gridStyle = {
    container: true,
    spacing: 0,
    style: {
      marginTop: '1rem',
      padding: '0.8rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      marginBottom: '30px'
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ControlToolbar isMyRequest />

          {requestNo ? <FormHeader statusNo={dprequeststatusno} /> : null}

          {status && status !== 'Saved' && (
            <>
              <Grid {...gridStyle}>
                <ProgressBar />
              </Grid>

              <Grid {...gridStyle}>
                <ActionLog />
              </Grid>
            </>
          )}

          {dprequeststatusno > 50 && (
            <Grid {...gridStyle}>
              <CostEstimation isRequest />
            </Grid>
          )}

          <CombinededForm isDetail isRequest requestId={props.requestNo} apptype={props.apptype} />
        </>
      )}
    </>
  );
};

export default WebdpDetail;
