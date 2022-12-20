import React, { memo, useState, useCallback, useEffect } from 'react';
import { Grid, TextField, FormControlLabel } from '@material-ui/core';
import { Divider, Input } from 'antd';
import { useFormik } from 'formik';
import Cron from 'react-js-cron';
import * as Yup from 'yup';
import '../../../../../style/antd.css';
import './index.css';
import { CommonDialog, CommonTip } from '../../../../../components';
// import AntSwitch from './AntSwitch';
import AntSwitch from './AntSwitch';
import API from '../../../../../api/timer';

const textFieldProps = {
  variant: 'outlined',
  size: 'small',
  fullWidth: true
};

const gridProps = {
  item: true,
  xs: 6
};

const AddTimer = (props) => {
  const { isOpenAdd, setIsOpenAdd, queryJobLists } = props;
  const [openExpression, setOpenExpression] = useState(false);
  const defaultValue = '* * * * *';
  const [value, setValue] = useState(defaultValue);
  const customSetValue = useCallback((newValue) => {
    setValue(newValue);
  }, []);
  const [error, onError] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [handleCount, setHandleCount] = useState(0);

  // 验证表达式是否符合规范
  const verifyExpression = () => {
    const splitArr = value.split(' ');

    // 星期与日不能同在
    if (
      splitArr?.length === 5 &&
      splitArr[2] !== '*' &&
      splitArr[2] !== '' &&
      splitArr[4] !== '*' &&
      splitArr[4] !== ''
    ) {
      CommonTip.warning('Days and weeks cannot coexist');
      return false;
    }

    return true;
  };

  const formik = useFormik({
    initialValues: {
      jobName: '',
      jobGroup: '',
      jobClassName: '',
      triggerName: '',
      triggerState: 'PAUSED',
      description: '',
      cronExpression: '',
      isNonconcurrent: 1
    },
    validationSchema: Yup.object({
      jobName: Yup.string().required('Can not be empty'),
      jobGroup: Yup.string().required('Can not be empty'),
      jobClassName: Yup.string().required('Can not be empty'),
      triggerName: Yup.string().required('Can not be empty'),
      cronExpression: Yup.string().required('Can not be empty')
    }),
    onSubmit: (values) => {
      if (isSaving || !verifyExpression()) {
        return;
      }
      const saveParams = {
        ...values
      };
      setIsSaving(true);
      API.saveJob(saveParams)
        .then((res) => {
          if (res?.data?.code === 0) {
            CommonTip.success('Success', 2000);
            handleClose();
            queryJobLists();
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  });

  useEffect(() => {
    if (handleCount && !verifyExpression()) {
      const splitArr = value.split(' ') || [];
      splitArr[2] = '*';
      splitArr[4] = '*';
      const newValue = splitArr.join(' ');
      setValue(newValue);
    }
  }, [handleCount]);

  const handleClose = () => {
    setIsOpenAdd(false);
    setTimeout(() => {
      formik.handleReset();
    }, 200);
  };

  const { handleChange, handleSubmit, setFieldValue, handleBlur, setFieldTouched } = formik;

  const expressionClose = () => {
    setOpenExpression(false);
    setTimeout(() => {
      setValue(defaultValue);
    }, 200);
  };

  const expressionConfirm = () => {
    if (!error) {
      const valArr = value.split(' ') || [];

      if (valArr[4] && valArr[4] !== '*' && valArr[4] !== '?') {
        // 组件星期是从0-6，后端需要1-7
        valArr[4] = valArr[4].replace(/[0-6]/g, (match) => (Number(match) + 1).toString());
      }

      // 星期与日不能同在，日存在星期就要为? 星期存在，日就要为?（意思就是至少有一个为？问号） ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      if (valArr[2] === '*' && valArr[4] === '*') {
        valArr[4] = '?';
      } else if (valArr[2] !== '*' && valArr[2] !== '?') {
        valArr[4] = '?';
      } else if (valArr[4] !== '*' && valArr[4] !== '?') {
        valArr[2] = '?';
      }
      // 星期与日不能同在，日存在星期就要为? 星期存在，日就要为?（意思就是至少有一个为？问号） ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      const newValue = `0 ${valArr.join(' ')}`;
      setFieldValue('cronExpression', newValue);
      expressionClose();
    }
  };

  return (
    <>
      <CommonDialog
        open={isOpenAdd}
        handleClose={handleClose}
        handleConfirm={handleSubmit}
        isHideFooter={false}
        title="Creating a Task Scheduler"
        content={
          <div style={{ padding: '40px' }}>
            <Grid container spacing={4}>
              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="jobName"
                  label="Job Name"
                  onChange={handleChange}
                  value={formik.values.jobName}
                  onBlur={handleBlur}
                  error={Boolean(formik.touched.jobName && formik.errors.jobName)}
                />
              </Grid>

              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="jobGroup"
                  label="Job Group"
                  onChange={handleChange}
                  value={formik.values.jobGroup}
                  onBlur={handleBlur}
                  error={Boolean(formik.touched.jobGroup && formik.errors.jobGroup)}
                />
              </Grid>

              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="jobClassName"
                  label="Job Class Name"
                  onChange={handleChange}
                  value={formik.values.jobClassName}
                  onBlur={handleBlur}
                  error={Boolean(formik.touched.jobClassName && formik.errors.jobClassName)}
                />
              </Grid>

              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="triggerName"
                  label="Trigger Name"
                  onChange={handleChange}
                  value={formik.values.triggerName}
                  onBlur={handleBlur}
                  error={Boolean(formik.touched.triggerName && formik.errors.triggerName)}
                />
              </Grid>

              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid {...gridProps}>
                <TextField
                  {...textFieldProps}
                  name="cronExpression"
                  label="Expression"
                  disabled
                  onChange={handleChange}
                  value={formik.values.cronExpression}
                  onBlur={handleBlur}
                  error={Boolean(formik.touched.cronExpression && formik.errors.cronExpression)}
                  InputProps={{
                    endAdornment: (
                      <span
                        style={{ color: '#229FFA', cursor: 'pointer' }}
                        onClick={() => {
                          setOpenExpression(true);
                          setFieldTouched('cronExpression', true);
                        }}
                      >
                        Gen...
                      </span>
                    )
                  }}
                />
              </Grid>
              <Grid {...gridProps}>
                <FormControlLabel
                  labelPlacement="start"
                  label="State"
                  control={
                    <AntSwitch
                      checked={formik.values.triggerState === 'ACQUIRED'}
                      onChange={(e, v) => {
                        setFieldValue('triggerState', v ? 'ACQUIRED' : 'PAUSED');
                      }}
                    />
                  }
                  style={{ marginLeft: 0 }}
                />
              </Grid>
            </Grid>
          </div>
        }
      />

      <CommonDialog
        open={openExpression}
        handleClose={expressionClose}
        handleConfirm={expressionConfirm}
        maxWidth="md"
        title="Generated Expression"
        isHideFooter={false}
        content={
          <div style={{ padding: '40px' }}>
            <Input
              status={error ? 'error' : undefined}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
            <Divider>OR</Divider>
            <Cron
              value={value}
              setValue={customSetValue}
              // onError={onError}
              onError={(v) => {
                onError(v);
                if (!v) {
                  setHandleCount(handleCount + 1);
                }
              }}
              clearButtonProps={{
                style: {
                  backgroundColor: '#fff',
                  borderColor: '#d9d9d9',
                  color: 'rgba(0, 0, 0, 0.85)'
                }
              }}
            />
          </div>
        }
      />
    </>
  );
};

export default memo(AddTimer);
