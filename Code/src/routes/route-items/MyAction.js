import getIcons from '../../utils/getIcons';
import MyAction from '../../pages/myaction/components/List';
import Detail from '../../pages/myaction/components/Detail';

const Action = {
  id: 'My Action',
  name: 'My Action',
  path: '/action',
  component: MyAction,
  icon: getIcons('workflowIcon'),
  children: [
    {
      id: 'My Action',
      name: 'My Action',
      path: '/action',
      component: MyAction
    },
    {
      id: 'Detail',
      name: 'Detail',
      path: '/action/detail/:requestId/:apptype',
      component: Detail
    }
  ]
};

export default Action;
