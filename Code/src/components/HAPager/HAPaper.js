import React from 'react';
import { Paper as MuiPaper } from '@material-ui/core';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';

let Paper = styled(MuiPaper)(spacing);
Paper = styled(Paper)`
  border-radius: 1em;
  margin-top: 10px;
`;

function HAPaper(props) {
  const style = props.style ? props.style : {};
  return <Paper style={style}>{props.children}</Paper>;
}

export default HAPaper;
