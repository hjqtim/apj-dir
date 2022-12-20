import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // load from redux
import dayjs from 'dayjs';

import { useParams } from 'react-router';
import { HAPaper, Loading, CommonTip } from '../../../../components';
import RequesterBaseInfo from './generalForm/RequesterBaseInfo';
import JobType from './generalForm/JobType';
import AttachMent from './generalForm/AttachMent';
import ResourceBTN from './ResourceBTN';
import DoneBtn from './ResourceDoneBTN';
import resourceMXAPI from '../../../../api/resourceManage/index';
import useValidationForm from './generalForm/useValidationForm';
import {
  // setRestData,
  setRestDataTouch,
  setTouch
} from '../../../../redux/ResourceMX/resourceAction';
import HandleApproval from './HandleApproval';

const ResourceForm = (props) => {
  const requesterInfo = useSelector((state) => state.resourceMX.requestInfo); // load from redux
  const moreInfo = useSelector((state) => state.resourceMX.moreInfo); // load from redux
  const bindAppForm = useSelector((state) => state.resourceMX.bindAppForm);
  const jobType = useSelector((state) => state.resourceMX.jobType);
  const serviceForm = useSelector((state) => state.resourceMX.serviceForm);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  const fileList = useSelector((state) => state.resourceMX?.fileAttachment);

  const requestNoT = useParams().requestNo;
  const orderStatus = useParams().status;
  // console.log('resource form', resourceStatus);
  // const touches = useSelector((state) => state.resourceMX.touches);

  const errors = useValidationForm();
  const dispatch = useDispatch();

  const { toggleDrawer, toGetCalendarList } = props;
  const { requestNo } = props;

  const { formType } = props;

  let requestNoMX;
  if (typeof requestNo === 'undefined') {
    requestNoMX = 'Resources Application';
  } else {
    requestNoMX = `RM${requestNo}`;
  }

  // 整理数据
  const collatingData = () => {
    const obj2 = {};
    obj2.requesterInfo = requesterInfo;
    obj2.bindAppForm = bindAppForm;
    obj2.jobType = jobType;
    obj2.serviceForm = serviceForm;
    obj2.moreInfo = moreInfo;

    let fileListString = [];
    if (fileList.length > 0) {
      fileList.forEach((element) => {
        const string = JSON.stringify(element);
        fileListString = [...fileListString, string];
      });
    }

    const obj = {};
    obj.fileList = fileListString;
    obj.domain = requesterInfo.logonDomain;
    obj.displayName = requesterInfo.name;
    obj.title = requesterInfo.title;
    obj.phone = requesterInfo.userPhone;

    // obj.illustration = '';
    obj.jobType = parseInt(jobType.jobType); // 0 Configuration; 1 New Installation

    obj.originalAppType = bindAppForm.requestType;
    obj.originalRequestNo = bindAppForm.requestNo;
    obj.networkDesign = bindAppForm.networkDesign;

    const { startDate, endDate } = jobType;

    obj.startDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    // obj.endDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    obj.targetDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    if (startDate !== '') {
      obj.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
    }
    if (endDate !== '') {
      obj.targetDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
    }
    // console.log('OBJ 1', startDate, endDate);
    // console.log('OBJ 2', obj.startDate, obj.endDate, obj.targetDate);

    // NewInstallation
    if (jobType.jobType === '1') {
      const { startDate, endDate } = serviceForm[0].rangeDate;

      obj.startDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      obj.targetDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (startDate) {
        obj.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
      }
      if (endDate) {
        obj.endDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
      }
    }

    // NewInstallation
    if (jobType.jobType === '1') {
      let resourceManagementNewInstallList = [];

      serviceForm.forEach((item) => {
        // console.log('NewInstallation serviceForm', serviceForm);
        const { subForm1, subForm2, subForm3 } = item;
        let resourceRequestNewInstallBackboneList = [];
        let resourceRequestNewInstallOrderList = [];
        let resourceRequestOutletList = [];

        subForm1.forEach((item1) => {
          const objTemp = {};
          objTemp.assignStaff = item.statffName;
          objTemp.email = item.staffEmail;
          objTemp.phone = item.staffPhone;

          const { startDate } = item?.rangeDate;
          const { endDate } = item?.rangeDate;
          objTemp.startDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
          objTemp.targetDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
          if (startDate) {
            objTemp.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
          }
          if (endDate) {
            objTemp.targetDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
          }
          // console.log('NewInstallation', objTemp.startDate, objTemp.endDate);

          // 0 L2 switch; 1 L3 switch;2 GBIC; 3 Others
          objTemp.equipment = parseInt(item1.Equipment);
          // 0 N3 stock; 1 New PR
          objTemp.sourceGoods = parseInt(item1.sourceOfGoods);
          objTemp.orderNo = item1.orderNo;
          objTemp.prCode = item1.PRCode;
          const { availableDate } = item1;
          objTemp.availableDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
          console.log('availableDate', objTemp.availableDate);
          if (availableDate && availableDate !== '') {
            objTemp.availableDate = dayjs(availableDate).format('YYYY-MM-DD HH:mm:ss');
          }
          console.log('availableDate', objTemp.availableDate);
          resourceRequestNewInstallOrderList = [...resourceRequestNewInstallOrderList, objTemp];
        });

        subForm2.forEach((item2) => {
          const obj2Temp = {};
          obj2Temp.closetId = item.closetID;
          obj2Temp.rackId = item.rackID;
          obj2Temp.position = item.position;
          obj2Temp.powerSource = item.powerSource;
          obj2Temp.ipAddress = item.ip;

          obj2Temp.priBackboneId = item2.priBackboneID;
          obj2Temp.priBackboneType = parseInt(item2.priBackboneType);
          obj2Temp.secBackboneId = item2.secBackboneID;
          obj2Temp.secBackboneType = parseInt(item2.secBackboneType);
          const { availableDate } = item2;
          obj2Temp.availableDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
          if (availableDate && availableDate !== '') {
            obj2Temp.availableDate = dayjs(availableDate).format('YYYY-MM-DD HH:mm:ss');
          }

          resourceRequestNewInstallBackboneList = [
            ...resourceRequestNewInstallBackboneList,
            obj2Temp
          ];
        });

        subForm3.forEach((item3) => {
          const obj3Temp = {};
          obj3Temp.switchPort = item3.switchPort;
          obj3Temp.outletId = item3.outletID;
          obj3Temp.activate = item3.activate;
          obj3Temp.remarks = item3.remarks;
          resourceRequestOutletList = [...resourceRequestOutletList, obj3Temp];
        });

        const objArray = {};
        objArray.resourceRequestNewInstallOrderList = resourceRequestNewInstallOrderList;
        objArray.resourceRequestNewInstallBackboneList = resourceRequestNewInstallBackboneList;
        objArray.resourceRequestOutletList = resourceRequestOutletList;

        resourceManagementNewInstallList = [...resourceManagementNewInstallList, objArray];
      });

      obj.resourceManagementNewInstallList = resourceManagementNewInstallList;
    }

    // Configuration
    if (jobType.jobType === '0') {
      let resourceRequestDetailList = [];
      serviceForm.forEach((item) => {
        console.log('serviceForm', item);
        const objTemp = {};
        objTemp.jobType = parseInt(jobType.jobType);
        objTemp.serviceType = parseInt(jobType.serviceType);
        objTemp.switchIp = item?.switchIp;
        objTemp.switchPort = item?.switchPort;
        objTemp.vlan = item?.vLan;
        objTemp.details = item?.Details;
        objTemp.assignStaff = jobType?.staffName;
        resourceRequestDetailList = [...resourceRequestDetailList, objTemp];
      });
      obj.resourceRequestDetailList = resourceRequestDetailList;
    }

    obj.illustration = moreInfo.html;
    obj.illustrationText = moreInfo.text;

    console.log('source Save :', obj2);
    // console.log('change for Save :', obj);

    return obj;
  };

  // 保存 save
  const toSave = (_, type, files) => {
    const obj = collatingData();
    console.log('change for Save :', obj);

    if (type === 'detail') {
      // for update API
      obj.requestNo = requestNo;
      Loading.show();
      resourceMXAPI
        .toUpdateData(obj)
        .then((res) => {
          // console.log('saveApplication', res);
          if (res.data.code === 200) {
            CommonTip.success(`RM${requestNo} Updated`);
            toGetCalendarList();
            toggleDrawer('left', false);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else if (type === 'approval') {
      obj.requestNo = requestNo;
      Loading.show();
      resourceMXAPI
        .toUpdateData(obj)
        .then((res) => {
          // console.log('saveApplication', res);
          if (res.data.code === 200) {
            CommonTip.success(`RM${requestNo} Updated`);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else if (type === 'files') {
      console.log('files save', files);
      obj.requestNo = requestNo;
      obj.fileList = files;
      Loading.show();
      resourceMXAPI
        .toUpdateData(obj)
        .then((res) => {
          // console.log('saveApplication', res);
          if (res.data.code !== 200) {
            CommonTip.warning(`RM${requestNo} Updated has Error`);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else {
      // for save API
      Loading.show();
      resourceMXAPI
        .saveApplication(obj)
        .then((res) => {
          // console.log('saveApplication', res);
          if (res.data.code === 200) {
            CommonTip.success(`RM${res.data.data} Saved`);
            toGetCalendarList();
            toggleDrawer('right', false);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };

  // 校检数据
  const makeDataVerify = () => {
    dispatch(setRestDataTouch());
    let status = false;
    if (errors.requesterInfo.userPhone === true) {
      status = true;
    } else if (jobType.jobType === '0') {
      // --------------------------------------------------------Confiugration
      if (bindAppForm.requestType === '') {
        status = true;
        dispatch(setTouch({ field: 'bindAppForm', data: { requestType: true } }));
      }
      if (bindAppForm.requestNo === '') {
        status = true;
        dispatch(setTouch({ field: 'bindAppForm', data: { requestNo: true } }));
      }

      if (jobType?.staffName === '') {
        status = true;
        dispatch(setTouch({ field: 'jobType', data: { staffName: true } }));
      }
      if (jobType.startDate === null || jobType.startDate === '') {
        status = true;
        dispatch(setTouch({ field: 'jobType', data: { startDate: true } }));
      }
      if (jobType.endDate === null || jobType.endDate === '') {
        status = true;
        dispatch(setTouch({ field: 'jobType', data: { endDate: true } }));
      }
      let serviceFormTouch = [];
      console.log('check data serviceForm', serviceForm);
      serviceForm?.forEach((item) => {
        let switchIp = false;
        if (item?.switchIp === '') {
          status = true;
          switchIp = true;
        }
        let vLan = false;
        let Details = false;
        if (item?.vLan === '') {
          vLan = true;
        }
        if (item?.Details === '') {
          Details = true;
        }
        if (Details && vLan) {
          status = true;
        }

        const obj = {};
        obj.switchIp = switchIp;
        obj.vLan = vLan;
        obj.Details = Details;
        serviceFormTouch = [...serviceFormTouch, obj];
      });

      dispatch(
        setTouch({
          field: 'serviceForm',
          data: serviceFormTouch
        })
      );
    } else if (jobType.jobType === '1') {
      // --------------------------------------------------------Installation
      if (bindAppForm.requestType === '') {
        status = true;
        dispatch(setTouch({ field: 'bindAppForm', data: { requestType: true } }));
      }
      if (bindAppForm.requestNo === '') {
        status = true;
        dispatch(setTouch({ field: 'bindAppForm', data: { requestNo: true } }));
      }

      // 检阅 表单
      let installationList = [];
      serviceForm?.forEach((item) => {
        // console.log('Submit item', item);

        let statffName = false;
        if (item.statffName === '') {
          status = true;
          statffName = true;
        }
        let staffPhone = false;
        if (item.staffPhone === '' || item.staffPhone?.length < 8) {
          status = true;
          staffPhone = true;
        }

        const rangeDate = {};
        if (item.rangeDate.startDate === null || item.rangeDate.startDate === '') {
          status = true;
          rangeDate.startDate = true;
        } else {
          rangeDate.startDate = false;
        }
        if (item.rangeDate.endDate === null || item.rangeDate.endDate === '') {
          status = true;
          rangeDate.endDate = true;
        } else {
          rangeDate.endDate = false;
        }
        const { startDate, endDate } = item.rangeDate;
        if (dayjs(startDate).unix() > dayjs(endDate).unix()) {
          status = true;
          rangeDate.endDate = true;
        }

        let subForm01 = [];
        const { subForm1 } = item;
        subForm1?.forEach((item01) => {
          let Equipment = false;
          if (item01.Equipment === '') {
            status = true;
            Equipment = true;
          }
          let availableDate = false;
          if (item01.availableDate === '') {
            status = true;
            availableDate = true;
          }

          const obj01 = {};
          obj01.Equipment = Equipment;
          obj01.availableDate = availableDate;
          subForm01 = [...subForm01, obj01];
        });

        let subForm02 = [];
        const { subForm2 } = item;
        subForm2?.forEach((item02) => {
          let priBackboneID = false;
          if (item02.priBackboneID === '') {
            status = true;
            priBackboneID = true;
          }
          let availableDate = false;
          if (item02.availableDate === '') {
            status = true;
            availableDate = true;
          }
          const obj02 = {};
          obj02.priBackboneID = priBackboneID;
          obj02.availableDate = availableDate;
          subForm02 = [...subForm02, obj02];
        });

        const obj = {};
        obj.statffName = statffName;
        obj.staffPhone = staffPhone;
        obj.rangeDate = rangeDate;
        obj.subForm1 = subForm01;
        obj.subForm2 = subForm02;
        installationList = [...installationList, obj];
      });
      dispatch(
        setTouch({
          field: 'installationList',
          data: installationList
        })
      );
    }
    return status;
  };

  // 提交 (分直接 Submit 及 saved 后 的 Submit)
  const toSubmit = (_, type) => {
    // console.log('requesterInfo', requesterInfo); // RI Request Info
    // console.log('jobType', jobType); // jobType Line
    // console.log('bindAppForm', bindAppForm); // Related Request
    // console.log('serviceForm', serviceForm); // FormSubmit
    // console.log('moreInfo', moreInfo); // more
    // console.log('touches', touches); // input状态 true是error false是通过

    const resVerify = makeDataVerify();
    // console.log('resVerify', resVerify);
    // 比较 原数据是否变动

    if (resVerify === true) {
      CommonTip.warning('Please complete the required field first.');
    } else {
      const obj = {};
      obj.requestNo = requestNo;
      if (type === 'detail') {
        // ----------------------saved 过的，提交 requestNo.
        Loading.show();
        resourceMXAPI
          .startProcess(obj)
          .then((res) => {
            console.log('Application Submitted starProcess', res);
            if (res.data.code === 200) {
              CommonTip.success(`RM${requestNo} Submitted`);

              toGetCalendarList();
              toggleDrawer('left', false);
            }
          })
          .finally(() => {
            Loading.hide();
          });
      } else if (type === 'make') {
        // ----------------------直接 submit apply
        const obj = collatingData();
        Loading.show();
        resourceMXAPI
          .toSubmitApply(obj)
          .then((res) => {
            console.log('Application Submitted apply', res);
            if (res.data.code === 200) {
              const requestNores = res?.data?.data;
              CommonTip.success(`RM${requestNores} Submitted`);
              toGetCalendarList();
              toggleDrawer('right', false);
            }
          })
          .finally(() => {
            Loading.hide();
          });
      }
    }
  };

  // 完成
  const toDone = () => {
    const obj = {};
    obj.flag = true;
    obj.requestNo = requestNo;
    obj.remark = '';
    Loading.show();
    resourceMXAPI
      .doApprovalTask(obj)
      .then((res) => {
        console.log('toDone', res);
        if (res.data.code === 200) {
          CommonTip.success(`RM${requestNo} Done`);
          toGetCalendarList();
          toggleDrawer('left', false);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // 逻辑删除
  const toDeleteOrder = () => {
    console.log('toDeleteOrder', requestNo);
    if (typeof requestNo === 'undefined') {
      // 关闭 弹柜
      toggleDrawer('left', false);
    } else {
      resourceMXAPI.doDeleteResource(requestNo).then((res) => {
        console.log('toDeleteOrder', res);
        toGetCalendarList();
        // 关闭 弹柜
        toggleDrawer('left', false);
      });
    }
  };

  return (
    <div>
      <HAPaper style={{ width: '98%', marginLeft: '1%', paddingBottom: 20 }}>
        {/* Title */}
        <div style={{ width: '98%', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          {requestNoMX}
        </div>

        {/* RequesterBaseInfo */}
        <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
          <RequesterBaseInfo />
        </div>

        {/* Job type */}
        <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
          <JobType />
        </div>

        {/* AttachMent */}
        <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
          <AttachMent toSave={toSave} formType={formType} />
        </div>

        {/* submit save cancel BTN */}
        {resourceStatus === 'detailSaved' || resourceStatus === '' ? (
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%', marginBottom: 20 }}>
            <ResourceBTN
              toSave={toSave}
              formType={formType}
              handleSubmit={toSubmit}
              handleDel={toDeleteOrder}
            />
          </div>
        ) : null}

        {/* approval reject BTN */}
        {orderStatus === 'detail' ||
        (resourceStatus === 'detailSubmited' && !requestNoT) ||
        resourceStatus === 'detailDone' ? null : (
          <HandleApproval isApproval={formType === 'approval'} toSave={toSave} />
        )}

        {/* done BTN */}
        {resourceStatus === 'detailApproved' && formType !== 'approval' ? (
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%', marginBottom: 20 }}>
            <DoneBtn formType={formType} handleDone={toDone} />
          </div>
        ) : null}
      </HAPaper>
    </div>
  );
};
export default memo(ResourceForm);
