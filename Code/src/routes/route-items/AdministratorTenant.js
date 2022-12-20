import React from 'react';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ADGroup from '../../pages/aaa-service/ADGroup';
import Tenant from '../../pages/aaa-service/Tenant';
import Quota from '../../pages/resources/tenantQuotaMapping';
import User from '../../pages/aaa-service/User';

import Grantread from '../../pages/Administrator/GrantReadOnlyRighttoOthers';
import SwitchToAnotherUser from '../../pages/Administrator/SwitchToAnotherUser';

const AdministratorTenant = {
  id: 'Administration-Tenant/User',
  name: 'AdministrationTenantUser',
  path: '/AdministrationTenantUser',
  icon: <HowToRegIcon />,
  children: [
    {
      name: 'AD Group Registration',
      path: '/AAAService/adGroup',
      component: ADGroup
    },
    {
      name: 'Tenant',
      path: '/AAAService/tenant',
      component: Tenant
    },
    {
      name: "Tenant's Quota",
      path: '/AdministrationTenant/TenantQuota',
      component: Quota
    },
    {
      name: 'User Profile',
      path: '/AAAService/user',
      component: User
    },
    {
      name: 'Read-Only Permission',
      path: '/admin/grantread',
      component: Grantread
    },
    {
      name: 'Switch to Another User',
      path: '/admin/switchtoanotheruser',
      component: SwitchToAnotherUser
    }
  ]
};

export default AdministratorTenant;
