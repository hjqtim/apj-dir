import React, { useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import WebdpStepper from '../../../../components/Webdp/ProgressBar/WebdpStepper';
import API from '../../../../api/webdp/webdp';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '60px 0'
  },
  main: {
    '&::before': {
      content: `''`,
      width: '950px',
      height: '5px',
      backgroundColor: '#078080',
      position: 'absolute',
      transform: 'translateX(-475px)'
    }
  }
}));

const ProgressBar = () => {
  const { requestNo } = useParams();
  const [statusDate, setStatusDate] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (requestNo) {
      API.getProgressBarByRequestNo(requestNo).then((res) => {
        let obj = {};
        const rewsData = res?.data?.data || [];
        rewsData.forEach((item) => {
          obj = { ...obj, [item.processNode]: item.date };
        });
        setStatusDate(obj);
      });
    }
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.main} />

      <WebdpStepper
        stepNo={1}
        stepName="Application Submitted"
        date={statusDate?.Submitted || ''}
        style={{ position: 'absolute', transform: 'translateX(-500px)' }}
      />

      <WebdpStepper
        stepNo={2}
        stepName="System Verification"
        style={{ position: 'absolute', transform: 'translateX(-254px)' }}
        date={statusDate?.[`System Verification`] || ''}
      />

      <WebdpStepper
        stepNo={3}
        stepName="N3 Verification"
        date={statusDate?.[`N3 Verification`] || ''}
        style={{ position: 'absolute', transform: 'translateX(-33px)' }}
        avoid={statusDate?.[`Request Rejected`] ? 1 : 0}
      />

      <WebdpStepper
        stepNo={4}
        stepName="Configuration"
        date={statusDate?.Configuration || ''}
        style={{ position: 'absolute', transform: 'translateX(199px)' }}
      />
      <WebdpStepper
        stepNo={5}
        stepName="Request Completed"
        date={statusDate?.[`Request Completed`] || ''}
        style={{ position: 'absolute', transform: 'translateX(450px)' }}
      />
    </div>
  );
};

export default memo(ProgressBar);
