import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { auth as authRoutes } from './index';
import { authRoute, getUser } from '../utils/auth';

import DashboardLayout from '../layouts/Dashboard';
import Page404 from '../pages/auth/Page404';
import ProtectedRoute from './ProtectedRoute';
// import SignIn from '../pages/auth/SignIn';

// const childRoutes = (Layout, routes) =>
//   routes.map(({ children, path, component: Component }, index) =>
//     children ? (
//       // Route item with children
//       children.map(({ path, component: Component }, index) => (
//         <Route
//           key={index}
//           path={path}
//           exact
//           render={(props) => (
//             <Layout>
//               {/* {
//                 authRoute(path) ? <Component {...props} /> : <Redirect to={{ path: '/auth/sign-in' }} />
//               } */}
//               <Component {...props} />
//             </Layout>
//           )}
//         />
//       ))
//     ) : (
//       // Route item without children
//       <Route
//         key={index}
//         path={path}
//         exact
//         render={(props) => (
//           <Layout>
//             {authRoute(path) ? (
//               <Component {...props} />
//             ) : (
//               <Redirect to={{ path: '/auth/sign-in' }} />
//             )}
//           </Layout>
//         )}
//       />
//     )
//   );

const Routes = () => (
  // here is the root level routing logic, check login here
  <Switch>
    <Route path="/" exact render={() => <Redirect to="/action" />} />
    {/* non protected route, e.g. login page */}
    {authRoutes[0].children.map((item) => (
      <Route key={item.name} path={item.path} component={item.component} />
    ))}

    {/* root page routing when isLogin = ture, the child routes are put in DashboardLayout component */}
    <ProtectedRoute path="/" isLogin={authRoute(getUser().username)} component={DashboardLayout} />
    {/* {childRoutes(DashboardLayout, dashboardRoutes)}
    {childRoutes(AuthLayout, authRoutes)} */}

    {/* route for the page was not found */}
    <Route component={Page404} />
  </Switch>
);

export default Routes;
