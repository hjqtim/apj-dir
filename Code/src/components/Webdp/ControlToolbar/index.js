import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PrintIcon from '@material-ui/icons/Print';
import { Delete } from '@material-ui/icons';
import APTemplate from '../../../pages/myrequest/components/Detail/template/APTemplate';
import DPTemplate from '../../../pages/myrequest/components/Detail/template/DPTemplate';
import { setViewOnly } from '../../../redux/webDP/webDP-actions';
import { WarningDialog, CommonTip } from '../../index';
import webdpAPI from '../../../api/webdp/webdp';
// import CancelBtn from '../CancelBtn';
// import PendingBtn from '../PendingBtn';

const ControlToolbar = (props) => {
  const { isMyAction = false, isMyRequest = false } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const formType = useSelector((state) => state.webDP.formType);
  const APDPForm = useSelector((state) => state.webDP.requestAll);
  const status = useSelector((state) => state.webDP.status);
  const readOnly = useSelector((state) => state.webDP.requestAll.readOnly);
  const requestNo = useSelector((state) => state.webDP.requestNo);
  const [open, setOpen] = useState(false);
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isN3, isN4, isN5 } = requestForm || {};

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleClickOpen = () => {
    handlePrint();
  };

  const editHandler = () => {
    dispatch(setViewOnly(false));
  };

  const deleteHandler = () => {
    setOpen(true);
  };

  const copyFormHandler = () => {
    if (formType === 'AP') {
      history.push(`/webdp/apForm`, { requestNo });
    } else {
      history.push(`/webdp/dpForm`, { requestNo });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    webdpAPI.deleteApplication(requestNo).then((deleteRes) => {
      if (deleteRes?.data?.code === 200) {
        CommonTip.success('Success');
        handleClose();
        setTimeout(() => {
          history.goBack();
        }, 1000);
      }
    });
  };

  const getEditShow = () => {
    if (readOnly) {
      return false;
    }

    if (isMyRequest && status === 'Saved') {
      return true;
    }

    if (isMyAction && APDPForm.dpRequest?.dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return true;
      }
    }

    return false;
  };

  const getDeleteShow = () => {
    if (readOnly) {
      return false;
    }

    if (isMyRequest && status === 'Saved') {
      return true;
    }

    return false;
  };

  return (
    <Grid
      container
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '1rem'
      }}
    >
      {getEditShow() && (
        <Tooltip title="Edit" placement="top">
          <IconButton onClick={editHandler}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {getDeleteShow() && (
        <Tooltip title="Delete" placement="top">
          <IconButton onClick={deleteHandler}>
            <Delete color="primary" />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Copy" placement="top">
        <IconButton onClick={copyFormHandler}>
          <FileCopyIcon color="primary" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Print" placement="top">
        <IconButton onClick={handleClickOpen}>
          <PrintIcon color="primary" />
        </IconButton>
      </Tooltip>

      {/* {isMyRequest && <CancelBtn isMyRequest={isMyRequest} />}

      {isMyRequest && <PendingBtn isMyRequest={isMyRequest} />} */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          {formType === 'AP' ? <APTemplate data={APDPForm} /> : <DPTemplate data={APDPForm} />}
        </div>
      </div>

      {/* delete dialog */}
      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Are you sure you want to permanently delete ${requestNo}?`}
      />
    </Grid>
  );
};

export default ControlToolbar;
