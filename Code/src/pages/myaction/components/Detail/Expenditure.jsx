import React, { useState, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useParams } from 'react-router-dom';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import CommonNumberFormat from '../../../../components/CommonNumberFormat';

import { setExpenditure } from '../../../../redux/myAction/my-action-actions';
import { CommonTip, Loading } from '../../../../components';
import API from '../../../../api/webdp/webdp';

import getFiscalYearOptions from '../../../../utils/getFiscalYearOptions';

const fiscal = getFiscalYearOptions();

const Expenditure = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const expenditure = useSelector((state) => state.myAction.expenditure);
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const [touch, setTouch] = useState({
    primaryEe: false,
    primaryEefy: false,
    secondaryEe: false,
    secondaryEefy: false
  });
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );

  const [data, setData] = useState({});
  const readOnly = data.readOnly || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const { isN3, isN4, isN5 } = requestForm || {};

  useEffect(() => {
    let newData = {};
    if (Object.keys(requestForm)?.length) {
      newData = requestForm;
    }
    setData(JSON.parse(JSON.stringify(newData)));
  }, [requestForm]);

  const handleTouch = (field) => {
    const newTouch = touch;
    newTouch[field] = true;
    setTouch({ ...newTouch });
  };

  const changeHandler = (e) => {
    const { id, value } = e.target;
    if (id === 'remark') {
      dispatch(
        setExpenditure({
          ...expenditure,
          remark: value
        })
      );
    }
  };

  const checkValue = () => {
    if (
      parseInt(expenditure.current.amount) >= 0 &&
      parseInt(expenditure.next.amount) >= 0 &&
      expenditure.next.fiscalYear &&
      expenditure.current.fiscalYear
    ) {
      return false;
    }

    return true;
  };

  const submitAction = () => {
    const newTouch = touch;
    Object.keys(newTouch).forEach((item) => {
      newTouch[item] = true;
    });
    setTouch({ ...newTouch });

    if (checkValue()) {
      CommonTip.warning('Please complete the required field first.');
      return;
    }

    const expenditureParams = {
      primaryEe: expenditure.current.amount,
      primaryEefy: expenditure.current.fiscalYear,
      secondaryEe: expenditure.next.amount,
      secondaryEefy: expenditure.next.fiscalYear,
      internalremarks: expenditure.remark,
      requestNo: params.requestId
    };
    Loading.show();
    API.saveNmsExpenditure(expenditureParams)
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

  const getDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 102 || dprequeststatusno === 112 || dprequeststatusno === 122) {
      return true;
    }

    if (dprequeststatusno === 160) {
      return true;
    }

    return false;
  };

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno < 160 && dprequeststatusno !== 102 && (isN3 || isN4 || isN5)) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid container>
        <Grid {...TitleProps}>
          <Typography variant="h6" style={{ color: webdpColor.title }}>
            <strong>Expenditure and Others (Internal Use by NMS)</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item {...FormControlProps}>
              <Typography variant="body2" align="center">
                Current Year
              </Typography>
            </Grid>
            <Grid item {...FormControlProps} xs={6} md={6} lg={6}>
              <CommonNumberFormat
                label="EE *"
                value={expenditure.current?.amount}
                onBlur={() => handleTouch('primaryEe')}
                disabled={getDisabled()}
                error={Boolean(
                  (expenditure.current.amount === '' ||
                    expenditure.current.amount === undefined ||
                    expenditure.current.amount === null) &&
                    touch.primaryEe
                )}
                onValueChange={(val) => {
                  dispatch(
                    setExpenditure({
                      ...expenditure,
                      current: {
                        ...expenditure.current,
                        amount: val?.value
                      }
                    })
                  );
                }}
              />
            </Grid>
            <Grid item {...FormControlProps} xs={6} md={6} lg={6}>
              <Autocomplete
                size="small"
                inputValue={expenditure.current.fiscalYear}
                filterOptions={(options) => options}
                onChange={(_, v) => {
                  const inputValue = v?.value || '';
                  let nextFiscalYear = expenditure.next.fiscalYear;
                  if (inputValue > expenditure.next.fiscalYear) {
                    nextFiscalYear = '';
                  }
                  dispatch(
                    setExpenditure({
                      ...expenditure,
                      current: {
                        ...expenditure.current,
                        fiscalYear: inputValue
                      },
                      next: {
                        ...expenditure.next,
                        fiscalYear: nextFiscalYear
                      }
                    })
                  );
                }}
                options={fiscal}
                getOptionLabel={(option) => option.label}
                disabled={getDisabled()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fiscal Year *"
                    variant="outlined"
                    error={Boolean(!expenditure.current.fiscalYear && touch.primaryEefy)}
                    onBlur={() => handleTouch('primaryEefy')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item {...FormControlProps}>
              <Typography variant="body2" align="center">
                Next Year
              </Typography>
            </Grid>
            <Grid item {...FormControlProps} xs={6} md={6} lg={6}>
              <CommonNumberFormat
                label="EE *"
                value={expenditure.next?.amount}
                onBlur={() => handleTouch('secondaryEe')}
                disabled={getDisabled()}
                error={Boolean(
                  (expenditure.next.amount === '' ||
                    expenditure.next.amount === undefined ||
                    expenditure.next.amount === null) &&
                    touch.secondaryEe
                )}
                onValueChange={(val) => {
                  dispatch(
                    setExpenditure({
                      ...expenditure,
                      next: {
                        ...expenditure.next,
                        amount: val?.value
                      }
                    })
                  );
                }}
              />
            </Grid>
            <Grid {...FormControlProps} xs={6} md={6} lg={6}>
              <Autocomplete
                size="small"
                inputValue={expenditure.next.fiscalYear}
                filterOptions={(options) => options}
                onChange={(_, v) => {
                  let inputValue = v?.value || '';
                  if (
                    expenditure.current.fiscalYear &&
                    inputValue &&
                    inputValue < expenditure.current.fiscalYear
                  ) {
                    inputValue = '';
                  }
                  dispatch(
                    setExpenditure({
                      ...expenditure,
                      next: {
                        ...expenditure.next,
                        fiscalYear: inputValue
                      }
                    })
                  );
                }}
                options={fiscal.filter((item) => {
                  if (!expenditure.current.fiscalYear) {
                    return true;
                  }
                  return item.value >= expenditure.current.fiscalYear;
                })}
                getOptionLabel={(option) => option.label}
                disabled={getDisabled()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fiscal Year *"
                    variant="outlined"
                    error={Boolean(!expenditure.next.fiscalYear && touch.secondaryEefy)}
                    onBlur={() => handleTouch('secondaryEefy')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid {...FormControlProps}>
        <WebdpTextField
          label="Remark"
          id="remark"
          value={expenditure.remark}
          onChange={changeHandler}
          multiline
          minRows={5}
          disabled={getDisabled()}
        />
      </Grid>
      <Grid {...FormControlProps}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={submitAction}
          disabled={getButtonDisabled()}
        >
          Update
        </Button>
      </Grid>
    </>
  );
};
export default memo(Expenditure);
