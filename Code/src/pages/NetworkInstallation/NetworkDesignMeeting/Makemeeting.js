import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import MeetingForm from './components/IndexMeetingForm';

export default function Index() {
  return (
    <Switch>
      <Route
        path="/NetworkInstallation/NetworkDesignMeeting/addmeeting"
        exact
        component={MeetingForm}
      />
      <Route component={Page404} />
    </Switch>
  );
}
