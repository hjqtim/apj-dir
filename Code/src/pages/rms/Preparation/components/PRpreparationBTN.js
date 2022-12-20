import React, { useState } from 'react';
import { Grid, Button, TextField, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import SearchIcon from '@material-ui/icons/Search';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { WarningDialog, HAKeyboardDatePicker } from '../../../../components';
import ActionLog from './ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4)
  }
}));

const PRButton = (props) => {
  const { undoLast, cancelChange, searchCondition, setParams, editRow, stepRow, BTNTime } = props;
  const classes = useStyles();
  const [openCancel, setOpenCancel] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      status: 0,
      startTime: dayjs().add(-2, 'year').format('YYYY-MM-DD'),
      endTime: dayjs().format('YYYY-MM-DD')
    },
    validationSchema: Yup.object({
      startTime: Yup.string().required('Please input startTime.'),
      endTime: Yup.string().required('Please input endTime.')
    }),
    onSubmit: (values) => {
      searchCondition(values.status, values.startTime, values.endTime);
      setParams({ page: 1, pageSize: 10 });
    }
  });
  const { startTime, endTime } = formik.values;

  BTNTime(startTime, endTime);

  const statusList = [
    { values: 0, label: 'All' },
    { values: 2, label: 'O/S' },
    { values: 1, label: 'Completed' }
  ];

  const handleCancel = () => {
    if (editRow?.length !== 0) {
      cancelChange();
    }
    setOpenCancel(false);
  };

  const getEndTimeMaxDate = () => {
    if (startTime) {
      const handleTime = dayjs(startTime).add(2, 'year');
      const nowTime = dayjs().format('YYYY-MM-DD 00:00:00');

      if (handleTime.diff(nowTime) < 0) {
        return handleTime;
      }
    }

    return new Date();
  };

  const commonProps = { item: true, xs: 12, xl: 8 };
  const commonProps2 = { item: true, xs: 12, xl: 4 };
  return (
    <>
      <Grid container>
        <Grid {...commonProps}>
          <Grid container spacing={5}>
            <Grid item xs={6} md={6} lg={7} xl={7}>
              <Grid container spacing={5}>
                <Grid item xs={4}>
                  <Autocomplete
                    options={statusList}
                    style={{ marginTop: -3 }}
                    getOptionLabel={(option) => `${option.label}`}
                    onChange={(e, data) => {
                      formik.setFieldValue('status', data?.values || 0);
                    }}
                    renderInput={(inputParams) => <TextField {...inputParams} label="Status" />}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HAKeyboardDatePicker
                    label="Start Date"
                    inputVariant="standard"
                    value={startTime}
                    error={Boolean(formik.errors.startTime && formik.touched.startTime)}
                    name="startTime"
                    style={{ minWidth: 138 }}
                    minDate={
                      endTime ? dayjs(endTime).add(-2, 'year').format('YYYY-MM-DD') : undefined
                    }
                    maxDate={endTime || new Date()}
                    onChange={(date) => {
                      formik.setFieldValue('startTime', date);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HAKeyboardDatePicker
                    label="End Date"
                    name="endTime"
                    style={{ minWidth: 138 }}
                    inputVariant="standard"
                    minDate={startTime || undefined}
                    maxDate={getEndTimeMaxDate()}
                    value={endTime}
                    error={Boolean(formik.errors.endTime && formik.touched.endTime)}
                    onChange={(date) => {
                      formik.setFieldValue('endTime', date);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} md={6} lg={5} xl={5}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
                startIcon={<SearchIcon />}
                onClick={formik.handleSubmit}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid {...commonProps2}>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<CheckIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Action Log
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<RestoreIcon />}
              onClick={() => setOpenCancel(true)}
              disabled={!(stepRow.length > 0)}
            >
              Undo All
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<UndoIcon />}
              onClick={undoLast}
              disabled={!(stepRow.length > 0)}
            >
              Undo Last
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <WarningDialog
        open={openCancel}
        handleConfirm={handleCancel}
        handleClose={() => setOpenCancel(false)}
        content="All the changes will be recovered, are you sure to continue ?"
      />

      <ActionLog {...{ drawerOpen, setDrawerOpen, module: 'PRPreparation' }} />
    </>
  );
};

export default PRButton;
