import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClearIcon from '@material-ui/icons/Clear';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  TextField,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import WebdpRadioField from '../../../../../components/Webdp/WebdpRadioField';
import ExternalCompany from './ExternalCompany';
import BudgetHolderContact from './BudgetHolderContact';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import API from '../../../../../api/webdp/webdp';
import useSetApplyReqManBud from '../../../../../hooks/webDP/useSetApplyReqManBud';
import { setMyBudgetHolder } from '../../../../../redux/webDP/webDP-actions';

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
  const [expanded, setExpanded] = useState(true);
  // redux data --> for display only
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const myBudgetHolder = useSelector((state) => state.webDP.myBudgetHolder);
  const applyReqManBudTouch = useSelector((state) => state.webDP.applyReqManBudTouch);
  const setApplyReqManBudByFiled = useSetApplyReqManBud();
  // const formType = useSelector((state) => state.webDP.formType);

  useEffect(() => {
    API.getCOAInstitutionList().then((res) => {
      const newOptions = res?.data?.data?.COAInstitutionList || [];
      setMyBudgetHolderByField('COAoptions', newOptions);
    });
  }, []);
  console.log(myBudgetHolder);

  const setMyBudgetHolderByField = (field, value) => {
    const newMyBudgetHolder = {
      ...myBudgetHolder,
      [field]: value
    };
    dispatch(setMyBudgetHolder(newMyBudgetHolder));
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
      dispatch(setMyBudgetHolder(newMyBudgetHolder));

      if (index <= 4 && newValue.length >= length) {
        const focusPoint = document.getElementById(`COA-${index + 1}`);
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

  const fundtransOptions = [
    // {
    //   label: `Fund transferred to HO IT&HI ${formType === 'DP' ? 'N3' : 'N3'} Team`,
    //   value: 1
    // },
    // { label: `HO IT&HI ${formType === 'DP' ? 'N3' : 'N3'} Team has agreed to fund`, value: 2 },
    {
      label: `Fund transferred to HO IT&HI N3 Team`,
      value: 1
    },
    { label: `HO IT&HI N3 Team has agreed to fund`, value: 2 },
    { label: 'Funded by others', value: 0 }
  ];

  return (
    <>
      <Accordion
        onChange={() => setExpanded(!expanded)}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: useWebDPColor().title }} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        >
          <Typography variant="h4" style={{ color: useWebDPColor().title, fontWeight: 'bold' }}>
            Pre-fill Information of Budget Holder
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }}>
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
                  disabled={viewOnly}
                  value={myBudgetHolder.fundtransferredtohsteam}
                  onChange={(e, v) => {
                    setMyBudgetHolderByField('fundtransferredtohsteam', parseInt(v));
                  }}
                />
              </Grid>
              <Grid {...FormControlProps} container>
                {parseInt(myBudgetHolder.fundtransferredtohsteam) === 1 && (
                  <Grid item xs={3}>
                    <WebdpTextField
                      select
                      label="Select Department *"
                      value={myBudgetHolder.fundparty}
                      onBlur={() => setApplyReqManBudByFiled('fundparty')}
                      error={!myBudgetHolder.fundparty && applyReqManBudTouch.fundparty}
                      onChange={(e) => {
                        setMyBudgetHolderByField('fundparty', e.target.value);
                      }}
                      disabled={viewOnly}
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
                      options={paymentmethodOptions}
                      onBlur={() => setApplyReqManBudByFiled('paymentmethod')}
                      error={Boolean(
                        Number.isNaN(parseInt(myBudgetHolder.paymentmethod)) &&
                          applyReqManBudTouch.paymentmethod
                      )}
                      onChange={(e, v) => {
                        setMyBudgetHolderByField('paymentmethod', parseInt(v));
                      }}
                      disabled={viewOnly}
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
                                id={`COA-${index}`}
                                forcePopupIcon
                                inputValue={myBudgetHolder?.cardNo?.[index] || ''}
                                onChange={(e, v) => {
                                  const value = v?.split('---')?.[index] || '';
                                  setCardNoByIndex(index, value);
                                }}
                                disableClearable
                                options={optionsFilter}
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
                                                <ClearIcon
                                                  style={{ fontSize: 22, color: '#999' }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          ) : null}
                                          {inputParams.InputProps.endAdornment}
                                        </>
                                      )
                                    }}
                                    disabled={viewOnly}
                                    onBlur={() => setApplyReqManBudByFiled('chartofaccount')}
                                    error={Boolean(
                                      myBudgetHolder?.cardNo?.[index]?.length !== item.length &&
                                        applyReqManBudTouch.chartofaccount
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
                              id={`COA-${index}`}
                              value={myBudgetHolder?.cardNo?.[index] || ''}
                              onChange={(e) => {
                                const { value } = e.target;
                                if (/^[0-9]*$/.test(value)) {
                                  setCardNoByIndex(index, value);
                                }
                              }}
                              disabled={viewOnly}
                              onBlur={() => setApplyReqManBudByFiled('chartofaccount')}
                              error={Boolean(
                                myBudgetHolder?.cardNo?.[index]?.length !== item.length &&
                                  applyReqManBudTouch.chartofaccount
                              )}
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
                        <BudgetHolderContact />
                      </Grid>
                    </Grid>
                  )}

                {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 &&
                  parseInt(myBudgetHolder.paymentmethod) === 3 && (
                    <Grid item xs={12} container spacing={2}>
                      <ExternalCompany />
                    </Grid>
                  )}

                {parseInt(myBudgetHolder.fundtransferredtohsteam) === 0 &&
                  parseInt(myBudgetHolder.paymentmethod) === 2 && (
                    <Grid item xs={12} container spacing={2}>
                      <Grid item xs={6}>
                        <WebdpTextField
                          label="Please Specify a Method *"
                          value={myBudgetHolder.otherpaymentmethod}
                          onChange={(e) => {
                            setMyBudgetHolderByField('otherpaymentmethod', e.target.value);
                          }}
                          disabled={viewOnly}
                          onBlur={() => setApplyReqManBudByFiled('otherpaymentmethod')}
                          error={
                            !myBudgetHolder.otherpaymentmethod &&
                            applyReqManBudTouch.otherpaymentmethod
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default React.memo(BudgetHolderInformation);
