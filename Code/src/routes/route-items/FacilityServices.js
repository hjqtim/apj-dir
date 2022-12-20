import React from 'react';
import SpaIcon from '@material-ui/icons/Spa';

import Facility from '../../pages/FacilityServices/Facility';
import GIS from '../../pages/FacilityServices/GIS';
import Category from '../../pages/FacilityServices/GIS/pages/elementTypes/category';
import Cluster from '../../pages/FacilityServices/GIS/pages/elementTypes/cluster';
import Status from '../../pages/FacilityServices/GIS/pages/elementTypes/status';
import Location from '../../pages/FacilityServices/GIS/pages/locationTypes/location';
import InstitutionProfile from '../../pages/FacilityServices/InstitutionProfile';

const FacilityServices = {
  id: 'Facility Services',
  name: 'Facility Services',
  path: '/FacilityServices',
  icon: <SpaIcon />,
  children: [
    {
      name: 'GIS',
      path: '/FacilityServices/GIS',
      component: GIS
    },
    {
      name: 'Locations',
      path: '/FacilityServices/GIS/Locations',
      component: Location
    },
    {
      name: 'Clusters',
      path: '/FacilityServices/GIS/clusters',
      component: Cluster
    },
    {
      name: 'Categories',
      path: '/FacilityServices/GIS/categories',
      component: Category
    },
    {
      name: 'Statuses',
      path: '/FacilityServices/GIS/statuses',
      component: Status
    },
    {
      name: 'Institution Profile',
      path: '/FacilityServices/InstitutionProfile',
      component: InstitutionProfile
    },
    {
      name: 'Facility',
      path: '/FacilityServices/Facility',
      component: Facility
    }
  ]
};

export default FacilityServices;
