import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import GeneralForm from './general-from';
import {
  setWebdp,
  setHospitalList,
  setServiceConduits,
  setProjectList,
  resetWebdp,
  setHospitalBlock
} from '../../../../redux/webDP/webDP-actions';
import { setDataToMyAction } from '../../../../redux/myAction/my-action-actions';
import webdpAPI from '../../../../api/webdp/webdp';
import Loading from '../../../../components/Loading';
import Comment from '../../../../components/Comment';

const CombinededForm = (props) => {
  const history = useHistory();
  // 如果是申请页面isDetail = false
  // 如果从my draft和my request和my action进入详情页，isDetail = ture
  // 如果从my action进入详情页isApproval = true
  // 如果从my request, my draft 进入详情页isRequest = true
  const { isDetail = false, isApproval = false, isRequest = false, requestId, apptype } = props;
  const formType = useSelector((state) => state.webDP.formType);
  const dispatch = useDispatch();
  const params = useParams();
  // console.log('Yancy CombinededForm', requestId, apptype);
  if (typeof requestId !== 'undefined') {
    params.requestId = requestId;
    params.apptype = apptype;
  }

  const [isRequested, setIsRequested] = useState(false); // 请求是否完成
  const [open, setOpen] = useState(false);
  const [commentObj, setCommentObj] = useState({});

  // 医院下拉列表数据
  const queryHospitalList = (hospitalList = []) => {
    const hospitalListData = hospitalList.filter((item) => item.hospitalName !== '') || [];

    // 根据hospital + hospitalName排序
    hospitalListData.sort((a, b) =>
      `${a.hospital}${a.hospitalName}`
        .replace(/[() /-]/g, '')
        ?.localeCompare(`${b.hospital}${b.hospitalName}`.replace(/[() /-]/g, ''))
    );

    dispatch(setHospitalList(hospitalListData));
  };

  // service type下拉列表数据
  const getServiceOption = (optionTypeList = []) => {
    const serviceTypeOption = [];
    const conduitTypeOption = [];
    optionTypeList.forEach((item) => {
      if (item.optionType === 'service' && formType === 'DP') {
        serviceTypeOption.push(item);
      } else if (item.optionType === 'APservice' && formType === 'AP') {
        serviceTypeOption.push(item);
      } else if (item.optionType === 'Conduit') {
        conduitTypeOption.push(item);
      }
    });
    const optionData = {
      serviceTypeOption,
      conduitTypeOption
    };
    dispatch(setServiceConduits(optionData));
  };

  // 获取project下拉列表数据
  const getProjectOption = (projectNameList = []) => {
    projectNameList.sort((a, b) =>
      `${a.project}${a.description}`
        .replace(/[() /-]/g, '')
        ?.localeCompare(`${b.project}${b.description}`.replace(/[() /-]/g, ''))
    ); // 根据project + description排序

    // projectNameList.sort((a, b) => b.group?.localeCompare?.(a.group)); // 再一次根据分组排序

    const others = { project: 'Others', description: '' };
    projectNameList.push(others);
    dispatch(setProjectList(projectNameList));
  };

  // 获取某间医院的街道信息
  const queryHospitalBlock = (data) => {
    webdpAPI.getBlockByHospCodeList(data).then((blockResult) => {
      const block = blockResult?.data?.data?.blockByHospCodeList || [];
      dispatch(setHospitalBlock(block));
    });
  };

  const handleData = (data = {}) => {
    data.isDetail = isDetail;
    try {
      const { serviceathosp } = data.dpRequest || {};

      dispatch(setWebdp(data));
      queryHospitalBlock(serviceathosp);
      handleComment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (data = {}) => {
    const { serviceathosp, requestNo, dprequeststatusno, apptype } = data.dpRequest || {};
    if (
      isRequest &&
      isDetail &&
      data.readOnly === false &&
      dprequeststatusno === 160 &&
      data.feedBack === false
    ) {
      setOpen(true);
      const newCommentObj = {
        requestNo,
        variables: {
          hospital: serviceathosp,
          appType: apptype
        }
      };
      setCommentObj(newCommentObj);
    }
  };

  const queryDetail = () => {
    const requestType = params?.apptype;
    const requestNo = params?.requestId;
    // console.log(params);
    const queryParams = {
      requestType,
      requestNo
    };
    // console.log(queryParams);
    webdpAPI
      .getRequestForm(queryParams)
      .then((res) => {
        if (res?.data?.data) {
          handleData(JSON.parse(JSON.stringify(res.data.data)));
          if (!isApproval && isDetail) {
            // 如果当前页不是my action，而是my request就要把数据放一份到my action redux
            dispatch(setDataToMyAction(JSON.parse(JSON.stringify(res.data.data))));
          }
        }
      })
      .finally(() => {
        if (isRequest) {
          Loading.hide();
        }
      });
  };

  const queryCopy = (requestNo) => {
    const requestType = formType;
    const queryParams = {
      requestType,
      requestNo
    };
    webdpAPI.getRequestForm(queryParams).then((res) => {
      if (res?.data?.data) {
        handleData(res.data.data);
      }
    });
  };

  useEffect(() => {
    const copyRequestNo = history.location.state?.requestNo;
    if (isRequested && isDetail) {
      // query detail
      queryDetail();
    } else if (!isDetail && isRequested && copyRequestNo) {
      // copy
      queryCopy(copyRequestNo);
    }
  }, [isRequested]);

  useEffect(() => {
    // 从my request 和my draft进入才加载loading
    if (isRequest) {
      Loading.show();
    }
    Promise.all([
      webdpAPI.getHospitalList(),
      webdpAPI.getOptionList(),
      webdpAPI.getProjectNameList(formType)
    ])
      .then((res) => {
        queryHospitalList(res?.[0]?.data?.data?.hospitalList || []);
        getServiceOption(res?.[1]?.data?.data?.optionTypeList || []);
        getProjectOption(res?.[2]?.data?.data?.projectNameList || []);
      })
      .finally(() => {
        // 执行该行会获取detail
        setIsRequested(true);
      });
  }, []);

  // reset redux
  useEffect(
    () => () => {
      dispatch(resetWebdp());
    },
    []
  );

  return (
    <Grid
      container
      spacing={0}
      style={{
        marginTop: '1rem',
        padding: '0.8rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem'
      }}
    >
      <GeneralForm isDetail={isDetail} isRequest={isRequest} isApproval={isApproval} />
      <Comment
        open={open}
        setOpen={setOpen}
        commentObj={commentObj}
        setCommentObj={setCommentObj}
      />
    </Grid>
  );
};

export default CombinededForm;
