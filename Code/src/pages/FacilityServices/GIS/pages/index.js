import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { useGlobalStyles } from '../../../../style';
import IndexCard from '../components/IndexCard';
import { elementTypes, locationTypes } from '../config/indexConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  iconButton: {
    padding: 10
  },
  InputBase: {
    marginLeft: theme.spacing(1),
    flex: 1
  }
}));

export default function Index() {
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  const [query, setQuery] = useState('');

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Search Bar */}
          <Paper className={classes.paper} component="form">
            <IconButton className={classes.iconButton}>
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.InputBase}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              value={query}
            />
          </Paper>
        </Grid>
        <br />
        <Grid item xs={12}>
          {/* Subtitle */}
          <div className={globalClasses.subTitle}>Location Types</div>
        </Grid>
        {/* Location Types */}
        {locationTypes
          .filter((locationType) => locationType.label.toLowerCase().includes(query.toLowerCase()))
          .map((locationType) => (
            <Grid key={locationType.label} item lg={2} md={3} sm={6} xs={12}>
              <Link to={`/FacilityServices/GIS${locationType.to}`}>
                <IndexCard img={locationType.img} label={locationType.label} />
              </Link>
            </Grid>
          ))}
        <br />
        <Grid item xs={12}>
          {/* Subtitle */}
          <div className={globalClasses.subTitle}>Element Types</div>
        </Grid>
        {/* Element Types */}
        {elementTypes
          .filter((elementType) => elementType.label.toLowerCase().includes(query.toLowerCase()))
          .map((elementType) => (
            <Grid key={elementType.label} item lg={2} md={3} sm={6} xs={12}>
              <Link to={`/FacilityServices/GIS${elementType.to}`}>
                <IndexCard img={elementType.img} label={elementType.label} />
              </Link>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
