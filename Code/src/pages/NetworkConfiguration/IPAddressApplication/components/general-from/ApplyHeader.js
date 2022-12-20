import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { FormHeaderProps } from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

const IPAddressApplication = () => {
  const webdpColor = useWebDPColor();

  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  return (
    <>
      <Typography {...FormHeaderProps}>
        Apply IP for Production Server, Workstations or Others
      </Typography>
      <Typography style={{ color: webdpColor?.typography }}>
        IP Address application for server to be moved in to CDC or HDC will be proceeded via{' '}
        <a
          href=" https://ias-app1/Hosting/itmovein/hw_welcome.asp"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#229FFA', textDecoration: 'none' }}
        >
          Move-in of IT Equipment System
        </a>
        {`. Please login with "corp\\${user?.username || ''}" for further arrangement.`}
      </Typography>
    </>
  );
};

export default memo(IPAddressApplication);
