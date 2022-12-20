import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux'; // load from redux
import dayjs from 'dayjs';
import _ from 'lodash';
import ResourceForm from './ResourceForm';

import DeForm from '../../../webdp/DERequestForm/components/index'; // for DE
import DPForm from '../../../myrequest/components/Detail/index'; // for DP AP
// import DPForm from '../../../myaction/components/Detail/index'; // for DP AP
import IPAddressApplicationDetail from '../../../NetworkConfiguration/IPAddressApplication/Detail';
import IPRDetail from '../../../NetworkConfiguration/IPAddressRelease/Detail';
import IPUDetail from '../../../NetworkConfiguration/IPAddressUpdate/index';

import { Loading } from '../../../../components';
import resourceMXAPI from '../../../../api/resourceManage/index';
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

const useStyles = makeStyles({
  tabPanel: {
    background: '#fff',
    height: '73vh',
    padding: '5px 10px',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  tabPanel01: {
    background: '#fff',
    padding: '5px 10px',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  tabStyle: {
    '&.MuiAppBar-colorPrimary': {
      color: '#155151',
      backgroundColor: '#fff',
      padding: '5px 20px',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15
    }
  },
  tabSelected: {
    '&.MuiTab-textColorInherit.Mui-selected': {
      color: '#229ffa' // if will be look like Bitrix24 color style change here #155151
    }
  }
});

const Index = (props) => {
  const { requestNo } = props;
  const requestNoURL = useParams().requestNo;
  // const orderStatus = useParams().status;
  // console.log('orderStatus', orderStatus);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expandOR, setExpandOR] = useState(false);

  // 获取 detail
  const toGetDetailDataforApproval = (requestNo) => {
    requestDetail(requestNo);
  };
  const requestDetail = (requestNo) => {
    console.log('requestDetail');
    Loading.show();
    resourceMXAPI
      .getDetailData(requestNo)
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

    if (detailData.resourceRequestNewInstallDetailVo === null) {
      // ------------------------------------------------------------- configuration
      const { resourceRequestVo } = detailData;
      // 0 文件处理
      const { fileList } = resourceRequestVo;
      console.log('configuration fileList', fileList);
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
    } else {
      // ------------------------------------------------------------- installation
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

  const { toggleDrawer, toGetCalendarList, originalAppType, originalRequestNo } = props;

  const checkFromMyAction = () => {
    if (typeof requestNoURL !== 'undefined') {
      // 触发 getdetail
      toGetDetailDataforApproval(requestNoURL);
    }
  };
  useEffect(() => {
    dispatch(setRestData());
    checkFromMyAction();
  }, []);

  return (
    <div style={{ width: '82vw' }}>
      <ResourceForm
        formType={props?.requestNo ? 'detail' : 'approval'}
        requestNo={requestNo}
        toggleDrawer={toggleDrawer}
        toGetCalendarList={toGetCalendarList}
      />
      {props?.requestNo ? (
        <Accordion
          expanded={expandOR}
          onChange={() => setExpandOR(!expandOR)}
          style={{ width: '98%', marginTop: '1rem', marginLeft: '1%' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            classes={{
              root: classes.muiAccordinSummaryRoot
            }}
          >
            <Typography variant="h4">Related Form</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            {originalAppType === 'DE' ? (
              <DeForm
                apptype={originalAppType.toLowerCase()}
                requestNo={originalRequestNo}
                aduser="re"
              />
            ) : originalAppType === 'DP' ? (
              <DPForm apptype={originalAppType.toUpperCase()} requestNo={originalRequestNo} />
            ) : originalAppType === 'AP' ? (
              <DPForm apptype={originalAppType.toUpperCase()} requestNo={originalRequestNo} />
            ) : originalAppType === 'IP' ? (
              <IPAddressApplicationDetail requestNo={originalRequestNo} />
            ) : originalAppType === 'IPR' ? (
              <IPRDetail requestNo={originalRequestNo} />
            ) : originalAppType === 'IPU' ? (
              <IPUDetail requestNo={originalRequestNo} status="detail" />
            ) : null}
          </AccordionDetails>
        </Accordion>
      ) : null}
    </div>
  );
};

export default Index;
