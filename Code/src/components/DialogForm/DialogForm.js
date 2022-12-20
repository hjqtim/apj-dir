import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  ButtonGroup
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import DynamicForm from '../DynamicForm';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    textAlign: 'center'
  },
  button: {
    marginRight: theme.spacing(10)
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20ch'
  }
}));

function DialogForm(props) {
  const {
    title,
    handleClose,
    open,
    titleLevel,
    formFieldList,
    onFormFieldChange,
    buttonList,
    isAll
  } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}> */}
            {/*  save */}
            {/* </Button> */}
          </Toolbar>
        </AppBar>
        <DynamicForm
          formTitle={title}
          titleLevel={titleLevel}
          formFieldList={formFieldList}
          onFormFieldChange={onFormFieldChange}
          isAll={isAll}
        />
        <ButtonGroup className={classes.buttonGroup}>
          {buttonList &&
            buttonList.map((el, i) => (
              <Button
                className={classes.button}
                key={`${i}__${el.id}`}
                variant="contained"
                color={el.color}
                onClick={el.onClick ? (e) => el.onClick(e, el.id) : null}
                disabled={el.disabled}
              >
                {el.label}
              </Button>
            ))}
        </ButtonGroup>
      </Dialog>
    </div>
  );
}

export default DialogForm;
