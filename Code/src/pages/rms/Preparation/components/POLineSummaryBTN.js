import React, { useState, memo } from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import { WarningDialog } from '../../../../components';
import ActionLogs from './ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4)
  }
}));

const POLineButton = (props) => {
  const { undoLast, record = [], handleUndoAll } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleConfirm = () => {
    handleUndoAll();
    setOpen(false);
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 6 };
  return (
    <>
      <Grid container>
        <Grid {...commonProps} />

        <Grid {...commonProps}>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Action Log
            </Button>

            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<RestoreIcon />}
              onClick={() => setOpen(true)}
              disabled={!record.length}
            >
              Undo All
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<UndoIcon />}
              onClick={undoLast}
              disabled={!record.length}
            >
              Undo Last
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={() => setOpen(false)}
        content="All the changes will be recovered. Are you sure to continue?"
      />

      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'poLineItem' }} />
    </>
  );
};

export default memo(POLineButton);
