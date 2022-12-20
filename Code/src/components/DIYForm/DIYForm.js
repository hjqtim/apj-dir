import React from 'react';
import { Typography, Divider as MuiDivider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import HAInput from '../HAInput';
import HASelect from '../HASelect/HASelect';
// import HADatePicker from "../HADatePicker/HADatePicker"
import SimpleDatePicker from '../SimpleDatePicker/SimpleDatePicker';
import HACheckBox from '../HACheckBox/HACheckBox';
import HAList from '../HAList/HAList';
import HADialogList from '../HADialogList/HADialogList';
import HAInputCheck from '../HAInputCheck/HAInputCheck';

const Divider = styled(MuiDivider)(spacing);

export default function DIYForm(props) {
  const {
    dataList,
    onChange,
    titleLevel,
    formTitle,
    hideTitle,
    defaultValues,
    htmlId,
    pid,
    isNew,
    containerStyle
  } = props;
  const useStyles = makeStyles(() => ({
    containerStyle,
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      marginTop: '6vh'
    },
    grid: {
      width: '50%',
      height: '10vh',
      marginBottom: '2vh'
    },
    nonegrid: {
      width: '50%',
      height: '10vh',
      display: 'none',
      marginBottom: '2vh'
    },
    allgrid: {
      width: '100%',
      minHeight: '10vh',
      marginBottom: '4.5vh'
    },
    allnonegrid: {
      width: '100%',
      minHeight: '20vh',
      marginBottom: '4.5vh',
      display: 'none'
    }
  }));
  const classes = useStyles();

  return (
    <div className={classes.containerStyle}>
      {!hideTitle ? (
        <>
          <Typography
            variant={titleLevel ? `h${titleLevel}` : 'h2'}
            gutterBottom
            style={{ userSelect: 'none', msUserSelect: 'none' }}
          >
            {formTitle}
          </Typography>
          <Divider my={6} />
        </>
      ) : null}
      <div className={classes.flex}>
        {dataList &&
          dataList.map((el, i) => {
            switch (el.type) {
              case 'select':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.nonegrid : classes.grid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HASelect
                      id={el.fieldName}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      isNew={isNew}
                      disabled={!el.writable}
                      onChange={onChange}
                      label={el.fieldDisplayName}
                      valueField={el.valueField}
                      labelField={el.labelField}
                      required={el.required}
                      itemList={el.itemList}
                    />
                  </div>
                ) : null;
              case 'checkbox':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.allnonegrid : classes.allgrid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HACheckBox
                      id={el.fieldName}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      isNew={isNew}
                      disabled={!el.writable}
                      onChange={onChange}
                      selectChange={el.selectChange}
                      label={el.fieldDisplayName}
                      valueField={el.valueField}
                      labelField={el.labelField}
                      required={el.required}
                      itemList={el.itemList}
                    />
                  </div>
                ) : null;
              case 'date':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.nonegrid : classes.grid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <SimpleDatePicker
                      id={el.fieldName}
                      onChange={onChange}
                      disabled={!el.writable}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                ) : null;
              case 'inputCheck':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.nonegrid : classes.grid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HAInputCheck
                      id={el.fieldName}
                      onBlur={onChange}
                      disabled={!el.writable}
                      apiKey={el.apiKey}
                      apiValue={el.apiValue}
                      title={el.title}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                ) : null;
              case 'dialogList':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.allnonegrid : classes.allgrid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HADialogList
                      id={el.fieldName}
                      onBlur={onChange}
                      disabled={!el.writable}
                      apiKey={el.apiKey}
                      apiValue={el.apiValue}
                      title={el.title}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                ) : null;
              case 'list':
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.allnonegrid : classes.allgrid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HAList
                      id={el.fieldName}
                      onBlur={onChange}
                      disabled={!el.writable}
                      isCheck={el.isCheck}
                      onCheck={el.onCheck}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                ) : null;
              default:
                return (pid || el.showOnRequest) && el.readable ? (
                  <div
                    className={el.display ? classes.nonegrid : classes.grid}
                    key={`${el.fieldName}_${i}`}
                    id={`${el.fieldName}_div`}
                  >
                    <HAInput
                      id={el.fieldName}
                      onBlur={onChange}
                      disabled={!el.writable}
                      isCheck={el.isCheck}
                      onCheck={el.onCheck}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                ) : null;
            }
          })}
      </div>
      <div id={htmlId} />
    </div>
  );
}
