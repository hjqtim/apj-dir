import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  FormHelperText,
  Button,
  Backdrop,
  CircularProgress,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  makeStyles
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { useFormik } from 'formik';
import _ from 'lodash';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import SubmitButton from '../../../../../components/Webdp/SubmitButton';
import API from '../../../../../api/myAction';
import { CommonTip, Loading, CommonAmount } from '../../../../../components';
import getFiscalYearOptions from '../../../../../utils/getFiscalYearOptions';
import { formatterMoney } from '../../../../../utils/tools';

const getServiceNameByDP = (v) => {
  let serviceTypeText = '';

  switch (v.serviceType) {
    case 'N':
      serviceTypeText = 'Install new data port ';
      break;
    case 'R':
      serviceTypeText = 'Relocate data port ';
      break;
    case 'D':
      serviceTypeText = 'Install new dual data port ';
      break;
    case 'L':
      serviceTypeText = 'Relocate new dual data port ';
      break;
    case 'O':
      serviceTypeText = `Others: ${v.otherServiceDesc} `;
      break;
    default:
  }

  let conduitTypeText = '';
  switch (v.conduitType) {
    case 'M':
      conduitTypeText = 'with metallic conduit protection';
      break;
    case 'P':
      conduitTypeText = 'with plastic conduit protection';
      break;
    case 'N':
      conduitTypeText = 'without conduit protection';
      break;
    default:
  }
  return serviceTypeText + conduitTypeText;
};

const useStyles = makeStyles({
  table: {
    borderCollapse: 'inherit!important'
  }
});

const DPQuotation = (props) => {
  const myClasses = useStyles();

  const { isRequest } = props;
  // const formType = useSelector((state) => state.webDP.formType);
  const [isOpen, setIsOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true); // 用于有数据后第一次请求报价
  const requestForm = useSelector((state) => state.myAction.requestForm); // 整张form的数据

  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const myactionProject = useSelector((state) => state.myAction.myactionProject);

  const totalIncome =
    useSelector((state) => state.myAction.requestForm?.dpRequest?.quotationtotal) || 0;

  const { isN3, isN4, isN5 } = requestForm || {};

  const formik = useFormik({
    initialValues: {
      data: {}
    },
    validate: (values) => {
      const dynamicErrors = {};
      if (
        parseInt(values.data.dpRequest?.lanpool) >= 0 &&
        !values.data.dpRequest?.budgetingfiscalyear
      ) {
        dynamicErrors.budgetingfiscalyear = 'Can not be empty';
      }

      return dynamicErrors;
    }
  });

  const { dpRequest = {}, dpLocationList = [] } = formik.values.data;

  const {
    aerialWorkPlatFormQty = '',
    aerialWorkPlatformChargeAll = '',
    dustBarriersQty = '',
    dustBarriersChargeAll = '',
    projectCostTotal = '',
    additionalChargeRemark,
    additionalcharge = '',
    lanpool,
    budgetingfiscalyear,
    quotationtotal = 0,
    projectbaseddpcharge
  } = dpRequest;

  const isMoreThanZero = projectCostTotal > 0;

  const getLanPoolDisabled = () => {
    if (readOnly || dprequeststatusno === 102 || isRequest || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno >= 50 && dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const lanPoolDisabledValue = getLanPoolDisabled();

  useEffect(() => {
    const newRequestForm = _.cloneDeep(requestForm || {});

    newRequestForm.dpLocationList?.forEach((item) => {
      if (!item.isExternalNetwork) {
        item.isExternalNetwork =
          myactionProject.find((projectItem) => projectItem.project === item.dpusage)?.remarks ===
          'MNI'
            ? 'Y'
            : 'N';
      }

      if (item.serviceType === 'O') {
        item.cablingCharge = 0;
        item.switchCharge = 0;
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
    API.saveLanPool({
      requestNo,
      lanpool: lanpool ?? null,
      budgetingfiscalyear,
      totalIncome
    })
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

  const submitHanlder = () => {
    const dpLocationListMap = dpLocationList.map((item) => ({
      ...item,
      numOfDP: item.numOfDP || 0
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

    const submitParams = {
      requestNo,
      dpRequest: dpRequestMap,
      dpLocationList: dpLocationListMap
    };

    Loading.show();
    API.quotationEstimated(submitParams)
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

  const changeQty = (e) => {
    if (/^[\d]*$/.test(e.target.value) && e.target.name) {
      formik.setFieldValue(e.target.name, e.target.value);
    }
  };

  const getSaveDisabled = () => {
    if (readOnly || dprequeststatusno === 102 || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno > 50 && dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const aerialWorkPlatformDisabled = () => {
    if (
      readOnly ||
      isMoreThanZero ||
      dprequeststatusno === 102 ||
      isRequest ||
      isCancel ||
      isPending
    ) {
      return true;
    }

    if (dprequeststatusno >= 50 && dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const aerialWorkPlatDisabledVal = aerialWorkPlatformDisabled();

  const getProjectCostDisabled = () => {
    if (readOnly || dprequeststatusno === 102 || isRequest || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno >= 50 && dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const projectCostDisabledValue = getProjectCostDisabled();

  const getSubmitDisabled = () => {
    if (readOnly || dprequeststatusno === 102 || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno >= 50 && dprequeststatusno !== 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  /**
   * 请求报价
   * @param {*} isHideLoading 是否隐藏loading
   */
  const quote = (initStatus, isHideLoading = false) => {
    const dpLocationListMap = dpLocationList.map((item) => ({
      ...item,
      numOfDP: item.numOfDP || 0
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
      dpLocationList: dpLocationListMap
    };

    if (!isHideLoading) {
      setIsOpen(true);
    }
    API.quoteByDP(queryParams)
      .then((res) => {
        formik.setFieldValue('data.dpRequest', res?.data?.data?.dpRequest || {});
        formik.setFieldValue('data.dpLocationList', res?.data?.data?.dpLocationList || []);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const getOptions = () => {
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

  return (
    <>
      <Backdrop open={isOpen} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>
      <Grid item xs={12}>
        <Table
          // aria-label="spanning table"
          style={{ backgroundColor: '#eef5f9', border: '2px solid #000' }}
          classes={{ root: myClasses.table }}
        >
          <TableHead>
            <TableRow style={{ backgroundColor: '#078080' }}>
              <TableCell align="center" colSpan={4} style={{ color: 'white', fontWeight: 'bold' }}>
                Service
              </TableCell>
              <TableCell align="center" colSpan={1} style={{ color: 'white', fontWeight: 'bold' }}>
                Data Port Amount
              </TableCell>
              <TableCell align="center" colSpan={4} style={{ color: 'white', fontWeight: 'bold' }}>
                Location ({dpRequest.serviceathosp || ''})
              </TableCell>
              <TableCell align="center" colSpan={1} style={{ color: 'white', fontWeight: 'bold' }}>
                Cabling
              </TableCell>
              <TableCell align="center" colSpan={1} style={{ color: 'white', fontWeight: 'bold' }}>
                Switch Port
              </TableCell>
              <TableCell align="center" colSpan={1} style={{ color: 'white', fontWeight: 'bold' }}>
                Subtotal (HKD)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell align="center" colSpan={1}>
                Qty
              </TableCell>
              <TableCell align="center">Dept</TableCell>
              <TableCell align="center">Block</TableCell>
              <TableCell align="center">Floor</TableCell>
              <TableCell align="center">RM/Ward</TableCell>
              <TableCell align="right" colSpan={1}>
                Charge (HKD)
              </TableCell>
              <TableCell align="right" colSpan={1}>
                Charge (HKD)
              </TableCell>
              <TableCell align="center" colSpan={1}>
                {/* Amount */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dpLocationList.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell colSpan={4}>{getServiceNameByDP(item)}</TableCell>
                <TableCell align="left" colSpan={1}>
                  <CommonAmount
                    value={item.numOfDP}
                    type="text"
                    label="Amount"
                    name={`data.dpLocationList[${index}].numOfDP`}
                    style={
                      aerialWorkPlatDisabledVal === true
                        ? { width: '100px' }
                        : { width: '100px', background: '#fff' }
                    }
                    onChange={(v) => {
                      formik.setFieldValue(`data.dpLocationList[${index}].numOfDP`, v);
                    }}
                    disabled={aerialWorkPlatDisabledVal}
                    onBlur={() => quote()}
                  />
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  {item.dept}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  {item.block}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  {item.floor}
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  {item.room}
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.cablingCharge)}
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.switchCharge)}
                </TableCell>
                <TableCell align="right" colSpan={1}>
                  {formatterMoney(item.subTotalCharge)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={4}>Aerial Work Platform</TableCell>
              <TableCell align="left" colSpan={1}>
                <WebdpTextField
                  label="Amount"
                  name="data.dpRequest.aerialWorkPlatFormQty"
                  style={
                    aerialWorkPlatDisabledVal === true
                      ? { width: '100px' }
                      : { width: '100px', background: '#fff' }
                  }
                  value={aerialWorkPlatFormQty}
                  onChange={changeQty}
                  disabled={aerialWorkPlatDisabledVal}
                  onBlur={() => quote()}
                />
              </TableCell>
              <TableCell align="center" colSpan={6} />
              <TableCell align="right" colSpan={1}>
                {formatterMoney(aerialWorkPlatformChargeAll)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Dust Control</TableCell>
              <TableCell align="left" colSpan={1}>
                <WebdpTextField
                  label="Amount"
                  name="data.dpRequest.dustBarriersQty"
                  style={
                    aerialWorkPlatDisabledVal === true
                      ? { width: '100px' }
                      : { width: '100px', background: '#fff' }
                  }
                  value={dustBarriersQty}
                  onChange={changeQty}
                  disabled={aerialWorkPlatDisabledVal}
                  onBlur={() => quote()}
                />
              </TableCell>
              <TableCell align="center" colSpan={6} />
              <TableCell align="right" colSpan={1}>
                {formatterMoney(dustBarriersChargeAll)}
              </TableCell>
            </TableRow>
            {requestNo.length < 9 && (
              <TableRow>
                <TableCell colSpan={11}>Project Basic Charge</TableCell>
                <TableCell align="right" colSpan={1}>
                  <NumberFormat
                    style={
                      projectCostDisabledValue === true
                        ? { width: '100px' }
                        : { width: '100px', background: '#fff' }
                    }
                    inputProps={{ style: { textAlign: 'right' } }}
                    label="Charge"
                    prefix="$ "
                    customInput={WebdpTextField}
                    decimalScale={2}
                    thousandSeparator=","
                    value={projectbaseddpcharge ?? ''}
                    name="data.dpRequest.projectbaseddpcharge"
                    disabled={aerialWorkPlatDisabledVal}
                    onValueChange={(val) => {
                      formik.setFieldValue('data.dpRequest.projectbaseddpcharge', val.floatValue);
                    }}
                    onBlur={quote}
                  />
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={11}>Project Cost</TableCell>
              {/* <TableCell colSpan={4} /> */}
              <TableCell align="right" colSpan={1}>
                <NumberFormat
                  inputProps={{ style: { textAlign: 'right' } }}
                  thousandSeparator=","
                  prefix="$ "
                  label="Charge"
                  name="data.dpRequest.projectCostTotal"
                  customInput={WebdpTextField}
                  style={
                    projectCostDisabledValue === true
                      ? { width: '100px' }
                      : { width: '100px', background: '#fff' }
                  }
                  decimalScale={2}
                  allowNegative={false}
                  value={projectCostTotal}
                  onValueChange={(val) => {
                    formik.setFieldValue('data.dpRequest.projectCostTotal', val.floatValue);
                  }}
                  disabled={projectCostDisabledValue}
                  onBlur={() => quote()}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Other Charges</TableCell>
              <TableCell align="left" colSpan={7}>
                <WebdpTextField
                  label="Description"
                  value={additionalChargeRemark || ''}
                  name="data.dpRequest.additionalChargeRemark"
                  style={projectCostDisabledValue === true ? {} : { background: '#fff' }}
                  onChange={formik.handleChange}
                  disabled={projectCostDisabledValue}
                />
              </TableCell>
              <TableCell align="right" colSpan={1}>
                <NumberFormat
                  inputProps={{ style: { textAlign: 'right' } }}
                  thousandSeparator=","
                  prefix="$ "
                  label="Charge"
                  customInput={WebdpTextField}
                  decimalScale={2}
                  style={
                    projectCostDisabledValue === true
                      ? { width: '100px' }
                      : { width: '100px', background: '#fff' }
                  }
                  allowNegative={false}
                  value={additionalcharge}
                  name="data.dpRequest.additionalcharge"
                  onValueChange={(val) => {
                    formik.setFieldValue('data.dpRequest.additionalcharge', val.floatValue);
                  }}
                  disabled={projectCostDisabledValue}
                  onBlur={() => quote()}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="center" colSpan={5} />
              <TableCell align="right" colSpan={1}>
                <strong>{formatterMoney(quotationtotal)}</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>LAN Pool Order</TableCell>
              <TableCell colSpan={2}>
                <FormControl disabled={lanPoolDisabledValue}>
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

              <TableCell colSpan={2} align="left">
                <WebdpTextField
                  label="Fiscal Year"
                  select
                  name="data.dpRequest.budgetingfiscalyear"
                  style={lanPoolDisabledValue === true ? {} : { background: '#fff' }}
                  onChange={formik.handleChange}
                  disabled={lanPoolDisabledValue}
                  value={budgetingfiscalyear || ''}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.data?.dpRequest?.budgetingfiscalyear &&
                      formik.errors.budgetingfiscalyear
                  )}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {getOptions().map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </WebdpTextField>
              </TableCell>
              <TableCell colSpan={12} />
            </TableRow>
          </TableBody>
        </Table>
        <FormHelperText style={{ color: 'red' }} variant="outlined">
          *The cost estimation is subject to change based on site situation, e.g., additional
          project cost, dust control, over-time charges.
        </FormHelperText>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '0.5rem', display: isRequest ? 'none' : 'block' }}>
        {dprequeststatusno >= 50 && (
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
                submitHanlder();
              } else {
                CommonTip.warning('Please complete the required field first.');
              }
            }}
            disabled={getSubmitDisabled()}
            style={{ marginRight: 15 }}
          />
        )}
        {dprequeststatusno > 50 && (
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

export default memo(DPQuotation);
