import React, { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField } from '@material-ui/core';
import dayjs from 'dayjs';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import CommonSelect from '../../../../components/CommonSelect';
import HAKeyboardDatePicker from '../../../../components/HAKeyboardDatePicker';

const useStyles = makeStyles(() => ({
  searchButton: {
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#229FFA',
    width: '10ch'
  },
  clearButton: {
    backgroundColor: '#FFF',
    color: '#229FFA',
    border: '1px solid #229FFA',
    width: '10ch',
    marginRight: 0
  },
  exportButton: {
    marginRight: 10
  }
}));

const TopDrawerBox = (props) => {
  const { eventFilter, getExcelUrlDownLoad, getActionLogPage } = props;
  const classes = useStyles();

  // for Select State
  const [statusSlect, setStatusSlect] = useState('');
  const [statusType] = useState([
    { label: 'Saved', value: 100 },
    { label: 'Submitted', value: 1 },
    { label: 'Approved', value: 2 },
    { label: 'Done', value: 0 }
  ]);

  const onStatusSelectChange = (e) => {
    setStatusSlect(e.target.value);
  };

  // for Select JobType
  const [jobTpyeSel, setJobTypeSel] = useState('');
  const [jobType] = useState([
    { label: 'Configuration', value: 0 },
    { label: 'Installation', value: 1 }
  ]);
  const onJobTypeSelectChange = (e) => {
    setJobTypeSel(e.target.value);
  };

  // for input requestNo
  const [requestNo, setRequestNo] = useState('');
  const hanldRequestNo = (e) => {
    setRequestNo(e.target.value);
  };

  // for Rang Data
  const [targetAt, setTargetAt] = useState([dayjs('1990-01-01'), dayjs('1990-01-01')]);
  const [rangeDate, setRangeDate] = useState({ startDate: null, endDate: null });
  const handleDataChange = (val, status) => {
    if (status === 'startDate') {
      setTargetAt([targetAt[0], val]);
      setRangeDate({ startDate: val, endDate: rangeDate.endDate });
    }
    if (status === 'endDate') {
      setRangeDate({ startDate: rangeDate.startDate, endDate: val });
    }
  };

  // for Search
  const toFilter = () => {
    // console.log('toFilter', statusSlect, jobTpyeSel, requestNo, rangeDate);
    eventFilter(statusSlect, jobTpyeSel, requestNo, rangeDate);
  };

  // for Clear
  const toClear = () => {
    setStatusSlect('');
    setJobTypeSel('');
    setRequestNo('');
    setRangeDate({ startDate: null, endDate: null });
    eventFilter();
  };

  // for DownExcel
  const downloadExcel = () => {
    // console.log('downloadExcel');
    getExcelUrlDownLoad();
  };

  return (
    <>
      <div>
        <Grid container>
          <Grid container spacing={3}>
            <Grid {...FormControlProps} md={3} lg="auto">
              <CommonSelect
                style={{ background: '#fff', width: '100%' }}
                outlined
                label="Filter Status"
                name="Filter Status"
                size="small"
                fullWidth
                labelWidth={80}
                value={statusSlect}
                itemList={statusType}
                onSelectChange={onStatusSelectChange}
              />
            </Grid>
            <Grid {...FormControlProps} md={3} lg="auto">
              <CommonSelect
                style={{ background: '#fff', width: '100%' }}
                outlined
                label="Job Type"
                name="Job Type"
                size="small"
                fullWidth
                value={jobTpyeSel}
                itemList={jobType}
                onSelectChange={onJobTypeSelectChange}
              />
            </Grid>
            <Grid {...FormControlProps} md={3} lg="auto">
              <TextField
                label="Resource Application No"
                variant="outlined"
                size="small"
                fullWidth
                style={{ width: '100%' }}
                value={requestNo}
                onChange={(e) => {
                  hanldRequestNo(e);
                }}
              />
            </Grid>
            <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
              <HAKeyboardDatePicker
                label="Start Date"
                minDate={targetAt[0]}
                value={rangeDate.startDate || ''}
                onChange={(val) => {
                  // console.log('HAKeyboardDatePicker', val);
                  handleDataChange(val, 'startDate');
                }}
              />
            </Grid>
            <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
              <HAKeyboardDatePicker
                label="Target Date"
                minDate={targetAt[1]}
                value={rangeDate.endDate || ''}
                onChange={(val) => {
                  // console.log('HAKeyboardDatePicker', val);
                  handleDataChange(val, 'endDate');
                }}
              />
            </Grid>

            <Grid {...FormControlProps} md={3} lg="auto">
              <Button
                variant="contained"
                color="primary"
                onClick={toFilter}
                className={classes.searchButton}
              >
                Search
              </Button>
            </Grid>

            <Grid {...FormControlProps} md={3} lg="auto">
              <Button
                variant="contained"
                // color="secondary"
                onClick={toClear}
                className={classes.clearButton}
              >
                Clear
              </Button>
            </Grid>
            <br />
            <Grid {...FormControlProps} md={3} lg="auto">
              <Button
                variant="contained"
                color="primary"
                onClick={downloadExcel}
                className={classes.exportButton}
              >
                Export Excel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={getActionLogPage}
                className={classes.exportButton}
              >
                Action Log
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default memo(TopDrawerBox);
