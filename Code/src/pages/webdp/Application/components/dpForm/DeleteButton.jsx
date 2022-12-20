import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { updateApDpDetails } from '../../../../../redux/webDP/webDP-actions';
import { WarningDialog } from '../../../../../components';

const DeleteButton = ({ index, dfi }) => {
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const formType = useSelector((state) => state.webDP.formType);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const fieldsUpdateHandler = (e) => {
    dispatch(updateApDpDetails(e, dfi));
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        size="small"
        startIcon={<DeleteIcon />}
        onClick={handleClickOpen}
        disabled={viewOnly}
      >
        <strong>Delete</strong>
      </Button>
      <WarningDialog
        open={open}
        title="Attention!"
        handleConfirm={(e) => {
          e = { ...e, currentTarget: { ...e?.currentTarget, id: `${index}-removeItem` } };
          fieldsUpdateHandler(e);
        }}
        handleClose={handleClose}
        content={`The selected row of ${
          formType === 'DP' ? 'Data Port' : 'WLAN AP'
        } Request Information will be removed, and the operation
          could not be fall back! Are you sure to continue?`}
      />
    </>
  );
};

export default DeleteButton;
