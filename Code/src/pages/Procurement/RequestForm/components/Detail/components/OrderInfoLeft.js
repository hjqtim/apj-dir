import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import React, { useState, memo, useEffect } from 'react';
import API from '../../../../../../api/webdp/webdp';
import AAAAPI from '../../../../../../api/adGroup';
import RenderFiled from './RenderFiled';
import { SENSE_NMSRS } from '../../../../../../utils/constant';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    padding: theme.spacing(2, 0, 2, 2),
    '& .MuiGrid-root.MuiGrid-container': {
      margin: theme.spacing(1, 0)
    }
  }
}));

const OrderInfoLeft = ({ formik, detailRequestDone, isDetail, isEdict, setFromStaff }) => {
  const classess = useStyles();

  const [status, setStatus] = useState([]);
  const [years, setYears] = useState([]);
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  useEffect(() => {
    console.log(formik, setFromStaff, user);
  }, []);
  const fileds = [
    {
      filed: 'reqNo',
      disabled: true,
      type: 'string',
      labelName: 'Request Form No.',
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'reqNoRev',
      labelName: 'Rev',
      type: 'number',
      maxValue: 99,
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'vendor',
      disabled: true,
      labelName: 'Vendor',
      type: 'string',
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'expenditureFY',
      labelName: 'Fiscal Year *',
      type: 'autoSelectNotObj',
      disabled: isDetail,
      data: years,
      renderOptionLabel: (option) => `${option.value}`,
      handleChange: (e, value) => {
        formik.setFieldValue('expenditureFY', value || '');
      },
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'description',
      labelName: 'Description',
      type: 'string',
      disabled: isDetail,
      itemFormControlProps: { md: 12, lg: 12 }
    },
    {
      filed: 'instDateFr',
      labelName: `Install'n Start Time *`,
      type: 'keyData',
      disabled: isDetail,
      itemFormControlProps: { md: 4, lg: 4 },
      maxDate: formik.values.instDateTo,
      listensData: formik.values.instDateTo
    },
    {
      filed: 'instDateTo',
      labelName: `Install'n End Time *`,
      type: 'keyData',
      disabled: isDetail,
      itemFormControlProps: { md: 4, lg: 4 },
      minDate: formik.values.instDateFr,
      listensData: formik.values.instDateFr
    },
    {
      filed: 'prCode',
      disabled: true,
      labelName: 'PR Code',
      type: 'string',
      itemFormControlProps: { md: 4, lg: 4 }
    },
    {
      filed: 'status',
      labelName: 'Status',
      type: 'autoSelect',
      disabled: true,
      renderOptionLabel: (option) => `${option.status}`,
      data: status,
      itemFormControlProps: { md: 6, lg: 6 }
    },
    {
      filed: 'jobCompletionDate',
      labelName: 'Status Date',
      type: 'date',
      disabled: true,
      itemFormControlProps: { md: 6, lg: 6 }
    },
    {
      filed: 'remark',
      labelName: 'Remark',
      type: 'textArea',
      disabled: isDetail,
      itemFormControlProps: { md: 12, lg: 12 }
    }
  ];
  const [respStaff, setRespStaff] = useState({
    filed: 'respStaff',
    labelName: 'Resp Staff *',
    type: 'autoSelect',
    disabled: isDetail,
    renderOptionLabel: (option) => `${option.displayName}`,
    handleChange: (e, value) => formik.setFieldValue('respStaff', value || ''),
    data: [],
    itemFormControlProps: { md: 3, lg: 3 }
  });

  useEffect(() => {
    setYears(getYearOptions() || []);
  }, []);

  const getYearOptions = () => {
    let year = dayjs().format('YY');
    const fullYear = dayjs().format('YYYY');
    if (dayjs().valueOf() <= dayjs(`${fullYear}-03-31 23:59:59`).valueOf()) {
      year = `${year - 1}`;
    }
    const towYearAgo = `${Number(year) - 2}${Number(year) - 1}`;
    const lastYear = `${Number(year) - 1}${year}`;
    const thisYear = `${year}${Number(year) + 1}`;
    const nextYear = `${Number(year) + 1}${Number(year) + 2}`;
    const nextTwoYear = `${Number(year) + 2}${Number(year) + 3}`;

    const yearOptions = [towYearAgo, lastYear, thisYear, nextYear, nextTwoYear];

    return yearOptions;
  };

  useEffect(() => {
    if ((!isDetail && !isEdict) || detailRequestDone) {
      Promise.all([
        API.getStatusList(),
        AAAAPI.getUsersForGroup({ groupNames: SENSE_NMSRS?.split(',') }),
        API.getStaffNameList()
      ])
        .then((res) => {
          const statusData = res?.[0]?.data?.data || [];
          const respStaffData = res?.[1]?.data?.data || [];

          setStatus(statusData || []);
          setRespStaff({ ...respStaff, data: respStaffData });
          // if (isDetail || isEdict) {
          //   // 这里表示是详情页he编辑页，获取数据回显
          //   const statusObj = statusData.filter((item) => item.status === formik.values.status);
          //   const respStaffObj = respStaffData.filter(
          //     (item) =>
          //       item.username?.toLowerCase() === formik.values.respStaffCorpId?.toLowerCase()
          //   );
          //   setFromStaff(respStaffObj?.[0] || {});
          //   formik.setFieldValue('status', statusObj?.[0] || null);
          //   formik.setFieldValue('respStaff', respStaffObj?.[0] || null);
          // } else {
          //   const isExitStaff = respStaffData?.filter((item) => item.username === user.username);
          //   if (isExitStaff?.length > 0) {
          //     formik.setFieldValue('respStaff', isExitStaff?.[0] || null);
          //   }
          // }
        })
        .finally(() => {
          //
        });
    }
  }, [detailRequestDone]);

  return (
    <Grid container className={classess.root}>
      <Grid container justifyContent="space-between" spacing={2}>
        <div>
          {/* <Button
            variant="contained"
            color="primary"
            // onClick={}
          >
            New Request Form
          </Button> */}
        </div>
        <RenderFiled formik={formik} item={respStaff} />
      </Grid>
      <Grid container spacing={2}>
        {fileds.map((item) => (
          <RenderFiled key={item.filed} formik={formik} item={item} />
        ))}
      </Grid>
    </Grid>
  );
};

export default memo(OrderInfoLeft);
