import ADGroup from '../../pages/aaa-service/ADGroup';
import User from '../../pages/aaa-service/User';
import Tenant from '../../pages/aaa-service/Tenant';
import Expiry from '../../pages/aaa-service/Expiry';
import getIcons from '../../utils/getIcons';

const AAA = {
  id: 'AAA Service',
  name: 'AAA Service',
  path: '/AAAService',
  icon: getIcons('aaaServiceIcon'),
  children: [
    {
      name: 'AD Group',
      path: '/AAAService/adGroup',
      component: ADGroup
    },
    {
      name: 'User Profile',
      path: '/AAAService/user',
      component: User
    },
    {
      name: 'Tenant',
      path: '/AAAService/tenant',
      component: Tenant
    },
    {
      name: 'Expiry',
      path: '/AAAService/expiry',
      component: Expiry
    }
  ]
};

export default AAA;
