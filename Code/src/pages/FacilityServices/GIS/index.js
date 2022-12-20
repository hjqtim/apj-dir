import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import Category from './pages/elementTypes/category';
import Cluster from './pages/elementTypes/cluster';
import Status from './pages/elementTypes/status';
import Index from './pages/index';
import Location from './pages/locationTypes/location';

export default function Gis() {
  return (
    <Switch>
      {/* Index */}
      <Route component={Index} path="/FacilityServices/GIS" exact />
      {/* Location Types */}
      <Route component={Location} path="/FacilityServices/GIS/locations" />
      {/* Element Types */}
      <Route component={Cluster} path="/FacilityServices/GIS/clusters" />
      <Route path="/FacilityServices/GIS/institutions" />
      <Route component={Category} path="/FacilityServices/GIS/categories" />
      <Route path="/FacilityServices/GIS/sites" />
      <Route path="/FacilityServices/GIS/building-zones" />
      <Route path="/FacilityServices/GIS/buildings" />
      <Route path="/FacilityServices/GIS/floor-zones" />
      <Route path="/FacilityServices/GIS/floors" />
      <Route path="/FacilityServices/GIS/rooms" />
      <Route component={Status} path="/FacilityServices/GIS/statuses" />
      {/* Exceptions */}
      <Route component={Page404} />
    </Switch>
  );
}
