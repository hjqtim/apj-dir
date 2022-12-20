import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import { WarningDialog } from '../../../../../components';

const SubmitButton = (props) => {
  const { handleSubmit } = props;
  const [open, setOpen] = useState(false);
  const formType = useSelector((state) => state.webDP.formType);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const webDPColor = useWebDPColor();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setOpen(false);
    handleSubmit();
  };

  return (
    <>
      <WarningDialog
        open={open}
        title={`Submitting ${formType} Application`}
        handleConfirm={formSubmitHandler}
        handleClose={handleClose}
        ConfirmText="Submit"
        content="Submit for cost estimation."
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckIcon />}
        style={{ fontWeight: 'bold', backgroundColor: webDPColor, color: 'white' }}
        onClick={handleClickOpen}
      >
        Submit
      </Button>
    </>
  );
};

export default SubmitButton;
