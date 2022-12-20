import _ from 'lodash';
import React, { memo, useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { WarningDialog } from '../../../../components';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import ReleaseListItem from './ReleaseListItem';
import ipassignAPI from '../../../../api/ipassign';
import webAPI from '../../../../api/webdp/webdp';

const ReleaseList = ({
  values,
  errors,
  touches,
  genNewItem,
  setFieldTouched,
  setFieldValue,
  ipListType,
  handleBlur,
  checkIp,
  isRequest
}) => {
  const webdpColor = useWebDPColor();
  const TitleProps = useTitleProps();
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [ipListLoading, setIpListLoading] = useState(false);
  const [ipOptions, setIpOptions] = useState([]);
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const userInfo = useSelector((state) => state.userReducer.groupInfo) || {};
  const [hospitalList, setHospitalList] = useState([]);

  useEffect(() => {
    getHospitalList();
  }, []);

  const getHospitalList = () => {
    webAPI.getHospitalList().then((res) => {
      const resHospitalList = res?.data?.data?.hospitalList || [];
      setHospitalList(resHospitalList);
    });
  };

  const addItem = () => {
    if (values?.[values.length - 1].ip) {
      values.push(genNewItem());
      // setFieldValue(`ipList[${values?.length}]`, genNewItem());
    }
  };

  const checkIpIsExit = (ip, index) => {
    const isExitObj = ipOptions?.find((item) => item?.ipAddress === ip);
    // ip 存在下拉列表则不发起检查
    if (_.isUndefined(isExitObj)) {
      checkIp(ip, index);
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

  useEffect(() => {
    getIpList();
  }, [ipListType]);
  const getIpList = () => {
    setIpListLoading(true);
    ipassignAPI
      .getIpListUpdateMac({
        requester: ipListType ? user?.displayName : undefined,
        groupName: ipListType ? undefined : userInfo.groupName
      })
      .then((res) => {
        const resList = res?.data?.data || [];
        setIpOptions(resList);
      })
      .finally(() => {
        setIpListLoading(false);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong> &nbsp;Release List</strong>
        </Typography>
      </Grid>
      {values?.map((values, index) => (
        <ReleaseListItem
          key={values.key}
          {...{
            index,
            values,
            addItem,
            isRequest,
            ipOptions,
            deleteItem,
            genNewItem,
            handleBlur,
            hospitalList,
            ipListLoading,
            checkIpIsExit,
            setFieldValue,
            setDeleteIndex,
            setDeleteDialog,
            errors: errors?.[index],
            touches: touches?.[index]
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

export default memo(ReleaseList);
