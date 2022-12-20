import React, { memo, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
// import SaveIcon from '@material-ui/icons/Save';
import { useSelector } from 'react-redux';
import { WarningDialog } from '../../../../components';

const ResourceBTN = ({ handleDone, formType }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus); // state 来判断 流程的进度

  return (
    <>
      <Grid container>
        <Grid item md={4} lg="auto">
          {resourceStatus === 'detailApproved' ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              style={{ fontWeight: 'bold', marginRight: 10 }}
              onClick={(_) => {
                // 缓冲reducer
                setTimeout(() => {
                  handleClickOpen(_);
                }, 200);
              }}
            >
              Done
            </Button>
          ) : null}
        </Grid>
      </Grid>
      <WarningDialog
        open={open}
        title="Done Application"
        handleConfirm={(_) => {
          handleClose();
          handleDone(_, formType);
        }}
        handleClose={handleClose}
        ConfirmText="Done"
        content="Done the application."
      />
    </>
  );
};
export default memo(ResourceBTN);
