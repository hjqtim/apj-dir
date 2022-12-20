import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';
import { useGlobalStyles } from '../../../../style';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

export default function Header(props) {
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* Subtitle */}
      <div className={clsx(globalClasses.subTitle, classes.title)}>{props.subtitle}</div>
      {/* Home Button */}
      <Button color="primary" href="/FacilityServices/GIS" variant="contained">
        <HomeIcon />
      </Button>
    </div>
  );
}
