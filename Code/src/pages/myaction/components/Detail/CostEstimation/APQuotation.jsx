import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  makeStyles,
  FormControl,
  FormHelperText,
  Button,
  Backdrop,
  CircularProgress,
  Radio,
  FormControlLabel,
  RadioGroup
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { useFormik } from 'formik';
import _ from 'lodash';
// import * as Yup from 'yup';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import SubmitButton from '../../../../../components/Webdp/SubmitButton';
import { CommonTip, Loading } from '../../../../../components';
import API from '../../../../../api/myAction';
import webdpAPI from '../../../../../api/webdp/webdp';
import getFiscalYearOptions from '../../../../../utils/getFiscalYearOptions';
import { formatterMoney } from '../../../../../utils/tools';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-sizeSmall': {
      padding: '3px'
    },
    '& .MuiOutlinedInput-root': {
      textAlign: 'left'
    }
  },
  myInput: {
    '& .MuiInputBase-fullWidth': {
      minWidth: '65px',
      maxWidth: '75px',
      margin: '0 auto'
    }
  },
  trHeight: {
    height: '70px'
  },
  paddingLeft: {
    paddingLeft: '16px !important'
  },
  paddingRight: {
    paddingRight: '16px !important'
  },
  myInput2: {
    '& .MuiInputBase-fullWidth': {
      minWidth: '65px',
      maxWidth: '75px',
      margin: '0 auto',
      background: '#fff'
    }
  }
});

const APQuotation = (props) => {
  const { isRequest } = props;

  const classes = useStyles();
  // const formType = useSelector((state) => state.webDP.formType);
  const dpRequestStatusNo = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const requestForm = useSelector((state) => state.myAction.requestForm); // 整张form的数据
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const myactionProject = useSelector((state) => state.myAction.myactionProject);
  const totalIncome =
    useSelector((state) => state.myAction.requestForm?.dpRequest?.quotationtotal) || 0;
  const { isN3, isN4, isN5 } = requestForm || {};

  const [isFirst, setIsFirst] = useState(true); // 用于有数据后第一次请求报价

  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      data: {},
      options: []
    },
    validate: (values) => {
      const dynamicErrors = {};
      if (
        parseInt(values.data.dpRequest?.lanpool) >= 0 &&
        !values.data.dpRequest?.budgetingfiscalyear
      ) {
        dynamicErrors.budgetingfiscalyear = 'Can not be empty';
      }

      if (
        values.data.dpRequest?.projectCostTotal <= 0 ||
        !values.data.dpRequest?.projectCostTotal
      ) {
        values.data.apLocationList?.forEach((item) => {
          if (!item.aptype && item.serviceType !== 'O') {
            dynamicErrors.aptype = true;
          }
          if (!item.conduitType && item.serviceType !== 'O') {
            dynamicErrors.conduitType = true;
          }
        });
      }
      return dynamicErrors;
    }
  });

  const { setFieldValue, handleChange } = formik;
  const { dpRequest = {}, apLocationList = [] } = formik.values.data;

  const {
    aerialWorkPlatFormQty = '',
    aerialWorkPlatformChargeAll = '',
    dustBarriersQty = '',
    dustBarriersChargeAll = '',
    projectCostTotal = '',
    additionalChargeRemark,
    additionalcharge = '',
    lanpool,
    budgetingfiscalyear = '',
    quotationtotal = 0,
    projectbaseddpcharge
  } = dpRequest;

  const submit = () => {
    const apLocationListMap = apLocationList.map((item) => ({
      ...item,
      aptype: item.aptype || '',
      apqty: item.apqty || 0,
      controllerQty: item.controllerQty || 0,
      conduitType: item.conduitType || '',
      conduitQty: item.conduitQty || 0,
      switchQty: item.switchQty || 0,
      boxQty: item.boxQty || 0,
      boxCharge: item.boxCharge || 0
    }));

    const dpRequestMap = {
      ...dpRequest,
      aerialWorkPlatFormQty: aerialWorkPlatFormQty || 0,
      dustBarriersQty: dustBarriersQty || 0,
      projectCostTotal: projectCostTotal || 0,
      additionalcharge: additionalcharge || 0,
      initStatus: 1,
      projectbaseddpcharge: projectbaseddpcharge || 0
    };
    const saveParams = {
      requestNo,
      apLocationList: apLocationListMap,
      dpRequest: dpRequestMap
    };
    Loading.show();
    API.quotationEstimated(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  /**
   *  请求报价
   * @param {*} initStatus 刷新第一次进入页面传0，手动触发报价默认为1
   */
  const quote = (initStatus, isHideLoading = false) => {
    const apLocationListMap = apLocationList.map((item) => ({
      ...item,
      aptype: item.aptype || '',
      apqty: item.apqty || 0,
      controllerQty: item.controllerQty || 0,
      conduitType: item.conduitType || '',
      conduitQty: item.conduitQty || 0,
      switchQty: item.switchQty || 0,
      boxQty: item.boxQty || 0,
      boxCharge: item.boxCharge || 0
    }));

    const dpRequestMap = {
      ...dpRequest,
      initStatus: initStatus === 0 ? 0 : 1,
      aerialWorkPlatFormQty: aerialWorkPlatFormQty || 0,
      dustBarriersQty: dustBarriersQty || 0,
      projectCostTotal: projectCostTotal || 0,
      additionalcharge: additionalcharge || 0,
      projectbaseddpcharge: projectbaseddpcharge || 0
    };
    const queryParams = {
      dpRequest: dpRequestMap,
      apLocationList: apLocationListMap
    };
    if (!isHideLoading) {
      setIsOpen(true);
    }
    API.quoteByAP(queryParams)
      .then((res) => {
        formik.setFieldValue('data.dpRequest', res?.data?.data?.dpRequest || {});
        formik.setFieldValue('data.apLocationList', res?.data?.data?.apLocationList || []);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  useEffect(() => {
    const newRequestForm = _.cloneDeep(requestForm || {});

    newRequestForm.apLocationList?.forEach((item) => {
      if (!item.isExternalNetwork) {
        item.isExternalNetwork =
          myactionProject.find((projectItem) => projectItem.project === item.dpusage)?.remarks ===
          'MNI'
            ? 'Y'
            : 'N';
      }
      if (item.serviceType === 'O') {
        item.boxQty = 0;
        item.subTotalCharge = 0;
      }
    });

    if (requestForm?.dpRequest?.dprequeststatusno === 50) {
      setIsFirst(false); // 拿到数据后马上请求报价
    } else if (newRequestForm.dpRequest && newRequestForm.dpRequest.projectCostTotal <= 0) {
      newRequestForm.dpRequest.aerialWorkPlatformChargeAll =
        newRequestForm.dpRequest.aerialWorkPlatFormQty *
        newRequestForm.dpRequest.aerialWorkPlatformCharge;

      newRequestForm.dpRequest.dustBarriersChargeAll =
        newRequestForm.dpRequest.dustBarriersQty * newRequestForm.dpRequest.dustBarriersCharge;
    }
    formik.setFieldValue('data', newRequestForm);
  }, [requestForm]);

  useEffect(() => {
    if (!isFirst) {
      quote(0, true);
    }
  }, [isFirst]);

  // 保存 Lanpool budgetingfiscalyear 接口
  const handleEditLanpool = () => {
    formik.setFieldTouched('data.dpRequest.budgetingfiscalyear', true);
    if (Number.isNaN(parseInt(lanpool)) || !budgetingfiscalyear) {
      CommonTip.warning('Please complete the required field first.');
      return;
    }
    Loading.show();
    API.saveLanPool({ requestNo, lanpool: lanpool ?? null, budgetingfiscalyear, totalIncome })
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  useEffect(() => {
    webdpAPI.getOptionList().then((res) => {
      setFieldValue('options', res?.data?.data?.optionTypeList || []);
    });
  }, []);

  const getServiceNameByAP = (v) => {
    let serviceTypeText = '';
    switch (v.serviceType) {
      case 'N':
        serviceTypeText = 'Install new access point';
        break;
      case 'R':
        serviceTypeText = 'Relocate access point';
        break;
      case 'O':
        serviceTypeText = `Others: ${v.otherServiceDesc}`;
        break;
      default:
    }
    return serviceTypeText;
  };

  const changeQty = (e) => {
    if (/^[\d]*$/.test(e.target.value) && e.target.name) {
      setFieldValue(e.target.name, e.target.value);
    }
  };

  const selectWidth = '105px';

  const getLanPoolDisabled = () => {
    if (readOnly || dpRequestStatusNo === 102 || isRequest || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo >= 50 && dpRequestStatusNo !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const lanPoolDisabledValue = getLanPoolDisabled();

  const getSaveDisabled = () => {
    if (readOnly || dpRequestStatusNo === 102 || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo > 50 && dpRequestStatusNo !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const getFormDisabled = () => {
    if (
      readOnly ||
      projectCostTotal > 0 ||
      dpRequestStatusNo === 102 ||
      isRequest ||
      isCancel ||
      isPending
    ) {
      return true;
    }

    if (dpRequestStatusNo >= 50 && dpRequestStatusNo !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const getProjectCostDisabled = () => {
    if (readOnly || dpRequestStatusNo === 102 || isRequest || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo >= 50 && dpRequestStatusNo !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const projectCostDisabledVal = getProjectCostDisabled();

  const getSubmitDisabled = () => {
    if (readOnly || dpRequestStatusNo === 102 || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo >= 50 && dpRequestStatusNo !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const getOptions = (item) => {
    const optionsFilter = formik.values.options.filter((item) => item.remark !== 'P'); // P的不出现在下拉列表

    if (item.conduitType === 'P') {
      // 为了兼容旧系统选择了P，将P也放到下拉列表
      return formik.values.options;
    }

    return optionsFilter;
  };

  const getYearOptions = () => {
    let result = getFiscalYearOptions();
    if (budgetingfiscalyear && !result.find((item) => item.value === budgetingfiscalyear)) {
      // 兼容数值不在下拉列表
      const pre = budgetingfiscalyear.slice(0, 2);
      const next = budgetingfiscalyear.slice(2);
      const label = `20${pre}/${next}`;
      const obj = { label, value: budgetingfiscalyear };
      result = [...result, obj];
    }
    return result;
  };

  const formDisabledValue = getFormDisabled();

  return (
    <>
      <Backdrop open={isOpen} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>
      <Grid item xs={12}>
        <Table
          style={{ backgroundColor: '#eef5f9', border: '2px solid #000' }}
          size="small"
          className={classes.table}
        >
          <TableHead>
            <TableRow style={{ backgroundColor: '#078080', height: '56px' }}>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>
                Service
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>
                Location ({dpRequest.serviceathosp || ''})
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }} colSpan={7}>
                Access Point
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }} colSpan={2}>
                Controller
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }} colSpan={3}>
                Cabling
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }} colSpan={2}>
                Switch Port
              </TableCell>
              <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }} colSpan={2}>
                Others
              </TableCell>
              <TableCell
                align="right"
                className={classes.paddingRight}
                style={{ color: 'white', fontWeight: 'bold' }}
              >
                Subtotal (HKD)
              </TableCell>
            </TableRow>
            <TableRow className={classes.trHeight}>
              <TableCell align="center" colSpan={1} />
              <TableCell align="center" colSpan={1} />
              <TableCell align="center" colSpan={5} />
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Charge(HKD)</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Charge(HKD)</TableCell>
              <TableCell align="center">Conduit Type</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Charge(HKD)</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Charge(HKD)</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Charge(HKD)</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {apLocationList.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="left" colSpan={1} className={classes.paddingLeft}>
                  {getServiceNameByAP(item)}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Block: {item.block}
                  <br />
                  Floor: {item.floor}
                  <br />
                  RM/Ward: {item.room}
                </TableCell>
                <TableCell align="left" colSpan={5}>
                  {/* <FormControl
                    style={
                      formDisabledValue
                        ? { width: selectWidth }
                        : { width: selectWidth, background: '#fff' }
                    }
                    size="small"
                    variant="outlined"
                  >
                    <Select
                      value={item.aptype || ''}
                      name={`data.apLocationList[${index}].aptype`}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      disabled={formDisabledValue}
                      error={Boolean(
                        formik.errors.aptype &&
                          formik.touched.data?.apLocationList?.[index]?.aptype &&
                          !item.aptype &&
                          item.serviceType !== 'O'
                      )}
                    >
                      {formik.values.options
                        .filter((filterItem) => filterItem.optionType === 'AccessPoint')
                        .map((optionItem) => (
                          <MenuItem key={optionItem.optionValue} value={optionItem.optionValue}>
                            {optionItem.optionValue}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl> */}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <WebdpTextField
                    fullWidth
                    className={formDisabledValue === true ? classes.myInput : classes.myInput2}
                    name={`data.apLocationList[${index}].apqty`}
                    value={item.apqty ?? ''}
                    onChange={changeQty}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.apcharge)}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <WebdpTextField
                    fullWidth
                    className={formDisabledValue === true ? classes.myInput : classes.myInput2}
                    name={`data.apLocationList[${index}].controllerQty`}
                    value={item.controllerQty ?? ''}
                    onChange={changeQty}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.controllerCharge)}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    style={
                      formDisabledValue === true
                        ? { width: selectWidth }
                        : { width: selectWidth, background: '#fff' }
                    }
                  >
                    <Select
                      value={item.conduitType || ''}
                      name={`data.apLocationList[${index}].conduitType`}
                      disabled={formDisabledValue}
                      onChange={handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        quote();
                      }}
                      error={Boolean(
                        formik.errors.conduitType &&
                          formik.touched.data?.apLocationList?.[index]?.conduitType &&
                          !item.conduitType &&
                          item.serviceType !== 'O'
                      )}
                    >
                      {getOptions(item)
                        .filter((filterItem) => filterItem.optionType === 'Conduit')
                        .map((optionItem) => (
                          <MenuItem key={optionItem.remark} value={optionItem.remark}>
                            {optionItem.optionValue}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <WebdpTextField
                    fullWidth
                    className={formDisabledValue === true ? classes.myInput : classes.myInput2}
                    name={`data.apLocationList[${index}].conduitQty`}
                    value={item.conduitQty ?? ''}
                    onChange={changeQty}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.conduitCharge)}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <WebdpTextField
                    fullWidth
                    className={formDisabledValue === true ? classes.myInput : classes.myInput2}
                    name={`data.apLocationList[${index}].switchQty`}
                    value={item.switchQty ?? ''}
                    onChange={changeQty}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.switchCharge)}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <WebdpTextField
                    fullWidth
                    className={formDisabledValue === true ? classes.myInput : classes.myInput2}
                    name={`data.apLocationList[${index}].boxQty`}
                    value={item.boxQty ?? ''}
                    onChange={changeQty}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <NumberFormat
                    inputProps={{
                      style:
                        formDisabledValue === true
                          ? { textAlign: 'right' }
                          : { textAlign: 'right', background: '#fff' }
                    }}
                    prefix="$ "
                    customInput={WebdpTextField}
                    decimalScale={2}
                    thousandSeparator=","
                    allowNegative={false}
                    className={classes.myInput}
                    value={item.boxCharge ?? ''}
                    name={`data.apLocationList[${index}].boxCharge`}
                    onValueChange={(val) => {
                      setFieldValue(`data.apLocationList[${index}].boxCharge`, val.floatValue);
                    }}
                    disabled={formDisabledValue}
                    onBlur={quote}
                  />
                </TableCell>
                <TableCell align="right" colSpan={1} className={classes.paddingRight}>
                  {formatterMoney(item.subTotalCharge)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow className={classes.trHeight}>
              <TableCell colSpan={1} className={classes.paddingLeft}>
                Aerial Work Platform
              </TableCell>
              <TableCell colSpan={2} />
              <TableCell align="left" colSpan={1}>
                <WebdpTextField
                  label="Amount"
                  style={
                    formDisabledValue === true
                      ? { width: selectWidth }
                      : { width: selectWidth, background: '#fff' }
                  }
                  name="data.dpRequest.aerialWorkPlatFormQty"
                  value={aerialWorkPlatFormQty ?? ''}
                  onChange={changeQty}
                  disabled={formDisabledValue}
                  onBlur={quote}
                />
              </TableCell>
              <TableCell colSpan={14} />
              <TableCell align="right" colSpan={1} className={classes.paddingRight}>
                {formatterMoney(aerialWorkPlatformChargeAll)}
              </TableCell>
            </TableRow>
            <TableRow className={classes.trHeight}>
              <TableCell colSpan={1} className={classes.paddingLeft}>
                Dust Control
              </TableCell>
              <TableCell align="center" colSpan={2} />
              <TableCell align="left" colSpan={1}>
                <WebdpTextField
                  label="Amount"
                  style={
                    formDisabledValue === true
                      ? { width: selectWidth }
                      : { width: selectWidth, background: '#fff' }
                  }
                  name="data.dpRequest.dustBarriersQty"
                  value={dustBarriersQty ?? ''}
                  onChange={changeQty}
                  disabled={formDisabledValue}
                  onBlur={quote}
                />
              </TableCell>
              <TableCell colSpan={14} />
              <TableCell align="right" colSpan={1} className={classes.paddingRight}>
                {formatterMoney(dustBarriersChargeAll)}
              </TableCell>
            </TableRow>

            {requestNo.length < 9 && (
              <TableRow className={classes.trHeight}>
                <TableCell colSpan={18} className={classes.paddingLeft}>
                  Project Basic Charge
                </TableCell>

                <TableCell align="right" colSpan={1}>
                  <NumberFormat
                    style={{ width: '100px', marginRight: 12 }}
                    inputProps={{
                      style:
                        formDisabledValue === true
                          ? { textAlign: 'right' }
                          : { textAlign: 'right', background: '#fff' }
                    }}
                    prefix="$ "
                    customInput={WebdpTextField}
                    decimalScale={2}
                    thousandSeparator=","
                    value={projectbaseddpcharge ?? ''}
                    name="data.dpRequest.projectbaseddpcharge"
                    disabled={formDisabledValue}
                    onValueChange={(val) => {
                      formik.setFieldValue('data.dpRequest.projectbaseddpcharge', val.floatValue);
                    }}
                    onBlur={quote}
                  />
                </TableCell>
              </TableRow>
            )}

            <TableRow className={classes.trHeight}>
              <TableCell colSpan={18} className={classes.paddingLeft}>
                Project Cost
              </TableCell>
              {/* <TableCell align="center" colSpan={16} /> */}
              <TableCell align="right" colSpan={1}>
                <NumberFormat
                  style={{ width: '100px', marginRight: 12 }}
                  // className={classes.paddingRight}
                  inputProps={{
                    style:
                      projectCostDisabledVal === true
                        ? { textAlign: 'right' }
                        : { textAlign: 'right', background: '#fff' }
                  }}
                  prefix="$ "
                  customInput={WebdpTextField}
                  decimalScale={2}
                  thousandSeparator=","
                  allowNegative={false}
                  // className={classes.myInput}
                  value={projectCostTotal ?? ''}
                  name="data.dpRequest.projectCostTotal"
                  disabled={projectCostDisabledVal}
                  onValueChange={(val) => {
                    formik.setFieldValue('data.dpRequest.projectCostTotal', val.floatValue);
                  }}
                  onBlur={quote}
                />
              </TableCell>
            </TableRow>
            <TableRow className={classes.trHeight}>
              <TableCell align="left" colSpan={3} className={classes.paddingLeft}>
                Other Charges
              </TableCell>
              <TableCell align="center" colSpan={14}>
                <WebdpTextField
                  fullWidth
                  label="Description"
                  value={additionalChargeRemark || ''}
                  style={projectCostDisabledVal === true ? {} : { background: '#fff' }}
                  name="data.dpRequest.additionalChargeRemark"
                  onChange={handleChange}
                  disabled={projectCostDisabledVal}
                  onBlur={quote}
                />
              </TableCell>
              <TableCell align="center" colSpan={1} />
              <TableCell align="right" colSpan={1}>
                <NumberFormat
                  inputProps={{ style: { textAlign: 'right' } }}
                  style={
                    projectCostDisabledVal === true
                      ? { width: '100px', marginRight: 12 }
                      : { width: '100px', marginRight: 12, background: '#fff' }
                  }
                  // className={classes.paddingRight}
                  prefix="$ "
                  customInput={WebdpTextField}
                  decimalScale={2}
                  thousandSeparator=","
                  allowNegative={false}
                  // className={classes.myInput}
                  value={additionalcharge ?? ''}
                  name="data.dpRequest.additionalcharge"
                  onValueChange={(val) => {
                    setFieldValue('data.dpRequest.additionalcharge', val.floatValue);
                  }}
                  disabled={projectCostDisabledVal}
                  onBlur={quote}
                />
              </TableCell>
            </TableRow>
            <TableRow className={classes.trHeight}>
              <TableCell colSpan={18} className={classes.paddingLeft}>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right" colSpan={1} className={classes.paddingRight}>
                <strong>{formatterMoney(quotationtotal)}</strong>
              </TableCell>
            </TableRow>
            <TableRow className={classes.trHeight}>
              <TableCell colSpan={1} className={classes.paddingLeft}>
                LAN Pool Order
              </TableCell>
              <TableCell colSpan={2}>
                <FormControl disabled={lanPoolDisabledValue} style={{ width: '140px' }}>
                  <RadioGroup
                    row
                    value={parseInt(lanpool)}
                    name="data.dpRequest.lanpool"
                    onChange={(e) => {
                      formik.setFieldValue('data.dpRequest.lanpool', parseInt(e.target.value));
                    }}
                  >
                    <FormControlLabel
                      value={1}
                      control={
                        <Radio
                          style={
                            lanPoolDisabledValue === true ? {} : { background: '#fff', padding: 3 }
                          }
                        />
                      }
                      label="Yes"
                      //
                    />
                    <FormControlLabel
                      value={0}
                      control={
                        <Radio
                          style={
                            lanPoolDisabledValue === true ? {} : { background: '#fff', padding: 3 }
                          }
                        />
                      }
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
              <TableCell colSpan={1} align="left">
                <WebdpTextField
                  select
                  label="Fiscal Year"
                  style={
                    lanPoolDisabledValue === true
                      ? { width: selectWidth }
                      : { width: selectWidth, background: '#fff' }
                  }
                  name="data.dpRequest.budgetingfiscalyear"
                  value={budgetingfiscalyear || ''}
                  onChange={handleChange}
                  disabled={lanPoolDisabledValue}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.data?.dpRequest?.budgetingfiscalyear &&
                      formik.errors.budgetingfiscalyear
                  )}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {getYearOptions().map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </WebdpTextField>
              </TableCell>
              <TableCell align="center" colSpan={15} />
            </TableRow>
          </TableBody>
        </Table>
        <FormHelperText style={{ color: 'red' }} variant="outlined">
          *The cost estimation is subject to change based on site situation, e.g., additional
          project cost, dust control, over-time charges.
        </FormHelperText>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '0.5rem', display: isRequest ? 'none' : 'block' }}>
        {dpRequestStatusNo >= 50 && (
          <SubmitButton
            label="Send All"
            submitLabel="Confirm"
            title="Sending Cost Estimation"
            message={`The total estimated cost is ${formatterMoney(
              quotationtotal
            )}. Do you confirm to send to the requester?`}
            submitAction={() => {
              formik.handleSubmit(); // 为了走一遍校验
              if (formik.isValid) {
                submit();
              } else {
                CommonTip.warning('Please complete the required field first.');
              }
            }}
            disabled={getSubmitDisabled()}
            style={{ marginRight: 15 }}
          />
        )}
        {dpRequestStatusNo > 50 && (
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleEditLanpool}
            disabled={getSaveDisabled()}
          >
            Save LAN Pool Order
          </Button>
        )}
      </Grid>
    </>
  );
};

export default memo(APQuotation);
