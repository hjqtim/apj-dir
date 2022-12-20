import React from 'react';
import CloudDoneIcon from '@material-ui/icons/CloudDone';

import NetworkCoverage from '../../pages/NetworkInformation/NetworkCoverage';
import Equipment from '../../pages/NetworkInformation/Equipment';
import CablingSystem from '../../pages/NetworkInformation/CablingSystem';
import CheckDataPortStatus from '../../pages/NetworkInformation/CheckDataPortStatus';
import SearchEndPointDeviceLocation from '../../pages/NetworkInformation/SearchEndPointDeviceLocation';
import NetworkCloset from '../../pages/NetworkInformation/NetworkCloset';
import EquipmentReplaceDetail from '../../pages/NetworkInformation/EquipmentReplaceDetail';

const NetworkInformation = {
  id: 'Network Information',
  name: 'Network Information',
  path: '/NetworkInformation',
  icon: <CloudDoneIcon />,
  children: [
    {
      name: 'Network Coverage',
      path: '/NetworkInformation/NetworkCoverage',
      component: NetworkCoverage
    },
    {
      name: 'Network Closet',
      path: '/NetworkInformation/NetworkCloset',
      component: NetworkCloset
    },
    {
      name: 'Equipment',
      path: '/NetworkInformation/Equipment',
      component: Equipment
    },
    {
      name: 'Replace Equipment',
      path: '/NetworkInformation/Replace/:requestNo',
      component: EquipmentReplaceDetail
    },
    {
      name: 'Cabling System',
      path: '/NetworkInformation/CablingSystem',
      component: CablingSystem
    },
    {
      name: 'Password Generation & Retrieval System',
      path: 'http://wtstapp35a/hs/scripts/switchpwdgen/mainPage.html?ActiveMainMenuIndex=3',
      component: CablingSystem,
      isBlank: true
    },
    {
      name: 'Check Data Port Status',
      path: '/NetworkInformation/CheckDataPortStatus',
      component: CheckDataPortStatus
    },
    {
      name: 'Search End Point Device Location',
      path: '/NetworkInformation/SearchEndPointDeviceLocation',
      component: SearchEndPointDeviceLocation
    }
  ]
};

export default NetworkInformation;
