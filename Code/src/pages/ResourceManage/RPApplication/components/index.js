import React, { memo, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useDispatch } from 'react-redux'; // load from redux
import {
  makeStyles,
  Tooltip,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { DataGrid } from '@material-ui/data-grid';
import _ from 'lodash';

import {
  setRequest,
  setStatusInfo,
  setBindAppForm,
  setJobType,
  setServiceForm,
  setMoreInfo,
  updateAttachments,
  setRestData
} from '../../../../redux/ResourceMX/resourceAction';

import HeadSearch from './HeadSearch';
import DetailApplication from './DetailApplication';
import MakeResouceOrder from './MakeResouceOrder';
import resourceMXAPI from '../../../../api/resourceManage/index';
import { Loading, CommonTip } from '../../../../components';
import { useGlobalStyles } from '../../../../style';
import { getDayNumber01 } from '../../../../utils/date';
import ActionLog from './ActionLog';

const useStyles = makeStyles({
  SwipeableDrawer: {
    minWidth: 500,
    maxWidth: '85wh',
    height: 'auto'
  },
  root: {
    // 间隔颜色
    '& .MuiDataGrid-row:nth-child(odd)': {
      background: '#f0f0f0'
    }
  }
});

export const StyleWrapper = styled.div`
  .fc th {
    background: antiquewhite;
  }
  .fc .fc-scrollgrid-liquid {
    border-radius: 5px;
  }
  .fc td {
    background: #fffffc;
  }
  .fc-direction-ltr .fc-daygrid-event.fc-event-end,
  .fc-direction-rtl .fc-daygrid-event.fc-event-start {
    display: flex;
    align-items: center;
    height: 40px;
  }
`;
// needed for dayClick
const DemoApp = () => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const classes = useStyles();
  const globalclasses = useGlobalStyles();
  const [event, setEvent] = useState([
    // {
    //   title: 'To do 1 saved',
    //   start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().format('YYYY-MM-DD'),
    //   backgroundColor: '#d9d9d9',
    //   borderColor: '#d9d9d9',
    //   textColor: '#fff',
    //   jobState: 'submit',
    //   editable: false
    // },
    // {
    //   title: 'To do 2 submit',
    //   start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().format('YYYY-MM-DD'),
    //   backgroundColor: '#ccc',
    //   borderColor: '#ccc',
    //   textColor: '#fff',
    //   jobState: 'approval',
    //   editable: true
    // },
    // {
    //   title: 'To do 3 done',
    //   start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().format('YYYY-MM-DD'),
    //   backgroundColor: '#52c41a',
    //   borderColor: '#52c41a',
    //   textColor: '#fff',
    //   jobState: 'done',
    //   editable: false
    // },
    // {
    //   title: 'To do A1 style',
    //   start: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    //   backgroundColor: '#FFCC00',
    //   borderColor: '#FFCC00',
    //   textColor: '#fff',
    //   jobState: 'view',
    //   editable: true,
    //   jobType: 'Installion',
    //   appType: 'DE',
    //   requestNo: '220800068',
    //   aduser: 're'
    // },
    // {
    //   title: 'To do A2 style',
    //   start: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    //   backgroundColor: '#FF4D00',
    //   borderColor: '#FF4D00',
    //   textColor: '#fff',
    //   jobState: 'view',
    //   editable: true
    // },
    // {
    //   title: 'To do A3 style',
    //   start: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    //   backgroundColor: '#FF00B3',
    //   borderColor: '#FF00B3',
    //   textColor: '#fff',
    //   jobState: 'view',
    //   editable: true
    // },
    // {
    //   title: 'To do A4 style',
    //   start: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    //   end: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    //   backgroundColor: '#FF7A95',
    //   borderColor: '#FF7A95',
    //   textColor: '#fff',
    //   jobState: 'view',
    //   editable: true
    // }
  ]);

  // 列表 开关
  const [listSwitch] = useState(true);
  // 列表 折叠 开关
  const [expandOR, setExpandOR] = useState(false);
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100
    },
    {
      field: 'requestNo',
      headerName: 'Request No.',
      width: 180
    },
    {
      field: 'displayName',
      headerName: 'Requester',
      width: 350
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 180
    },
    {
      field: 'jobType',
      headerName: 'Job Type',
      width: 250
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 230
    },
    {
      field: 'targetDate',
      headerName: 'Target Date',
      width: 230
    }
  ];
  const [rows, setRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 弹柜设置
  const [drawerStatus, setDrawerStatus] = useState({ left: false, right: false });

  // 切换 日历 月份
  const [dateTime, setDateTime] = useState('');
  const handleEvenDateSet = (info) => {
    // console.log('day month year:', info.view.title);
    const monthArr = [
      { en: 'January', num: '01' },
      { en: 'February', num: '02' },
      { en: 'March', num: '03' },
      { en: 'April', num: '04' },
      { en: 'May', num: '05' },
      { en: 'June', num: '06' },
      { en: 'July', num: '07' },
      { en: 'August', num: '08' },
      { en: 'September', num: '09' },
      { en: 'October', num: '10' },
      { en: 'November', num: '11' },
      { en: 'December', num: '12' }
    ];
    const { title } = info.view;
    const temparr = title.split(' ');
    // console.log('temparr', temparr);
    const mon = monthArr.filter((item) => item.en === temparr[0]);
    const dateTime = `${temparr[1]}-${mon[0].num}-01 00:00:00`;
    setDateTime(dateTime);
    // console.log('dateTime', mon, dateTime);
  };
  const handleDateClick = () => {
    // console.log('handleDateClick', info.dateStr);
    toggleDrawer2('right', true);
  };

  // for detail
  const [requestNo, setRequestNo] = useState('');
  const [originalAppType, setOriginalAppType] = useState('');
  const [originalRequestNo, setOriginalRequestNo] = useState('');
  const handleEventClick = (info) => {
    const requestNoTemp = info.event._def.extendedProps.requestNo;
    const AppType = info.event._def.extendedProps.originalAppType;
    const RequestNo = info.event._def.extendedProps.originalRequestNo;
    // console.log('handleEventClick detail', info, requestNoTemp);
    setRequestNo(requestNoTemp);
    setOriginalAppType(AppType);
    setOriginalRequestNo(RequestNo);
    toGetDetailData(requestNoTemp);
    toggleDrawer2('left', true);
  };

  // 拖动
  const handleEventDrop = (info) => {
    // console.log('change confirmed', info);
    const { requestNo, orderId, startDate } = info.event._def.extendedProps; // 获取到 order原本的 开始 时间
    const { startStr } = info.event; // 获取 拖到 的日子

    const obj = {};

    obj.requestNo = requestNo;
    obj.orderId = orderId;
    // 拖动 的时间 比 原本 的 时间 还要 早，就 把 拖动 的日子 当开始日期；
    if (dayjs(startStr).unix() < dayjs(startDate).unix()) {
      // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', dayjs(startStr).unix(), dayjs(startDate).unix());
      obj.startDate = dayjs(startStr).format('YYYY-MM-DD HH:mm:ss');
    } else {
      obj.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
    }
    obj.targetDate = dayjs(startStr).format('YYYY-MM-DD HH:mm:ss');

    Loading.show();
    resourceMXAPI
      .updateStart8Target(obj)
      .then((res) => {
        if (res.data.code === 200) {
          CommonTip.success('Update Success');
          toGetCalendarList();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };
  const handleEventResize = (info) => {
    let { endStr } = info.event;
    endStr = dayjs(endStr).subtract(1, 'day').format('YYYY-MM-DD'); // 传给后端的 结束日
    console.log('handleEventResize', info.event.endStr, endStr);
  };

  // 获取 详情
  const toGetDetailData = (requestNoTemp) => {
    dispatch(setRestData());
    // console.log('getDetailData index');
    Loading.show();
    resourceMXAPI
      .getDetailData(requestNoTemp)
      .then((res) => {
        // console.log('getDetailData', res);
        if (res.data.code === 200) {
          processorDetailData(res.data.data);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };
  const processorDetailData = (detailData) => {
    const bindAppForm = {};
    const jobType = {};
    let state = null;

    // ------------------------------------------------------------- configuration
    if (detailData.resourceRequestNewInstallDetailVo === null) {
      const { resourceRequestVo } = detailData;
      // 0 文件处理
      const { fileList } = resourceRequestVo;
      // console.log('configuration fileList', fileList);
      if (fileList?.length > 0) {
        if (fileList[0] !== '') {
          fileList.forEach((element) => {
            const obj = JSON.parse(element);
            dispatch(updateAttachments(obj));
          });
        }
      }

      // console.log('Configuration Detail:', resourceRequestVo);
      // 1 更新 申请者字段
      dispatch(setRequest({ field: 'logonDomain', data: resourceRequestVo?.domain }));
      // dispatch(setRequest({ field: 'logonName', data: resourceRequestVo?.displayName }));
      dispatch(setRequest({ field: 'title', data: resourceRequestVo?.title }));
      dispatch(setRequest({ field: 'name', data: resourceRequestVo?.displayName }));
      dispatch(setRequest({ field: 'userPhone', data: resourceRequestVo?.phone }));

      // 2 获取到 状态
      state = resourceRequestVo.state;
      if (!state) {
        dispatch(setStatusInfo('detailSaved'));
      } else if (state === 1) {
        dispatch(setStatusInfo('detailSubmited'));
      } else if (state === 2) {
        dispatch(setStatusInfo('detailApproved'));
      } else if (state === 0) {
        dispatch(setStatusInfo('detailDone'));
      }

      // 3 更新到 绑定 的 单据资料
      bindAppForm.requestType = resourceRequestVo?.originalApplyType || '';
      bindAppForm.requestNo = resourceRequestVo?.originalRequestNo || '';
      bindAppForm.networkDesign = resourceRequestVo?.networkDesign || '';
      dispatch(setBindAppForm(bindAppForm));

      // 4 获取到 工作 的类型
      jobType.jobType = resourceRequestVo?.jobType;
      jobType.serviceType = resourceRequestVo?.detailVoList[0].serviceType;
      jobType.staffName = resourceRequestVo?.detailVoList[0].assignStaff;
      jobType.startDate = resourceRequestVo?.startDate;
      jobType.endDate = resourceRequestVo?.targetDate;
      dispatch(setJobType(jobType));

      // 5 处理 表单数据
      const { detailVoList } = resourceRequestVo;
      if (detailVoList?.length > 0) {
        let serviceForm = [];
        detailVoList.forEach((item) => {
          const obj = {};
          obj.id = _.uniqueId();
          obj.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
          obj.switchIp = item?.switchIp || '';
          obj.switchPort = item?.switchPort || '';
          obj.switchIp = item?.switchIp || '';
          obj.Details = item?.details || '';
          obj.vLan = item?.vlan || '';

          serviceForm = [...serviceForm, obj];
        });
        // console.log('detailVoList', detailVoList, serviceForm);
        dispatch(setServiceForm(serviceForm));
      }

      // 6 处理 富文本
      const moreInfo = {};
      moreInfo.html = resourceRequestVo.illustration;
      moreInfo.text = resourceRequestVo.illustrationText;
      dispatch(setMoreInfo(moreInfo));
    }
    // ------------------------------------------------------------- installation
    else {
      const { resourceRequestNewInstallDetailVo } = detailData;
      // 0 文件处理
      const { fileList } = resourceRequestNewInstallDetailVo;
      // console.log('Installtion fileList', fileList);
      if (fileList?.length > 0) {
        if (fileList[0] !== '') {
          fileList.forEach((element) => {
            const obj = JSON.parse(element);
            dispatch(updateAttachments(obj));
          });
        }
      }

      // console.log('NewInstallation Detail:', resourceRequestNewInstallDetailVo);
      const { domain, displayName, title, phone } = resourceRequestNewInstallDetailVo;
      // 1 更新 申请者字段
      dispatch(setRequest({ field: 'logonDomain', data: domain }));
      dispatch(setRequest({ field: 'title', data: title }));
      dispatch(setRequest({ field: 'name', data: displayName }));
      dispatch(setRequest({ field: 'userPhone', data: phone }));

      // 2 获取到 状态
      state = resourceRequestNewInstallDetailVo?.state;
      console.log('Yancy', state);
      if (!state) {
        dispatch(setStatusInfo('detailSaved'));
      } else if (state === 1) {
        dispatch(setStatusInfo('detailSubmited'));
      } else if (state === 2) {
        dispatch(setStatusInfo('detailApproved'));
      } else if (state === 0) {
        dispatch(setStatusInfo('detailDone'));
      }

      // 3 更新到 绑定 的 单据资料
      bindAppForm.requestType = resourceRequestNewInstallDetailVo?.originAppType || '';
      bindAppForm.requestNo = resourceRequestNewInstallDetailVo?.originRequestNo || '';
      bindAppForm.networkDesign = resourceRequestNewInstallDetailVo?.networkDesign || '';
      dispatch(setBindAppForm(bindAppForm));

      // 4 获取到 工作 的类型
      jobType.jobType = resourceRequestNewInstallDetailVo?.jobType;
      jobType.serviceType = '';
      jobType.staffName = '';
      jobType.startDate = resourceRequestNewInstallDetailVo?.startDate;
      jobType.endDate = resourceRequestNewInstallDetailVo?.targetDate;
      dispatch(setJobType(jobType));

      // 5 处理 表单数据
      const { resourceNewInstallArrays } = resourceRequestNewInstallDetailVo;
      if (resourceNewInstallArrays?.length > 0) {
        let serviceForm = [];
        resourceNewInstallArrays.forEach((item) => {
          const {
            resourceRequestOrderVoList,
            resourceRequestNewInstallBackboneVos,
            resourceRequestNewInstallOutletVoList
          } = item;
          const obj = {};
          obj.id = _.uniqueId();
          obj.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
          obj.jobTypeValue = '1';
          obj.statffName = resourceRequestOrderVoList[0].assignStaff;
          obj.staffListLoading = false;
          obj.staffPhone = resourceRequestOrderVoList[0].phone;
          obj.staffPhoneError = false;
          obj.staffEmail = resourceRequestOrderVoList[0].email;
          obj.staffEmailError = false;
          obj.targetAt = [
            dayjs(resourceRequestOrderVoList[0].startDate).format('YYYY-MM-DD'),
            null
          ];
          obj.rangeDate = {
            startDate: dayjs(resourceRequestOrderVoList[0].startDate).format('YYYY-MM-DD'),
            endDate: dayjs(resourceRequestOrderVoList[0].targetDate).format('YYYY-MM-DD')
          };

          // subForm1 done
          obj.subForm1 = [];
          for (let i1 = 0; i1 < resourceRequestOrderVoList.length; i1 += 1) {
            const obj1 = {};
            obj1.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
            obj1.Equipment = resourceRequestOrderVoList[i1].equipment;
            obj1.sourceOfGoods = resourceRequestOrderVoList[i1].sourceGoods;
            obj1.orderNo = resourceRequestOrderVoList[i1].orderNo || '';
            obj1.PRCode = resourceRequestOrderVoList[i1].prCode || '';
            obj1.availableDate = dayjs(resourceRequestOrderVoList[i1].availableDate).format(
              'YYYY-MM-DD'
            );
            obj.subForm1 = [...obj.subForm1, obj1];
          }

          obj.closetID = resourceRequestNewInstallBackboneVos[0].closetId || '';
          obj.closeListLoading = false;
          obj.rackID = resourceRequestNewInstallBackboneVos[0].rackId || '';
          obj.rackListLoading = false;
          obj.position = resourceRequestNewInstallBackboneVos[0].position || '';
          obj.positionListLoading = false;
          obj.powerSource = resourceRequestNewInstallBackboneVos[0].powerSource;
          obj.powerSourceListLoading = false;
          obj.ip = resourceRequestNewInstallBackboneVos[0].ipAddress;
          obj.ipListLoading = false;

          // subForm2 done
          obj.subForm2 = [];
          for (let i2 = 0; i2 < resourceRequestNewInstallBackboneVos.length; i2 += 1) {
            const obj2 = {};
            obj2.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
            obj2.priBackboneID = resourceRequestNewInstallBackboneVos[i2].priBackboneId;
            obj2.priBackboneIDLoading = false;
            obj2.priBackboneType =
              resourceRequestNewInstallBackboneVos[i2].priBackboneType?.toString();
            obj2.secBackboneID = resourceRequestNewInstallBackboneVos[i2].secBackboneId;
            obj2.secBackboneIDLoading = false;
            obj2.secBackboneType =
              resourceRequestNewInstallBackboneVos[i2].secBackboneType?.toString();
            obj2.availableDate =
              dayjs(resourceRequestNewInstallBackboneVos[i2].availableDate).format('YYYY-MM-DD') ||
              null;
            obj.subForm2 = [...obj.subForm2, obj2];
          }

          // subForm3 done
          obj.subForm3 = [];
          for (let i3 = 0; i3 < resourceRequestNewInstallOutletVoList.length; i3 += 1) {
            const obj3 = {};
            obj3.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
            obj3.switchPort = resourceRequestNewInstallOutletVoList[i3].switchPort;
            obj3.outletID = resourceRequestNewInstallOutletVoList[i3].outletId;
            obj3.activate = resourceRequestNewInstallOutletVoList[i3].activate;
            obj3.remarks = resourceRequestNewInstallOutletVoList[i3].remarks;
            obj3.outletIDLoading = false;
            obj.subForm3 = [...obj.subForm3, obj3];
          }
          serviceForm = [...serviceForm, obj];
        });
        dispatch(setServiceForm(serviceForm));
      }

      // 6 处理 富文本
      const moreInfo = {};
      moreInfo.html = resourceRequestNewInstallDetailVo.illustration;
      moreInfo.text = resourceRequestNewInstallDetailVo.illustrationText;
      dispatch(setMoreInfo(moreInfo));
    }
  };

  // Drawer
  const toggleDrawer2 = (anchor, open) => {
    // console.log('toggleDrawer2', anchor, open);
    dispatch(setRestData());
    setDrawerStatus({ ...drawerStatus, [anchor]: open });
  };
  const toggleDrawer = (anchor, open) => (event) => {
    // console.log('toggleDrawer', anchor, open);
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerStatus({ ...drawerStatus, [anchor]: open });
  };

  // for tooltips
  const renderEventContent = (eventInfo) => (
    <>
      <b>{eventInfo.timeText}</b>
      <Tooltip title={eventInfo.event.title} placement="top">
        <i>{eventInfo.event.title}</i>
      </Tooltip>
    </>
  );

  // 获取 列表 日历
  const toGetCalendarList = (statusSlect, jobTpyeSel, requestNo, rangeDate) => {
    const startDate = dayjs('2022-01-01').format('YYYY-MM-DD');
    const endDate = dayjs().add(1, 'year').format('YYYY-MM-DD');
    // console.log('toGetCalendarList', startDate, endDate);
    // console.log('toGetCalendarList', statusSlect, jobTpyeSel, requestNo, rangeDate);

    const obj = {};

    obj.state = statusSlect;
    obj.jobType = jobTpyeSel;
    obj.requestNo = requestNo;
    obj.startDate = rangeDate?.startDate || startDate;
    obj.targetDate = rangeDate?.endDate || endDate;

    Loading.show();
    resourceMXAPI
      .getCalendarList(obj)
      .then((res) => {
        // console.log('getCalendarList', res);
        if (res.data.code === 200) {
          const listTemp = res.data.data;
          if (listTemp.length > 0) {
            const eventList = [];
            // listTemp.forEach((item) => {
            for (let i = 0; i < listTemp.length; i += 1) {
              const item = listTemp[i];
              // console.log('get list ', item);
              const obj = {};
              obj.tableIndex = i + 1;
              // console.log('tableIndex', i + 1);
              // 0 done; 1 submit; 2 view ; null save;
              let jobStatus = '';
              if (item.state === 0) {
                jobStatus = 'Done';
                obj.backgroundColor = '#52c41a';
                obj.borderColor = '#52c41a';
              }
              if (item.state === 1) {
                jobStatus = 'Submitted';
                obj.backgroundColor = '#bfbfbf';
                obj.borderColor = '#bfbfbf';
              }
              if (item.state === null) {
                jobStatus = 'Saved';
                obj.backgroundColor = '#ff8f1f';
                obj.borderColor = '#ff8f1f';
                obj.editable = true;
              }
              let jobType = '';
              if (item.state === 2) {
                jobStatus = 'Approved';
                if (item.jobType === 0) {
                  jobType = 'Configuration';
                  obj.backgroundColor = '#FF7A95';
                  obj.borderColor = '#FF7A95';
                }
                if (item.jobType === 1) {
                  jobType = 'New Installation';
                  obj.backgroundColor = '#1f8fff';
                  obj.borderColor = '#1f8fff';
                }
              }

              obj.title = `RM${item.requestNo}-${jobType}-${jobStatus}`;
              obj.start = dayjs(item.targetDate).format('YYYY-MM-DD');
              obj.end = dayjs(item.targetDate).add(1, 'day').format('YYYY-MM-DD');
              obj.requestNo = item?.requestNo;
              obj.orderId = item?.orderId;
              obj.originalAppType = item?.originalAppType;
              obj.originalRequestNo = item?.originalRequestNo;
              obj.jobType =
                item?.jobType === 0
                  ? 'Configuration'
                  : item?.jobType === 1
                  ? 'New Installation'
                  : '';

              // for List Data
              obj.id = item?.id;
              obj.startDate = dayjs(item.startDate).format('YYYY-MM-DD');
              obj.targetDate = dayjs(item.targetDate).format('YYYY-MM-DD');
              obj.phone = item?.phone;
              obj.displayName = item?.displayName;

              eventList.push(obj);
              // eventList = [...eventList, obj];
            }
            // console.log('even List:', eventList);
            setEvent(eventList);
            setRows(eventList);
          } else {
            const eventList = [];
            setEvent(eventList);
            setRows(eventList);
          }
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  useEffect(() => {
    toGetCalendarList();
  }, []);

  // 下载 Excel
  const getExcelUrlDownLoad = () => {
    const obj = {};
    obj.dateTime = dateTime;

    Loading.show();
    resourceMXAPI
      .getExcelUrl(obj)
      .then((res) => {
        // console.log('getExcelUrlDownLoad', res);
        if (res.data.code === 200) {
          const url = res.data.data;
          // console.log('getExcelUrlDownLoad', url);
          if (url !== '') {
            fetch(url)
              .then((res) => res.blob())
              .then((blob) => {
                // 将链接地址字符内容转变成blob地址
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                // 测试链接console.log(a.href)
                a.download = `RM${getDayNumber01()}.xlsx`; // 下载文件的名字
                document.body.appendChild(a);
                a.click();
              });
          }
        } else if (res.data.code === 201) {
          CommonTip.warning(`This month no data`);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // 列表 每页  条数
  const [pageSize, setPageSize] = useState(10);

  // get Action Log
  const getActionLogPage = () => {
    // console.log('getActionLogPage');
    setDrawerOpen(true);
  };

  return (
    <>
      <HeadSearch
        eventFilter={toGetCalendarList}
        getExcelUrlDownLoad={getExcelUrlDownLoad}
        getActionLogPage={getActionLogPage}
      />
      {listSwitch === true ? (
        <Accordion
          expanded={expandOR}
          onChange={() => setExpandOR(!expandOR)}
          style={{ width: '100%', marginBottom: 30, borderRadius: 5 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            classes={{
              root: classes.muiAccordinSummaryRoot
            }}
          >
            <Typography variant="h4">List</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            <div style={{ height: '640px' }} className={classes.root}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 20, 50]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                className={globalclasses.fixDatagrid}
                // getRowClassName={(params) => {
                //   const { row } = params;
                //   console.log('getRowClassName', params);
                //   return row.tableIndex % 2 === 0
                //     ? 'my-table-active-color'
                //     : 'my-select-item-color';
                // }}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      ) : null}

      <div style={{ width: '99%', marginLeft: '0.5%' }}>
        <StyleWrapper>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            ref={myRef}
            // weekends={false}
            events={event}
            datesSet={handleEvenDateSet}
            eventContent={renderEventContent} // custom render function
            dateClick={handleDateClick} // make a task submit
            eventDrop={handleEventDrop} // adjust schedule
            eventClick={handleEventClick} // view detail
            eventResize={handleEventResize}
          />
        </StyleWrapper>
      </div>

      <div>
        {['left', 'right'].map((anchor) => (
          <React.Fragment key={anchor}>
            <SwipeableDrawer
              anchor={anchor}
              open={drawerStatus[anchor]}
              onOpen={toggleDrawer(anchor, true)}
              onClose={toggleDrawer(anchor, false)}
              className={classes.SwipeableDrawer}
              // disableDiscovery
            >
              {anchor === 'right' ? (
                <MakeResouceOrder
                  toggleDrawer={toggleDrawer2}
                  toGetCalendarList={toGetCalendarList}
                />
              ) : null}
              {anchor === 'left' ? (
                <DetailApplication
                  requestNo={requestNo}
                  toggleDrawer={toggleDrawer2}
                  toGetCalendarList={toGetCalendarList}
                  originalAppType={originalAppType}
                  originalRequestNo={originalRequestNo}
                />
              ) : null}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
      <ActionLog drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
  );
};

export default memo(DemoApp);
