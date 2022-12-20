import React, { memo, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { WarningDialog } from '../../../../components';

const ResourceBTN = ({ toSave, handleSubmit, formType, handleDel }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const orderStatus = useParams().status;
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus); // state 来判断 流程的进度
  // console.log('ResourceBTN', formType, resourceStatus);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  return (
    <>
      <Grid container>
        <Grid item md={4} lg="auto">
          {orderStatus === 'detail' || resourceStatus === 'detailSubmited' ? null : (
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
              Submit
            </Button>
          )}

          {formType === 'make' ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              style={{ fontWeight: 'bold', marginRight: 10 }}
              onClick={(_) => {
                // 缓冲reducer
                setTimeout(() => {
                  toSave(_, formType);
                }, 300);
              }}
            >
              Save
            </Button>
          ) : null}

          {formType === 'detail' && resourceStatus === 'detailSaved' ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              style={{ fontWeight: 'bold', marginRight: 10 }}
              onClick={(_) => {
                // 缓冲reducer
                setTimeout(() => {
                  toSave(_, formType, resourceStatus);
                }, 300);
              }}
            >
              Update
            </Button>
          ) : null}

          {formType === 'detail' && resourceStatus === 'detailSaved' ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              style={{ fontWeight: 'bold', marginRight: 10 }}
              onClick={(_) => {
                // 缓冲reducer
                setTimeout(() => {
                  handleClickOpen2(_);
                }, 200);
              }}
            >
              Delete
            </Button>
          ) : null}
        </Grid>
      </Grid>
      <WarningDialog
        open={open}
        title="Submitting Application"
        handleConfirm={(_) => {
          handleSubmit(_, formType);
          handleClose();
        }}
        handleClose={handleClose}
        ConfirmText="Submit"
        content="Submit the application."
      />
      <WarningDialog
        open={open2}
        title="Delete Application"
        handleConfirm={(_) => {
          handleClose2();
          handleDel(_);
        }}
        handleClose={handleClose2}
        ConfirmText="Delete"
        content="Delete the application."
      />
    </>
  );
};
export default memo(ResourceBTN);
