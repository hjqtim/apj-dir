import React, { memo, useEffect, useState } from 'react';
import { Grid, Typography, Switch, FormControlLabel } from '@material-ui/core';
import { WarningDialog } from '../../../../components';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import UpdateListItem from './UpdateListItem';

const UpdateList = ({
  values,
  errors,
  touches,
  handleChange,
  genNewItem,
  setFieldTouched,
  setFieldValue,
  setValues,
  handleBlur,
  // checkIp,
  isRequest,
  isApproval,
  apiList,
  switchStatus,
  setSwitchStatus,
  formStatus,
  ipListLoading
}) => {
  const webdpColor = useWebDPColor();
  const TitleProps = useTitleProps();
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [switchStatusMemo, setSwitchStatusMemo] = useState('All IP from my tenant');

  useEffect(() => {
    // console.log('update list useEffect', values);
  }, [values]);

  const addItem = (ipValue, index) => {
    console.log('addItem 1:', ipValue, 'IPlist', index, values);
    let tempItem = [];
    let tempItem2 = []; // for isApproval === true;
    if (ipValue !== '' || ipValue !== null) {
      tempItem = apiList.filter((item) => item.ip === ipValue);
      //   console.log('addItem 2:', tempItem, index, values);
      if (isApproval) {
        tempItem2 = values.filter((item) => item.ip === ipValue);
        // console.log('is Approval tempItem2:', tempItem2);
      }

      let flagItem = false;
      for (let i = 0; i < values.length; i += 1) {
        if (values[i]?.ip === '') {
          flagItem = true;
          break;
        }
      }

      if (flagItem === false) {
        // 需要增加一行空白的
        const temp = genNewItem();
        let temp2 = {};

        if (isApproval) {
          if (tempItem2.length > 0) {
            temp2 = {
              ...tempItem2[0],
              key: Date.now().toString(36) + Math.random().toString(36).substr(2),
              // macAddress: tempItem2[0].macAddress === null ? '' : tempItem2[0].macAddress,
              macAddress:
                values[index].macAddress !== ''
                  ? values[index].macAddress
                  : tempItem[0].macAddress === null
                  ? ''
                  : tempItem[0].macAddress,
              hospital: tempItem2[0].hospital === null ? '' : tempItem2[0].hospital,
              block: tempItem2[0].block === null ? '' : tempItem2[0].block,
              floor: tempItem2[0].floor === null ? '' : tempItem2[0].floor,
              room:
                values[index].room !== ''
                  ? values[index].room
                  : tempItem2[0].room === null
                  ? ''
                  : tempItem2[0].room
            };
            // console.log('---------------', temp2);
          } else if (tempItem.length > 0) {
            temp2 = {
              ...tempItem[0],
              key: Date.now().toString(36) + Math.random().toString(36).substr(2),
              // macAddress: tempItem[0].macAddress === null ? '' : tempItem[0].macAddress,
              macAddress:
                values[index]?.macAddress !== ''
                  ? values[index]?.macAddress
                  : tempItem[0]?.macAddress === null
                  ? ''
                  : tempItem[0]?.macAddress,
              hospital: tempItem[0].hospital === null ? '' : tempItem[0].hospital,
              block: tempItem[0].block === null ? '' : tempItem[0].block,
              floor: tempItem[0].floor === null ? '' : tempItem[0].floor,
              room:
                values[index]?.room !== ''
                  ? values[index]?.room
                  : tempItem2[0]?.room === null
                  ? ''
                  : tempItem2[0]?.room
            };
            // console.log('---------------', temp2);
          } else {
            temp2 = genNewItem();
            temp2.ip = ipValue;
          }
        } else if (tempItem.length > 0) {
          temp2 = {
            ...tempItem[0],
            key: Date.now().toString(36) + Math.random().toString(36).substr(2),
            // macAddress: tempItem[0].macAddress === null ? '' : tempItem[0].macAddress,
            macAddress:
              values[index]?.macAddress !== ''
                ? values[index]?.macAddress
                : tempItem[0]?.macAddress === null
                ? ''
                : tempItem[0]?.macAddress,
            hospital: tempItem[0].hospital === null ? '' : tempItem[0].hospital,
            block: tempItem[0].block === null ? '' : tempItem[0].block,
            floor: tempItem[0].floor === null ? '' : tempItem[0].floor,
            room:
              values[index]?.room !== ''
                ? values[index]?.room
                : tempItem2[0]?.room === null
                ? ''
                : tempItem2[0]?.room
          };
          // console.log('---------------', temp2);
        } else {
          temp2 = genNewItem();
          temp2.ip = ipValue;
        }

        let newValues = [...values];
        newValues[index] = temp2;
        newValues = [...newValues, temp];
        //   console.log('flagItem 1: ', newValues);
        setFieldValue(`ipList`, newValues);
      } else {
        // 不需要增加空白行
        let temp2 = {};
        if (tempItem.length > 0) {
          temp2 = {
            ...tempItem[0],
            key: Date.now().toString(36) + Math.random().toString(36).substr(2),
            macAddress:
              values[index].macAddress !== ''
                ? values[index].macAddress
                : tempItem[0].macAddress === null
                ? ''
                : tempItem[0].macAddress,
            hospital: tempItem[0].hospital === null ? '' : tempItem[0].hospital,
            block: tempItem[0].block === null ? '' : tempItem[0].block,
            floor: tempItem[0].floor === null ? '' : tempItem[0].floor,
            room:
              values[index]?.room !== ''
                ? values[index]?.room
                : tempItem2[0]?.room === null
                ? ''
                : tempItem2[0]?.room
          };
        } else {
          // 如果 非 ip list 里面 的值，就 单独 起一条
          temp2 = genNewItem();
          temp2.ip = ipValue;
        }
        const newValues = [...values];
        newValues[index] = temp2;
        //   console.log('flagItem 2: ', newValues);
        setFieldValue(`ipList`, newValues);
      }
    } else {
      const temp = genNewItem();
      const newValues = [...values];
      newValues[index] = temp;
      setFieldValue(`ipList`, newValues);
    }
  };

  const deleteItem = (index) => {
    const newValues = values?.filter((_, idx) => index !== idx);
    setFieldValue(`ipList`, newValues);

    if (values.length === 1) {
      setFieldValue(`ipList.[0]`, genNewItem());
      setFieldTouched(`ipList.[0].ip`, false);
    }
  };

  const switchChecked = () => {
    if (switchStatus) {
      setSwitchStatusMemo('Only my IP');
    } else {
      setSwitchStatusMemo('All IP from my tenant');
    }
    setSwitchStatus(!switchStatus);
  };

  return (
    <Grid container>
      <Grid {...TitleProps}>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" style={{ color: webdpColor.title }}>
            <strong>Update List </strong>
          </Typography>
          <div style={{ marginLeft: 30, marginTop: -8 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={switchStatus}
                  onChange={switchChecked}
                  name="allIp"
                  color="primary"
                  disabled={!isRequest}
                />
              }
              label={switchStatusMemo}
            />
          </div>
        </div>
      </Grid>
      {values?.map((values, index) => (
        <UpdateListItem
          key={values?.key}
          {...{
            index,
            values,
            // checkIp,
            addItem,
            isRequest,
            isApproval,
            deleteItem,
            genNewItem,
            handleBlur,
            handleChange,
            setDeleteIndex,
            setDeleteDialog,
            errors: errors?.[index],
            touches: touches?.[index],
            apiList,
            setFieldValue,
            setValues,
            formStatus,
            ipListLoading
          }}
        />
      ))}

      <WarningDialog
        open={deleteDialog}
        handleConfirm={() => {
          deleteItem(deleteIndex);
          setDeleteDialog(false);
        }}
        handleClose={() => setDeleteDialog(false)}
        content="Whether to delete Item ?"
      />
    </Grid>
  );
};

export default memo(UpdateList);
