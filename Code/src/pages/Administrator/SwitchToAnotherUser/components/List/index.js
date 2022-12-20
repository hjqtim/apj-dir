import React, { useState, useCallback, useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import {
  CommonTable,
  HAPaper,
  CommonDialog,
  CommonTip,
  TablePagination
} from '../../../../../components';
import loopingAPI from '../../../../../api/webdp/looping';
import HeadForm from './HeadForm';
import { signIn } from '../../../../../utils/auth';
import userAPI from '../../../../../api/user';
import webdpAPI from '../../../../../api/webdp/webdp';
import { setLoginUser, setSwitchTime, maxSwitchTime } from '../../../../../utils/switchRose';
import { dateFormat, dateFormatShow } from '../../../../../utils/tools';

const List = () => {
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    startTime: '',
    endTime: '',
    originUserName: '',
    switchUserName: ''
  });
  const [total, setTotal] = useState(0);

  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const loginUser = useSelector((state) => state.userReducer.loginUser);
  const isSwitch = useSelector((state) => state.userReducer.isSwitch);

  const formik = useFormik({
    initialValues: {
      username: {}
    },
    onSubmit: (values) => {
      if (!isSaving) {
        submit(values.username);
      }
    },
    validationSchema: Yup.object({
      username: Yup.object({
        corp: Yup.string().required('Can not be empty')
      })
    })
  });

  const getList = () => {
    setListLoading(true);
    webdpAPI
      .getSwitchList(params)
      .then((res) => {
        setRows(res?.data?.data?.records || []);
        setTotal(res?.data?.data?.total || 0);
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [params]);

  const headCells = [
    // { id: 'auditID', alignment: 'left', label: 'Audit ID' },
    { id: 'originalUserName', alignment: 'left', label: 'Original User' },
    { id: 'switchedUserName', alignment: 'left', label: 'Switched User' },
    { id: 'actionDate', alignment: 'left', label: 'Start Time' },
    { id: 'actionEndDate', alignment: 'left', label: 'End Time' }
  ];

  const fieldList = [
    // { field: 'auditID', align: 'left' },
    { field: 'originalUserName', align: 'left' },
    { field: 'switchedUserName', align: 'left' },
    {
      field: 'actionDate',
      align: 'left',
      renderCell: (row) => (row.actionDate ? dayjs(row.actionDate).format(dateFormatShow) : '')
    },
    {
      field: 'actionEndDate',
      align: 'left',
      renderCell: (row) => {
        const { actionDate, actionEndDate } = row;

        if (!actionDate || !actionEndDate) {
          return '';
        }

        if (
          dayjs(actionEndDate).diff(actionDate, 'seconds') === maxSwitchTime &&
          dayjs().diff(actionEndDate, 'seconds') < 0
        ) {
          return '';
        }

        return dayjs(row.actionEndDate).format(dateFormatShow);
      }
    }
  ];

  const submit = async (user = {}) => {
    try {
      const obj = {
        username: user.corp
      };
      setIsSaving(true);
      const userRes = await userAPI.findUser(obj);
      const val = userRes?.data?.data || {};

      const userId = val.sAMAccountName;

      if (userId) {
        const result = await webdpAPI.saveSwitch(userId);
        if (result?.data?.status === 200) {
          const data = {
            user: {
              phone: val.telephoneNumber,
              username: userId,
              ...val
            }
          };
          signIn(data);
          setLoginUser(loginUser?.username ? loginUser : currentUser);
          setSwitchTime(dayjs().format(dateFormat));
          CommonTip.success('Success');
          setOpen(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setOptions([]);
        loopingAPI
          .findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const customCreate = () => {
    if (isSwitch) {
      CommonTip.warning('You are currently in switch mode');
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      pageIndex: newPage + 1
    };
    setParams(newParams);
  };

  const onChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: Number(event.target.value)
    };
    setParams(newParams);
  };

  return (
    <>
      <HeadForm params={params} setParams={setParams} />
      <br />
      <HAPaper>
        <CommonTable
          rows={rows}
          hideCheckBox
          hideUpdate
          hideDetail
          headCells={headCells}
          fieldList={fieldList}
          customCreate={customCreate}
          hideActionColumn
          createTitle="Switch"
          tableName="Switch Log"
          loading={listLoading}
        />
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={parseInt(params.pageSize) || 10}
          page={params.pageIndex ? params.pageIndex - 1 : 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          loading={listLoading}
        />
        <br />
      </HAPaper>

      <CommonDialog
        title="Select the user"
        isHideFooter={false}
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Autocomplete
                  loading={loading}
                  onBlur={formik.handleBlur}
                  onChange={(e, value) => {
                    formik.setFieldValue('username', value || {});
                  }}
                  options={options}
                  getOptionLabel={(option) => option.display}
                  value={formik.values.username?.display ? formik.values.username : null}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="username"
                      error={Boolean(formik.errors.username?.corp && formik.touched.username)}
                      onChange={(e) => {
                        checkAD(e?.target?.value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Login ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled
                  value={formik.values.username?.corp || ''}
                />
              </Grid>
            </Grid>
          </div>
        }
        open={open}
        maxWidth="xs"
        handleClose={handleClose}
        handleConfirm={formik.handleSubmit}
      />
    </>
  );
};

export default List;
