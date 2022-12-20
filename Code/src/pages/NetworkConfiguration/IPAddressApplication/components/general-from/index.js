import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import RequesterBaseInfo from './RequesterBaseInfo';
import ContactPerson from './ContactPerson';
import ProjectInformation from './ProjectInformation';
import DetailsRequest from './DetailsRequest';
import { Loading } from '../../../../../components';
import SubmitButton from './SubmitButton';
import ApplyHeader from './ApplyHeader';
import webdpAPI from '../../../../../api/webdp/webdp';
import ipassignAPI from '../../../../../api/ipassign';
import { setBaseData, setAllFormData } from '../../../../../redux/IPAdreess/ipaddrActions';

const GeneralForm = (props) => {
  let { requestNo } = props;
  const dispatch = useDispatch();
  const requestNoURL = useParams().requestNo;
  if (requestNoURL) {
    requestNo = requestNoURL;
  }
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    Promise.all([
      webdpAPI.getHospitalList(),
      webdpAPI.getProjectNameList('IP'),
      ipassignAPI.getEqupmentTypeList()
    ])
      .then((res) => {
        dispatch(setBaseData({ hospitalList: res?.[0]?.data?.data?.hospitalList || [] }));
        dispatch(setBaseData({ projectList: res?.[1]?.data?.data?.projectNameList || [] }));
        dispatch(setBaseData({ equpTypeList: res?.[2]?.data?.data?.list || [] }));
      })
      .finally(() => {
        setIsRequested(true);
      });
  }, []);

  useEffect(() => {
    if (isRequested && (isMyRequest || isMyApproval)) {
      Loading.show();
      ipassignAPI
        .getIpReqeust({ requestNo })
        .then((res) => {
          // console.log('getIpReqeust', res);
          const ipRequest = res.data?.data?.ipRequest || {};
          const ipRequestDetailsList = res.data?.data?.ipRequestDetailsList || [];
          const {
            logonDomain,
            name,
            title,
            userPhone,
            logonName,
            userName,
            endUserName,
            endUserTitle,
            endUserPhone,
            endUserEmail,
            endUserCorp,
            hospital,
            remark,
            adminRemark
          } = ipRequest || {};
          const items = ipRequestDetailsList?.map((item) => ({
            ...item,
            key: Date.now().toString(36) + Math.random().toString(36).substr(2)
          }));

          const data = {
            requestNo,
            formStatus: res.data?.data?.ipRequest?.formStatus || 0,
            requester: { logonDomain, name, title, userPhone, logonName, userName },
            contactPerson: { endUserName, endUserTitle, endUserPhone, endUserEmail, endUserCorp },
            projectInfo: { hospital, remark },
            items,
            ipRequest,
            ipRequestDetailsList,
            adminRemark
          };
          dispatch(setAllFormData(data));
        })
        .finally(() => {
          Loading.hide();
        });
    }
  }, [isRequested]);

  const getSubmitButtonShow = () => {
    if (isMyRequest || isMyApproval) return false;
    return true;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Title */}
      {!requestNo && <ApplyHeader />}

      {/* RequesterBaseInfo */}
      <RequesterBaseInfo />

      {/* ContactPerson */}
      <ContactPerson />

      {/* ProjectInformation */}
      <ProjectInformation />

      {/* DetailsRequest */}
      <DetailsRequest />

      {/* SubmitButton */}
      {getSubmitButtonShow() && <SubmitButton />}
    </div>
  );
};

export default GeneralForm;
