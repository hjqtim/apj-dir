import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Toolbar, Tooltip, Typography, Button } from '@material-ui/core';

import { Delete as DeleteIcon, AddCircle as AddIcon } from '@material-ui/icons';

import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import DownloadDialog from '../DownloadDialog';

import { WarningDialog } from '../index';

const ToolbarTitle = styled.div`
  min-width: 400px;
`;

const Spacer = styled.div`
  flex: 1;
`;
const useStyles = makeStyles(() => ({
  addButton: {
    marginRight: -10,
    backgroundColor: '#229FFA',
    color: '#FFF',
    fontWeight: 'bold'
  },
  deleteButton: {
    marginRight: -10,
    backgroundColor: '#FD5841',
    color: 'white',
    fontWeight: 'bold'
  }
}));

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    tableName,
    createPath,
    showDownLoad,
    onDelete,
    hideCreate,
    customCreate,
    titleLevel,
    page,
    hideDelete,
    createTitle
  } = props;
  const classes = useStyles();
  const [openDelete, setOpenDelete] = useState(false);
  const [event, setEvent] = useState();

  const [open, setOpen] = useState(false);
  const history = useHistory();
  const onDownLoad = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const toCreatePage = () => {
    console.log('Yancy toCreatePage');
    customCreate ? customCreate() : history.push(createPath);
  };
  return (
    <>
      <Toolbar>
        <ToolbarTitle style={{ marginLeft: -10 }}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant={titleLevel ? `h${titleLevel}` : 'h4'} id="tableTitle">
              {tableName}
            </Typography>
          )}
        </ToolbarTitle>
        <Spacer />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            minWidth: showDownLoad ? '13em' : undefined
          }}
        >
          {showDownLoad && (
            <Tooltip title="Export">
              <Button
                variant="contained"
                size="small"
                className={classes.addButton}
                startIcon={<GetAppIcon />}
                onClick={onDownLoad}
              >
                Export
              </Button>
            </Tooltip>
          )}
          {numSelected > 0 && !hideDelete ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                size="small"
                className={classes.deleteButton}
                onClick={(event) => {
                  setOpenDelete(true);
                  setEvent(event);
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Tooltip>
          ) : !hideCreate ? (
            <Tooltip title="Create">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.addButton}
                startIcon={<AddIcon />}
                onClick={toCreatePage}
              >
                {createTitle || 'Add'}
              </Button>
            </Tooltip>
          ) : null}
        </div>
      </Toolbar>
      <DownloadDialog open={open} page={page} onClose={onClose} />
      <WarningDialog
        open={openDelete}
        handleConfirm={() => {
          setOpenDelete(false);
          onDelete(event);
        }}
        handleClose={() => setOpenDelete(false)}
        content="Are you sure you want to permanently delete this data?"
      />
    </>
  );
}

export default EnhancedTableToolbar;
