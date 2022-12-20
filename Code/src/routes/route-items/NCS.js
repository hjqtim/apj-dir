import React from 'react';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import ApEquipment from '../../pages/NCS/ApEquipment';

const Ncs = {
  id: 'NCS',
  name: 'NCS',
  path: '/ncs',
  icon: <DeveloperBoardIcon />,
  children: [
    {
      name: 'AP Equipment',
      path: '/ncs/ApEquipment',
      component: ApEquipment
    }
  ]
};

export default Ncs;
