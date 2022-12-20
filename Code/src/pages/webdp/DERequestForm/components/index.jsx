import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  makeStyles,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
// import { alpha } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import SearchIcon from '@material-ui/icons/Search';
import { useFormik } from 'formik';
// import * as Yup from 'yup';
import dayjs from 'dayjs';
// import DatePicker from './DatePicker';
import { setHospitalList, updateServiceRequired } from '../../../../redux/webDP/webDP-actions';
import { Styles, Param } from './indexStyle';
import API from '../../../../api/webdp/webdp';
import SubmitButton from './SubmitButton';
import N3Button from './N3Button';
import { CommonTip, WarningDialog, HAKeyboardDatePicker, HAPaper } from '../../../../components';
import Loading from '../../../../components/Loading';
import { getUser } from '../../../../utils/auth';
import { getDateChina, getToday } from '../../../../utils/date';
import { L } from '../../../../utils/lang';
import readOnlyTip from '../../../../utils/readOnlyTip';

import Requester from './Requester';
import Enduser from './Enduser';
import DataPortID from './DataPortID';
import ActinoLog from './ActionLogs';
import ProgressBar from './ProgressBar';

function DeForm(props) {
  let { apptype, aduser, requestNo } = useParams();
  if (props?.apptype) {
    apptype = props?.apptype;
    aduser = props?.aduser;
    requestNo = props?.requestNo;
  }

  console.log('DeForm ', apptype, aduser, requestNo);

  const history = useHistory();

  // mekeStyles
  const useStyles = makeStyles(() => ({
    radio: {
      '&$checked': {
        color: '#155151'
      }
    },
    checked: {},
    checkBox: {
      '&$checked': {
        color: '#155151'
      }
    },
    muiAccordinSummaryRoot: {
      //   borderBottom: '1px solid #155151',
      marginBottom: 5,
      minHeight: 'unset!important',
      height: '48px'
    },
    muiAccordinSummaryContent: {
      margin: '12px 0'
    },
    inputValidation: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '2px'
      }
    },
    inputDefult: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '1px'
      }
    }
  }));
  const classes = useStyles();

  const [detail01, setDetail01] = useState(false);
  const [detail02, setDetail02] = useState(true);
  const [detail03, setDetail03] = useState(false);
  const [detail04, setDetail04] = useState(false);
  const [detail05, setDetail05] = useState(false);
  const [detail06, setDetail06] = useState(false);

  const userInfo = getUser();

  // Requester
  const [requesterCorp, setRequesterCorp] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterNameE, setRequesterNameE] = useState(false);
  const [requesterTitle, setRequesterTitle] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterPhoneE, setRequesterPhoneE] = useState(false);
  const [requesterEmail, setRequesterEmail] = useState('');
  const RequestData = {
    requesterCorp,
    requesterName,
    requesterNameE,
    requesterPhoneE,
    requesterTitle,
    requesterPhone,
    detail01,
    setRequesterName,
    setRequesterTitle,
    setRequesterPhone
  };

  // Enduser
  const [endUserName, setEndUserName] = useState('');
  const [endUserTitle, setEndUserTitle] = useState('');
  const [endUserPhone, setEndUserPhone] = useState('');
  const [endUserRemarks, setEndUserRemarks] = useState('');

  const [endUserNameE, setEndUserNameE] = useState(false);
  const [endUserPhoneE, setEndUserPhoneE] = useState(false);

  const [readOnly, setReadOnly] = useState(false);

  const EnduserData = {
    endUserName,
    endUserTitle,
    endUserPhone,
    endUserRemarks,
    detail01,
    setEndUserName,
    setEndUserTitle,
    setEndUserPhone,
    setEndUserRemarks,
    endUserNameE,
    endUserPhoneE
  };

  // Data Port ID
  const [valid01, setValid01] = useState(false);
  const [dataPortList, setDataPortList] = useState([
    {
      dataPortID: '',
      dataPortRemarks: '',
      dataPortStatus: 'Pending',
      list: [{ outletID: '' }],
      //   list: [],
      open: false,
      loading: false,
      status: ''
    }
  ]);
  const [dataPortListStatus, setDataPortListStatus] = useState([]);
  const [checkLoad, setCheckLoad] = useState(false);
  const [error03, setError03] = useState(false);

  // N3 data and detail Data
  const [getBackDetail, setGetBackDetail] = useState('');
  const [n3TeamRemark, setN3TeamRemark] = useState('');
  const [n3CheckArray, setN3CheckArray] = useState([]);

  // make Variable
  const [expanded03, setExpanded03] = useState(true);
  const [expanded06, setExpanded06] = useState(true);
  console.log('setExpanded06: ', setExpanded06, setExpanded03);

  // const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const serviceRequiredInformation = useSelector((state) => state.webDP.serviceRequired);
  const { hospitalList = [], hospitalLocation } = serviceRequiredInformation || {};
  const dispatch = useDispatch();

  const [expectedActionDate, setExpectedActionDate] = useState(
    dayjs().add(14, 'day').format('YYYY-MM-DD')
  );
  const [revertedONDate, setRevertedONDate] = useState(
    // dayjs(getToday().toString()).format('YYYY-MM-DD')
    // dayjs(getToday()).format('YYYY-MM-DD')
    dayjs().format('YYYY-MM-DD')
  );

  const [error01, setError01] = useState(false);
  const [error02, setError02] = useState(false);

  const [chioce3, setChioce3] = useState(true);
  const [chioce4, setChioce4] = useState(true);
  const [chioce0, setChioce0] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openCommonDialog, setOpenCommonDialog] = useState(false);

  const [submitObj, setSubmitObj] = useState({});

  const formik = useFormik({
    initialValues: {
      requestHospital: '',
      requestHospitalE: false,
      serviceType: '',
      requestReason: '',
      requestReasonE: false,

      placeholderReason: '',
      requestReason01: true,
      requestReason02: true,

      today01: dayjs().add(14, 'day').format('YYYY-MM-DD'),
      // today02: new Date().toString(),
      today02: dayjs().format('YYYY-MM-DD'),

      statusDuration: '1',
      statusDuration01: true,
      statusDuration02: true,
      justification: '',

      hospitalList: []
    }
  });

  const DataPortIDData = {
    valid01,
    dataPortList,
    error03,
    detail01,
    detail02,
    detail03,
    detail04,
    setValid01,
    setDataPortList,
    hospital: formik.values.requestHospital,
    serviceType: formik.values.serviceType,
    setCheckLoad,
    setDetail06,
    setN3CheckArray,
    dataPortListStatus,
    setDataPortListStatus
  };

  const closeCommonDialog = () => {
    setOpenCommonDialog(false);
  };
  const changeServiceType = () => {
    setOpenCommonDialog(false);
    // init dataportList
    console.log('dataportList');
    const init = [
      {
        dataPortID: '',
        dataPortRemarks: '',
        dataPortStatus: 'Pending',
        list: [{ outletID: '' }],
        //   list: [],
        open: false,
        loading: false,
        status: ''
      }
    ];
    setDataPortList([...init]);
  };

  // handleConfirmSubmitY
  const handleConfirmSubmitY = () => {
    // console.log('handleConfirmSubmitY', submitObj);
    setOpenDialog(false);
    handleClickSubmit(submitObj);
  };
  // handleConfirmSubmitN
  const handleConfirmSubmitN = () => {
    // console.log('handleConfirmSubmitN');
    setOpenDialog(false);
  };

  // true Submit request form
  const handleClickSubmit = (data) => {
    // console.log('handleClickSubmit', data);
    if (checkLoad === true) {
      CommonTip.warning(L('checkFill03'));
    } else {
      let checkServiceType = true;
      // console.log('xxxx', dataPortList);
      for (let i = 0; i < dataPortList.length; i += 1) {
        // console.log('XXXX2', dataPortList[i].checkState);
        if (dataPortList[i].checkState === 'false') {
          checkServiceType = false;
          break;
        }
      }
      // console.log('checkServiceType', checkServiceType);
      if (checkServiceType) {
        // console.log('submit');
        Loading.show();
        API.deRequestSubmit(data).then((res) => {
          Loading.hide();
          // console.log('deRequestSubmit', res);
          if (res.data.code === 200) {
            restForm();
            handleDetail1();
            CommonTip.success(L('DEsubmitSuccess'));
          } else {
            CommonTip.error(L('DEsubmitFail'));
          }
        });
      } else {
        CommonTip.warning(`Current status is ${formik.values?.serviceType?.toLowerCase()}d`);
      }
    }
  };

  // reset form
  const restForm = () => {
    // setRequesterPhone('');

    setEndUserName('');
    setEndUserTitle('');
    setEndUserPhone('');
    setEndUserRemarks('');

    setExpectedActionDate(dayjs().add(14, 'day').format('YYYY-MM-DD'));
    setRevertedONDate(dayjs(getToday()).format('YYYY-MM-DD'));
    const arr = [
      {
        dataPortID: '',
        dataPortRemarks: '',
        dataPortStatus: 'Pending',
        list: [{ outletID: '' }],
        //   list: [],
        open: false,
        loading: false,
        status: ''
      }
    ];
    setDataPortList(arr);

    const restHospitalLocation = {
      target: {
        id: 'hospitalLocation',
        value: {}
      }
    };
    fieldsUpdateHandler(restHospitalLocation);

    formik.resetForm();

    setValid01(false);
  };

  // kenny for hospital setting
  const fieldsUpdateHandler = (e) => {
    console.log('fieldsUpdateHandler', e);
    // for setValue to Redux in UI
    dispatch(updateServiceRequired(e));
    // console.log('Yancy', e); //for setValue in my Data
    formik.setFieldValue('requestHospital', e.target.value.hospital);
  };
  // Hospital Data selection
  const queryHospitalList = (hospitalList = []) => {
    const hospitalListData = hospitalList.filter((item) => item.hospitalName !== '') || [];
    hospitalListData.sort((a, b) =>
      `${a.hospital}${a.hospitalName}`?.localeCompare(`${b.hospital}${b.hospitalName}`)
    );
    dispatch(setHospitalList(hospitalListData));
  };

  useEffect(() => {
    const isDetail = history.location?.pathname !== '/webdp/myDEForm';
    Param.FormHeaderProps = {
      ...Param?.FormHeaderProps,
      style: {
        ...Param?.FormHeaderProps?.style,
        textAlign: !isDetail ? 'left' : 'center',
        fontSize: !isDetail ? 16.5 : 28
      }
    };
    // console.log('aduser:', apptype, aduser, res);
    // get Request Infor
    const requesterNameStr = userInfo.displayName;
    const arrTemp = requesterNameStr?.split(',');

    setRequesterCorp(userInfo.username);
    setRequesterName(arrTemp[0]);
    // setRequesterTitle(userInfo.title);
    setRequesterTitle(arrTemp[1]);
    setRequesterEmail(userInfo.mail);
    // if (userInfo.phone !== '') {
    //   setRequesterPhone(userInfo.phone);
    // }

    API.checkADInfo({
      username: userInfo.username
    }).then((res) => {
      // console.log('finUserInfo', res);
      if (res?.data?.code === 200) {
        const iphone = res?.data?.data?.phone;
        // console.log('finUserInfo', res?.data?.data?.phone);
        setRequesterPhone(iphone);
      }
    });

    API.getHospitalList().then((res) => {
      queryHospitalList(res?.data?.data?.hospitalList || []);
      let hospitalList = [];
      hospitalList = res.data.data.hospitalList;

      // Get param from url to get detail
      if (apptype && apptype === 'de' && aduser === 'n3') {
        // console.log('Yancy N3', apptype, requestNo, userInfo);
        setDetail01(true);
        setDetail02(false);
        setDetail03(true);
        initDetail(requestNo, hospitalList);
      } else if (apptype && apptype === 'de' && aduser === 're') {
        // console.log('Yancy RE', apptype, requestNo, userInfo);
        setDetail01(true);
        setDetail02(true);
        // setDetail03(true);
        setDetail05(true);
        initDetail(requestNo, hospitalList);
      } else {
        restForm();
        setDetail02(false);
      }
    });
  }, []);

  // Get Detail and Init
  const initDetail = (requestNo, hospitalList) => {
    setChioce0(true);
    // console.log('userInfo', userInfo);
    const obj = {};
    obj.requestNo = requestNo;
    obj.requestId = userInfo.name;
    Loading.show();
    API.deRequestDetail(obj).then((res) => {
      // console.log('deRequestDetail', res);
      Loading.hide();

      if (res.data.code === 200) {
        setGetBackDetail(res.data.data);
        // const { DPDisableEnable, pending } = res.data.data;
        const { DPDisableEnable } = res.data.data;
        const {
          requesterName,
          requesterTitle,
          requesterPhone,
          requesterEmail,
          readOnly,

          status,

          forRequestHosp,
          expectedCompletionDate,
          type,
          reason,

          timePeriod,
          permanentReason,
          tempEndDate,

          dpDisableEnableEndRequesterList,
          dpDisableEnableDetailsList,

          internalRemarks,
          otherBusiness
        } = DPDisableEnable;

        setReadOnly(readOnly);

        // Requester
        setRequesterName(requesterName);
        setRequesterTitle(requesterTitle === null ? '' : requesterTitle);
        setRequesterPhone(requesterPhone === null ? '' : requesterPhone);
        setRequesterEmail(requesterEmail === null ? '' : requesterEmail);

        // console.log('DE status', status, pending);
        // if (pending === false && status !== 'Pending') {
        if (status !== 'Pending') {
          // console.log('DE status', status);
          setDetail04(true);
        }
        // console.log('????????????????', detail04);

        // End requester
        if (dpDisableEnableEndRequesterList && dpDisableEnableEndRequesterList.length > 0) {
          const { endRequesterName, endRequesterTitle, contactNbr, remarks } =
            dpDisableEnableEndRequesterList[0];
          // console.log('endRequesterName', dpDisableEnableEndRequesterList[0]);

          setEndUserName(endRequesterName === null ? '' : endRequesterName);
          setEndUserTitle(endRequesterTitle === null ? '' : endRequesterTitle);
          setEndUserPhone(contactNbr === null ? '' : contactNbr);
          setEndUserRemarks(remarks === null ? '' : remarks);
        }

        formik.setFieldValue('requestHospital', forRequestHosp);
        for (let i = 0; i < hospitalList.length; i += 1) {
          if (hospitalList[i].hospital === forRequestHosp) {
            const restHospitalLocation = {
              target: {
                id: 'hospitalLocation',
                value: hospitalList[i]
              }
            };
            fieldsUpdateHandler(restHospitalLocation);
          }
        }

        if (expectedCompletionDate !== null) {
          let temp01 = '';
          temp01 = expectedCompletionDate.substring(0, 10);
          temp01 = temp01.replace(new RegExp('-', 'g'), '/');
          // console.log('temp01', temp01);
          formik.setFieldValue('today01', new Date(temp01).toString());
          setExpectedActionDate(new Date(temp01).toString());
        }

        // disable and enable
        formik.setFieldValue('serviceType', type);
        if (type === 'Disable') {
          formik.setFieldValue('requestReason01', true);
          formik.setFieldValue('requestReason02', false);
          // console.log('???', tempEndDate);
          if (tempEndDate === null || tempEndDate === '') {
            formik.setFieldValue('statusDuration', 'cc');
          } else {
            formik.setFieldValue('statusDuration', 'dd');
          }
        }
        if (type === 'Enable') {
          formik.setFieldValue('requestReason02', false);
          formik.setFieldValue('requestReason01', true);
        }

        // Plan
        if (type === 'Enable' && timePeriod === 'Permanent') {
          formik.setFieldValue('requestReason01', false);
          formik.setFieldValue('requestReason02', true);
          formik.setFieldValue('statusDuration', 'bb');
          formik.setFieldValue('justification', permanentReason === null ? '' : permanentReason);
        }

        if (type === 'Enable' && timePeriod === 'Temporary') {
          formik.setFieldValue('requestReason01', false);
          formik.setFieldValue('requestReason02', true);
          if (tempEndDate === null || tempEndDate === '') {
            formik.setFieldValue('statusDuration', 'aa');
          } else {
            formik.setFieldValue('statusDuration', 'dd');

            formik.setFieldValue('today02', dayjs(tempEndDate).format('YYYY-MM-DD'));
            setRevertedONDate(dayjs(tempEndDate).format('YYYY-MM-DD'));
          }
        }

        // Request reason
        formik.setFieldValue('requestReason', reason === null ? '' : reason);

        // set back N3 data
        // console.log('otherBusiness', otherBusiness);
        if (otherBusiness === null || otherBusiness === '' || otherBusiness === ' ') {
          setN3CheckArray(['', '']);
          // console.log('otherBusiness', n3CheckArray);
        } else {
          checkedStatusCallBack(otherBusiness);
        }
        setN3TeamRemark(internalRemarks === null ? '' : internalRemarks);

        // DataPort ID List
        if (dpDisableEnableDetailsList) {
          for (let i = 0; i < dpDisableEnableDetailsList.length; i += 1) {
            const temp2 = [];
            const obj = {};
            obj.outletID = dpDisableEnableDetailsList[i].dataPortID;
            temp2.push(obj);
            dpDisableEnableDetailsList[i].list = temp2;
          }
          // console.log('dpDisableEnableDetailsList', dpDisableEnableDetailsList);
          setDataPortList([...dpDisableEnableDetailsList]);
        }
      }
    });
  };

  const handleExpectedActionDate = (fullTime) => {
    setExpectedActionDate(fullTime);
  };
  const handleRevertedONDate = (onDate) => {
    setRevertedONDate(onDate);
    // formik.setFieldValue('statusDuration', 'Temporary');
  };

  // Submit form
  const handleSubmit = () => {
    const obj = {};
    obj.isSubmit = true;
    obj.displayName = userInfo.displayName;
    // Requester Name
    if (requesterName === '' || requesterName === null) {
      setRequesterNameE(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (requesterName !== '') {
      setRequesterNameE(false);
    }

    // Requester Phone
    if (requesterPhone === '' || requesterPhone === null || requesterPhone === undefined) {
      setRequesterPhoneE(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (requesterPhone !== undefined) {
      console.log('requesterPhone', requesterPhone);
      if (requesterPhone.length < 8) {
        setRequesterPhoneE(true);
        CommonTip.warning(L('checkFill02'));
        return;
      }
    }
    if (requesterPhone !== '') {
      setRequesterPhoneE(false);
    }

    // check Enduser info
    if (endUserPhone.length > 0 && endUserPhone.length < 8) {
      setEndUserPhoneE(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (endUserName === '' && endUserPhone.length === 8) {
      setEndUserNameE(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (endUserName !== '') {
      if (endUserPhone === '') {
        setEndUserPhoneE(true);
        CommonTip.warning(L('checkFill02'));
        return;
      }
    }

    if (endUserPhone === '' && endUserName === '') {
      setEndUserPhoneE(false);
      setEndUserNameE(false);
    }

    const dpDisableenable = {};
    dpDisableenable.requesterName = requesterName;
    dpDisableenable.requesterTitle = requesterTitle;
    dpDisableenable.requesterPhone = requesterPhone;
    dpDisableenable.requesterEmail = requesterEmail;
    dpDisableenable.requesterId = userInfo.username;
    dpDisableenable.status = 'Pending';

    const dpDisableEnableEndRequesterList = {};
    dpDisableEnableEndRequesterList.endRequesterName = endUserName;
    dpDisableEnableEndRequesterList.endRequesterTitle = endUserTitle;
    dpDisableEnableEndRequesterList.contactNbr = endUserPhone;
    dpDisableEnableEndRequesterList.remarks = endUserRemarks;

    // Hospital
    if (formik.values.requestHospital === '' || formik.values.requestHospital === undefined) {
      formik.setFieldValue('requestHospitalE', true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (formik.values.requestHospital !== '') {
      formik.setFieldValue('requestHospitalE', false);
    }
    dpDisableenable.forRequestHosp = formik.values.requestHospital;

    // Disable + Enable
    if (formik.values.serviceType === '') {
      setError01(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (formik.values.serviceType !== '') {
      setError01(false);
    }
    dpDisableenable.type = formik.values.serviceType;

    // Permanent + Temporary
    if (formik.values.statusDuration === '') {
      setError02(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (formik.values.statusDuration !== '') {
      setError02(false);
    }

    // reason
    if (formik.values.requestReason === '') {
      formik.setFieldValue('requestReasonE', true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (formik.values.requestReason !== '') {
      formik.setFieldValue('requestReasonE', false);
    }
    dpDisableenable.reason = formik.values.requestReason;

    dpDisableenable.expectedCompletionDate = `${getDateChina(expectedActionDate)} 00:00:00`; // yyyy-mm-dd 00:00:00

    let statusDuration = '';
    // console.log('statusDuration', formik.values.statusDuration);
    if (formik.values.statusDuration === 'aa' || formik.values.statusDuration === 'dd') {
      statusDuration = 'Temporary';
      // console.log('statusDuration1', statusDuration);
    }
    if (formik.values.statusDuration === 'bb' || formik.values.statusDuration === 'cc') {
      statusDuration = 'Permanent';
      // console.log('statusDuration2', statusDuration);
    }
    dpDisableenable.timePeriod = statusDuration;
    if (formik.values.statusDuration === 'bb') {
      dpDisableenable.permanentReason = formik.values.justification;
    } else {
      dpDisableenable.permanentReason = '';
    }
    // console.log('statusDuration', formik.values.statusDuration);
    if (formik.values.statusDuration === 'dd') {
      dpDisableenable.tempEndDate = `${getDateChina(revertedONDate)} 00:00:00`; // yyyy-mm-dd 00:00:00
    }

    // dataPortList 01
    let incorrectStatus = false;
    let againStatus = false;
    const dpDisableEnableDetailsList = [];
    for (let i = 0; i < dataPortList.length; i += 1) {
      if (dataPortList[i].dataPortID !== '') {
        dpDisableEnableDetailsList.push({
          dataPortID: dataPortList[i].dataPortID,
          dataPortRemarks: dataPortList[i].dataPortRemarks,
          dataPortStatus: dataPortList[i].dataPortStatus,
          checkState: dataPortList[i].checkState,
          approach: ''
        });
      }
      if (dataPortList[i].checkState === 'incorrect') {
        incorrectStatus = true;
      }
      if (dataPortList[i].checkState === 'again') {
        againStatus = true;
      }
    }
    if (dpDisableEnableDetailsList.length === 0) {
      // formik.setFieldValue('valid01', true);
      setError03(true);
      CommonTip.warning(L('checkFill02'));
      return;
    }
    if (dpDisableEnableDetailsList.length !== 0) {
      // formik.setFieldValue('valid01', false);
      setError03(false);
    }

    obj.dpDisableEnableDetailsList = dpDisableEnableDetailsList;

    obj.dpDisableenable = dpDisableenable;

    const temp = [];
    temp.push(dpDisableEnableEndRequesterList);
    obj.dpDisableEnableEndRequesterList = temp;

    obj.userInfo = { loginUser: userInfo.name, requester: userInfo.name };
    obj.dataPortID = true;
    // console.log('handleClickSubmit', obj);

    if (formik.values.statusDuration === 'bb') {
      if (formik.values.justification === '') {
        CommonTip.warning(L('checkFill01'));
      } else if (incorrectStatus === true && againStatus === false) {
        // Interception
        setOpenDialog(true);
        setSubmitObj(obj);
      } else if (againStatus === true) {
        CommonTip.warning(L('DPfillAgain'));
      } else {
        handleClickSubmit(obj);
      }
    } else if (incorrectStatus === true && againStatus === false) {
      // Interception
      setOpenDialog(true);
      setSubmitObj(obj);
    } else if (againStatus === true) {
      CommonTip.warning(L('DPfillAgain'));
    } else {
      handleClickSubmit(obj);
    }
  };

  // Clean
  const handleCancel = () => {
    restForm();
    CommonTip.success(L('clearTip01'));
  };
  // for SubmitButton
  const toProps = {
    handleCancel,
    handleSubmit
  };

  // N3 Complete
  const handleCompleteRequest = () => {
    // console.log('handleCompleteRequest', e);
    console.log('readOnly =', readOnly);
    if (readOnly === false) {
      const obj = {};
      // cover data
      const dpDisableenable = getBackDetail.DPDisableEnable;
      obj.dpDisableenable = dpDisableenable;
      // obj.dpDisableEnableEndRequesterList = dpDisableenable.dpDisableEnableEndRequesterList;
      obj.dpDisableEnableEndRequesterList = [];

      // DataPortID List
      // obj.dpDisableEnableDetailsList = dpDisableenable.dpDisableEnableDetailsList; //orgin
      const temp = [];
      // console.log('dataPortList', dataPortList);
      for (let i = 0; i < dataPortList.length; i += 1) {
        if (dataPortList[i].dataPortID !== '') {
          const obj = {};
          obj.id = dataPortList[i].id || '';
          obj.requestNo = requestNo;
          obj.dataPortID = dataPortList[i].dataPortID;
          obj.approach = dataPortList[i].approach;
          obj.dataPortRemarks = dataPortList[i].dataPortRemarks;
          // obj.dataPortStatus = dataPortList[i].dataPortStatus;
          obj.dataPortStatus = 'Completed';

          temp.push(obj);
        }
      }
      // obj.dpDisableEnableDetailsList = dataPortList;
      obj.dpDisableEnableDetailsList = temp;

      // N3 Remark
      obj.dpDisableenable.internalRemarks = n3TeamRemark;
      // N3 Check
      let n3CheckString = '';
      for (let i = 0; i < n3CheckArray.length; i += 1) {
        if (n3CheckArray[i] !== '') {
          if (i + 1 === n3CheckArray.length) {
            n3CheckString += n3CheckArray[i];
          } else {
            n3CheckString += `${n3CheckArray[i]}|`;
          }
        }
      }

      // const otherBusiness = n3CheckArray.join('|');
      const otherBusiness = n3CheckString;
      obj.dpDisableenable.id = obj.dpDisableenable.id.toString();
      obj.dpDisableenable.otherBusiness = otherBusiness;
      obj.dpDisableenable.status = 'Completed';
      obj.dpDisableenable.requesterId = userInfo.username;
      obj.dpDisableenable.requesterTitle = obj.dpDisableenable.requesterTitle
        ? obj.dpDisableenable.requesterTitle
        : '';

      delete obj.dpDisableenable.lastUpdatedBy;
      delete obj.dpDisableenable.lastUpdatedDate;
      delete obj.dpDisableenable.tempPeriodpe;
      delete obj.dpDisableenable.requesterID;
      delete obj.dpDisableenable.processId;
      delete obj.dpDisableenable.userInfo;
      delete obj.dpDisableenable.respStaffEmail;
      delete obj.dpDisableenable.respStaffID;
      delete obj.dpDisableenable.respStaffName;
      delete obj.dpDisableenable.respStaffTitle;
      delete obj.dpDisableenable.staffRemarks;

      delete obj.dpDisableenable.refId;
      delete obj.dpDisableenable.refNo;
      delete obj.dpDisableenable.releaseBy;
      delete obj.dpDisableenable.releaseDate;
      delete obj.dpDisableenable.relevantService;
      delete obj.dpDisableenable.remarks;
      delete obj.dpDisableenable.requestDate;

      delete obj.dpDisableenable.completionDate;
      delete obj.dpDisableenable.contactNbr;
      delete obj.dpDisableenable.createdBy;
      delete obj.dpDisableenable.createdDate;
      delete obj.dpDisableenable.dataPortID;
      delete obj.dpDisableenable.dataPortRemarks;
      delete obj.dpDisableenable.dataPortStatus;
      delete obj.dpDisableenable.dataportNo;
      delete obj.dpDisableenable.dpDisableEnableDetailsList;
      delete obj.dpDisableenable.dpDisableEnableEndRequesterList;

      // console.log(userInfo);
      // User Info
      obj.userInfo = { loginUser: userInfo.username, requester: userInfo.username };

      obj.isSubmit = false;
      // obj.dataPortID = '';

      // console.log('deRequestN3SaveBackOBJ', obj);
      // save Back DB

      let status = false;
      let manualStatus = false;
      const temparr = obj.dpDisableEnableDetailsList;
      for (let i = 0; i < temparr.length; i += 1) {
        if (temparr[i].approach === 'Progress') {
          status = true;
          break;
        }
        if (temparr[i].approach === 'Manual') {
          manualStatus = true;
        }
      }
      let n3tickStatus = false;
      if (manualStatus === true) {
        for (let i = 0; i < n3CheckArray.length; i += 1) {
          console.log(i, n3CheckArray[i]);
          if (n3CheckArray[i] === '') {
            n3tickStatus = true;
          }
        }
      }

      if (status) {
        CommonTip.warning(L('DEN3Tip01'));
      } else if (n3tickStatus) {
        CommonTip.warning(L('DEN3Tip02'));
      } else {
        console.log('obj', obj);
        Loading.show();
        API.deRequestN3SaveBack(obj).then((res) => {
          // console.log('deRequestN3SaveBack', res);
          Loading.hide();
          if (res.data.code === 200) {
            handleDetail2();
            CommonTip.success('Completed successfully');
          }
        });
      }
    } else {
      readOnlyTip();
    }
  };
  // N3 Rejected
  const handleCancelRequest = () => {
    // console.log('handleCancelRequest', e);
    if (readOnly === false) {
      const obj = {};
      // cover data
      const dpDisableenable = getBackDetail.DPDisableEnable;
      obj.dpDisableenable = dpDisableenable;
      // obj.dpDisableEnableEndRequesterList = dpDisableenable.dpDisableEnableEndRequesterList;
      obj.dpDisableEnableEndRequesterList = [];

      // DataPortID List
      // obj.dpDisableEnableDetailsList = dpDisableenable.dpDisableEnableDetailsList; //orgin
      const temp = [];
      // console.log('dataPortList', dataPortList);
      for (let i = 0; i < dataPortList.length; i += 1) {
        if (dataPortList[i].dataPortID !== '') {
          const obj = {};
          obj.id = dataPortList[i].id || '';
          obj.requestNo = requestNo;
          obj.dataPortID = dataPortList[i].dataPortID;
          obj.approach = dataPortList[i].approach;
          obj.dataPortRemarks = dataPortList[i].dataPortRemarks;
          obj.dataPortStatus = dataPortList[i].dataPortStatus;
          temp.push(obj);
        }
      }
      // obj.dpDisableEnableDetailsList = dataPortList;
      obj.dpDisableEnableDetailsList = temp;

      // N3 Remark
      obj.dpDisableenable.internalRemarks = n3TeamRemark;

      // N3 Check
      let n3CheckString = '';
      for (let i = 0; i < n3CheckArray.length; i += 1) {
        if (n3CheckArray[i] !== '') {
          if (i + 1 === n3CheckArray.length) {
            n3CheckString += n3CheckArray[i];
          } else {
            n3CheckString += `${n3CheckArray[i]}|`;
          }
        }
      }
      // const otherBusiness = n3CheckArray.join('|');
      const otherBusiness = n3CheckString;
      obj.dpDisableenable.otherBusiness = otherBusiness;
      obj.dpDisableenable.status = 'Rejected';
      obj.dpDisableenable.requesterId = userInfo.username;

      // User Info
      obj.userInfo = { loginUser: userInfo.name, requester: userInfo.name };

      obj.isSubmit = false;
      obj.dataPortID = '';

      // console.log('deRequestN3SaveBackOBJ', obj);
      // save Back DB
      if (n3TeamRemark !== '') {
        Loading.show();
        API.deRequestN3SaveBack(obj).then((res) => {
          Loading.hide();
          // console.log('deRequestN3SaveBack', res);
          if (res.data.code === 200) {
            handleDetail2();
            CommonTip.success(L('DEN3Reject01'));
          }
        });
      } else {
        CommonTip.warning(L('DEN3Reject02'));
      }
    } else {
      readOnlyTip();
    }
  };
  // N3 Save
  const handleSaveRequest = () => {
    if (readOnly === false) {
      const obj = {};
      // cover data
      const dpDisableenable = getBackDetail.DPDisableEnable;
      obj.dpDisableenable = dpDisableenable;
      // obj.dpDisableEnableEndRequesterList = dpDisableenable.dpDisableEnableEndRequesterList;
      obj.dpDisableEnableEndRequesterList = [];

      // DataPortID List
      // obj.dpDisableEnableDetailsList = dpDisableenable.dpDisableEnableDetailsList; //orgin
      const temp = [];
      // console.log('dataPortList', dataPortList);
      for (let i = 0; i < dataPortList.length; i += 1) {
        if (dataPortList[i].dataPortID !== '') {
          const obj = {};
          obj.id = dataPortList[i].id || '';
          obj.requestNo = requestNo;
          obj.dataPortID = dataPortList[i].dataPortID;
          obj.approach = dataPortList[i].approach;
          obj.dataPortRemarks = dataPortList[i].dataPortRemarks;
          // obj.dataPortStatus = dataPortList[i].dataPortStatus;
          temp.push(obj);
        }
      }
      // obj.dpDisableEnableDetailsList = dataPortList;
      obj.dpDisableEnableDetailsList = temp;
      // console.log('TEMP', temp);

      // N3 Remark
      obj.dpDisableenable.internalRemarks = n3TeamRemark;
      // N3 Check
      let n3CheckString = '';
      for (let i = 0; i < n3CheckArray.length; i += 1) {
        if (n3CheckArray[i] !== '') {
          if (i + 1 === n3CheckArray.length) {
            n3CheckString += n3CheckArray[i];
          } else {
            n3CheckString += `${n3CheckArray[i]}|`;
          }
        }
      }
      // const otherBusiness = n3CheckArray.join('|');
      const otherBusiness = n3CheckString;
      obj.dpDisableenable.otherBusiness = otherBusiness;
      // User Info
      obj.userInfo = { loginUser: userInfo.name, requester: userInfo.name };

      obj.isSubmit = false;
      obj.dataPortID = '';

      // console.log('deRequestN3SaveBackOBJ', obj);
      // save Back DB
      Loading.show();
      API.deRequestN3SaveBack(obj).then((res) => {
        // console.log('deRequestN3SaveBack', res);
        Loading.hide();
        if (res.data.code === 200) {
          CommonTip.success(L('DEN3Save01'));
        }
      });
    } else {
      readOnlyTip();
    }
  };
  // for N3 Button
  const toPropsN3 = {
    handleCompleteRequest,
    handleCancelRequest,
    handleSaveRequest
  };

  // for N3 Check detail
  const checkedStatusCallBack = (otherBusiness) => {
    const temp = ['', ''];
    const tempN3Check = otherBusiness.split('|');
    for (let i = 0; i < tempN3Check.length; i += 1) {
      if (tempN3Check[i] === 'Configure Switch') {
        temp[0] = 'Configure Switch';
      }
      if (tempN3Check[i] === 'Save Switch Configuration') {
        temp[1] = 'Save Switch Configuration';
      }
      // if (tempN3Check[i] === 'Update Configuration DB') {
      //   temp[2] = 'Update Configuration DB';
      // }
    }
    setN3CheckArray(temp);
  };

  // for History 1
  const handleDetail1 = () => {
    history.push({
      pathname: `/request`
    });
  };
  // for History 2
  const handleDetail2 = () => {
    history.push({
      pathname: `/action`
    });
  };

  return (
    <div
      style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff', borderRadius: '0.5rem' }}
    >
      {/* Title */}
      <Grid item xs={12}>
        <Typography {...Param.FormHeaderProps}>
          {requestNo ? `DE${requestNo}` : ''}
          {/* <p>Data Port Disabling/Enabling</p> */}
        </Typography>
      </Grid>

      {requestNo && (
        <Grid item xs={12}>
          <HAPaper style={{ padding: '1em' }}>
            <ProgressBar />
          </HAPaper>
        </Grid>
      )}

      {requestNo && (
        <Grid item xs={12}>
          <HAPaper style={{ padding: '0.8em 0 0.8em 0.8em' }}>
            <ActinoLog />
          </HAPaper>
        </Grid>
      )}

      {/* Requester Info */}
      <Requester toProps={RequestData} />

      {/* End-user Information (Optional) */}
      <Enduser toProps={EnduserData} />

      {/* Service Required */}
      <Accordion
        expanded={expanded03}
        // onChange={() => setExpanded03(!expanded03)}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ ...Styles.title }} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          classes={{
            root: classes.muiAccordinSummaryRoot
          }}
        >
          <Typography variant="h4" style={{ ...Styles.typography }}>
            Service Required
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }}>
          <Grid container {...Param.SubTitleProps}>
            <Grid {...Param.FormControlProps} md={6} lg={8}>
              <Autocomplete
                id="hospitalLocation"
                value={hospitalLocation?.hospitalName ? hospitalLocation : null}
                options={hospitalList}
                getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
                onChange={(e, value) => {
                  // console.log('hostpit', value);
                  const newHospitalLocation = {
                    target: {
                      id: 'hospitalLocation',
                      value: value || {}
                    }
                  };
                  fieldsUpdateHandler(newHospitalLocation); // 保存选中的医院
                }}
                renderInput={(inputParams) => (
                  <TextField
                    {...inputParams}
                    {...Param.inputProps}
                    label="Institution / Location "
                    required
                    error={formik.values.requestHospitalE}
                  />
                )}
                disabled={detail01}
              />
            </Grid>
            <Grid {...Param.FormControlProps} md={6} lg={4}>
              {/* <DatePicker
                minDate={formik.values.today01}
                variant="inline"
                inputVariant="outlined"
                size="small"
                format="dd-MMM-yyyy"
                label="Expected Complete Date"
                value={expectedActionDate}
                onChange={handleExpectedActionDate}
                disabled={detail01}
              /> */}
              <HAKeyboardDatePicker
                name="service.exemptFrom"
                label="From *"
                value={expectedActionDate}
                onChange={handleExpectedActionDate}
                disabled={detail01}
              />
            </Grid>

            {/* Disable and Enable */}
            <Grid {...Param.FormControlProps} md={6} lg={12}>
              <RadioGroup
                aria-label="serviceType"
                name="serviceType"
                style={{ flexDirection: 'row' }}
                defaultValue={null}
                value={formik.values.serviceType}
                onChange={(e, value) => {
                  formik.handleChange(e);
                  // formik.setFieldValue('requestReason01', false);
                  if (value === 'Disable') {
                    formik.setFieldValue('statusDuration', '');
                    formik.setFieldValue(
                      'placeholderReason',
                      'Data port is no longer in use for production.'
                    );
                    formik.setFieldValue('requestReason01', true);
                    formik.setFieldValue('requestReason02', false);
                    setChioce3(true);
                    setChioce0(false);
                    // check dataPortList.length if >1  iquery clear
                    if (dataPortList.length > 1) {
                      console.log('dataPortList', dataPortList);
                      setOpenCommonDialog(true);
                    }
                  } else if (value === 'Enable') {
                    formik.setFieldValue('statusDuration', '');
                    formik.setFieldValue('placeholderReason', 'New workstation installation.');
                    formik.setFieldValue('requestReason01', false);
                    formik.setFieldValue('requestReason02', true);
                    setChioce4(true);
                    setChioce0(false);
                    // check dataPortList.length if >1  iquery clear
                    if (dataPortList.length > 1) {
                      console.log('dataPortList', dataPortList);
                      setOpenCommonDialog(true);
                    }
                  }
                }}
              >
                <FormControlLabel
                  value="Disable"
                  control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                  label="Disable Data Ports"
                  disabled={detail01}
                />
                <FormControlLabel
                  value="Enable"
                  control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                  label="Enable Data Ports"
                  disabled={detail01}
                />
              </RadioGroup>
            </Grid>

            {/* Status Duration */}
            <Grid container {...Param.SubTitleProps} style={{ marginLeft: 20 }}>
              <Grid {...Param.FormControlProps} md={6} lg={12}>
                <RadioGroup
                  aria-label="statusDuration"
                  name="statusDuration"
                  style={{ flexDirection: 'colunm' }}
                  defaultValue={null}
                  value={formik.values.statusDuration}
                  onChange={(e, value) => {
                    formik.handleChange(e);

                    if (value === 'dd') {
                      setChioce4(false);
                    } else {
                      setChioce4(true);
                    }
                    if (value === 'bb') {
                      setChioce3(false);
                    } else {
                      setChioce3(true);
                    }
                    setChioce0(true);
                  }}
                >
                  {/* enable aa= Temporary + bb = Permanent(justification) + 4Temporary */}
                  <FormControlLabel
                    value="aa"
                    control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                    label="One-off enable but the port will be disabled if not used within 3 months"
                    disabled={formik.values.requestReason01 || detail01}
                    style={
                      formik.values.requestReason01 === true
                        ? { display: 'none' }
                        : { display: 'block' }
                    }
                  />
                  <FormControlLabel
                    value="bb"
                    control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                    label="Permanently enable even the port is not in use for more than 3 months"
                    disabled={formik.values.requestReason01 || detail01}
                    style={
                      formik.values.requestReason01 === true
                        ? { display: 'none' }
                        : { display: 'block' }
                    }
                  />
                  <Grid {...Param.FormControlProps} md={12} lg={12}>
                    <TextField
                      {...Param.inputProps}
                      label="Please provide justification with due consideration of the associated security exposure"
                      value={formik.values.justification}
                      id="justification"
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      style={
                        formik.values.requestReason01 === true
                          ? { display: 'none' }
                          : { display: 'block', marginBottom: 15 }
                      }
                      disabled={chioce3}
                    />
                  </Grid>
                  {/* disable cc Permanent + 4Temporary */}
                  <FormControlLabel
                    value="cc"
                    control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                    label="One-off disable"
                    disabled={formik.values.requestReason02 || detail01}
                    style={
                      formik.values.requestReason02 ? { display: 'none' } : { display: 'block' }
                    }
                  />
                  <FormControlLabel
                    value="dd"
                    control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                    label={`Temporarily ${formik.values.serviceType.toLowerCase()} and will be reverted on`}
                    style={
                      formik.values.serviceType === '' ? { display: 'none' } : { display: 'block' }
                    }
                    disabled={detail01}
                  />
                </RadioGroup>
                <Grid
                  {...Param.FormControlProps}
                  md={6}
                  lg={3}
                  style={
                    formik.values.serviceType === ''
                      ? { display: 'none', position: 'relative', marginLeft: 320, marginTop: -40 }
                      : { display: 'block', position: 'relative', marginLeft: 320, marginTop: -40 }
                  }
                >
                  {/* <DatePicker
                    minDate={formik.values.today02}
                    variant="inline"
                    inputVariant="outlined"
                    size="small"
                    label="Reverted Date"
                    format="dd-MMM-yyyy"
                    value={revertedONDate}
                    onChange={handleRevertedONDate}
                    disabled={chioce4}
                  /> */}
                  <HAKeyboardDatePicker
                    minDate={formik.values.today02}
                    label="Reverted Date"
                    value={revertedONDate}
                    onChange={handleRevertedONDate}
                    disabled={chioce4}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <label
                style={
                  error02
                    ? { display: 'block', color: 'red', padding: '5px 10px' }
                    : { display: 'none' }
                }
              >
                You must choose a plan
              </label>
            </Grid>

            <Grid {...Param.FormControlProps} md={6} lg={12}>
              <TextField
                {...Param.inputProps}
                label="Reason "
                value={formik.values.requestReason}
                id="requestReason"
                multiline
                rows={4}
                placeholder={formik.values.placeholderReason}
                onChange={formik.handleChange}
                required
                error={formik.values.requestReasonE}
                style={chioce0 === false ? { display: 'none' } : { display: 'block' }}
                disabled={!chioce0 || detail01}
              />
            </Grid>
          </Grid>
          <Grid container>
            <label
              style={
                error01
                  ? { display: 'block', color: 'red', padding: '5px 10px' }
                  : { display: 'none' }
              }
            >
              You Must Select Disable or Enable
            </label>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Data Port List */}
      <DataPortID toProps={DataPortIDData} />

      {/* N3 result */}
      <Grid
        {...Param.FormControlProps}
        container
        md={6}
        lg={12}
        style={detail05 ? { display: 'block' } : { display: 'none' }}
      >
        <TextField
          {...Param.inputRemark}
          id="n3TeamRemark"
          label="Remarks (for N3 Team / DC Operation internal use):"
          value={n3TeamRemark}
          onChange={(e) => {
            setN3TeamRemark(e.target.value);
          }}
          minRows={6}
          maxRows={10}
          disabled
        />
      </Grid>

      {/* N3 Team Approval */}
      <Accordion
        expanded={expanded06}
        // onChange={() => setExpanded06(!expanded06)}
        style={
          detail03 === false
            ? { width: '100%', marginTop: '1rem', display: 'none' }
            : { width: '100%', marginTop: '1rem' }
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ ...Styles.title }} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          classes={{
            root: classes.muiAccordinSummaryRoot
          }}
        >
          <Typography variant="h4" style={{ ...Styles.typography }}>
            N3 Team Approval
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container {...Param.FormControlProps} md={6} lg={12}>
            <Grid {...Param.FormControlProps} md={6} lg={12}>
              <TextField
                {...Param.inputRemark}
                id="n3TeamRemark"
                label="Remarks (for N3 Team / DC Operation internal use):"
                value={n3TeamRemark}
                onChange={(e) => {
                  setN3TeamRemark(e.target.value);
                }}
                minRows={6}
                maxRows={10}
                disabled={detail04}
              />
            </Grid>
            <Grid {...Param.FormControlProps} md={6} lg={12}>
              <FormGroup>
                <FormControlLabel
                  label="Configure Switch"
                  control={
                    <Checkbox
                      classes={{ root: classes.checkBox, checked: classes.checked }}
                      checked={n3CheckArray[0] !== ''}
                      onChange={() => {
                        let temp = [];
                        temp = [...n3CheckArray];
                        if (temp[0] !== '') {
                          temp[0] = '';
                        } else {
                          temp[0] = 'Configure Switch';
                        }
                        setN3CheckArray(temp);
                      }}
                      disabled={detail04 || detail06}
                    />
                  }
                />
                <FormControlLabel
                  label="Save Switch Configuration"
                  control={
                    <Checkbox
                      classes={{ root: classes.checkBox, checked: classes.checked }}
                      checked={n3CheckArray[1] !== ''}
                      onChange={() => {
                        let temp = [];
                        temp = [...n3CheckArray];
                        if (temp[1] !== '') {
                          temp[1] = '';
                        } else {
                          temp[1] = 'Save Switch Configuration';
                        }
                        setN3CheckArray(temp);
                      }}
                      disabled={detail04 || detail06}
                    />
                  }
                />
                {/* <FormControlLabel
                  label="Update Configuration DB (Change Status To 'Enabled/Disabled', Input 'DExxxxxx' In Remark Field)"
                  control={
                    <Checkbox
                      classes={{ root: classes.checkBox, checked: classes.checked }}
                      checked={n3CheckArray[2] !== ''}
                      onChange={() => {
                        let temp = [];
                        temp = [...n3CheckArray];
                        if (temp[2] !== '') {
                          temp[2] = '';
                        } else {
                          temp[2] = 'Update Configuration DB';
                        }
                        setN3CheckArray(temp);
                      }}
                      disabled={detail04}
                    />
                  }
                /> */}
              </FormGroup>
            </Grid>

            {/* N3 BTN */}
            <Grid
              {...Param.FormControlProps}
              md={6}
              lg={12}
              style={detail04 ? { display: 'none' } : { display: 'block' }}
            >
              <N3Button toProps={toPropsN3} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* requester BTN */}
      <div style={detail01 === true ? { display: 'none' } : { display: 'block' }}>
        <SubmitButton toProps={toProps} />
      </div>

      {/* Dialog */}
      <>
        <WarningDialog
          handleConfirm={handleConfirmSubmitY}
          handleClose={handleConfirmSubmitN}
          content="Data port ID isn't correct, Are you sure to submit the application ?"
          open={openDialog}
        />
      </>
      {/* <>
        <CommonDialogTip
          open={openCommonDialog}
          content="Are you sure want to convert the service type ?"
          handleConfirm={changeServiceType}
          handleClose={closeCommonDialog}
        />
      </> */}
      <WarningDialog
        handleConfirm={changeServiceType}
        handleClose={closeCommonDialog}
        content="Are you sure want to convert the service type ?"
        open={openCommonDialog}
      />
    </div>
  );
}
export default DeForm;
