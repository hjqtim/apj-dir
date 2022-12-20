import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DeashboardDetail from '../../pages/Dashboard';

const Dashboard = {
  id: 'Dashboard',
  name: 'Dashboard',
  path: '/dashboard',
  icon: <DashboardIcon />,
  component: DeashboardDetail,
  children: null
};

export default Dashboard;
