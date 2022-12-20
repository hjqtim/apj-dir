import React, { memo, useState, useCallback, useMemo } from 'react';
import { useDispatch, connect, useSelector } from 'react-redux';
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import API from '../../../../../api/webdp/webdp';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import { setMyBudgetHolder } from '../../../../../redux/webDP/webDP-actions';
import useSetApplyReqManBud from '../../../../../hooks/webDP/useSetApplyReqManBud';

const inputProps = {
  fullWidth: true,
  variant: 'outlined',
  size: 'small'
};

const BudgetHolderContact = (props) => {
  const dispatch = useDispatch();
  const applyReqManBudTouch = useSelector((state) => state.webDP.applyReqManBudTouch);
  const setApplyReqManBudByFiled = useSetApplyReqManBud();
  const myBudgetHolder = props.webDP?.myBudgetHolder || {};
  const [loading, setLoading] = useState(false);
  const viewOnly = props.webDP.viewOnly || false;

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
    dispatch(setMyBudgetHolder(newMyBudgetHolder));
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
            disabled={viewOnly}
            getOptionLabel={(option) => option.display || ''}
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
              dispatch(setMyBudgetHolder(newMyBudgetHolder));
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...inputProps}
                label="Specify a budget holder *"
                onChange={(e) => {
                  const inputVal = e?.target?.value || '';
                  checkAD(inputVal);
                }}
                onBlur={() => setApplyReqManBudByFiled('budgetholderid')}
                error={Boolean(!budgetholdernameMap && applyReqManBudTouch.budgetholderid)}
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
            disabled={viewOnly}
            onChange={(e) => {
              const { value } = e.target;
              setMyBudgetHolderByField('budgetholderemail', value);
            }}
            onBlur={() => setApplyReqManBudByFiled('budgetholderemail')}
            error={Boolean(
              !myBudgetHolder.budgetholderemail && applyReqManBudTouch.budgetholderemail
            )}
          />
        </Grid>
        <Grid xs={3} item>
          <WebdpTextField
            value={myBudgetHolder.budgetholderphone}
            label="Phone *"
            disabled={viewOnly}
            onChange={(e) => {
              const { value } = e.target;
              if (/^[0-9]*$/.test(value) && value?.length <= 8) {
                setMyBudgetHolderByField('budgetholderphone', value);
              }
            }}
            onBlur={() => setApplyReqManBudByFiled('budgetholderphone')}
            error={Boolean(
              myBudgetHolder.budgetholderphone?.length !== 8 &&
                applyReqManBudTouch.budgetholderphone
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default connect((state) => state)(memo(BudgetHolderContact));
