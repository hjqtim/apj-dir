import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WebdpStepper from './WebdpStepper';

// 已废弃
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

const DpProgressBar = ({ status }) => {
  console.log('Bar status 假的', status);
  const classes = useStyles();
  let submitted;
  let costEstimated;
  let managerApproved;
  let fundConfirmed;
  let cablingOrderIssued;
  let installationScheduled;
  let installationCompleted;
  let networkReady;
  let fundTransferred;

  let managerRejected;
  let fundRejected;

  for (let i = 0; i < status.length; i += 1) {
    console.log('Yancy status', i);
    if (status[i].DPRequestStatusNo === 10) {
      submitted = status[i];
    }
    if (status[i].DPRequestStatusNo === 100) {
      costEstimated = status[i];
    }
    if (status[i].DPRequestStatusNo === 110) {
      managerApproved = status[i];
    }
    if (status[i].DPRequestStatusNo === 120) {
      fundConfirmed = status[i];
    }
    if (status[i].DPRequestStatusNo === 133) {
      cablingOrderIssued = status[i];
    }
    if (status[i].DPRequestStatusNo === 134) {
      installationScheduled = status[i];
    }
    if (status[i].DPRequestStatusNo === 135) {
      installationCompleted = status[i];
    }
    if (status[i].DPRequestStatusNo === 139) {
      networkReady = status[i];
    }
    if (status[i].DPRequestStatusNo === 155) {
      fundTransferred = status[i];
    }

    // rejected
    if (status[i].DPRequestStatusNo === 112) {
      managerRejected = status[i];
      console.log('Yancy rejected');
    }
    if (status[i].DPRequestStatusNo === 122) {
      fundRejected = status[i];
    }
  }

  useEffect(() => {
    // console.log('Step bar', status);
  }, [status]);

  return (
    <div className={classes.root}>
      <WebdpStepper
        stepNo={1}
        stepName="Application Submitted"
        date={submitted?.date}
        style={{ position: 'absolute', transform: 'translateX(-500px)' }}
      />
      <WebdpStepper
        stepNo={2}
        stepName="Cost Estimated"
        date={costEstimated?.date}
        style={{ position: 'absolute', transform: 'translateX(-375px)' }}
      />
      <WebdpStepper
        stepNo={3}
        stepName="Manager Approved"
        date={managerApproved?.date || managerRejected?.date}
        style={{ position: 'absolute', transform: 'translateX(-250px)' }}
        avoid={managerRejected ? 1 : 0}
      />
      <WebdpStepper
        stepNo={4}
        stepName="Fund Confirmed"
        date={fundConfirmed?.date || fundRejected?.date}
        style={{ position: 'absolute', transform: 'translateX(-125px)' }}
        avoid={fundRejected ? 1 : 0}
      />
      <WebdpStepper
        stepNo={5}
        stepName="Cabling Order Issued"
        date={cablingOrderIssued?.date}
        style={{ position: 'absolute' }}
      />
      <div className={classes.main} />
      <WebdpStepper
        stepNo={6}
        stepName="Installation Scheduled"
        date={installationScheduled?.date}
        style={{ position: 'absolute', transform: 'translateX(125px)' }}
      />
      <WebdpStepper
        stepNo={7}
        stepName="Installation Completed"
        date={installationCompleted?.date}
        style={{ position: 'absolute', transform: 'translateX(250px)' }}
      />
      <WebdpStepper
        stepNo={8}
        stepName="Network Service is Ready"
        date={networkReady?.date}
        style={{ position: 'absolute', transform: 'translateX(375px)' }}
      />
      <WebdpStepper
        stepNo={9}
        stepName="Fund Transferred"
        date={fundTransferred?.date}
        style={{ position: 'absolute', transform: 'translateX(500px)' }}
      />
    </div>
  );
};

export default DpProgressBar;
