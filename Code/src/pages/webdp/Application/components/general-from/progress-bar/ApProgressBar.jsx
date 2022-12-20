import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import useWebDPColor from '../../../../../../hooks/webDP/useWebDPColor';
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
    border: '5px solid #078080',
    borderRadius: '20px',
    width: '450px',
    height: '100px',
    '&::before': {
      content: `''`,
      width: '350px',
      height: '5px',
      backgroundColor: '#078080',
      position: 'absolute',
      transform: 'translate(-355px, 45px)'
    },
    '&::after': {
      content: `''`,
      width: '150px',
      height: '5px',
      backgroundColor: '#078080',
      position: 'absolute',
      transform: 'translate(445px, 45px)'
    }
  }
}));

const ApProgressBar = ({ status }) => {
  // console.log('Bar status AP 假的', status);
  const classes = useStyles();
  // const [
  //   // saved,
  //   submitted,
  //   costEstimated,
  //   managerApproved,
  //   fundConfirmed,
  //   CablingOrderIssued,
  //   InstallationScheduled,
  //   Installed,
  //   networkServiceReady,
  //   fundTransferred
  // ] = status;
  let submitted;
  let costEstimated;
  let managerApproved;
  let fundConfirmed;

  let cablingOrderIssued;
  let installationScheduled01;
  let installationCompleted01;

  let apOrderIssued;
  let installationScheduled02;
  let installationCompleted02;

  let networkReady;
  let fundTransferred;

  let managerRejected;
  let fundRejected;

  for (let i = 0; i < status.length; i += 1) {
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

    // rejected
    if (status[i].DPRequestStatusNo === 112) {
      managerRejected = status[i];
    }
    if (status[i].DPRequestStatusNo === 122) {
      fundRejected = status[i];
    }

    // up
    if (status[i].DPRequestStatusNo === 133) {
      cablingOrderIssued = status[i];
    }
    if (status[i].DPRequestStatusNo === 134) {
      installationScheduled01 = status[i];
    }
    if (status[i].DPRequestStatusNo === 135) {
      installationCompleted01 = status[i];
    }

    // down
    if (status[i].DPRequestStatusNo === 136) {
      apOrderIssued = status[i];
    }
    if (status[i].DPRequestStatusNo === 137) {
      installationScheduled02 = status[i];
    }
    if (status[i].DPRequestStatusNo === 138) {
      installationCompleted02 = status[i];
    }

    if (status[i].DPRequestStatusNo === 139) {
      networkReady = status[i];
    }
    if (status[i].DPRequestStatusNo === 155) {
      fundTransferred = status[i];
    }
  }

  return (
    <div className={classes.root}>
      <WebdpStepper
        stepName="Application Submitted"
        stepNo={1}
        date={submitted?.date}
        style={{ position: 'absolute', transform: 'translateX(-600px)' }}
      />
      <WebdpStepper
        stepName="Cost Estimated"
        stepNo={2}
        date={costEstimated?.date}
        style={{ position: 'absolute', transform: 'translateX(-500px)' }}
      />
      <WebdpStepper
        stepName="Manager Approved"
        stepNo={3}
        date={managerApproved?.date || managerRejected?.date}
        style={{ position: 'absolute', transform: 'translateX(-400px)' }}
        avoid={managerRejected ? 1 : 0}
      />
      <WebdpStepper
        stepName="Fund Confirmed"
        stepNo={4}
        date={fundConfirmed?.date || fundRejected?.date}
        style={{ position: 'absolute', transform: 'translateX(-300px)' }}
        avoid={fundRejected ? 1 : 0}
      />

      {/* down */}
      <WebdpStepper
        stepName="AP Order Issued"
        stepNo="I"
        date={apOrderIssued?.date}
        style={{ position: 'absolute', transform: 'translate(-150px,48px)' }}
        downS
      />
      <WebdpStepper
        stepName="Installation Scheduled"
        stepNo="II"
        date={installationScheduled02?.date}
        style={{ position: 'absolute', transform: 'translateY(48px)' }}
        downS
      />
      <WebdpStepper
        stepName="Installation Completed"
        stepNo="III"
        date={installationCompleted02?.date}
        style={{ position: 'absolute', transform: 'translate(150px,48px)' }}
        downS
      />

      {/* up */}
      <WebdpStepper
        stepName="Cabling Order Issued"
        stepNo="I"
        date={cablingOrderIssued?.date}
        style={{ position: 'absolute', transform: 'translate(-150px,-48px)' }}
      />
      <WebdpStepper
        stepName="Installation Scheduled"
        stepNo="II"
        date={installationScheduled01?.date}
        style={{ position: 'absolute', transform: 'translateY(-48px)' }}
      />
      <WebdpStepper
        stepName="Installation Completed"
        stepNo="III"
        date={installationCompleted01?.date}
        style={{ position: 'absolute', transform: 'translate(150px,-48px)' }}
      />

      <div className={classes.main} />
      <WebdpStepper
        stepName="Network Service is Ready"
        stepNo={5}
        date={networkReady?.date}
        style={{ position: 'absolute', transform: 'translateX(300px)' }}
      />
      <WebdpStepper
        stepName="Fund Transferred"
        stepNo={6}
        date={fundTransferred?.date}
        style={{ position: 'absolute', transform: 'translateX(400px)' }}
      />
    </div>
  );
};

export default ApProgressBar;
