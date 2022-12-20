import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import useWebDPColor from '../../../../../../hooks/webDP/useWebDPColor';

const WebdpStepper = ({ stepNo, stepName, date, avoid, downS, ...rest }) => {
  const color = useWebDPColor();
  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        zIndex: 1,
        '&::after': {
          content: `''`,
          position: 'absolute',
          backgroundColor: 'red',
          height: '50px',
          width: '50px'
        },
        ...rest.style
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          // backgroundColor: date ? color.typography : color.title, 假的
          // backgroundColor: date ? '#155151' : avoid === 1 ? 'red' : '#bfbfbf',
          backgroundColor: avoid === 1 ? 'red' : date ? '#155151' : '#bfbfbf',
          textAlign: 'center',
          borderRadius: '50%',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 'bold',
          alignItems: 'center',
          zIndex: 1,
          position: 'absolute'
        }}
      >
        {/* {date ? <CheckIcon fontSize="small" /> : } */}
        {avoid === 1 ? (
          <ClearIcon fontSize="small" />
        ) : date ? (
          <CheckIcon fontSize="small" />
        ) : (
          stepNo
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          width: '100px',
          textAlign: 'center',
          // color: color.typography
          color: date ? color.typography : '#bfbfbf',
          top: downS ? '50px' : ''
        }}
      >
        {stepName}
      </div>
      <div
        style={{
          position: 'absolute',
          top: downS ? '-40px' : '50px',
          width: '125px',
          textAlign: 'center',
          color: color.typography
        }}
      >
        {date}
      </div>
    </div>
  );
};

export default WebdpStepper;
