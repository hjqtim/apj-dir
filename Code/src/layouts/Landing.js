import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { CssBaseline } from '@material-ui/core';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.body.background};
  }
`;

function Landing({ children }) {
  return (
    <>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </>
  );
}

export default Landing;
