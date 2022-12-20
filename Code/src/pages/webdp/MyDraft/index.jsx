// // import React from 'react';

// // const index = () => {
// //   const a = 'a';
// //   return (
// //     <>
// //       <div>Request ID</div>
// //       <div>Status</div>
// //       <div>Submttion Date</div>
// //       <div>Responsible Staff</div>
// //       <div>Approval Manager</div>
// //       <div>Approval Status</div>
// //       <div>Action</div>
// //     </>
// //   );
// // };

import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Detail } from './components';
import List from './components/List';
// import { L } from '../../../utils/lang';
import Page404 from '../../auth/Page404';

// const path = '/webdp/request';
// const parentTitle = L('My Request');
// const title = 'My Data Port Installation Request';

function MyRequest() {
  // const props = {
  //   path,
  //   title,
  //   parentTitle,
  //   List,
  //   Detail
  // };
  return (
    <Switch>
      {/* <CommonPage {...props} /> */}
      <Route path="/webdp/mydraft/" exact component={List} />
      <Route component={Page404} />
    </Switch>
  );
}

export default MyRequest;
