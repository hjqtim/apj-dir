import React, { useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropsType from 'prop-types';
import { Grid, TextField, Typography, Button, CircularProgress } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import API from '../../../../../api/webdp/webdp';
import {
  updateApDpDetails,
  setContact,
  setContactObj
} from '../../../../../redux/webDP/webDP-actions';
import DeleteButton from './DeleteButton';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

const SiteContactControl = ({ index, length }) => {
  const siteContactPersonError = useSelector(
    (state) => state.webDP.error.dpDetails[index].siteContactPerson
  );
  const phoneError = useSelector((state) => state.webDP.error.dpDetails[index].phone);
  const emailError = useSelector((state) => state.webDP.error.dpDetails[index].email);
  const dfi = useSelector((state) => state.webDP.apDpDetails.items[index]);
  // Define if on Detail page
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const [options, setOptions] = useState([]); // contact person 下拉列表数据
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const fieldsUpdateHandler = (e) => {
    dispatch(updateApDpDetails(e));
  };
  const color = useWebDPColor().typography;

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setOptions([]);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const optionsMemo = useMemo(() => options.map((optionItem) => optionItem.display), [options]);
  const getUserName = (display) => {
    const arr = display?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return display || '';
  };

  // phone onblur event
  const phoneOnBlur = () => {
    if (
      dfi.siteContactInformation?.contactObj?.corp &&
      dfi.siteContactInformation?.phone?.length === 8
    ) {
      API.saveUserInfo({
        corp: dfi.siteContactInformation?.contactObj?.corp,
        phone: dfi.siteContactInformation?.phone
      }).then((res) => {
        console.log(res);
      });
    }
  };

  const getTitleDisable = () => {
    if (!viewOnly && !dfi.siteContactInformation?.contactObj?.corp) {
      return false;
    }
    return true;
  };

  return (
    <Grid item xs={12} md={3} lg={3}>
      <Grid container>
        <Grid {...FormControlProps}>
          <Typography variant="h6" style={{ color }}>
            Site Contact
          </Typography>
        </Grid>
        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            disabled={viewOnly}
            value={dfi.siteContactInformation.contactPerson}
            onChange={(event, value) => {
              const userItem = options.find((item) => item.display === value);
              // console.log('SiteContactControl', dfi, userItem);
              const { display = '' } = userItem || {};
              const temparr = display.split(',');

              dispatch(setContactObj({ index, contactObj: userItem || {} }));
              if (value) {
                const newSiteContact = {
                  index,
                  // requestTitle: userItem?.title || '',
                  requestTitle: temparr[1] || '',
                  requestPhone: userItem?.phone || '',
                  contactPerson: getUserName(userItem?.display),
                  email: userItem?.mail || ''
                };
                dispatch(setContact(newSiteContact));
              } else {
                const newValue = {
                  currentTarget: {
                    id: `${index}-siteContactInformation-contactPerson`,
                    value: ''
                  }
                };
                fieldsUpdateHandler(newValue);
                setOptions([]);
              }
            }}
            options={optionsMemo || []}
            loading
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Contact Person *"
                id={`${index}-siteContactInformation-contactPerson`}
                error={siteContactPersonError}
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
                  dispatch(setContactObj({ index, contactObj: {} }));
                  const newValue = {
                    currentTarget: {
                      id: `${index}-siteContactInformation-contactPerson`,
                      value: inputVal
                    }
                  };
                  fieldsUpdateHandler(newValue);
                  if (!newValue) {
                    setOptions([]);
                  }
                  checkAD(inputVal);
                }}
              />
            )}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Title"
            value={dfi.siteContactInformation.jobTitle}
            id={`${index}-siteContactInformation-jobTitle`}
            onChange={fieldsUpdateHandler}
            disabled={getTitleDisable()}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Phone *"
            id={`${index}-siteContactInformation-phone`}
            value={dfi.siteContactInformation.phone}
            onChange={(e) => {
              if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                fieldsUpdateHandler(e);
              } else if (!e.target.value) {
                fieldsUpdateHandler(e);
              }
            }}
            error={phoneError}
            disabled={viewOnly}
            onBlur={phoneOnBlur}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Email *"
            id={`${index}-siteContactInformation-email`}
            value={dfi.siteContactInformation.email}
            onChange={fieldsUpdateHandler}
            disabled={viewOnly}
            error={emailError}
          />
        </Grid>
        <Grid item xs={length > 1 ? 6 : 12} style={{ padding: '0.3rem' }}>
          <Button
            size="small"
            variant="contained"
            fullWidth
            color="primary"
            id={`${index}-copyItem`}
            onClick={fieldsUpdateHandler}
            disabled={viewOnly}
          >
            <FileCopyIcon fontSize="small" />
            &nbsp;
            <strong>Copy</strong>
          </Button>
        </Grid>
        {length > 1 && (
          <Grid item xs={6} style={{ padding: '0.3rem' }}>
            <DeleteButton index={index} dfi={dfi} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

SiteContactControl.propTypes = {
  FromcontrolProps: PropsType.object,
  RowTitleProps: PropsType.object,
  InputProps: PropsType.object,
  ButtonProps: PropsType.object,
  dfi: PropsType.object,
  index: PropsType.number,
  length: PropsType.number
};
export default SiteContactControl;
