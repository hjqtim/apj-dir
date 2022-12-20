import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ApProgressBar from './ApProgressBar';
import DpProgressBar from './DpProgressBar';
import API from '../../../api/webdp/webdp';

const ProgressBar = (props) => {
  let { requestId } = useParams();
  if (props.requestId !== null || props.requestId !== '') {
    requestId = props.requestId;
  }

  const [status, setStatus] = useState([]);
  // const [clientWidth, setClientWidth] = useState(document.body.clientWidth);
  // const [scaleValue, setScaleValue] = useState(1);

  const { clientWidth } = document.body;
  let scaleValue = 1;
  if (clientWidth < 1820) {
    scaleValue = 0.8;
  }
  if (clientWidth < 1200) {
    scaleValue = 0.6;
  }
  if (clientWidth < 1000) {
    scaleValue = 0.5;
  }

  useEffect(() => {
    if (requestId) {
      API.getStatus(requestId).then((res) => {
        // console.log('Progress Bar ', res);
        setStatus(res?.data.data);
      });
    }
  }, []);
  const formType = useSelector((state) => state.webDP.formType);

  return (
    <Grid container style={{ margin: '1rem 0', transform: `scale(${scaleValue})` }}>
      {/* <Grid container style={{ margin: '1rem 0', transform: `scale(0.8)` }}> */}
      {formType === 'DP' ? <DpProgressBar status={status} /> : <ApProgressBar status={status} />}
    </Grid>
  );
};

export default ProgressBar;
