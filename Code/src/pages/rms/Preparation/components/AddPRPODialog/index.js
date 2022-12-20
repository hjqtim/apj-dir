import React, { memo, useState, useCallback } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@material-ui/core';
import { useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  CommonDialog,
  CommonTip,
  HAKeyboardDatePicker,
  CommonNumberFormat,
  Loading
} from '../../../../../components';
import API from '../../../../../api/webdp/webdp';

const AddPRPODialog = (props) => {
  const {
    addOpen,
    setAddOpen,
    addOneItem,
    options,
    optionsMap,
    contractOptions,
    contractOptionsMap
  } = props;
  const [loading, setLoading] = useState(false);
  const [prRequesteroptions, setPrRequesteroptions] = useState([]);

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

  const formik = useFormik({
    initialValues: {
      fiscalYear: '',
      prDate: '',
      prCode: '',
      prNo: '',
      lanPoolOrder: '',
      prSend: '',
      poNo: '',
      poSend: '',
      totalAmount: '',
      contract: '',
      requesterTeam: '',
      prRequester: '',
      vendorCode: '',
      coa: '',
      project: '',
      remark: '',
      prCodeStatus: ''
    },
    validationSchema: Yup.object({
      fiscalYear: Yup.string().required('Can not be empty'),
      prDate: Yup.string().required('Can not be empty'),
      // prCode: Yup.string().required('Can not be empty'),
      // prNo: Yup.string().required('Can not be empty'),
      lanPoolOrder: Yup.string().required('Can not be empty'),
      prSend: Yup.string().required('Can not be empty'),
      // poNo: Yup.string().required('Can not be empty'),
      // poSend: Yup.string().required('Can not be empty'),
      totalAmount: Yup.string().required('Can not be empty'),
      contract: Yup.string().required('Can not be empty'),
      // remark: Yup.string().required('Can not be empty'),
      requesterTeam: Yup.string().required('Can not be empty'),
      prRequester: Yup.string().required('Can not be empty'),
      vendorCode: Yup.string().required('Can not be empty'),
      coa: Yup.string().required('Can not be empty')
      // project: Yup.string().required('Can not be empty')
    }),
    validate: (values) => {
      const dynamicError = {};
      if (values.prCodeStatus !== 'ok') {
        dynamicError.prCode = true;
      }
      return dynamicError;
    },
    onSubmit: (values) => {
      const projectIsExit = options.find((item) => item?.project === values?.project);
      const contractIsExit = contractOptions.find((item) => item?.contract === values?.contract);
      const projectFlag = _.isUndefined(projectIsExit) ? 0 : 1;
      const contractFlag = _.isUndefined(contractIsExit) ? 0 : 1;
      const saveParams = [
        {
          ...values,
          id: 0,
          totalAmount: totalAmount || '',
          projectFlag,
          contractFlag
        }
      ];

      Loading.show();
      API.savePRPOSummary(saveParams)
        .then((res) => {
          if (res?.data?.code === 200 && res?.data?.data?.[0]) {
            CommonTip.success('Success', 2000);
            formik.handleReset();
            handleClose();

            const newItem = res.data.data[0];
            newItem.lanPoolOrder = String(newItem.lanPoolOrder === null ? 0 : newItem.lanPoolOrder);
            addOneItem(newItem);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  });

  const handleClose = () => {
    setAddOpen(false);
  };

  const {
    prDate,
    prCode,
    prNo,
    lanPoolOrder,
    prSend,
    poNo,
    poSend,
    totalAmount,
    contract,
    remark,
    fiscalYear,
    requesterTeam,
    prRequester,
    vendorCode,
    coa,
    project,
    prCodeStatus
  } = formik.values;
  const { setFieldValue, handleBlur, handleChange } = formik;

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setPrRequesteroptions([]);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setPrRequesteroptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const queryPRCode = () => {
    setFieldValue('prCodeStatus', '');

    if (prCode) {
      API.getPRPOSummaryByPrCode(prCode).then((res) => {
        if (res?.data?.data?.status === false) {
          setFieldValue('prCodeStatus', 'ok');
        } else if (res?.data?.data?.status === true) {
          setFieldValue('prCodeStatus', 'exist');
        } else {
          setFieldValue('prCodeStatus', 'error');
        }
      });
    }
  };

  return (
    <>
      <CommonDialog
        title="Add Record"
        open={addOpen}
        handleClose={handleClose}
        handleConfirm={formik.handleSubmit}
        isHideFooter={false}
        maxWidth="sm"
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={Boolean(formik.errors.fiscalYear && formik.touched.fiscalYear)}
                >
                  <InputLabel>Fis Yr *</InputLabel>
                  <Select
                    label="Fis Yr *"
                    name="fiscalYear"
                    value={fiscalYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {getYearOptions()?.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="PR Date *"
                  name="prDate"
                  value={prDate || null}
                  onBlur={handleBlur}
                  onChange={(date) => {
                    const newPrDate = dayjs(date).format('YYYY-MM-DD 00:00:00');
                    setFieldValue('prDate', newPrDate === 'Invalid Date' ? '' : newPrDate);
                  }}
                  error={Boolean(formik.errors.prDate && formik.touched.prDate)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="PR Code *"
                  name="prCode"
                  value={prCode}
                  onBlur={(e) => {
                    handleBlur(e);
                    queryPRCode();
                  }}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value?.trim()?.length <= 10) {
                      setFieldValue('prCode', value.trim() || '');
                      setFieldValue('prCodeStatus', '');
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(formik.errors.prCode && formik.touched.prCode)}
                  helperText={prCodeStatus === 'exist' ? `${prCode} already exists` : undefined}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="PR No."
                  name="prNo"
                  value={prNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(formik.errors.prNo && formik.touched.prNo)}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={Boolean(formik.errors.lanPoolOrder && formik.touched.lanPoolOrder)}
                >
                  <InputLabel>LPool *</InputLabel>
                  <Select
                    label="LPool *"
                    name="lanPoolOrder"
                    value={lanPoolOrder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value={0}>N</MenuItem>
                    <MenuItem value={1}>Y</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="PR Sent *"
                  name="prSend"
                  value={prSend || null}
                  onBlur={handleBlur}
                  onChange={(date) => {
                    const newPrSend = dayjs(date).format('YYYY-MM-DD 00:00:00');
                    setFieldValue('prSend', newPrSend === 'Invalid Date' ? '' : newPrSend);
                  }}
                  error={Boolean(formik.errors.prSend && formik.touched.prSend)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="PO No."
                  name="poNo"
                  value={poNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  // error={Boolean(formik.errors.poNo && formik.touched.poNo)}
                />
              </Grid>

              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="PO Sent"
                  name="poSend"
                  value={poSend || null}
                  onBlur={handleBlur}
                  onChange={(date) => {
                    const newPoSend = dayjs(date).format('YYYY-MM-DD 00:00:00');
                    setFieldValue('poSend', newPoSend === 'Invalid Date' ? '' : newPoSend);
                  }}
                  // error={Boolean(formik.errors.poSend && formik.touched.poSend)}
                />
              </Grid>

              <Grid item xs={6}>
                <CommonNumberFormat
                  name="totalAmount"
                  label="Final Amt *"
                  value={totalAmount}
                  onBlur={handleBlur}
                  error={Boolean(formik.errors.totalAmount && formik.touched.totalAmount)}
                  onValueChange={(val) => {
                    setFieldValue('totalAmount', val?.value);
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  value={contractOptionsMap[contract] || null}
                  options={contractOptions || []}
                  getOptionLabel={(option) => `${option?.contract || ''}---${option?.vendor || ''}`}
                  onChange={(e, value) => {
                    formik.setFieldValue('contract', value?.contract);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="outlined"
                      error={Boolean(formik.errors.contract && formik.touched.contract)}
                      label="Contract No. *"
                      onChange={(e) => {
                        const inputVal = e?.target?.value || '';
                        formik.setFieldValue('contract', inputVal);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Requester's Team *"
                  name="requesterTeam"
                  value={requesterTeam}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(formik.errors.requesterTeam && formik.touched.requesterTeam)}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  value={prRequester}
                  onChange={(e, val) => {
                    setFieldValue('prRequester', val || '');
                  }}
                  options={prRequesteroptions?.map((optionItem) => optionItem?.display) || []}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="PR Requester *"
                      variant="outlined"
                      size="small"
                      name="prRequester"
                      fullWidth
                      onBlur={handleBlur}
                      error={Boolean(formik.errors.prRequester && formik.touched.prRequester)}
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress size={20} color="inherit" /> : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        )
                      }}
                      onChange={(e) => {
                        const inputVal = e?.target?.value || '';
                        setFieldValue('prRequester', inputVal);
                        checkAD(inputVal);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Vendor Code *"
                  name="vendorCode"
                  value={vendorCode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(formik.errors.vendorCode && formik.touched.vendorCode)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="COA *"
                  name="coa"
                  value={coa}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(formik.errors.coa && formik.touched.coa)}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  value={optionsMap[project] || null}
                  onChange={(event, val) => {
                    setFieldValue('project', val?.project || '');
                  }}
                  options={options}
                  getOptionLabel={(option) => `${option.project}---${option.description}`}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="Project"
                      variant="outlined"
                      size="small"
                      name="project"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setFieldValue('project', e?.target?.value || '');
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Remarks"
                  name="remark"
                  value={remark}
                  // onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  // error={Boolean(formik.errors.remark && formik.touched.remark)}
                />
              </Grid>
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(AddPRPODialog);
