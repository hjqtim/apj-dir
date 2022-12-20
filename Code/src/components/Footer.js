import React from 'react';
import styled from 'styled-components';

import { Grid, Hidden, List, Typography } from '@material-ui/core';
// import { Grid, Hidden, List, ListItem as MuiListItem, Typography } from '@material-ui/core';

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(1) / 4}px ${(props) => props.theme.spacing(4)}px;
  background: ${(props) => props.theme.palette.common.white};
  position: relative;
`;

// const ListItem = styled(MuiListItem)`
//   display: inline-block;
//   width: auto;
//   padding-left: ${(props) => props.theme.spacing(2)}px;
//   padding-right: ${(props) => props.theme.spacing(2)}px;

//   &,
//   &:hover,
//   &:active {
//     color: #000;
//   }
// `;

function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Hidden smDown>
          <Grid item xs={12} md={6}>
            <List>
              {/* <ListItem component="a" href="#">
                <ListItemText primary="Support" />
              </ListItem>
              <ListItem component="a" href="#">
                <ListItemText primary="Help Center" />
              </ListItem>
              <ListItem component="a" href="#">
                <ListItemText primary="Privacy" />
              </ListItem>
              <ListItem component="a" href="#">
                <ListItemText primary="Terms of Service" />
              </ListItem> */}
            </List>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6} style={{ padding: '1rem' }}>
          <Typography align="right">{`© ${new Date().getFullYear()} - Hospital Authority`}</Typography>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
