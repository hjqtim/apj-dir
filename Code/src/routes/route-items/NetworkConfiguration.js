import React from 'react';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import DERequestForm from '../../pages/webdp/DERequestForm';
import Looping from '../../pages/webdp/Looping';
import LoopingDetail from '../../pages/webdp/Looping/Detail';
import LoopingApproval from '../../pages/webdp/Looping/Approval';
import IPAddressApplication from '../../pages/NetworkConfiguration/IPAddressApplication';
import IPAddressUpdate from '../../pages/NetworkConfiguration/IPAddressUpdate';
import Admin from '../../pages/NetworkConfiguration/Admin';
import IPAddressRelease from '../../pages/NetworkConfiguration/IPAddressRelease/Application';
import IPAddressApplicationDetail from '../../pages/NetworkConfiguration/IPAddressApplication/Detail';
import IPApproval from '../../pages/NetworkConfiguration/IPAddressApplication/IPApproval';
import IPAddressReleaseDetail from '../../pages/NetworkConfiguration/IPAddressRelease/Detail';
import IPAddressReleaseApproval from '../../pages/NetworkConfiguration/IPAddressRelease/Approval';

const NetworkConfiguration = {
  id: 'Network Configuration',
  name: 'Network Configuration',
  path: '/NetworkConfiguration',
  icon: <PermDataSettingIcon />,
  children: [
    {
      name: 'Data Port Disabling/Enabling',
      path: '/webdp/myDEForm',
      component: DERequestForm
    },
    {
      name: 'Data Port Looping Protection Approval',
      path: '/webdp/looping/approval/:requestNo',
      component: LoopingApproval,
      isHidden: true
    },
    {
      name: 'Data Port Looping Protection Detail',
      path: '/webdp/looping/detail/:requestNo',
      component: LoopingDetail,
      isHidden: true
    },
    {
      name: 'Data Port Looping Protection',
      path: '/webdp/looping',
      component: Looping,
      groups: []
    },
    {
      name: 'IP Address Update',
      path: '/IPAddress/IPAddressUpdate/:status/:requestNo',
      component: IPAddressUpdate,
      isHidden: true
    },
    {
      name: 'IP Address Update Approval',
      path: '/IPAddress/IPAddressUpdate/:status/:requestNo',
      component: IPAddressUpdate,
      isHidden: true
    },
    {
      name: 'IP Address Release Detail',
      path: '/IPAddress/IPAddressRelease/detail/:requestNo',
      component: IPAddressReleaseDetail,
      isHidden: true
    },
    {
      name: 'IP Address Release Approval',
      path: '/IPAddress/IPAddressRelease/approval/:requestNo',
      component: IPAddressReleaseApproval,
      isHidden: true
    },
    {
      name: 'IP Address Application Detail',
      path: '/IPAddress/detail/:requestNo',
      component: IPAddressApplicationDetail,
      isHidden: true
    },
    {
      name: 'IP Address Application Approval',
      path: '/IPAddress/approval/:requestNo',
      component: IPApproval,
      isHidden: true
    },
    {
      id: 'IP Address',
      name: 'IP Address',
      path: '/IPAddress',
      icon: <PermDataSettingIcon />,
      children: [
        {
          name: 'IP Address Application',
          path: '/IPAddress/IPAddressForm',
          component: IPAddressApplication
        },
        {
          name: 'IP Address Update',
          path: '/IPAddress/IPAddressUpdate',
          component: IPAddressUpdate
        },
        {
          name: 'IP Address Release',
          path: '/IPAddress/IPAddressRelease',
          component: IPAddressRelease
        },
        {
          name: 'IP Address Admin',
          path: '/IPAddress/Admin',
          component: Admin
        }
      ]
    }
  ]
};

export default NetworkConfiguration;
