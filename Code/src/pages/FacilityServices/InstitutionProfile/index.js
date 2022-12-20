import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AddressBook from './components/index';
import Page404 from '../../auth/Page404';

function AddressBookHosp() {
  return (
    <Switch>
      <Route path="/FacilityServices/InstitutionProfile" exact component={AddressBook} />
      <Route component={Page404} />
    </Switch>
  );
}

export default AddressBookHosp;
