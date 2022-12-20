import VM from '../../pages/resources/VM';
import IPAddress from '../../pages/resources/IPAddress';
import Network from '../../pages/resources/Network';
import Server from '../../pages/resources/Server';
import Platform from '../../pages/resources/Platform';
import LifeCycle from '../../pages/resources/LifeCycle';
import Quota from '../../pages/resources/tenantQuotaMapping';
import getIcons from '../../utils/getIcons';

const Resources = {
  id: 'Resource',
  name: 'Resource',
  path: '/resources',
  icon: getIcons('resourceIcon'),
  children: [
    {
      name: 'VM',
      path: '/resources/vm/',
      component: VM
    },
    {
      name: 'IP Address',
      path: '/resources/IPAddress/',
      component: IPAddress
    },
    {
      name: 'Network',
      path: '/resources/network/',
      component: Network
    },
    {
      name: 'Server',
      path: '/resources/server/',
      component: Server
    },
    {
      name: 'Platform',
      path: '/resources/platform/',
      component: Platform
    },
    {
      name: 'Life Cycle',
      path: '/resources/lifeCycle/',
      component: LifeCycle
    },
    {
      name: 'Quota',
      path: '/resources/quota',
      component: Quota
    }
  ]
};

export default Resources;
