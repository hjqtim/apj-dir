import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SaveIcon from '@material-ui/icons/Save';
import { Grid, Typography, Button } from '@material-ui/core';
import dayjs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';
import RequesterForm from './RequesterForm';
import ServiceRequiredForm from './ServiceRequiredForm';
import DataPortForm from '../dpForm';
import ExternalNetworkControl from './ExternalNetworkControl';
import AttachmentControl from './AttachmentControl';
import BudgetHolder from './BudgetHolderInformation';
import SubmitButton from './SubmitButton';
import BaseLine from './BaseLine';
import API from '../../../../../api/webdp/webdp';
import CommonTip from '../../../../../components/CommonTip';
import Loading from '../../../../../components/Loading';
import webdpValidate from '../../../../../utils/webdpValidate';
import RequesterManagerInformation from './RequesterManagerInformation';
import { setError, setApplyReqManBudTouch } from '../../../../../redux/webDP/webDP-actions';
import getBudgetHolder from '../../../../../utils/getBudgetHolder';
import CancleConfirm from '../../../../myaction/components/Detail/CancleConfirm';
//
import PendingConfirm from '../../../../myaction/components/Detail/PendingConfirm';

const GeneralForm = (props) => {
  const locationParams = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const formType = useSelector((state) => state.webDP.formType);
  const requestNo = useSelector((state) => state.webDP.requestNo);
  const { isDetail, isApproval } = props;
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const webDP = useSelector((state) => state.webDP);
  const files = useSelector((state) => state.webDP.fileAttachment);
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const projects = useSelector((state) => state.webDP.apDpDetails.items);
  const applyReqManBudTouch = useSelector((state) => state.webDP.applyReqManBudTouch);
  const dprequeststatusno = useSelector(
    (state) => state.webDP.requestAll?.dpRequest?.dprequeststatusno
  );

  const isExitStatusNo = useSelector((state) => state.webDP?.requestAll?.detail?.dpRequestStatusNo);
  const isExitPendingStatusNo = useSelector(
    (state) => state.webDP?.requestAll?.detail?.dpRequestPendingStatusNo
  );

  const externalNetworkId = useSelector((state) => state.webDP.requestAll?.mniRequest?.id || 0);
  const dataBaseDpRequest = webDP.requestAll?.dpRequest || {};

  const requesteremail = useSelector((state) => state.webDP.requestAll?.dpRequest?.requesteremail);

  const FormHeaderProps = {
    variant: 'h2',
    style: {
      fontWeight: 'bold',
      fontSize: 16.5,
      textAlign: 'left',
      padding: '0.5rem',
      paddingLeft: 0
    }
  };

  const toList = (isSubmit) => {
    setTimeout(() => {
      if (isApproval) {
        // N3、N4、N5在审核页面修改申请者form
        window.location.reload();
      } else if (isSubmit) {
        // 申请者提交form
        history.push('/request');
      } else if (!isSubmit) {
        // 申请者保存草稿
        history.push('/webdp/mydraft');
      }
    }, 500);
  };

  const getDataBaseDpRequest = () => {
    if (isDetail) {
      return dataBaseDpRequest;
    }
    return {};
  };

  // 判断有没有选到MNI的项目
  const getIsMNI = () =>
    projects.find(
      (item) => item.dataPortInformation?.projectInfo?.project?.remarks?.toUpperCase?.() === 'MNI'
    );

  const getUserName = (value) => {
    const arr = value?.split?.(',') || [];
    if (arr?.[0]) {
      return arr[0];
    }
    return '';
  };

  const getMniRequest = () => ({
    dpId: isDetail ? dataBaseDpRequest.id : 0, // 0 is add, other is edit
    id: isDetail ? externalNetworkId : 0, // 0 is add, other is edit
    requestNo: isDetail ? requestNo : 0,
    endusercontact: webDP.externalNetwork?.adminContact?.contactPerson,
    endusertel: webDP.externalNetwork?.adminContact?.phone,
    enduseremail: webDP.externalNetwork?.adminContact?.email,
    respitcontact: webDP.externalNetwork?.technicalContact?.contactPerson,
    respittel: webDP.externalNetwork?.technicalContact?.phone,
    respitemail: webDP.externalNetwork?.technicalContact?.email,
    localnetwork: webDP.externalNetwork?.system?.existedNetwork,
    localnetworksupplier: webDP.externalNetwork?.system?.supplierName,
    locationpc: webDP.externalNetwork?.system?.pcLocation,
    locationserver: webDP.externalNetwork?.system?.serverLocation,
    integratehasystem: webDP.externalNetwork?.system?.haSystemIntegrate,
    integratehaproject: webDP.externalNetwork?.system?.relatedProject,
    integratehaserver: webDP.externalNetwork?.system?.relatedServer,
    traffictoha: webDP.externalNetwork?.system?.initiateTraffic,
    destinationproject: webDP.externalNetwork?.system?.projectDestination,
    destinationserver: webDP.externalNetwork?.system?.serverDestination,
    numberofdevice: webDP.externalNetwork?.networkTraffic?.deviceAmount,
    numberoftraffic: webDP.externalNetwork?.networkTraffic?.trafficPerDay,
    sizepertraffic: webDP.externalNetwork?.networkTraffic?.perFileSize,
    networkresponsetime: webDP.externalNetwork?.networkTraffic?.expectedResponseTime,
    peakhour: webDP.externalNetwork?.networkTraffic?.peakHourFrom,
    peakhourend: webDP.externalNetwork?.networkTraffic?.peakHourTo,
    resilientnetworkrequired: webDP.externalNetwork?.networkTraffic?.networkResilience,
    remotemaintenancemethods: webDP.externalNetwork?.networkTraffic?.remoteMethod,
    vendor: webDP.externalNetwork?.vendor?.vendorName,
    implementcontact: webDP.externalNetwork?.vendor?.implementalPerson,
    implementtel: webDP.externalNetwork?.vendor?.implementalPhone,
    implementemail: webDP.externalNetwork?.vendor?.implementalEmail,
    maintenancecontact: webDP.externalNetwork?.vendor?.maintenancePerson,
    maintenancetel: webDP.externalNetwork?.vendor?.maintenancePhone,
    maintenanceemail: webDP.externalNetwork?.vendor?.maintenanceEmail
  });

  /**
   * submit or save DP
   * @param {*} isSubmit true is submit, false is save
   */
  const saveDP = (isSubmit) => {
    const dpLocationList = []; // Data Port Request Information的数据
    webDP.apDpDetails?.items?.forEach?.((locationItem) => {
      const obj = { ...locationItem };
      obj.requestNo = isDetail ? locationItem.requestNo : 0; // 0 is add, other is edit
      obj.id = isDetail ? locationItem.id : 0; // 0 is add, other is edit
      obj.numOfDP = Number(locationItem.amount) || 0; // No. Of Data Ports
      obj.dpusage = locationItem.dataPortInformation.projectInfo?.project?.project || ''; // project
      obj.dept = locationItem.locationInformation.department; // department
      obj.block = locationItem.locationInformation.block; // block
      obj.floor = locationItem.locationInformation.floor; // floor
      obj.room = locationItem.locationInformation.roomOrWard; // room/Ward
      obj.isPublicArea = locationItem.locationInformation.publicAreas; // Located at Public Areas
      obj.needInfectionControl = locationItem.locationInformation.icm; // Dust Control
      obj.needWorkingPlatform = locationItem.locationInformation.awp; // Aerial Working Platform
      obj.siteContactPerson = locationItem.siteContactInformation.contactPerson; // contact person
      obj.siteContactTitle = locationItem.siteContactInformation.jobTitle; // title
      obj.siteContactPhone = locationItem.siteContactInformation.phone; // phone
      obj.siteContactEmail = locationItem.siteContactInformation.email; // email
      obj.hubPortQty = isDetail ? locationItem.hubPortQty || 0 : 0;
      obj.hubPortCharge = isDetail ? locationItem.hubPortCharge || 0 : 0;
      obj.cablingQty = isDetail ? locationItem.cablingQty || 0 : 0;
      obj.cablingCharge = isDetail ? locationItem.cablingCharge || 0 : 0;
      obj.subTotalCharge = isDetail ? locationItem.subTotalCharge || 0 : 0;
      obj.serviceType = locationItem.dataPortInformation.service?.type;
      obj.conduitType = locationItem.dataPortInformation.conduitType;
      obj.dataPortID = locationItem.dataPortInformation.service?.existingLocation;
      obj.secondaryDataPortID =
        locationItem.dataPortInformation.service?.type === 'L'
          ? locationItem.dataPortInformation.service?.secondaryDataPortID
          : undefined;
      obj.otherServiceDesc = locationItem.dataPortInformation.service?.others;
      obj.dpusageDesc = locationItem.dataPortInformation.projectInfo?.others || '';
      obj.isExternalNetwork =
        locationItem.dataPortInformation.projectInfo?.project?.remarks === 'MNI' ? 'Y' : 'N';
      obj.externalNetworkRequirement =
        locationItem.dataPortInformation.externalNetworkRequirement || '';

      dpLocationList.push(obj);
    });

    const dpRequest = {
      ...getDataBaseDpRequest(),
      requestNo: isDetail ? locationParams.requestId : 0, // 0 is add, other is edit
      id: isDetail ? dataBaseDpRequest.id : 0,
      requesterhosp: webDP.requester.hospital, // Hospital / Department
      requestername: webDP.requester.name, // Name
      requestertitle: webDP.requester.title, // Title
      requesterphone: webDP.requester.phone, // phone
      hospitalreference: webDP.serviceRequired?.hospitalRef || '',
      serviceathosp: webDP.serviceRequired.hospitalLocation?.hospital || '',
      additionalcharge: isDetail ? dataBaseDpRequest.additionalcharge || 0 : 0,
      applyip: isDetail ? dataBaseDpRequest.applyip || 0 : 0,
      connectmedicalnet2hanet: isDetail ? dataBaseDpRequest.connectmedicalnet2hanet || 0 : 0,
      formcreatedby: isDetail ? dataBaseDpRequest.requestername : getUserName(user.displayName),
      hubportcharge: isDetail ? dataBaseDpRequest.hubportcharge || 0 : 0,
      hubportqty: isDetail ? dataBaseDpRequest.hubportqty || 0 : 0,
      metalliccablingcharge: isDetail ? dataBaseDpRequest.metalliccablingcharge || 0 : 0,
      metalliccablingqty: isDetail ? dataBaseDpRequest.metalliccablingqty || 0 : 0,
      noconduitcablingcharge: isDetail ? dataBaseDpRequest.noconduitcablingcharge || 0 : 0,
      noconduitcablingqty: isDetail ? dataBaseDpRequest.noconduitcablingqty || 0 : 0,
      plasticcablingcharge: isDetail ? dataBaseDpRequest.plasticcablingcharge || 0 : 0,
      plasticcablingqty: isDetail ? dataBaseDpRequest.plasticcablingqty || 0 : 0,
      projectbaseddpcharge: isDetail ? dataBaseDpRequest.projectbaseddpcharge || 0 : 0,
      projectbaseddpqty: isDetail ? dataBaseDpRequest.projectbaseddpqty || 0 : 0,
      quotationtotal: isDetail ? dataBaseDpRequest.quotationtotal || 0 : 0,
      requesterid: isDetail ? dataBaseDpRequest.requesterid : user.username,
      rmanagerphone: webDP.rManager.phone,
      rmanageremail: webDP.rManager.email,
      rmanagerid: webDP.rManager.corp,
      rmanagername: webDP.rManager.name,
      rmanagertitle: webDP.rManager.title,
      // budgetHolder information
      ...getBudgetHolder(webDP.myBudgetHolder),
      // end of budgetHolder information
      remark: webDP.apDpDetails.remarks,
      expectedcompletiondate: webDP.apDpDetails.expectedCompleteDate
        ? dayjs(webDP.apDpDetails.expectedCompleteDate).format('YYYY-MM-DD')
        : null,
      apptype: 'DP',
      requesteremail: isDetail ? requesteremail : user.mail
    };

    const userInfo = {
      loginUser: user.username,
      requester: isDetail ? dataBaseDpRequest.requesterid : user.username
    };

    const isMNI = getIsMNI();

    const params = {
      dpLocationList,
      dpRequest,
      userInfo,
      isSubmit,
      isMni: !!isMNI,
      delIds: webDP.delIds,
      displayName: user.displayName
    };

    if (isMNI) {
      params.mniRequest = getMniRequest();
    }

    const formData = new FormData();

    formData.append(
      'dpRequestForm',
      new Blob([JSON.stringify(params)], { type: 'application/json' })
    );

    const uploadFiles = files.filter((item) => !item.id); // 是否有文件需要上传，如果上传过的不再上传
    if (uploadFiles.length) {
      uploadFiles.forEach((fileItem) => {
        formData.append('file', fileItem);
      });
    } else {
      formData.append('file', '');
    }

    formData.append(
      'resumeFile',
      new Blob([JSON.stringify({ requestNo: requestNo || null, projectName: 'webDP' })], {
        type: 'application/json'
      })
    );

    Loading.show();
    API.saveDPRequest(formData)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          toList(isSubmit);
        } else if (res?.data?.code && res?.data?.code !== 200) {
          CommonTip.error('Submit failed');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getFileIndex = (locationItem) => {
    const fileIndex = webDP.apDpDetails?.floorPlan
      ?.filter((item) => !item.file.id)
      ?.findIndex((fileItem) => fileItem.key === locationItem.key);

    return fileIndex === -1 ? '' : fileIndex;
  };

  /**
   * submit or save AP
   * @param {*} isSubmit true is submit, false is save
   */
  const saveAP = (isSubmit) => {
    const apLocationList = []; // Data Port Request Information的数据

    const formData = new FormData();

    const uploadFiles = webDP.apDpDetails.floorPlan?.filter((item) => !item.file?.id); // 是否有文件需要上传，如果上传过的不再上传
    if (!uploadFiles?.length) {
      formData.append('file', '');
    }

    webDP.apDpDetails?.items?.forEach?.((locationItem) => {
      const obj = { ...locationItem };
      obj.requestNo = isDetail ? locationItem.requestNo : 0; // 0 is add, other is edit
      obj.id = isDetail ? locationItem.id : 0; // 0 is add, other is edit
      obj.dpusage = locationItem.dataPortInformation.projectInfo?.project?.project || ''; // project
      obj.dept = locationItem.locationInformation.department; // department
      obj.block = locationItem.locationInformation.block; // block
      obj.floor = locationItem.locationInformation.floor; // floor
      obj.room = locationItem.locationInformation.roomOrWard; // room/Ward
      obj.needInfectionControl = locationItem.locationInformation.icm; // Dust Control
      obj.needWorkingPlatform = locationItem.locationInformation.awp; // Aerial Working Platform
      obj.siteContactPerson = locationItem.siteContactInformation.contactPerson; // contact person
      obj.siteContactTitle = locationItem.siteContactInformation.jobTitle; // title
      obj.siteContactPhone = locationItem.siteContactInformation.phone; // phone
      obj.siteContactEmail = locationItem.siteContactInformation.email; // email
      obj.hubPortQty = isDetail ? locationItem.hubPortQty || 0 : 0;
      obj.hubPortCharge = isDetail ? locationItem.hubPortCharge || 0 : 0;
      obj.subTotalCharge = isDetail ? locationItem.subTotalCharge || 0 : 0;
      obj.serviceType = locationItem.dataPortInformation.service?.type;
      obj.dataPortID = locationItem.dataPortInformation.service?.existingLocation;
      obj.otherServiceDesc = locationItem.dataPortInformation.service?.others;
      obj.dpusageDesc = locationItem.dataPortInformation.projectInfo?.others || '';
      obj.fileName =
        webDP.apDpDetails?.floorPlan?.find((fileItem) => fileItem.key === locationItem.key)?.file
          ?.id || null;
      obj.fileIndex = getFileIndex(locationItem);
      obj.isExternalNetwork =
        locationItem.dataPortInformation.projectInfo?.project?.remarks === 'MNI' ? 'Y' : 'N';
      obj.externalNetworkRequirement =
        locationItem.dataPortInformation.externalNetworkRequirement || '';

      apLocationList.push(obj);

      if (uploadFiles?.length) {
        const hasFile = uploadFiles.find((fileItem) => fileItem.key === locationItem.key);
        if (hasFile) {
          formData.append('file', hasFile.file);
        }
      }
    });

    const dpRequest = {
      ...getDataBaseDpRequest(),
      requestNo: isDetail ? locationParams.requestId : 0, // 0 is add, other is edit
      id: isDetail ? dataBaseDpRequest.id : 0,
      requesterhosp: webDP.requester.hospital, // Hospital / Department
      requestername: webDP.requester.name, // Name
      requestertitle: webDP.requester.title, // Title
      requesterphone: webDP.requester.phone, // phone
      hospitalreference: webDP.serviceRequired?.hospitalRef || '',
      serviceathosp: webDP.serviceRequired.hospitalLocation?.hospital || '',
      additionalcharge: isDetail ? dataBaseDpRequest.additionalcharge || 0 : 0,
      applyip: isDetail ? dataBaseDpRequest.applyip || 0 : 0,
      connectmedicalnet2hanet: isDetail ? dataBaseDpRequest.connectmedicalnet2hanet || 0 : 0,
      formcreatedby: isDetail ? dataBaseDpRequest.requestername : getUserName(user.displayName),
      hubportcharge: isDetail ? dataBaseDpRequest.hubportcharge || 0 : 0,
      hubportqty: isDetail ? dataBaseDpRequest.hubportqty || 0 : 0,
      metalliccablingcharge: isDetail ? dataBaseDpRequest.metalliccablingcharge || 0 : 0,
      metalliccablingqty: isDetail ? dataBaseDpRequest.metalliccablingqty || 0 : 0,
      noconduitcablingcharge: isDetail ? dataBaseDpRequest.noconduitcablingcharge || 0 : 0,
      noconduitcablingqty: isDetail ? dataBaseDpRequest.noconduitcablingqty || 0 : 0,
      plasticcablingcharge: isDetail ? dataBaseDpRequest.plasticcablingcharge || 0 : 0,
      plasticcablingqty: isDetail ? dataBaseDpRequest.plasticcablingqty || 0 : 0,
      projectbaseddpcharge: isDetail ? dataBaseDpRequest.projectbaseddpcharge || 0 : 0,
      projectbaseddpqty: isDetail ? dataBaseDpRequest.projectbaseddpqty || 0 : 0,
      quotationtotal: isDetail ? dataBaseDpRequest.quotationtotal || 0 : 0,
      requesterid: isDetail ? dataBaseDpRequest.requesterid : user.username,
      rmanagerphone: webDP.rManager.phone,
      rmanageremail: webDP.rManager.email,
      rmanagerid: webDP.rManager.corp,
      rmanagername: webDP.rManager.name,
      rmanagertitle: webDP.rManager.title,
      // budgetHolder information
      ...getBudgetHolder(webDP.myBudgetHolder),
      // end of budgetHolder information
      expectedcompletiondate: dayjs(webDP.apDpDetails.expectedCompleteDate).format('YYYY-MM-DD'),
      otherservices: webDP.apDpDetails.specialRequirements,
      remark: webDP.apDpDetails.justificationsForUsingWLAN,
      apptype: 'AP',
      requesteremail: isDetail ? requesteremail : user.mail
    };

    const userInfo = {
      loginUser: user.username,
      requester: isDetail ? dataBaseDpRequest.requesterid : user.username
    };
    const isMNI = getIsMNI();

    const params = {
      apLocationList,
      dpRequest,
      userInfo,
      isSubmit,
      isMni: !!isMNI,
      delIds: webDP.delIds,
      displayName: user.displayName
    };

    if (isMNI) {
      params.mniRequest = getMniRequest();
    }

    formData.append(
      'apRequestForm',
      new Blob([JSON.stringify(params)], { type: 'application/json' })
    );

    formData.append(
      'resumeFile',
      new Blob([JSON.stringify({ requestNo: requestNo || null, projectName: 'webDP' })], {
        type: 'application/json'
      })
    );

    Loading.show();

    API.saveAPRequest(formData)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          toList(isSubmit);
        } else if (res?.data?.code && res?.data?.code !== 200) {
          CommonTip.error('Submit failed');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const handleSave = () => {
    // const { submittable, error } = webdpValidate(webDP);

    // if (!submittable) {
    //   CommonTip.warning('Please complete the required fields first');
    //   dispatch(setError(error));
    //   return;
    // }

    if (formType === 'DP') {
      saveDP(false);
    } else if (formType === 'AP') {
      saveAP(false);
    }
  };

  const handleSubmit = () => {
    const { submittable, error } = webdpValidate(webDP);

    const newApplyReqManBudTouch = { ...applyReqManBudTouch };
    Object.keys(newApplyReqManBudTouch).forEach((item) => {
      newApplyReqManBudTouch[item] = true;
    });
    dispatch(setApplyReqManBudTouch(newApplyReqManBudTouch));

    if (!submittable) {
      CommonTip.warning('Please complete the required fields first');
      dispatch(setError(error));
      return;
    }

    if (formType === 'DP') {
      saveDP(true);
    } else if (formType === 'AP') {
      saveAP(true);
    }
  };

  return (
    <>
      {!isDetail && (
        <Grid item xs={12}>
          {formType === 'AP' ? (
            <Typography align="left" {...FormHeaderProps}>
              WLAN AP Installation
            </Typography>
          ) : (
            <Typography align="left" {...FormHeaderProps}>
              Data Port Installation
            </Typography>
          )}
        </Grid>
      )}

      <Grid component="form" style={{ display: 'contents' }}>
        {/* Requester Information */}
        <RequesterForm isDetail={isDetail} />

        {/* Requester Manager Information */}
        <RequesterManagerInformation />

        {/* Service Required */}
        <ServiceRequiredForm />

        {/* Data Port Request Information */}
        <DataPortForm isDetail={isDetail} />

        {/* External Network (formerly known as MNI) User Requirement Form  */}
        <ExternalNetworkControl />

        {/* File Attachment (Optional) */}
        {formType === 'DP' && <AttachmentControl />}

        {!isApproval && <BudgetHolder />}

        {!!isExitStatusNo && dprequeststatusno > 1 && !isApproval && isDetail && (
          <CancleConfirm isRequest={isDetail} />
        )}

        {!!isExitPendingStatusNo && dprequeststatusno > 1 && !isApproval && isDetail && (
          <PendingConfirm isRequest={isDetail} />
        )}

        <BaseLine />

        {/* submit button */}
        {viewOnly === false && (
          <Grid item xs={12}>
            {(!dprequeststatusno || dprequeststatusno === 1 || !isDetail) && (
              <span style={{ marginRight: 15, display: 'inline-block' }}>
                <SubmitButton handleSubmit={handleSubmit} />
              </span>
            )}

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              style={{ fontWeight: 'bold' }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default GeneralForm;
