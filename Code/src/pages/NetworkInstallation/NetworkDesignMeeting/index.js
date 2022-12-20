import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import MeetingList from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/NetworkInstallation/NetworkDesignMeeting" exact component={MeetingList} />
      <Route component={Page404} />
    </Switch>
  );
}
