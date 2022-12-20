import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    backgroundImage: (props) =>
      props.img &&
      `linear-gradient(rgba(15, 62, 91, 0.5), rgba(15, 62, 91, 0.5)), url(${props.img})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    border: '1px solid #dae0e9',
    borderRadius: '12px',
    cursor: 'pointer',
    flexGrow: 1,
    paddingTop: '75%' /* 4:3 Aspect Ratio */,
    position: 'relative',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      backgroundImage: (props) =>
        props.img &&
        `linear-gradient(rgba(10, 43, 63, 0.5), rgba(10, 43, 63, 0.5)), url(${props.img})`
    }
  },
  content: {
    color: theme.palette.primary.contrastText,
    left: '50%',
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}));

export default function IndexCard(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h3">{props.label}</Typography>
      </div>
    </div>
  );
}
