import React, { memo, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import API from '../../../../api/webdp/webdp';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import { setMyBudgetHolderByMyAction } from '../../../../redux/myAction/my-action-actions';
import useSetReqManBudTouch from '../../../../hooks/webDP/useSetReqManBudTouch';

const inputProps = {
  fullWidth: true,
  variant: 'outlined',
  size: 'small'
};

const BudgetHolderContact = (props) => {
  const { disabled = false } = props;
  const setReqManBudTouchByFiled = useSetReqManBudTouch();
  const dispatch = useDispatch();
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);
  const [loading, setLoading] = useState(false);
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3) {
        setLoading(true);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newContactOptions = res?.data?.data || [];
            setMyBudgetHolderByField('options', newContactOptions);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 800),
    []
  );

  const budgetholdernameMap = useMemo(
    () =>
      myBudgetHolder.options?.find((item) => item.corp === myBudgetHolder.budgetholderid) || null,
    [myBudgetHolder.options, myBudgetHolder.budgetholderid]
  );

  const setMyBudgetHolderByField = (field, value) => {
    const newMyBudgetHolder = {
      ...myBudgetHolder,
      [field]: value
    };
    dispatch(setMyBudgetHolderByMyAction(newMyBudgetHolder));
  };

  return (
    <>
      <Grid container xs={12} item spacing={2}>
        <Grid xs={3} item>
          <Autocomplete
            forcePopupIcon
            value={budgetholdernameMap}
            options={myBudgetHolder.options || []}
            loading={loading}
            getOptionLabel={(option) => option.display || ''}
            disabled={disabled}
            onChange={(e, val) => {
              let newMyBudgetHolder;
              if (val) {
                newMyBudgetHolder = {
                  budgetholdername: val.display,
                  budgetholdertitle: val.display?.split(',')?.[1]?.trim() || '',
                  budgetholderemail: val.mail || '',
                  budgetholderphone: val.phone || '',
                  budgetholderid: val.corp
                };
              } else {
                newMyBudgetHolder = {
                  budgetholdername: '',
                  budgetholdertitle: '',
                  budgetholderemail: '',
                  budgetholderphone: '',
                  budgetholderid: ''
                };
              }
              dispatch(setMyBudgetHolderByMyAction(newMyBudgetHolder));
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...inputProps}
                label="Specify a budget holder *"
                disabled={disabled}
                onBlur={() => setReqManBudTouchByFiled('budgetholderid')}
                error={Boolean(!budgetholdernameMap && reqManBudTouch.budgetholderid)}
                onChange={(e) => {
                  const inputVal = e?.target?.value || '';
                  checkAD(inputVal);
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={3} item>
          <WebdpTextField value={myBudgetHolder.budgetholdertitle} label="Title" disabled />
        </Grid>
        <Grid xs={3} item>
          <WebdpTextField
            value={myBudgetHolder.budgetholderemail}
            label="Email *"
            disabled={disabled}
            onBlur={() => setReqManBudTouchByFiled('budgetholderemail')}
            error={Boolean(!myBudgetHolder.budgetholderemail && reqManBudTouch.budgetholderemail)}
            onChange={(e) => {
              const { value } = e.target;
              setMyBudgetHolderByField('budgetholderemail', value);
            }}
          />
        </Grid>
        <Grid xs={3} item>
          <WebdpTextField
            value={myBudgetHolder.budgetholderphone}
            label="Phone *"
            disabled={disabled}
            onBlur={() => setReqManBudTouchByFiled('budgetholderphone')}
            error={Boolean(
              myBudgetHolder.budgetholderphone?.length !== 8 && reqManBudTouch.budgetholderphone
            )}
            onChange={(e) => {
              const { value } = e.target;
              if (/^[0-9]*$/.test(value) && value?.length <= 8) {
                setMyBudgetHolderByField('budgetholderphone', value);
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(BudgetHolderContact);
