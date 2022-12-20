import React from 'react';
import GradientIcon from '@material-ui/icons/Gradient';

import VM from '../../pages/resources/VM';
import Server from '../../pages/resources/Server';

const PlatformResources = {
  id: 'Platform Resources',
  name: 'PlatformResources',
  path: '/PlatformResources',
  icon: <GradientIcon />,
  children: [
    {
      name: 'VM Provisioning',
      path: '/resources/vm/',
      component: VM
    },
    {
      name: 'Server',
      path: '/resources/server/',
      component: Server
    }
  ]
};

export default PlatformResources;
