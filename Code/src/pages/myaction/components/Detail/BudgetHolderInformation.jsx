import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, MenuItem, TextField, IconButton, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ClearIcon from '@material-ui/icons/Clear';
import NumberFormat from 'react-number-format';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpRadioField from '../../../../components/Webdp/WebdpRadioField';
import ExternalCompany from './ExternalCompany';
import BudgetHolderContact from './BudgetHolderContact';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import API from '../../../../api/webdp/webdp';
import useSetReqManBudTouch from '../../../../hooks/webDP/useSetReqManBudTouch';
import { setMyBudgetHolderByMyAction } from '../../../../redux/myAction/my-action-actions';
import useHandleMaximum from './useHandleMaximum';

const choice = [
  { label: 'CMS', value: 'LPool-CMS' },
  { label: 'IPMOE', value: 'LPool-IPMOE' },
  { label: 'Ophthalmology Filmless', value: 'LPool-OPH' }
];

const paymentmethodOptions = [
  {
    label: 'Chart of Account No.',
    value: 1
  },
  { label: 'Bill to External Company', value: 3 },
  { label: 'Other', value: 2 }
];

const COAOptions = [
  { length: 3, label: 'Institution', width: '150px' },
  { length: 2, label: 'Fund', width: '150px' },
  { length: 6, label: 'Account', width: '150px' },
  { length: 7, label: 'Section', width: '150px' },
  { length: 2, label: 'Type', width: '150px' },
  { length: 5, label: 'Analytical', width: '150px' }
];

const BudgetHolderInformation = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const setReqManBudTouchByFiled = useSetReqManBudTouch();
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);
  // const readOnly = false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  // const apptype = useSelector((state) => state.myAction.requestForm?.dpRequest?.apptype);
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isBudgetHolder, isManager, isRequester } = requestForm || {};
  const quotationtotal = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.quotationtotal
  );

  const MaximumError = useHandleMaximum();

  useEffect(() => {
    API.getCOAInstitutionList().then((res) => {
      const newOptions = res?.data?.data?.COAInstitutionList || [];
      setMyBudgetHolderByField('COAoptions', newOptions);
    });
  }, []);

  const setMyBudgetHolderByField = (field, value) => {
    const newMyBudgetHolder = {
      ...myBudgetHolder,
      [field]: value
    };
    if (newMyBudgetHolder.paymentmethod === 3 && newMyBudgetHolder.fundconfirmed === 0) {
      newMyBudgetHolder.fundconfirmed = quotationtotal;
    }
    dispatch(setMyBudgetHolderByMyAction(newMyBudgetHolder));
  };

  const setCardNoByIndex = (index, value) => {
    try {
      const { length } = COAOptions[index];
      const newValue = value.slice(0, length);
      const newCardNo = myBudgetHolder.cardNo || [];
      newCardNo[index] = newValue;
      const newMyBudgetHolder = {
        ...myBudgetHolder,
        cardNo: newCardNo
      };
      dispatch(setMyBudgetHolderByMyAction(newMyBudgetHolder));

      if (index <= 4 && newValue.length >= length) {
        const focusPoint = document.getElementById(`COA${index + 1}`);
        focusPoint.focus?.();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const optionsFilter = useMemo(
    () =>
      myBudgetHolder?.COAoptions?.map(
        (item) => `${item.erpinstitutionValue}---${item.erpinstitutionCode}`
      ),
    [myBudgetHolder.COAoptions]
  );

  const sourceValue = myBudgetHolder.cardNo?.[0];

  const getSource = useMemo(() => {
    if (!myBudgetHolder.COAoptions?.length || !sourceValue) {
      return '';
    }
    const hasInstitution = myBudgetHolder.COAoptions?.find(
      (item) => item.erpinstitutionValue === Number(sourceValue)
    );
    if (!hasInstitution) {
      return <span style={{ color: '#00AB91' }}>New</span>;
    }

    if (!hasInstitution.effectiveDate && !hasInstitution.expiryDate) {
      return hasInstitution.erpinstitutionCode;
    }

    if (hasInstitution.effectiveDate && hasInstitution.expiryDate) {
      if (
        new Date().valueOf() > new Date(hasInstitution.effectiveDate).valueOf() &&
        new Date().valueOf() < new Date(hasInstitution.expiryDate).valueOf()
      ) {
        return hasInstitution.erpinstitutionCode;
      }

      return (
        <span style={{ color: '#FD5841' }}>
          {hasInstitution.erpinstitutionCode} is not on the expiry date
        </span>
      );
    }

    if (hasInstitution.effectiveDate && !hasInstitution.expiryDate) {
      if (new Date().valueOf() > new Date(hasInstitution.effectiveDate).valueOf()) {
        return hasInstitution.erpinstitutionCode;
      }
      return (
        <span style={{ color: '#FD5841' }}>
          {hasInstitution.erpinstitutionCode} not yet effective
        </span>
      );
    }

    if (!hasInstitution.effectiveDate && hasInstitution.expiryDate) {
      if (new Date().valueOf() < new Date(hasInstitution.expiryDate).valueOf()) {
        return hasInstitution.erpinstitutionCode;
      }
      return (
        <span style={{ color: '#FD5841' }}>
          {hasInstitution.erpinstitutionCode} has been expried
        </span>
      );
    }

    return '';
  }, [myBudgetHolder.COAoptions, sourceValue]);

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isRequester && dprequeststatusno === 100) {
      return false;
    }
    if (isManager && dprequeststatusno === 110) {
      return false;
    }
    return true;
  };

  const getCostDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isRequester && dprequeststatusno === 100) {
      return false;
    }
    if (isManager && dprequeststatusno === 110) {
      return false;
    }
    if (isBudgetHolder && dprequeststatusno === 120) {
      return false;
    }
    return true;
  };

  const getMaximumError = () => {
    if (!reqManBudTouch.fundconfirmed) {
      return false;
    }

    return MaximumError;
  };

  const fundtransOptions = [
    // {
    //   label: `Fund transferred to HO IT&HI ${apptype === 'DP' ? 'N3' : 'N3'} Team`,
    //   value: 1
    // },
    // { label: `HO IT&HI ${apptype === 'DP' ? 'N3' : 'N3'} Team has agreed to fund`, value: 2 },
    {
      label: `Fund transferred to HO IT&HI N3 Team`,
      value: 1
    },
    { label: `HO IT&HI N3 Team has agreed to fund`, value: 2 },
    { label: 'Funded by others', value: 0 }
  ];

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Grid container>
          <Grid {...TitleProps}>
            <Typography variant="h6" style={{ color: webdpColor.title }}>
              <strong>Budget Holder (or Delegate) Information (For Fund Confirmation)</strong>
            </Typography>
          </Grid>

          <Grid {...FormControlProps}>
            <WebdpRadioField
              row
              label="Source of funding *"
              options={fundtransOptions}
              onBlur={() => setReqManBudTouchByFiled('fundtransferredtohsteam')}
              error={Boolean(
                Number.isNaN(parseInt(myBudgetHolder.fundtransferredtohsteam)) &&
                  reqManBudTouch.fundtransferredtohsteam
              )}
              value={myBudgetHolder.fundtransferredtohsteam}
              disabled={getFormDisabled()}
              onChange={(e, v) => {
                setMyBudgetHolderByField('fundtransferredtohsteam', parseInt(v));
              }}
            />
          </Grid>
          <Grid {...FormControlProps} container spacing={2}>
            {parseInt(myBudgetHolder.fundtransferredtohsteam) >= 0 && (
              <Grid item xs={3}>
                <NumberFormat
                  isNumericString
                  label="Maximum Cost You Commit *"
                  allowNegative={false}
                  value={myBudgetHolder.fundconfirmed}
                  customInput={WebdpTextField}
                  prefix="$"
                  decimalScale={2}
                  thousandSeparator
                  disabled={getCostDisabled()}
                  onBlur={() => setReqManBudTouchByFiled('fundconfirmed')}
                  error={getMaximumError()}
                  helperText={
                    getMaximumError()
                      ? `Maximum Cost You Commit must be greater than ${quotationtotal}`
                      : undefined
                  }
                  onValueChange={(val) => {
                    setMyBudgetHolderByField('fundconfirmed', val?.value);
                  }}
                />
              </Grid>
            )}

            {parseInt(myBudgetHolder.fundtransferredtohsteam) === 1 && (
              <Grid item xs={3}>
                <WebdpTextField
                  select
                  label="Select Department *"
                  value={myBudgetHolder.fundparty}
                  disabled={getFormDisabled()}
                  onBlur={() => setReqManBudTouchByFiled('fundparty')}
                  error={Boolean(!myBudgetHolder.fundparty && reqManBudTouch.fundparty)}
                  onChange={(e) => {
                    setMyBudgetHolderByField('fundparty', e.target.value);
                  }}
                >
                  {choice.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </WebdpTextField>
              </Grid>
            )}

            {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 && (
              <Grid item xs={12}>
                <WebdpRadioField
                  value={myBudgetHolder.paymentmethod}
                  row
                  label="Payment Method *"
                  disabled={getFormDisabled()}
                  options={paymentmethodOptions}
                  onBlur={() => setReqManBudTouchByFiled('paymentmethod')}
                  error={Boolean(
                    Number.isNaN(parseInt(myBudgetHolder.paymentmethod)) &&
                      reqManBudTouch.paymentmethod
                  )}
                  onChange={(e, v) => {
                    setMyBudgetHolderByField('paymentmethod', parseInt(v));
                  }}
                />
              </Grid>
            )}

            {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 &&
              parseInt(myBudgetHolder.paymentmethod) === 1 && (
                <Grid item xs={12} container spacing={2}>
                  {COAOptions.map((item, index) => {
                    if (item.label === 'Institution') {
                      return (
                        <Grid item key={item.label} style={{ width: item.width }}>
                          <Autocomplete
                            freeSolo
                            id={`COA${index}`}
                            forcePopupIcon
                            inputValue={myBudgetHolder?.cardNo?.[index] || ''}
                            onChange={(e, v) => {
                              const value = v?.split('---')?.[index] || '';
                              setCardNoByIndex(index, value);
                            }}
                            options={optionsFilter}
                            disabled={getFormDisabled()}
                            disableClearable
                            renderInput={(inputParams) => (
                              <TextField
                                {...inputParams}
                                variant="outlined"
                                size="small"
                                label={item.label}
                                fullWidth
                                InputProps={{
                                  ...inputParams.InputProps,
                                  endAdornment: (
                                    <>
                                      {myBudgetHolder?.cardNo?.[index] ? (
                                        <Tooltip title="Clear">
                                          <IconButton
                                            style={{ width: 20, height: 20 }}
                                            onClick={() => setCardNoByIndex(index, '')}
                                          >
                                            <ClearIcon style={{ fontSize: 22, color: '#999' }} />
                                          </IconButton>
                                        </Tooltip>
                                      ) : null}
                                      {inputParams.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                                onBlur={() => setReqManBudTouchByFiled('chartofaccount')}
                                error={Boolean(
                                  myBudgetHolder?.cardNo?.[index]?.length !== item.length &&
                                    reqManBudTouch.chartofaccount
                                )}
                                onChange={(e) => {
                                  const { value = '' } = e.target;
                                  if (/^\d*$/.test(value)) {
                                    setCardNoByIndex(index, value);
                                  }
                                }}
                              />
                            )}
                          />
                        </Grid>
                      );
                    }
                    return (
                      <Grid item key={item.label} style={{ width: item.width }}>
                        <WebdpTextField
                          label={item.label}
                          id={`COA${index}`}
                          value={myBudgetHolder?.cardNo?.[index] || ''}
                          disabled={getFormDisabled()}
                          onBlur={() => setReqManBudTouchByFiled('chartofaccount')}
                          error={Boolean(
                            myBudgetHolder?.cardNo?.[index]?.length !== item.length &&
                              reqManBudTouch.chartofaccount
                          )}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^[0-9]*$/.test(value)) {
                              setCardNoByIndex(index, value);
                            }
                          }}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item container xs={12}>
                    <Grid item xs={2}>
                      <Typography color="textSecondary">Funding Source: {getSource}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="textSecondary">
                        Displayed COA: {myBudgetHolder.cardNo?.join?.('-')}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <BudgetHolderContact disabled={getFormDisabled()} />
                  </Grid>
                </Grid>
              )}

            {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 &&
              parseInt(myBudgetHolder.paymentmethod) === 3 && (
                <Grid item xs={12} container spacing={2}>
                  <ExternalCompany disabled={getFormDisabled()} />
                </Grid>
              )}

            {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 &&
              parseInt(myBudgetHolder.paymentmethod) === 2 && (
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={6}>
                    <WebdpTextField
                      label="Please Specify a Method *"
                      value={myBudgetHolder.otherpaymentmethod}
                      disabled={getFormDisabled()}
                      onBlur={() => setReqManBudTouchByFiled('otherpaymentmethod')}
                      error={
                        !myBudgetHolder.otherpaymentmethod && reqManBudTouch.otherpaymentmethod
                      }
                      onChange={(e) => {
                        setMyBudgetHolderByField('otherpaymentmethod', e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default React.memo(BudgetHolderInformation);
