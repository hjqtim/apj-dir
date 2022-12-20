import React, { useState } from 'react';
import PropsType from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Button, TextField } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
// import { useLocation } from 'react-router-dom';
import {
  updateAttitionalInformation,
  updateDateTime
} from '../../../../../redux/webDP/webDP-actions';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import TextAreaProps from '../../../../../models/webdp/PropsModels/TextAreaProps';
import DatePicker from '../general-from/DatePicker';

const AdditionalDPControl = () => {
  // declear recently date
  const [date] = useState(new Date().setDate(new Date().getDate() + 14));

  // const isShowMinDate = !useLocation().pathname.includes('/detail/');

  const formType = useSelector((state) => state.webDP.formType);
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const expectedDateError = useSelector((state) => state.webDP.error.expectedDate);
  const dprequeststatusno = useSelector(
    (state) => state.webDP.requestAll.dpRequest?.dprequeststatusno
  );

  // declear Expected Complete Date state
  const expectedCompleteDate = useSelector((state) => state.webDP.apDpDetails.expectedCompleteDate);
  const remarks = useSelector((state) => state.webDP.apDpDetails.remarks);
  const specialRequirements = useSelector((state) => state.webDP.apDpDetails.specialRequirements);
  const justificationsForUsingWLAN = useSelector(
    (state) => state.webDP.apDpDetails.justificationsForUsingWLAN
  );

  const dispatch = useDispatch();

  // handler for text areas fields updating
  const actionHandler = (e) => {
    dispatch(updateAttitionalInformation(e));
  };

  // Handler for Expected Complete Date updating
  const datetimeUpdateHandler = (fullTime) => {
    dispatch(updateDateTime('expectedCompleteDate', fullTime));
  };

  // change to recently date
  const aSAPbuttonAction = () => {
    datetimeUpdateHandler(date);
  };

  const getMinDate = () => {
    // !viewOnly ? date : undefined
    if (viewOnly) {
      return undefined;
    }

    // 表单一开始提交时和在草稿中提交表单时有时间限制
    if (!dprequeststatusno || dprequeststatusno <= 1) {
      return date;
    }

    return undefined;
  };

  return (
    <Grid container>
      <Grid
        {...FormControlProps}
        md={12}
        lg={12}
        style={{ textAlign: 'center', marginBottom: '1rem' }}
      >
        <Button
          variant="contained"
          color="primary"
          id="addItem"
          startIcon={<AddBoxIcon />}
          onClick={actionHandler}
          disabled={viewOnly}
        >
          <strong>Add</strong>
        </Button>
      </Grid>
      <Grid {...FormControlProps} md={8} lg={8}>
        {formType === 'DP' && (
          <TextField
            variant="outlined"
            id="remarks"
            label="Remarks"
            multiline
            fullWidth
            minRows={8}
            maxRows={10}
            value={remarks || ''}
            onChange={actionHandler}
            disabled={viewOnly}
          />
        )}

        {formType === 'AP' && (
          <>
            <TextField
              {...TextAreaProps}
              id="specialRequirements"
              label="Special Requirements (Optional)"
              style={{ marginBottom: '1rem' }}
              value={specialRequirements || ''}
              minRows={8}
              maxRows={10}
              onChange={actionHandler}
              disabled={viewOnly}
            />
            <TextField
              {...TextAreaProps}
              id="justificationsForUsingWLAN"
              label="Justifications for using WLAN"
              minRows={7}
              maxRows={10}
              onChange={actionHandler}
              value={justificationsForUsingWLAN || ''}
              disabled={viewOnly}
            />
          </>
        )}
      </Grid>
      <Grid {...FormControlProps} md={4} lg={4}>
        <DatePicker
          minDate={getMinDate()}
          variant="inline"
          inputVariant="outlined"
          size="small"
          label="Expected Completion Date"
          value={expectedCompleteDate}
          onChange={datetimeUpdateHandler}
          disabled={viewOnly}
          error={expectedDateError}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '0.5rem', paddingRight: '1rem' }}
          onClick={aSAPbuttonAction}
          disabled={viewOnly}
        >
          ASAP
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '0.5rem' }}
          onClick={() => {
            window.open(`/webdp/leadtimeinfo/${formType}`, '_blank');
          }}
        >
          Installation Lead Time Info
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '0.5rem' }}
          onClick={() => {
            window.open(`/webdp/pricelist/${formType}`, '_blank');
          }}
        >
          Installation Price List
        </Button>
      </Grid>
    </Grid>
  );
};

AdditionalDPControl.propTypes = {
  FormControlProps: PropsType.object
};

export default AdditionalDPControl;
