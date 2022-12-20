import React, { memo, useEffect } from 'react';
import { makeStyles, Drawer, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import { useDispatch } from 'react-redux';
// import { resetWebdp } from '../../../../../redux/webDP/webDP-actions';
import DPForm from '../../../../myaction/components/Detail/index4Meeting'; // for DP AP

const useStyles = makeStyles((theme) => ({
  list: {
    '& .MuiDrawer-paperAnchorRight': {
      width: '80%'
    }
  },
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(0, 5)
  }
}));

const CallrequestForm = (props) => {
  const { apptype, requestNo, callFormOpen, setCallFormClose } = props;
  console.log('CallrequestForm', apptype, requestNo);
  const classes = useStyles();
  // const dispatch = useDispatch();

  const toggleDrawer = () => {
    // dispatch(resetWebdp());

    setCallFormClose(false);
  };

  const LoadingComponents = (apptype, requestNo) => {
    console.log('LoadingComponents', apptype, requestNo);
    return <DPForm apptype={apptype} requestId={requestNo} />;
  };

  useEffect(() => {}, [apptype, requestNo]);

  return (
    <Drawer
      anchor="right"
      open={callFormOpen}
      onClose={toggleDrawer}
      classes={{ root: classes.list }}
    >
      <div className={classes.headerStyle}>
        <Typography variant="h4"> Source Form</Typography>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon style={{ color: '#fff' }} />
        </IconButton>
      </div>
      <div>{LoadingComponents(apptype, requestNo)}</div>
    </Drawer>
  );
};
export default memo(CallrequestForm);
