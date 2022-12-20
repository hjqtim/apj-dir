import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import CombinededForm from '../../../webdp/Application/components';
import WebdpAccordion from '../../../../components/Webdp/WebdpAccordion';
import CostEstimation from './CostEstimation';
// import ManagerApproval from './ManagerApproval';
import {
  HAPaper,
  Loading
  // CommonTip
} from '../../../../components';
import OrderList from '../OrderList/OrderList';
import AntTab from '../../../../components/CustomizeMuiComponent/AntTab';
import AntTabs from '../../../../components/CustomizeMuiComponent/AntTabs';
import ControlToolbar from '../../../../components/Webdp/ControlToolbar';
import NetworkDesignUpload from './NetworkDesignUpload';
import SiteVisitUpload from './SiteVisitUpload';
import N5Approval from './N5Approval';
import ExternalNetworkEndorsement from './ExternalNetworkEndorsement';
import { setViewOnly, setForm } from '../../../../redux/webDP/webDP-actions';
import {
  setDataToMyAction,
  setAllMyAction,
  setMyActionProject
} from '../../../../redux/myAction/my-action-actions';
import ProgressBar from '../../../../components/Webdp/ProgressBar';
import ActionLog from '../../../../components/Webdp/ActionLog';
import BudgetHolderInformation from './BudgetHolderInformation';
import SiteVisitArrangement from './SiteVisitArrangement';
import FinalizeNetworkDesign from './FinalizeNetworkDesign';
import NetworkDesignConformation from './NetworkDesignConformation';
import ResponsibleStaff from './ResponsibleStaff';
import ManagerInformation from './ManagerInformation';
import RequesterConfirm from './RequesterConfirm';
// import { setDetail } from '../../../../redux/myAction/my-action-actions';
import API from '../../../../api/myAction';
import webdpAPI from '../../../../api/webdp/webdp';
import { getIdentity } from '../../../../utils/getIdentity';
import TaskCompleted from './TaskCompleted';
import Expenditure from './Expenditure';
import ManagerConfirm from './ManagerConfirm';
import BudgetHolderConfirm from './BudgetHolderConfirm';
import EndorsementConfirm from './EndorsementConfirm';
import CancleConfirm from './CancleConfirm';
//
import PendingConfirm from './PendingConfirm';
import CancelBtn from '../../../../components/Webdp/CancelBtn';
import PendingBtn from '../../../../components/Webdp/PendingBtn';

import GenerateDoc from './GenerateDoc';
import DocSent from './DocSent';

const Detail = (props) => {
  let requestId = props?.requestNo;
  let apptype = props?.apptype;
  const requestIdURL = useParams().requestId;
  const apptypeURL = useParams().apptype;
  if (requestIdURL) {
    requestId = requestIdURL;
  }
  if (apptypeURL) {
    apptype = apptypeURL;
  }
  // console.log('dap detail', props, requestId, apptype);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const formType = useSelector((state) => state.webDP.formType);
  const requestAllForm = useSelector((state) => state.myAction.requestForm); // 整张form的数据

  const isExitStatusNo = useSelector(
    (state) => state.myAction.requestForm?.detail?.dpRequestStatusNo
  );
  const isExitPendingStatusNo = useSelector(
    (state) => state.myAction.requestForm?.detail?.dpRequestPendingStatusNo
  );

  const myDprequeststatusno = useSelector((state) => state.myAction.myDprequeststatusno); //  用于generate doc的流程节点，会被修改
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  ); // 流程进度number
  const { fundparty } = requestAllForm?.dpRequest || {};
  const { isN3, isN4, isN5, isRequester, isManager, isBudgetHolder, isEndorsement, isMni, isRF } =
    requestAllForm || {};
  console.log('requestAllForm 83', isN3, isN4, isN5, isRF, requestAllForm);

  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState('Approval');
  const getToLowerCase = (val) => val?.toLowerCase();

  const getIsBudgetHolder = (data = {}, loginId) => {
    if (loginId === getToLowerCase(data.dpRequest?.budgetholderid)) {
      return true;
    }

    if (!data.dpRequest?.budgetholderid && data.dpRequest?.dprequeststatusno > 112) {
      if (data.isN3 || data.isN4 || data.isN5) {
        return true;
      }
    }
    return false;
  };

  // 判断是否可以查看该form
  const handlePermission = (data = {}) => {
    const { isN3, isN4, isN5, isRF, isRequester, isManager, isBudgetHolder, isEndorsement } = data;
    console.log(
      'handlePermission 105',
      isN3,
      isN4,
      isN5,
      isRF,
      isRequester,
      isManager,
      isBudgetHolder,
      isEndorsement
    );
    // 如果不属于其中一个身份，就无权查看
    // if (
    //   !isN3 &&
    //   !isN4 &&
    //   !isN5 &&
    //   !isRF &&
    //   !isRequester &&
    //   !isManager &&
    //   !isBudgetHolder &&
    //   !isEndorsement
    // ) {
    //   CommonTip.error('You do not have permission to view this request form!', 3000);
    //   setTimeout(() => {
    //     window.location.href = '/request';
    //   }, 3000);
    // }
  };

  // on page loaded fetch ap/dp data
  useEffect(() => {
    // console.log('yancy useEffect ', requestId, apptype);
    const requestData = {
      requestType: apptype,
      requestNo: requestId
    };
    Loading.show();

    // 初始化 ↓↓↓↓↓↓↓↓↓↓↓
    dispatch(setViewOnly(true));
    dispatch(setForm(apptype));
    // 初始化 ↑↑↑↑↑↑↑↑↑↑↑↑

    const p1 = API.getRequestForm(requestData);
    const p2 = webdpAPI.getProjectNameList(apptype);
    Promise.all([p1, p2])
      .then((res) => {
        const formData = res?.[0]?.data?.data || {};
        const projectList = res?.[1]?.data?.data?.projectNameList || [];
        if (!projectList.length) {
          return;
        }
        const { dpRequest = {} } = formData;
        const newData = JSON.parse(JSON.stringify(formData));

        // 如果有read only，就取read only那个用户信息，没有就拿登录的用户信息
        const user = newData.readOnly ? newData.licensorList?.[0] || currentUser : currentUser;

        const loginId = getToLowerCase(user.username);

        newData.isRF = getIdentity(user).isRF;
        newData.isN3 = getIdentity(user).isN3;
        newData.isN4 = getIdentity(user).isN4;
        newData.isN5 = getIdentity(user).isN5;
        newData.isRequester = loginId === getToLowerCase(dpRequest.requesterid);
        newData.isManager = loginId === getToLowerCase(dpRequest.rmanagerid);
        newData.isBudgetHolder = getIsBudgetHolder(newData, loginId);
        newData.isEndorsement = loginId === getToLowerCase(dpRequest.endorsementId);
        newData.isMni = dpRequest.isMni === 'Y';
        newData.isCancel =
          dpRequest?.dprequeststatusno === 170 || dpRequest?.dprequeststatusno === 180;
        newData.isPending =
          dpRequest?.dprequeststatusno === 140 || dpRequest?.dprequeststatusno === 141;

        dispatch(setDataToMyAction(JSON.parse(JSON.stringify(newData))));
        dispatch(setMyActionProject(projectList));
        handlePermission(newData);
        setLoading(false);
      })
      .finally(() => {
        Loading.hide();
      });
  }, []);

  useEffect(() => {
    console.log('');
    return () => {
      // 组件销毁时清空my action redux
      dispatch(setAllMyAction());
    };
  }, []);

  const tabsChange = (e, value) => {
    setTabValue(value);
  };

  const getSiteVisitShow = () => {
    if (dprequeststatusno >= 30) {
      if (isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }
    // if (isMni) {
    //   if (isN5 && dprequeststatusno >= 30) {
    //     return true;
    //   }
    //   if ((isN3 || isN4 || isEndorsement) && dprequeststatusno > 30) {
    //     return true;
    //   }
    // }

    // if (!isMni) {
    //   if ((isN3 || isN4) && dprequeststatusno >= 30) {
    //     return true;
    //   }
    //   if (isN5 && dprequeststatusno > 30) {
    //     return true;
    //   }
    // }

    return false;
  };

  const getExpenditureShow = () => {
    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 50) {
      return true;
    }
    return false;
  };

  const getCancleConfirmShow = () => {
    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 170 && !!isExitStatusNo) {
      return true;
    }
    return false;
  };

  const getPendingConfirmShow = () => {
    // console.log('getPendingConfirmShow', isRF);
    if (
      (isN3 || isN4 || isN5) &&
      // isRF &&
      [140, 141, 180].includes(dprequeststatusno) &&
      !!isExitPendingStatusNo
    ) {
      return true;
    }
    return false;
  };

  const getNetworkDesignConformation = () => {
    if ((isN3 || isN4 || isN5 || isEndorsement) && dprequeststatusno >= 40) {
      return true;
    }

    return false;
  };

  const getFinalizeNetworkDesignShow = () => {
    // if (isMni) {
    //   if (isN5 && dprequeststatusno >= 41) {
    //     return true;
    //   }
    //   if ((isN3 || isN4 || isEndorsement) && dprequeststatusno > 41) {
    //     return true;
    //   }
    // }

    // if (!isMni) {
    //   if ((isN3 || isN4) && dprequeststatusno >= 41) {
    //     return true;
    //   }
    //   if (isN5 && dprequeststatusno > 41) {
    //     return true;
    //   }
    // }

    if ((isN3 || isN4 || isN5 || isEndorsement) && dprequeststatusno >= 41) {
      return true;
    }

    return false;
  };

  const getCostEstimationShow = () => {
    if (isMni) {
      if (isN5 && dprequeststatusno >= 50) {
        return true;
      }
    }

    if (!isMni) {
      if (dprequeststatusno >= 50 && (isN3 || isN4)) {
        return true;
      }
    }

    if (dprequeststatusno > 50) {
      if (isN3 || isN4 || isN5 || isRequester || isManager || isBudgetHolder || isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getResponsibleStaffShow = () => {
    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 30) {
      return true;
    }
    return false;
  };

  const getRequesterConfirmShow = () => {
    if (dprequeststatusno >= 100) {
      if (isRequester || isManager || isBudgetHolder || isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }
    return false;
  };

  const getBudgetHolderInformationShow = () => {
    // if (isRequester && dprequeststatusno >= 100) {
    //   return true;
    // }

    // if (isManager && dprequeststatusno >= 110) {
    //   return true;
    // }

    // if (isBudgetHolder && dprequeststatusno >= 120) {
    //   return true;
    // }

    // if (dprequeststatusno >= 125 && (isN3 || isN4)) {
    //   return true;
    // }
    if (dprequeststatusno >= 100) {
      if (isRequester || isManager || isBudgetHolder || isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getSiteVisitUploadShow = () => {
    // if ((isN3 || isN4) && dprequeststatusno >= 31) {
    //   return true;
    // }

    // if ((isN5 || isEndorsement) && dprequeststatusno > 31) {
    //   return true;
    // }

    if (dprequeststatusno >= 31) {
      if (isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getNetworkDesignUploadShow = () => {
    if ((isN3 || isN4 || isN5 || isEndorsement) && dprequeststatusno >= 41) {
      return true;
    }

    return false;
  };

  const getManagerConfirmShow = () => {
    if (dprequeststatusno >= 100) {
      if (isManager || isRequester || isBudgetHolder || isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getBudgetHolderConfirmShow = () => {
    if (dprequeststatusno >= 100) {
      if (isManager || isRequester || isBudgetHolder || isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getTaskCompletedShow = () => {
    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 145) {
      return true;
    }
    return false;
  };

  const getExternalNetworkEndorsementShow = () => {
    if (isMni && isN5 && dprequeststatusno >= 20) {
      return true;
    }
    return false;
  };

  const getN5ApprovalShow = () => {
    if (!isMni) {
      return false;
    }
    if (isN5 && dprequeststatusno >= 22) {
      return true;
    }
    if (isEndorsement && dprequeststatusno > 22) {
      return true;
    }
    return false;
  };

  const getEndorsementConfirmShow = () => {
    if (!isMni) {
      return false;
    }

    if (isEndorsement && dprequeststatusno >= 21) {
      return true;
    }
    if (isN5 && dprequeststatusno > 21) {
      return true;
    }
    return false;
  };

  const getGenerateDocShow = () => {
    if (fundparty === 'External') {
      if (dprequeststatusno >= 105 && (isN3 || isN4 || isN5)) {
        return true;
      }

      if (dprequeststatusno > 105 && isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getDocSentShow = () => {
    if (fundparty === 'External') {
      if (myDprequeststatusno >= 106 && (isN3 || isN4 || isN5)) {
        return true;
      }

      if (myDprequeststatusno > 106 && isEndorsement) {
        return true;
      }
    }

    return false;
  };

  const getManagerInformationShow = () => {
    if (dprequeststatusno >= 100) {
      if (isRequester || isBudgetHolder || isN3 || isN4 || isN5 || isEndorsement) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      {!loading && (
        <>
          {(isN3 || isN4 || isN5 || isRF) && (
            // {isRF && (
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              {isN3 || isRF ? <CancelBtn isMyAction /> : null}
              {isN3 || isRF ? <PendingBtn isMyAction /> : null}

              {/* <CancelBtn isMyAction />
              <PendingBtn isMyAction /> */}
            </Grid>
          )}

          <Grid>
            <Typography
              variant="h2"
              style={{
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {apptype}
              {requestId}
              {dprequeststatusno === 180 && <span>&nbsp;(Cancelled)</span>}
            </Typography>
          </Grid>

          <AntTabs value={tabValue} onChange={tabsChange} textColor="primary">
            <AntTab label="Approval" value="Approval" />
            {(isN3 || isN4 || isN5) && <AntTab label="Order List" value="Order List" />}
          </AntTabs>

          <div style={{ display: tabValue === 'Approval' ? 'block' : 'none' }}>
            <Grid
              container
              style={{
                marginTop: '1rem',
                padding: '0.8rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                marginBottom: '30px'
              }}
            >
              <ProgressBar />
            </Grid>
            <Grid
              container
              style={{
                marginTop: '1rem',
                padding: '0.8rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                marginBottom: '30px'
              }}
            >
              <ActionLog />
            </Grid>
            <Grid
              container
              style={{
                marginTop: '1rem',
                padding: '0.8rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                marginBottom: '30px'
              }}
            >
              <WebdpAccordion
                label={`${formType} Application Form ( Click to Open )`}
                content={
                  <div>
                    <ControlToolbar isMyAction />
                    <CombinededForm isDetail isApproval requestId={requestId} apptype={apptype} />
                  </div>
                }
              />
            </Grid>
          </div>

          <HAPaper style={{ display: tabValue === 'Approval' ? 'block' : 'none' }}>
            <br />

            <Grid container style={{ padding: '0.8rem' }}>
              {/* Assign Responsible Staff, always displayed */}
              {getResponsibleStaffShow() && <ResponsibleStaff />}

              {/* set endorsement person */}
              {getExternalNetworkEndorsementShow() && <ExternalNetworkEndorsement />}

              {getEndorsementConfirmShow() && <EndorsementConfirm />}

              {/* Requester Manager Information moved to AP DP form */}

              {/* endorsement person approval or N5 SM approval */}
              {getN5ApprovalShow() && <N5Approval />}

              {/* site visit arrangement */}
              {getSiteVisitShow() && <SiteVisitArrangement />}

              {/* upload site visit report */}
              {getSiteVisitUploadShow() && <SiteVisitUpload />}

              {/* Decide require network design or not */}
              {getNetworkDesignConformation() && <NetworkDesignConformation />}

              {/* Network design upload */}
              {getNetworkDesignUploadShow() && <NetworkDesignUpload />}

              {/* Finalize Network Design */}
              {getFinalizeNetworkDesignShow() && <FinalizeNetworkDesign />}

              {getCostEstimationShow() && <CostEstimation />}

              {getManagerInformationShow() && <ManagerInformation />}

              {/* Set budget Holder, the user, or N3/N4/N5 can edit before fund confirmed */}

              {/* Fund Confirmation for request, request manager, and budget holder */}
              {getBudgetHolderInformationShow() && <BudgetHolderInformation />}

              {getRequesterConfirmShow() && <RequesterConfirm />}

              {getManagerConfirmShow() && <ManagerConfirm />}

              {getBudgetHolderConfirmShow() && <BudgetHolderConfirm />}

              {getGenerateDocShow() && <GenerateDoc />}

              {getDocSentShow() && <DocSent />}

              {getExpenditureShow() && <Expenditure />}

              {getCancleConfirmShow() && <CancleConfirm />}

              {getPendingConfirmShow() && <PendingConfirm />}

              {/* Task Complete */}
              {getTaskCompletedShow() && <TaskCompleted />}
            </Grid>
          </HAPaper>
          {tabValue === 'Order List' && <OrderList />}
        </>
      )}
    </>
  );
};

export default Detail;
