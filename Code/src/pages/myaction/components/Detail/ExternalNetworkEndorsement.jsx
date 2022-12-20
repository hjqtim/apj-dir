import React, { useState, useCallback, useMemo, memo } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import WebdpRadioField from '../../../../components/Webdp/WebdpRadioField';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import API from '../../../../api/myAction';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip, Loading } from '../../../../components';
import { setEndorsement } from '../../../../redux/myAction/my-action-actions';

const options = [
  {
    label: 'Endorsement Person',
    value: 'E'
  },
  { label: 'SM(N)5', value: 'N' }
];

const ExternalNwtworkEndorsement = () => {
  const dispatch = useDispatch();
  const dpId = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const endorsement = useSelector((state) => state.myAction.endorsement);
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;

  const [loading, setLoading] = useState(false);
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();

  const submitHandler = () => {
    const {
      endorsementStatus,
      endorsementId,
      endorsementName,
      endorsementPhone,
      endorsementTitle
    } = endorsement;
    const data = {
      endorsementStatus,
      endorsementId: endorsementStatus === 'E' ? endorsementId : '',
      endorsementName: endorsementStatus === 'E' ? endorsementName : '',
      endorsementPhone: endorsementStatus === 'E' ? endorsementPhone : '',
      endorsementTitle: endorsementStatus === 'E' ? endorsementTitle : '',
      id: dpId,
      requestNo
    };

    Loading.show();
    API.setEndorsementPerson(data)
      .then((result) => {
        if (result.data.code === 200) {
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

  const setEndorsementByField = (filed, value) => {
    const newEndorsement = endorsement;
    newEndorsement[filed] = value;
    dispatch(setEndorsement({ ...newEndorsement }));
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3) {
        setLoading(true);
        webdpAPI
          .findUserList({ username: inputValue })
          .then((res) => {
            const newContactOptions = res?.data?.data || [];
            dispatch(setEndorsement({ options: newContactOptions }));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 800),
    []
  );

  const endorsementIdMap = useMemo(
    () => endorsement.options?.find((item) => item.corp === endorsement.endorsementId) || null,
    [endorsement.options, endorsement.endorsementId]
  );

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (dprequeststatusno === 20) {
      if (
        endorsement.endorsementStatus === 'E' &&
        endorsement.endorsementId &&
        endorsement.endorsementPhone?.length === 8
      ) {
        return false;
      }
      if (endorsement.endorsementStatus === 'N') {
        return false;
      }
    }
    return true;
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (dprequeststatusno === 20) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Endorsement Person</strong>
        </Typography>
      </Grid>
      <Grid component="form" container spacing={3}>
        <Grid item xs={12}>
          <WebdpRadioField
            row
            label="Select Approver *"
            options={options}
            onChange={(e, v) => {
              setEndorsementByField('endorsementStatus', v);
            }}
            value={endorsement.endorsementStatus || ''}
            disabled={getFormDisabled()}
          />
        </Grid>
        {endorsement.endorsementStatus === 'E' && (
          <>
            <Grid {...FormControlProps} xs={6} md={3} lg={3}>
              <Autocomplete
                forcePopupIcon
                options={endorsement.options}
                getOptionLabel={(option) => option.display || ''}
                loading={loading}
                value={endorsementIdMap}
                disabled={getFormDisabled()}
                onChange={(e, val) => {
                  const newEndorsement = {
                    ...endorsement,
                    endorsementId: val?.corp || '',
                    endorsementName: val?.display || '',
                    endorsementPhone: val?.phone || '',
                    endorsementTitle: val?.display?.split?.(',')?.[1]?.trim() || ''
                  };
                  dispatch(setEndorsement(newEndorsement));
                }}
                renderInput={(inputParams) => (
                  <TextField
                    {...inputParams}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Endorsement Person *"
                    disabled={getFormDisabled()}
                    onChange={(e) => {
                      const inputVal = e?.target?.value || '';
                      checkAD(inputVal);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid {...FormControlProps} xs={6} md={3} lg={3}>
              <WebdpTextField
                label="Title"
                id="title"
                disabled
                value={endorsement.endorsementTitle || ''}
              />
            </Grid>
            <Grid {...FormControlProps} xs={6} md={3} lg={3}>
              <WebdpTextField
                label="Phone"
                id="phone"
                disabled={getFormDisabled()}
                value={endorsement.endorsementPhone || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  if (!value) {
                    setEndorsementByField('endorsementPhone', '');
                  } else if (/^\d*$/.test(value) && value.length <= 8) {
                    setEndorsementByField('endorsementPhone', value);
                  }
                }}
              />
            </Grid>
            <Grid {...FormControlProps} xs={6} md={3} lg={3}>
              <WebdpTextField
                label="Requested Time"
                id="time"
                disabled
                value={
                  endorsement.endorsementDate
                    ? dayjs(endorsement.endorsementDate).format('DD-MMM-YYYY HH:mm:ss')
                    : ''
                }
              />
            </Grid>
          </>
        )}

        <Grid {...FormControlProps} xs={12} md={12} lg={12}>
          <SubmitButton
            label="Submit"
            title="Assign External Network Endorsement Person"
            message="The entered contact will be notified to endorse the External Network request, are you sure to continue?"
            submitAction={submitHandler}
            submitLabel="Submit"
            disabled={getButtonDisabled()}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default memo(ExternalNwtworkEndorsement);
