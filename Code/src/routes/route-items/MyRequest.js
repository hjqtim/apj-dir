import React from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';

import MyRequest from '../../pages/myrequest/components/List';
import Detail from '../../pages/myrequest/components/Detail/index';
import DetailDE from '../../pages/webdp/DERequestForm/components/index';

const Request = {
  id: 'My Request',
  name: 'My Request',
  path: '/request',
  component: MyRequest,
  icon: <PostAddIcon />,
  children: [
    {
      id: 'My Request',
      name: 'My Request',
      path: '/request',
      component: MyRequest
    },
    {
      id: 'Detail',
      name: 'Detail',
      path: '/request/detail/:requestId/:apptype',
      component: Detail
    },
    {
      id: 'DetailDE',
      name: 'DetailDE',
      path: '/webdp/deForm/detail/:apptype/:aduser/:requestNo',
      component: DetailDE
    }
  ]
};

export default Request;
