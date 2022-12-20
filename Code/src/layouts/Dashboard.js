import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Paper as MuiPaper,
  withWidth,
  AppBar,
  Drawer,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector, useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// local component and methods
import DashboardDrawer from '../components/DashboardDrawer';
import { getCurrentPage } from '../utils/url';

import NaviBar from '../components/NaviBar';
import menu from '../utils/menu';
import Page404 from '../pages/auth/Page404';
import Footer from '../components/Footer';
import UserMenu from '../components/UserMenu';
import newRoutes from '../routes/newRoutes';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: '8rem',
    width: '100%'
  }
}));

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.body.background};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const menuRoutes2 = _.cloneDeep(newRoutes);
let menuRoutes3 = [];
const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isShowMenu = useSelector((state) => state.global.isShowMenu); // 菜单显示与隐藏

  const handleMenu = () => {
    const action = {
      type: 'global/setIsShowMenu',
      payload: !isShowMenu
    };
    dispatch(action);
  };

  const [breadcrumbsList, setBreadcrumbsList] = useState([]);

  useEffect(() => {
    checkMenu();
  }, []);

  const checkMenu = () => {
    for (let i = 0; i < newRoutes.length; i += 1) {
      if (newRoutes[i]?.children !== null) {
        const child = newRoutes[i]?.children;

        for (let i2 = 0; i2 < child.length; i2 += 1) {
          if (Object.prototype.hasOwnProperty.call(child[i2], 'children')) {
            const child2 = child[i2]?.children;
            menuRoutes2[i].children = child2;
            for (let i3 = 0; i3 < child2.length; i3 += 1) {
              menuRoutes3 = [...menuRoutes3, child2[i3]];
            }
          } else {
            menuRoutes3 = [...menuRoutes3, child[i2]];
          }
        }
      } else {
        menuRoutes3 = [...menuRoutes3, newRoutes[i]];
      }
    }
    // console.log('menuRoutes3', newRoutes, menuRoutes3);
  };

  useEffect(() => {
    const { rootName, pageName, moduleName } = getCurrentPage();
    const model = [
      {
        title: menu[rootName] ? menu[rootName].name : ''
      },
      {
        title:
          menu[rootName] && menu[rootName].children[pageName]
            ? menu[rootName].children[pageName].name
            : '',

        path: () => {
          if (menu[rootName] && menu[rootName].children[pageName]) {
            return moduleName === 'List' ? '' : menu[rootName].children[pageName].path;
          }
          return '/';
        }
        // path: '/'
      }
    ];
    if (moduleName !== 'List') {
      model.push({
        title: moduleName
      });
    }
    setBreadcrumbsList(model);
    // eslint-disable-next-line
  }, [location.href]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" style={{ paddingLeft: isShowMenu ? drawerWidth : '' }}>
        <Toolbar style={{ backgroundColor: 'white' }}>
          <IconButton edge="start" onClick={handleMenu} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <UserMenu />
        </Toolbar>
        <NaviBar breadcrumbsList={breadcrumbsList} />
      </AppBar>

      <nav
        style={{ width: drawerWidth, display: !isShowMenu ? 'none' : '' }}
        aria-label="mailbox folders"
      >
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
          style={{ width: drawerWidth }}
        >
          <DashboardDrawer />
        </Drawer>
      </nav>
      {/* <AppContent> */}
      <AppContent>
        <MainContent>
          <main className={classes.content}>
            <Switch>
              {menuRoutes3?.map(
                (route, index) =>
                  route.component && (
                    <Route key={index} path={route.path} exact component={route.component} />
                  )
              )}

              {/* {newRoutes?.map((each) =>
                each.children?.map((child) => {
                  // console.log('child', child);
                  if (child?.children) {
                    const child2 = child?.children;
                    // console.log('child2', child2);
                    child2.map((child2item) => (
                      // console.log('child2item', child2item);
                      <Route
                        key={child2item.name}
                        path={child2item.path}
                        component={child2item.component}
                        exact
                      />
                    ));
                  }
                  return <Route key={child.name} path={child.path} component={child.component} />;
                })
              )} */}

              <Route component={Page404} />
            </Switch>
          </main>
        </MainContent>
        <Footer />
      </AppContent>
    </div>
  );
};

export default withWidth()(Dashboard);
