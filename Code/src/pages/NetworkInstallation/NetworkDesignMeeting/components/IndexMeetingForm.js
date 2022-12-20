import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux'; // load from redux
import { useHistory, useParams } from 'react-router';
import dayjs from 'dayjs';
import _ from 'lodash';
import {
  CommonTip,
  // Loading, CommonTip,
  HAPaper
} from '../../../../components';
import RequesterBaseInfo from './generalForm/RequesterBaseInfo';
import BasicElements from './generalForm/BasicElements';
import Participants from './generalForm/Participants';
import RequestFormTransfer from './generalForm/RequestFormTransfer';
import RequestFormTransferList from './generalForm/RequestFormTransferList';
import MeetingRecord from './generalForm/MeetingRecord';
import Attach from './generalForm/AttachMent';
import BTN2Save from './generalForm/BTN2Save';
import meetingAPI from '../../../../api/networkdesign/index';
import {
  setRequest,
  setDetail,
  setBaseEl,
  setParticipants,
  setSelector,
  setMoreInfo,
  updateAttachments,
  setRestData
} from '../../../../redux/NetworkMeeting/Action';

const Index = (props) => {
  const { handleConfirmSave } = props;
  const detailData = useSelector((state) => state.networkMeeting.detailData);
  // console.log('detailData', detailData);
  const requesterInfo = useSelector((state) => state.networkMeeting.requestInfo); // load from redux
  const baseElReduce = useSelector((state) => state.networkMeeting.baseEl); // load from redux
  const participantsReduce = useSelector((state) => state.networkMeeting.participants); // load from redux
  const selectorReduce = useSelector((state) => state.networkMeeting.selector); // load from redux
  const moreInfo = useSelector((state) => state.networkMeeting.moreInfo);
  const filesList = useSelector((state) => state.networkMeeting?.fileAttachment);
  const dispatch = useDispatch();

  const meetingNoURL = useParams().meetingNo;
  const fromStatusURL = useParams().status;
  // console.log('meetingNoURL', meetingNoURL);
  let fromStatus = 'add';
  if (typeof fromStatusURL !== 'undefined') {
    fromStatus = fromStatusURL;
  }
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      requester: {},
      meetingMembers: [],
      meetingTime: { start: null, end: null },
      meetingPlace: '',
      meetingRemark: ''
    },
    onSubmit: (values) => {
      //   console.log('submit', values);
      handleConfirmSave(values);
    }
  });
  const {
    // meetingMembers, meetingTime, meetingPlace, meetingRemark ,
    requester
  } = formik.values;

  // -----toSave meeting
  const handleSave = () => {
    const formData = dataCollection();
    // console.log('formData', formData.get('networkDesignMeetingPojo'));
    // for (const [a, b] of formData.entries()) {
    //   console.log(a, b, '----------------------------');
    // }

    meetingAPI.toSaveMeetingData(formData).then((res) => {
      console.log('toSaveMeetingData', res);
      if (res?.data?.code === 200) {
        CommonTip.success('save success');
        history.push({ pathname: '/NetworkInstallation/NetworkDesignMeeting' });
      }
    });
  };

  // 整理 数据 去 保存
  const dataCollection = () => {
    console.log(
      'requesterInfo',
      requesterInfo,
      'baseElReduce',
      baseElReduce,
      'participantsReduce',
      participantsReduce,
      'selectorReduce',
      selectorReduce,
      'moreInfo',
      moreInfo,
      'filesList',
      filesList
    );

    // --------------------------------- 整理与会成员
    let networkDesignMeetingParticipants = [];
    const { memberList, closeList } = participantsReduce;
    const meetingNo = meetingNoURL ?? '';

    // 认为 是 新单
    // 去掉空白 的部分
    let memberListTemp = [];
    memberList.forEach((item) => {
      if (item.display !== '') {
        memberListTemp = [...memberListTemp, item];
      }
    });

    if (typeof meetingNoURL === 'undefined') {
      memberListTemp.forEach((item) => {
        let obj = {};
        obj = item;
        obj.checkStatus = 0;
        obj.staffName = item.display;
        networkDesignMeetingParticipants = [...networkDesignMeetingParticipants, obj];
      });
    }
    // 认为 是 编辑单
    if (typeof meetingNoURL !== 'undefined') {
      memberListTemp.forEach((item) => {
        let obj = {};
        if (item?.checkStatus === 0) {
          obj = item;
          obj.staffName = item.display;
          networkDesignMeetingParticipants = [...networkDesignMeetingParticipants, obj];
        } else {
          obj = item;
          obj.id = 0;
          obj.staffName = item.display;
          networkDesignMeetingParticipants = [...networkDesignMeetingParticipants, obj];
        }
      });

      closeList.forEach((item) => {
        let obj = {};
        if (item?.checkStatus === 0) {
          obj = item;
          obj.staffName = item.display;
          obj.checkStatus = 1; // 1 就是约定删除
          networkDesignMeetingParticipants = [...networkDesignMeetingParticipants, obj];
        }
      });
      // console.log('networkDesignMeetingParticipants save', networkDesignMeetingParticipants);
    }

    // --------------------------------- 整理 相关原始单据 DP AP
    let networkDesignMeetingRequestNos = [];
    const { right, closeLeft } = selectorReduce;
    // 认为 是 新单
    if (typeof meetingNoURL === 'undefined') {
      right.forEach((item) => {
        console.log('new order');
        if (!item?.checkStatus) {
          let obj = {};
          obj = item;
          obj.id = 0;
          networkDesignMeetingRequestNos = [...networkDesignMeetingRequestNos, obj];
        }
      });
    }
    // 认为 是 编辑单
    if (typeof meetingNoURL !== 'undefined') {
      console.log('old order');
      right.forEach((item) => {
        let obj = {};
        if (item?.checkStatus !== 0) {
          ///------------------------
          obj = item;
          obj.id = 0;
          networkDesignMeetingRequestNos = [...networkDesignMeetingRequestNos, obj];
        }
      });
      closeLeft.forEach((item) => {
        let obj = {};
        if (item?.checkStatus === 0) {
          obj = item;
          obj.checkStatus = 1; // 1 就是约定删除
          networkDesignMeetingRequestNos = [...networkDesignMeetingRequestNos, obj];
        }
      });
    }
    // console.log(' Save ', networkDesignMeetingRequestNos, closeLeft);
    const params = {
      resumeFile: {
        groupType: '',
        projectName: '',
        requestNo: '',
        requesterId: 0,
        sysTemplateId: 0
      },
      networkDesignMeetingPojo: {
        meetingFileList: [],
        networkDesignMeeting: {
          createdBy: '',
          createdDate: '',
          id: meetingNo !== '' ? detailData.networkDesignMeeting.id : 0,
          isDelete: 0,
          lastUpdatedBy: '',
          lastUpdatedDate: '',
          params: {},
          remarks: moreInfo.html,
          // 发起人信息
          requesterInstitution: requesterInfo.logonDomain,
          requesterName: requesterInfo.userName,
          requesterPhone: requesterInfo.userPhone,
          requesterTitle: requesterInfo.title,
          // 会议基本要素
          startDate: dayjs(baseElReduce.dateRanges.start).format('YYYY-MM-DD HH:mm:ss'),
          targetDate: dayjs(baseElReduce.dateRanges.end).format('YYYY-MM-DD HH:mm:ss'),
          meetingForm: baseElReduce.meetingForm,
          meetingPlace: baseElReduce.place,
          meetingNo,
          type: ''
        },
        networkDesignMeetingParticipants,
        // [
        // {
        //   id: 0,
        //   staffCorpId: '',
        //   staffName: '',
        //   title: '',
        //   email: '',
        //   phone: '',
        //   checkStatus: 0,
        //   createdBy: '',
        //   createdDate: '',
        //   isDelete: 0,
        //   lastUpdatedBy: '',
        //   lastUpdatedDate: '',
        //   meetingNo: '',
        //   params: {},
        //   remarks: ''
        // }
        // ],
        networkDesignMeetingRequestNos,
        // [
        //   {
        //     id: 0,
        //     apptype: '',
        //     requestNo: '',
        //     checkStatus: 0,
        //     createdBy: '',
        //     createdDate: '',
        //     isDelete: 0,
        //     lastUpdatedBy: '',
        //     lastUpdatedDate: '',
        //     meetingNo: '',
        //     params: {},
        //     remarks: ''
        //   }
        // ],
        participantIds: [],
        requestNoIds: []
      }
    };

    // 创建 formData
    const formData = new FormData();
    const uploadFiles = filesList.filter((item) => !item.id); // 是否有文件需要上传，如果上传过的不再上传
    if (uploadFiles.length) {
      uploadFiles.forEach((fileItem) => {
        formData.append('file', fileItem);
      });
    } else {
      formData.append('file', '');
    }

    formData.append(
      'networkmeeting',
      new Blob([JSON.stringify(filesList)], { type: 'application/json' })
    );

    formData.append(
      'resumeFile',
      new Blob([JSON.stringify(params.resumeFile)], {
        type: 'application/json'
      })
    );
    formData.append(
      'networkDesignMeetingPojo',
      new Blob([JSON.stringify(params.networkDesignMeetingPojo)], {
        type: 'application/json'
      })
    );
    // console.log('dataCollection', formData);
    return formData;
  };

  // --------------------------------------------------------获取 detail
  const toGetMeetingDetail = () => {
    if (typeof meetingNoURL !== 'undefined') {
      const obj = {};
      obj.meetingNo = meetingNoURL;
      meetingAPI.getMeetingDetail(obj).then((res) => {
        // console.log('getMeetingDetail', res);
        if (res?.data?.code === 200) {
          const data = res?.data?.data?.networkDesignMeetingPojo;
          dataPrecess2Redux(data);
        }
      });
    }
  };
  // 将 取回来的 详情 数据 整理 到 redux
  const dataPrecess2Redux = (data) => {
    // console.log('dataPrecess2Redux', data);
    // 把整个数据存起来
    dispatch(setDetail(data));

    // 发起人
    const {
      networkDesignMeeting,
      networkDesignMeetingParticipants,
      networkDesignMeetingRequestNos,
      meetingFileList
    } = data;
    dispatch(setRequest({ field: 'logonDomain', data: networkDesignMeeting.requesterInstitution }));
    dispatch(setRequest({ field: 'name', data: networkDesignMeeting.requesterName }));
    dispatch(setRequest({ field: 'title', data: networkDesignMeeting.requesterTitle }));
    dispatch(setRequest({ field: 'userPhone', data: networkDesignMeeting.requesterPhone }));
    // WangEditor
    const objmemo = {};
    objmemo.html = networkDesignMeeting.remarks;
    dispatch(setMoreInfo(objmemo));

    // -----------------fileList
    if (meetingFileList?.length > 0) {
      meetingFileList.forEach((item) => {
        let objfiles = {};
        objfiles = item;
        objfiles.name = item.fileName;
        objfiles.size = item.fileSize;
        objfiles.type = item.fileType;
        objfiles.fileUrl = ` ${item.fileUrl}`;
        // fileArr = [...fileArr, objfiles];
        dispatch(updateAttachments(objfiles));
      });
    }

    // 会议 基础要素
    const { startDate, targetDate } = networkDesignMeeting;
    const baseEl = {
      dateRanges: {
        // start: networkDesignMeeting.startDate,
        // end: networkDesignMeeting.targetDate
        start: dayjs(startDate).format('DD-MMM-YYYY hh:mm:ss'),
        end: dayjs(targetDate).format('DD-MMM-YYYY hh:mm:ss')
      },
      meetingForm: networkDesignMeeting.meetingForm,
      place: networkDesignMeeting.meetingPlace,
      timeValid: false,
      meetingFormSelectList: [
        { label: 'Network form', value: 1 },
        { label: 'Site form', value: 2 }
      ]
    };
    dispatch(setBaseEl(baseEl));

    // 与会成员
    let temp4participants = [];
    if (networkDesignMeetingParticipants?.length > 0) {
      networkDesignMeetingParticipants.forEach((item) => {
        let obj = {};
        obj = { ...item };
        obj.display = item.staffName;
        obj.corpId = _.uniqueId(`corp_`);
        temp4participants = [...temp4participants, obj];
      });
      // console.log('temp4participants', temp4participants);
      const participants = {};
      participants.memberList = [...temp4participants];
      participants.closeList = [];
      // console.log('participants', participants);
      dispatch(setParticipants(participants));
    }

    // 讨论 的 DP AP 申请单
    let RequestNoTemp = [];
    if (networkDesignMeetingRequestNos?.length > 0) {
      networkDesignMeetingRequestNos.forEach((item) => {
        let obj = {};
        obj = item;
        RequestNoTemp = [...RequestNoTemp, obj];
      });
      const requestNoObj = {};
      requestNoObj.right = RequestNoTemp;
      requestNoObj.closeLeft = [];
      // console.log('networkDesignMeetingRequestNos', networkDesignMeetingRequestNos);
      dispatch(setSelector(requestNoObj));
    }
  };

  useEffect(() => {
    if (fromStatus === 'add') {
      // console.log('add');
      dispatch(setRestData());
    }
    if (fromStatus !== 'add') {
      // console.log('edit detail');
      dispatch(setRestData());
      setTimeout(() => {
        toGetMeetingDetail();
      }, 1000);
    }
  }, []);

  return (
    <>
      <div>
        <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
            <RequesterBaseInfo requester={requester} />
          </div>
        </HAPaper>
        <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
            <BasicElements />
          </div>
        </HAPaper>
        <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
            <Participants />
          </div>
        </HAPaper>

        {fromStatus === 'add' || fromStatus === 'edit' ? (
          <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
            <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
              <RequestFormTransfer />
            </div>
          </HAPaper>
        ) : null}
        {fromStatus === 'detail' ? (
          <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
            <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
              <RequestFormTransferList />
            </div>
          </HAPaper>
        ) : null}
        <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
            <MeetingRecord />
          </div>
        </HAPaper>
        <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
          <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
            <Attach />
          </div>
        </HAPaper>

        {/* Save and Cancel BTN */}
        {fromStatus === 'detail' ? null : (
          <HAPaper style={{ width: '100%', paddingBottom: 20 }}>
            <div style={{ width: '98%', marginTop: 20, marginLeft: '1%' }}>
              <BTN2Save handleSave={handleSave} />
            </div>
          </HAPaper>
        )}
      </div>
    </>
  );
};
export default memo(Index);
