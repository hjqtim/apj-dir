import React from 'react';
import { Typography, Divider as MuiDivider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import HAInput from '../HAInput';
import HASelect from '../HASelect/HASelect';
import HADatePicker from '../HADatePicker/HADatePicker';

const Divider = styled(MuiDivider)(spacing);

export default function HAForm(props) {
  const {
    dataList,
    onChange,
    titleLevel,
    formTitle,
    hideTitle,
    defaultValues,
    htmlId,
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
                return (
                  <div className={classes.grid} key={`${el.fieldName}_${i}`}>
                    <HASelect
                      id={el.fieldName}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      isNew={isNew}
                      onChange={onChange}
                      label={el.fieldDisplayName}
                      valueField={el.valueField}
                      labelField={el.labelField}
                      required={el.required}
                      itemList={el.itemList}
                    />
                  </div>
                );
              case 'date':
                return (
                  <div className={classes.grid} key={`${el.fieldName}_${i}`}>
                    <HADatePicker
                      id={el.fieldName}
                      onChange={onChange}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                );
              default:
                return (
                  <div className={classes.grid} key={`${el.fieldName}_${i}`}>
                    <HAInput
                      id={el.fieldName}
                      onBlur={onChange}
                      showRequest={el.showRequest}
                      defaultValue={defaultValues ? defaultValues[el.fieldName] : null}
                      label={el.fieldDisplayName}
                      required={el.required}
                    />
                  </div>
                );
            }
          })}
      </div>
      <div id={htmlId} />
    </div>
  );
}
