import React, { useState, useCallback, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import getIcons from '../../../../../utils/getIcons';
import {
  CommonTable,
  HAPaper,
  CommonDialog,
  TablePagination,
  CommonTip,
  WarningDialog
} from '../../../../../components';
import API from '../../../../../api/webdp/webdp';

const List = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.userReducer.currentUser);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [params, setParams] = useState({
    current: 1,
    lastUpdatedBy: user?.username,
    size: 10
  });

  const handleQuery = () => {
    setListLoading(true);
    API.getGrantPermission(params)
      .then((res) => {
        const newRows = res?.data?.data?.records || [];
        setRows(newRows);
        setTotal(res?.data?.data?.total || 0);
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    handleQuery();
  }, [params]);

  const formik = useFormik({
    initialValues: {
      username: {}
    },
    onSubmit: (values) => {
      const { username } = values;
      if (saving) {
        return;
      }
      if (!username?.corp || !user.username) {
        return;
      }
      const addPrams = {
        grantLoginId:
          username.corp === 'HO IT&HI SENSE System Account 1' ? 'sensesc1' : username.corp,
        grantName: username.display,
        lastUpdatedBy: user.username,
        personalDetails: JSON.stringify(user)
      };

      setSaving(true);
      API.addGrantPermission(addPrams)
        .then((res) => {
          if (res?.data?.status === 200) {
            CommonTip.success('Success');
            handleClose();
          } else if (res?.data?.status === 400) {
            CommonTip.error('The user already exists in the list');
          }
        })
        .finally(() => {
          setSaving(false);
          handleQuery();
        });
    },
    validationSchema: Yup.object({
      username: Yup.object({
        corp: Yup.string().required('Can not be empty')
      })
    })
  });

  const headCells = [
    { id: 'grantLoginId', alignment: 'left', label: 'CORP ID' },
    { id: 'grantName', alignment: 'left', label: 'Name' },
    { id: 'action', alignment: 'left', label: 'Actions' }
  ];

  const fieldList = [
    { field: 'grantLoginId', align: 'left' },
    { field: 'grantName', align: 'left' }
  ];

  const actionList = [
    {
      label: 'Delete',
      icon: getIcons('delete'),
      handleClick: (e, row) => {
        setDeleteOpen(true);
        setDeleteObj(row);
      }
    }
  ];

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3) {
        setOptions([]);
        setLoading(true);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    []
  );

  const customCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.handleReset();
  };

  const onChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      current: newPage + 1
    };
    setParams(newParams);
  };

  const onChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      current: 1,
      size: Number(event.target.value)
    };
    setParams(newParams);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setTimeout(() => {
      setDeleteObj({});
    }, 200);
  };

  const handleConfirm = () => {
    API.deleteGrantPermission(deleteObj.id)
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
        }
      })
      .finally(() => {
        closeDelete();
        handleQuery();
      });
  };

  return (
    <>
      <br />
      <HAPaper>
        <CommonTable
          rows={rows}
          hideCheckBox
          hideUpdate
          hideDetail
          headCells={headCells}
          fieldList={fieldList}
          actionList={actionList}
          customCreate={customCreate}
          createTitle="Grant Permission"
          loading={listLoading}
        />
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={parseInt(params.size) || 10}
          page={params.current - 1}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          loading={listLoading}
        />
      </HAPaper>

      <CommonDialog
        title="Grant read-only permission"
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
                  value={formik.values.username?.corp ? formik.values.username : null}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="Name *"
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
                  label="Login ID *"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled
                  value={formik.values.username?.corp || ''}
                />
              </Grid>
              <Grid item container xs={12} justifyContent="center">
                <Button variant="contained" color="primary" onClick={formik.handleSubmit}>
                  Grant
                </Button>
              </Grid>
            </Grid>
          </div>
        }
        open={open}
        maxWidth="xs"
        handleClose={handleClose}
      />

      <WarningDialog
        open={deleteOpen}
        handleConfirm={handleConfirm}
        handleClose={closeDelete}
        content={`Whether to delete ${deleteObj.grantName} ?`}
      />
    </>
  );
};

export default List;
