import React from 'react';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import CheckDataPortStatus from '../../pages/HardwardStatus/CheckDataPortStatus';
import SearchEndPointDeviceLocation from '../../pages/HardwardStatus/SearchEndPointDeviceLocation';
import SearchPDUInformation from '../../pages/HardwardStatus/SearchPDUInformation';
import NetworkCoverage from '../../pages/HardwardStatus/NetworkCoverage';
// import ExternalNetworkInterfaceCoverage from '../../pages/HardwardStatus/ExternalNetworkInterfaceCoverage';
// import WiredlessNetworkCoverage from '../../pages/HardwardStatus/WiredlessNetworkCoverage';
// import WiredNetworkCoverage from '../../pages/HardwardStatus/WiredNetworkCoverage';

const HardwardStatus = {
  id: 'Information',
  name: 'Information',
  path: '/hardwardstatus',
  icon: <PermDataSettingIcon />,
  children: [
    {
      name: 'Check Data Port Status',
      path: '/hardwardstatus/CheckDataPortStatus',
      component: CheckDataPortStatus
    },
    {
      name: 'Search End Point DeviceLocation',
      path: '/hardwardstatus/SearchEndPointDeviceLocation',
      component: SearchEndPointDeviceLocation
    },
    {
      name: 'Search PDU Information',
      path: '/hardwardstatus/SearchPDUInformation',
      component: SearchPDUInformation
    },
    {
      name: 'Network Coverage',
      path: '/hardwardstatus/NetworkCoverage',
      component: NetworkCoverage
    }
    // {
    //   name: 'Wiredless Network Coverage',
    //   path: '/hardwardstatus/WiredlessNetworkCoverage',
    //   component: WiredlessNetworkCoverage
    // },
    // {
    //   name: 'Wired Network Coverage',
    //   path: '/hardwardstatus/WiredNetworkCoverage',
    //   component: WiredNetworkCoverage
    // },
    // {
    //   name: 'External Network Interface Coverage',
    //   path: '/hardwardstatus/ExternalNetworkInterfaceCoverage',
    //   component: ExternalNetworkInterfaceCoverage
    // }
  ]
};

export default HardwardStatus;
