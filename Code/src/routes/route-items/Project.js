import React from 'react';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import ProjectList from '../../pages/project/ProjectList';

const Project = {
  id: 'Project',
  name: 'Project',
  path: '/project',
  icon: <ReceiptOutlinedIcon />,
  component: ProjectList,
  children: null
  // children: [
  //   {
  //     name: 'Project List',
  //     path: '/project/list',
  //     component: ProjectList
  //   }
  // ]
};

export default Project;
