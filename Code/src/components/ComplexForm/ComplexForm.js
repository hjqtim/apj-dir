import React from 'react';
import { Paper, Divider as MuiDivider, Button, ButtonGroup, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import FormTable from '../FormTable';
import DynamicForm from '../DynamicForm';
import CommonForm from '../CommonForm';

const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: `${theme.spacing(10)}px`,
    width: '100%'
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

export default function ComplexForm(props) {
  const { moduleList, buttonList, title, titleLevel } = props;
  const classes = useStyles();

  const formHandle = (module) => {
    const {
      formFieldList,
      onFormFieldChange,
      showBtn,
      onBtnClick,
      onFormFieldBlur,
      showHR,
      isCommon
    } = module;

    return (
      <>
        {isCommon ? (
          <CommonForm
            formFieldList={formFieldList}
            onFormFieldChange={onFormFieldChange}
            showBtn={showBtn}
            onBtnClick={onBtnClick}
            onFormFieldBlur={onFormFieldBlur}
          />
        ) : (
          <DynamicForm
            formFieldList={formFieldList}
            onFormFieldChange={onFormFieldChange}
            showBtn={showBtn}
            onBtnClick={onBtnClick}
            onFormFieldBlur={onFormFieldBlur}
          />
        )}
        {showHR && <Divider my={6} />}
      </>
    );
  };

  const tableHandle = (module) => {
    const {
      rows,
      title,
      titleLevel,
      handleDelete,
      headCells,
      fieldList,
      actionList,
      hideCreate,
      hideCheckBox,
      customCreate
    } = module;

    return (
      <>
        <div style={{ width: 1300 }}>
          <FormTable
            rows={rows}
            title={title}
            titleLevel={titleLevel}
            handleDelete={handleDelete}
            headCells={headCells}
            fieldList={fieldList}
            actionList={actionList}
            hideCreate={hideCreate}
            hideCheckBox={hideCheckBox}
            customCreate={customCreate}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant={titleLevel ? `h${titleLevel}` : 'h1'} id="tableTitle">
          {title}
        </Typography>
        <Divider my={6} />
        {moduleList &&
          moduleList.map((module, i) => {
            switch (module.type) {
              case 'form':
                return (
                  <div key={`${i}__${module.title}`} style={{ marginBottom: '5ch' }}>
                    {formHandle(module)}
                  </div>
                );
              case 'table':
                return (
                  <div key={`${i}__${module.title}`} style={{ marginBottom: '5ch' }}>
                    {tableHandle(module)}
                  </div>
                );
              default:
                return <div key={`${i}__${module.title}`} />;
            }
          })}
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
      </Paper>
    </>
  );
}
