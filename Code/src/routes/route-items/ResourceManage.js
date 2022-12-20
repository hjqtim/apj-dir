import getIcons from '../../utils/getIcons';
import ResourceApplication from '../../pages/ResourceManage/RPApplication';
import DetailApplication from '../../pages/ResourceManage/RPApplication/components/DetailApplication';

const ResourceManage = {
  id: 'Resources Management',
  name: 'Resources Management',
  path: '/resourcemanage',
  icon: getIcons('resourceIcon'),
  children: [
    {
      name: 'Resources Application',
      path: '/resourcemanage/Application/',
      component: ResourceApplication
    },
    {
      name: 'Resources Approval',
      path: '/resourcemanage/:status/:requestNo',
      component: DetailApplication
    }
  ]
};

export default ResourceManage;
