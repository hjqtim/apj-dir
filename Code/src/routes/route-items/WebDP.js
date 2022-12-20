import React from 'react';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import ApApplicationForm from '../../pages/webdp/Application/ApApplicationForm';
import DpApplicationForm from '../../pages/webdp/Application/DpApplicationForm';
import WebdpDraft from '../../pages/webdp/MyDraft';
// import WebdpMyApproval from '../../pages/webdp/MyApproval';
import DERequestForm from '../../pages/webdp/DERequestForm';
import Looping from '../../pages/webdp/Looping';
import LoopingDetail from '../../pages/webdp/Looping/Detail';

const WebDP = {
  id: 'Web DP',
  name: 'Web DP',
  path: '/webdp',
  icon: <QueryBuilderIcon />,
  children: [
    {
      name: 'AP Application',
      path: '/webdp/apForm',
      component: ApApplicationForm
    },
    {
      name: 'DP Application',
      path: '/webdp/dpForm',
      component: DpApplicationForm
    },
    {
      name: 'D/E Data Port',
      path: '/webdp/myDEForm',
      component: DERequestForm
    },
    {
      name: 'Looping Protection Detail',
      path: '/webdp/looping/detail/:requestNo',
      component: LoopingDetail,
      isHidden: true
    },
    {
      name: 'Looping Protection',
      path: '/webdp/looping',
      component: Looping
    },
    {
      name: 'My Draft',
      path: '/webdp/mydraft',
      component: WebdpDraft
    }
  ]
};

export default WebDP;
