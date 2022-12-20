import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Helmet from 'react-helmet';

import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { StylesProvider } from '@material-ui/styles';
import { ThemeProvider } from 'styled-components';
import maTheme from './theme';
import Routes from './routes/Routes';
import Platform from './pages/camunda/Platform';

function App(props) {
  const { theme } = props;
  // console.log(maTheme[theme.currentTheme]);
  const locationHref = window.location.href;
  if (locationHref.match('camunda/platform')) {
    return <Platform />;
  }
  return (
    <>
      <Helmet titleTemplate="%s | SENSE Platform" defaultTitle="SENSE Platform" />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
            <ThemeProvider theme={maTheme[theme.currentTheme]}>
              <Router>
                <Routes />
              </Router>
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </>
  );
}

export default connect((store) => ({ theme: store.themeReducer }))(App);
