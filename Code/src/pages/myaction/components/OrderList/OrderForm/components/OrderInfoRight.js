import React, { useMemo, memo } from 'react';
import {
  Grid,
  makeStyles,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { HAKeyboardDatePicker } from '../../../../../../components';
import {
  FormControlProps,
  InputControlProps,
  CheckControlProps
} from '../../../../../../models/rms/req/FormControlProps';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    padding: theme.spacing(4, 2),
    borderBottom: '1px solid #fff'
  },
  checkedStyle: {
    '& .MuiFormControlLabel-labelPlacementStart': {
      marginLeft: theme.spacing(1),
      flexDirection: 'row-reverse',
      display: 'flex',
      justifyContent: 'space-between'
    },
    '& .MuiButtonBase-root.MuiIconButton-root': {
      padding: '6px !important'
    }
  }
}));

const OrderInfoRight = ({ formik, isDetail = false }) => {
  const classes = useStyles();

  const dataMap = {
    prissued: 'prissuedDate',
    reqIssued: 'reqIssuedDate',
    // patchCableSent: 'patchCableSentDate',
    // hubPortEnabled: 'hubPortEnabledDate',
    inSpCompleted: 'inSpCompDate',
    // isNetDIagUpdated: 'updateNetDIag',
    isConfigDBUpdated: 'updateConfigDB'
  };

  // 处理复选框
  const handleCheckedClick = (e, value, filed) => {
    if (!value) {
      if (
        // filed === 'patchCableSent' ||
        // filed === 'hubPortEnabled' ||
        // filed === 'updateNetDIag' ||
        filed === 'isConfigDBUpdated'
      ) {
        formik.setFieldValue(dataMap[filed], 'Not Yet');
      } else {
        formik.setFieldValue(dataMap[filed], null);
      }
    } else {
      formik.setFieldValue(dataMap[filed], new Date());
    }
    formik.setFieldValue(filed, value);
  };

  // 渲染复选框
  const renderChecked = (filed, labelName, isDisabled) => (
    <>
      <Grid {...CheckControlProps} md={4} lg={4} className={classes.checkedStyle}>
        <FormControlLabel
          control={
            <Checkbox
              name={filed}
              disabled={isDisabled || isDetail}
              checked={formik.values[filed] || false}
              onChange={(e, value) => {
                handleCheckedClick(e, value, filed);
              }}
              value={formik.values[filed] || false}
              color="secondary"
            />
          }
          labelPlacement="start"
          label={labelName}
        />
      </Grid>
    </>
  );
  const renderOtherInput = (filed, isSelect) => (
    <>
      {isSelect ? (
        <Grid {...FormControlProps} md={8} lg={8}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel htmlFor="-dataPortInformation-service-type" />
            <Select
              name={filed}
              disabled={isDetail}
              onChange={formik.handleChange}
              value={formik.values[filed] || 'Not Yet'}
            >
              <MenuItem value="Not Yet">Not Yet</MenuItem>
              <MenuItem value="Not Req">Not Req</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      ) : (
        <Grid {...FormControlProps} md={8} lg={8}>
          <TextField disabled name={filed} {...InputControlProps} label="" />
        </Grid>
      )}
    </>
  );

  /**
   *
   * @param {*} showDate  Whether  show datainput
   * @param {*} filed     filed name
   * @param {*} isSelect  isSelect
   * @returns
   */
  const renderInputOrDate = (showDate, filed, isSelect) => (
    <>
      {showDate ? (
        <Grid {...FormControlProps} md={8} lg={8}>
          <DatePicker
            autoOk
            fullWidth
            variant="inline"
            inputVariant="outlined"
            format="dd-MMM-yyyy"
            size="small"
            disabled={isDetail || (!isDetail && filed !== 'updateNetDIag')}
            value={formik.values[filed] || false}
            onChange={(date) => {
              formik.setFieldValue(filed, date);
            }}
          />
        </Grid>
      ) : (
        renderOtherInput(filed, isSelect)
      )}
    </>
  );
  const renderPRraisedChecked = useMemo(
    () => renderChecked('prissued', 'PR Raised', true),
    [formik.values.prissued]
  );
  const renderPRraised = useMemo(
    () => renderInputOrDate(formik.values.prissued, 'prissuedDate'),
    [formik.values.prissued, formik.values.prissuedDate]
  );

  const renderToVenderChecked = useMemo(
    () => renderChecked('reqIssued', 'Req Sent to Vender', true),
    [formik.values.reqIssued]
  );
  const renderToVender = useMemo(
    () => renderInputOrDate(formik.values.reqIssued, 'reqIssuedDate'),
    [formik.values.reqIssued, formik.values.reqIssuedDate]
  );

  // const renderPwdRevisedChecked = useMemo(
  //   () => renderChecked('patchCableSent', 'Hub Pwd Revised'),
  //   [formik.values.patchCableSent]
  // );
  // const renderPwdRevised = useMemo(
  //   () => renderInputOrDate(formik.values.patchCableSent, 'patchCableSentDate', true),
  //   [formik.values.patchCableSent, formik.values.patchCableSentDate]
  // );

  // const renderPortDisabledChecked = useMemo(
  //   () => renderChecked('hubPortEnabled', 'Hub Port Disabled'),
  //   [formik.values.hubPortEnabled]
  // );
  // const renderPortDisabled = useMemo(
  //   () => renderInputOrDate(formik.values.hubPortEnabled, 'hubPortEnabledDate', true),
  //   [formik.values.hubPortEnabled, formik.values.hubPortEnabledDate]
  // );

  const renderinstallCompletedChecked = useMemo(
    () => renderChecked('inSpCompleted', `Install'n Completed`, true),
    [formik.values.inSpCompleted]
  );
  const renderInstallCompleted = useMemo(
    () => renderInputOrDate(formik.values.inSpCompleted, 'inSpCompDate'),
    [formik.values.inSpCompleted, formik.values.inSpCompDate]
  );

  // const renderDiagUpdateChecked = useMemo(
  //   () => renderChecked('isNetDIagUpdated', 'Net. Diag. Updated'),
  //   [formik.values.isNetDIagUpdated]
  // );
  // const renderDiagUpdateCompleted = useMemo(
  //   () => renderInputOrDate(formik.values.isNetDIagUpdated, 'updateNetDIag', true),
  //   [formik.values.isNetDIagUpdated, formik.values.updateNetDIag]
  // );

  const renderDbUpdateChecked = useMemo(
    () => renderChecked('isConfigDBUpdated', 'Config. DB Updated'),
    [formik.values.isConfigDBUpdated]
  );

  const renderDbUpdateCompleted = useMemo(
    () => renderInputOrDate(formik.values.isConfigDBUpdated, 'updateConfigDB', true),
    [formik.values.isConfigDBUpdated, formik.values.updateConfigDB]
  );

  return (
    <Grid container className={classes.root}>
      <Grid container spacing={2}>
        {renderPRraisedChecked}
        {renderPRraised}

        {renderToVenderChecked}
        {renderToVender}

        {/* {renderPwdRevisedChecked}
        {renderPwdRevised} */}

        {/* {renderPortDisabledChecked}
        {renderPortDisabled} */}

        {renderinstallCompletedChecked}
        {renderInstallCompleted}

        {/* {renderDiagUpdateChecked}
        {renderDiagUpdateCompleted} */}

        {renderDbUpdateChecked}
        {renderDbUpdateCompleted}

        <Grid {...FormControlProps} md={12} lg={12}>
          <TextField
            name="invoice"
            disabled={isDetail}
            label="OC or DN No."
            {...InputControlProps}
            onChange={formik.handleChange}
            value={formik.values.invoice || ''}
          />
        </Grid>
        <Grid {...FormControlProps} md={12} lg={12}>
          <HAKeyboardDatePicker
            disabled={isDetail}
            label="Received Date"
            value={formik.values.invoiceRecdDate}
            onChange={(date) => {
              formik.setFieldValue('invoiceRecdDate', date);
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(OrderInfoRight);
