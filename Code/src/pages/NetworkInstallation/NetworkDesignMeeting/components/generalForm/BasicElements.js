import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { Grid, Typography, TextField } from '@material-ui/core';
import dayjs from 'dayjs';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux'; // load from redux
import { useParams } from 'react-router';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import CommonSelect from '../../../../../components/CommonSelect';
import { setBaseEl } from '../../../../../redux/NetworkMeeting/Action';

const Index = () => {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const baseElReduce = useSelector((state) => state.networkMeeting.baseEl); // load from redux
  // console.log('baseElReduce', baseElReduce);
  const { startRedux, endRedux } = baseElReduce.dateRanges;
  const meetingFormRedux = baseElReduce.meetingForm;
  const placeRedux = baseElReduce.meetingForm.place;
  const dispatch = useDispatch();
  const fromStatusURL = useParams().status;
  let fromStatus = 'add';
  let isRequest = false;
  if (typeof fromStatusURL !== 'undefined') {
    fromStatus = fromStatusURL;
    if (fromStatus === 'edit' || fromStatus === 'detail') {
      isRequest = true;
    }
  }

  const formik = useFormik({
    initialValues: {
      baseEl: {
        dateRanges: {
          start: isRequest
            ? dayjs(startRedux).format('DD-MMM-YYYY HH:mm:ss')
            : dayjs().format('DD-MMM-YYYY HH:mm:ss'),
          end: isRequest
            ? dayjs(endRedux).format('DD-MMM-YYYY HH:mm:ss')
            : dayjs().add(2, 'hour').format('DD-MMM-YYYY HH:mm:ss')
        },
        timeValid: false,
        meetingFormSelectList: [
          { label: 'Virtual', value: 1 },
          { label: 'Physical', value: 2 }
        ],
        meetingForm: isRequest ? meetingFormRedux : 1,
        place: isRequest ? placeRedux : ''
      }
    }
  });
  const { baseEl } = formik.values;
  const { dateRanges, timeValid, meetingFormSelectList, meetingForm, place } = baseEl;
  const { setFieldValue, handleChange } = formik;

  // 检查前后 日期
  const checkDatetime = () => {
    const { start, end } = dateRanges;
    const startUnix = dayjs(start).unix();
    const endUnix = dayjs(end).unix();
    // console.log('checkDatetime', startUnix, endUnix);
    if (start && end) {
      if (startUnix > endUnix) {
        setFieldValue(`baseEl.timeValid`, true);
      } else {
        setFieldValue(`baseEl.timeValid`, false);
      }
    }
    set2Reducer();
  };
  const handleDataChange = (val, field) => {
    if (field === 'startDate') {
      const temp02 = dateRanges;
      temp02.start = dayjs(val).format('DD-MMM-YYYY HH:mm:ss');
      setFieldValue(`baseEl.dateRanges`, temp02);
      setTimeout(() => {
        checkDatetime();
      }, 1000);
    }
    if (field === 'endDate') {
      const temp02 = dateRanges;
      temp02.end = dayjs(val).format('DD-MMM-YYYY HH:mm:ss');
      console.log('end ', temp02.end);
      setFieldValue(`baseEl.dateRanges`, temp02);
      setTimeout(() => {
        checkDatetime();
      }, 1000);
    }
  };

  // 更新到 reduce
  const set2Reducer = () => {
    dispatch(setBaseEl(baseEl));
  };

  const setFormikData = (baseElReduce) => {
    formik.setFieldValue('baseEl', baseElReduce);
  };
  useEffect(() => {
    setFormikData(baseElReduce);
  }, [baseElReduce]);

  return (
    <>
      <Grid container>
        <Grid {...TitleProps}>
          <Typography variant="h6" style={{ color: webdpColor.title }}>
            <strong>Basic Elements</strong>
          </Typography>
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <KeyboardDateTimePicker
            style={{ width: '100%' }}
            size="small"
            label="Start Date *"
            ampm={false}
            inputVariant="outlined"
            format="dd-MMM-yyyy HH:mm:ss"
            inputValue={dateRanges.start || ''}
            onChange={(val) => {
              console.log('HAKeyboardDatePicker', val);
              handleDataChange(val, 'startDate');
            }}
            // error={Boolean(touches.installationList?.[index]?.rangeDate?.startDate)}
            disabled={fromStatus === 'detail' || false}
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <KeyboardDateTimePicker
            style={{ width: '100%' }}
            size="small"
            label="Target Date *"
            ampm={false}
            inputVariant="outlined"
            format="dd-MMM-yyyy HH:mm:ss"
            // minDate={dateRanges.start}
            inputValue={dateRanges.end || ''}
            onChange={(val) => {
              console.log('HAKeyboardDatePicker', val);
              handleDataChange(val, 'endDate');
            }}
            onBlur={checkDatetime}
            error={Boolean(timeValid)}
            disabled={fromStatus === 'detail' || false}
          />
        </Grid>

        <Grid {...FormControlProps} md={4} lg={2}>
          <CommonSelect
            style={{ background: '#fff', width: '100%' }}
            outlined
            label="Meeting Form *"
            name=""
            size="small"
            fullWidth
            labelWidth={100}
            value={meetingForm}
            itemList={meetingFormSelectList}
            onSelectChange={handleChange(`baseEl.meetingForm`)}
            onChange={set2Reducer}
            disabled={fromStatus === 'detail' || false}
          />
        </Grid>

        <Grid {...FormControlProps} md={6} lg={4}>
          <TextField
            id="place"
            label="Place / Zoom ID"
            variant="outlined"
            size="small"
            fullWidth
            style={{ width: '100%' }}
            value={place}
            defaultValue={place}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange(`baseEl.place`)}
            onBlur={set2Reducer}
            //   error={Boolean(touches?.serviceForm?.[index]?.Details)}
            disabled={fromStatus === 'detail' || false}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default memo(Index);
