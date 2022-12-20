import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';

import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { CommonTip, WarningDialog, Loading } from '../../../../components';
import ipassignAPI from '../../../../api/ipassign';
import { handleValidation } from '../../../../utils/tools';
import { getIdentity } from '../../../../utils/getIdentity';
import { setBaseData } from '../../../../redux/IPAdreess/ipaddrActions';
import useValidationApprove from './useValidationApprove';
import {
  staticItemTouch,
  reserverItemTouch,
  rangeItemTouch
} from '../../../../models/ipaddr/TouchModel';

const HandleRequestBTN = ({ DHCPRangeData }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { requestNo } = useParams();
  const requesterInfo = useSelector((state) => state.IPAdreess.requester);
  const ipRequestDetailsList = useSelector((state) => state.IPAdreess.items);
  const formStatus = useSelector((state) => state.IPAdreess.formStatus);
  const adminRemark = useSelector((state) => state.IPAdreess.adminRemark);
  const user = useSelector((state) => state.userReducer.currentUser);
  const { isN3, isN4, isN5 } = getIdentity(user);
  const staticIPData = useSelector((state) => state.IPAdreess.staticIPData) || [];
  const DHCPReservedData = useSelector((state) => state.IPAdreess.DHCPReservedData) || [];

  const [openNeedRemark, setOpenNeedRemark] = useState(false);
  const [openCompete, setOpenCompete] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openSave, setOpenSave] = useState(false);

  const errors = useValidationApprove(staticIPData, DHCPReservedData, DHCPRangeData);

  const handleReject = () => {
    Loading.show();
    if (formStatus === 0) {
      ipassignAPI
        .AwaitingConfirm({
          ipRequest: { requestNo, adminRemark },
          pass: false,
          ipRequestDetailsList
        })
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success('Rejected');
            setTimeout(() => {
              history.push('/action');
            }, 500);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else if (formStatus === 10) {
      ipassignAPI
        .AwaitingConfiguration({
          ipRequest: { requestNo, adminRemark },
          pass: false,
          ipRequestDetailsList
        })
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success('Rejected');
            setTimeout(() => {
              history.push('/action');
            }, 500);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };

  const genTouches = () => {
    const staticTouches = staticIPData?.map(() => staticItemTouch(true));
    const reserverTouches = DHCPReservedData?.map(() => reserverItemTouch(true));
    const rangeTouches = DHCPRangeData?.map(() => rangeItemTouch(true));
    dispatch(setBaseData({ staticTouches }));
    dispatch(setBaseData({ reserverTouches }));
    dispatch(setBaseData({ rangeTouches }));
  };

  const handleSave = () => {
    const canSubmit = beforeRequest();
    if (canSubmit) {
      const queryData = {
        pass: true,
        ipRequest: { requestNo, adminRemark },
        ipList: dataProcessor01(),
        ipRequestDetailsList
      };
      Loading.show();
      ipassignAPI
        .AwaitingConfirm(queryData)
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success('Approved');
            setTimeout(() => {
              history.push('/action');
            }, 500);
            // handleCompete();
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else {
      handleValidation();
    }
  };

  const handleCompete = () => {
    const canSubmit = beforeRequest();
    if (canSubmit) {
      const queryData = {
        pass: true,
        ipRequest: { requestNo, adminRemark },
        ipList: dataProcessor01(),
        ipRequestDetailsList
      };
      Loading.show();
      ipassignAPI
        .AwaitingConfiguration(queryData)
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success('Success');
            setTimeout(() => {
              history.push('/action');
            }, 500);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else {
      handleValidation();
    }
  };

  const beforeRequest = () => {
    // 设置 touches
    genTouches();

    let itemErrorFlag = true;
    errors.staticError?.forEach((item) => {
      if (!_.isEmpty(item)) {
        itemErrorFlag = false;
      }
    });
    errors.reserverError?.forEach((item) => {
      if (!_.isEmpty(item)) {
        itemErrorFlag = false;
      }
    });
    errors.rangeError?.forEach((item) => {
      if (!_.isEmpty(item)) {
        itemErrorFlag = false;
      }
    });

    return itemErrorFlag;
  };

  const dataProcessor01 = () => {
    const ipList = [];
    staticIPData?.forEach((item) => {
      const { macAddress, bit, hospital, block, floor, room, gateway } = item;
      const obj = {
        macAddress,
        bit,
        hospital,
        block,
        floor,
        room,
        gateway,
        requestDetailsId: item?.detailId,
        subnet: item?.subnetSelected,
        requester: requesterInfo.userName,
        phone: requesterInfo.userPhone,
        mask: item?.subnetMask,
        purpose: item?.purpose,
        ipAddress: item?.ipAddress + item?.ipaddressLast
      };
      ipList.push(obj);
    });

    DHCPReservedData?.forEach((item) => {
      const { macAddress, bit, hospital, block, floor, room, gateway } = item;
      const obj = {
        macAddress,
        bit,
        hospital,
        block,
        floor,
        room,
        gateway,
        requestDetailsId: item?.detailId,
        subnet: item?.subnetSelected,
        requester: requesterInfo.userName,
        phone: requesterInfo.userPhone,
        mask: item?.subnetMask,
        purpose: item?.purpose,
        ipAddress: item?.ipAddress + item?.ipaddressLast
      };
      ipList.push(obj);
    });

    DHCPRangeData?.forEach((item) => {
      new Array(Number(item?.ipNumber)).fill('').forEach((__, i) => {
        const { hospital, block, floor, room, subnetSelected } = item;
        const tempArr = subnetSelected.split('.');
        const temp = `${tempArr[0]}.${tempArr[1]}.${tempArr[2]}`;
        const obj = {
          hospital,
          block,
          floor,
          room,
          requestDetailsId: item?.detailId,
          subnet: item?.subnetSelected,
          requester: requesterInfo.userName,
          phone: requesterInfo.userPhone,
          mask: item?.subnetMask,
          purpose: item?.purpose,
          ipAddress: `${temp}.${Number(item?.rangeFrom + i)}`
        };
        ipList.push(obj);
      });
    });
    return ipList;
  };

  const canApprovel = () => isN3 || isN4 || isN5;

  return (
    <>
      <Grid item xs={12}>
        <div style={{ marginBottom: 10 }}>
          <TextField
            variant="outlined"
            label="Reason"
            multiline
            fullWidth
            minRows={6}
            maxRows={10}
            value={adminRemark}
            name="remark"
            disabled={formStatus === 20 || formStatus === 30}
            onChange={(e) => {
              dispatch(setBaseData({ adminRemark: e.target.value || '' }));
            }}
          />
        </div>

        {canApprovel() && formStatus === 10 ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            style={{
              fontWeight: 'bold',
              marginRight: 15
            }}
            onClick={() => setOpenCompete(true)}
          >
            Completed
          </Button>
        ) : (
          <></>
        )}

        {canApprovel() && formStatus === 0 ? (
          <Button
            variant="contained"
            // disabled={wrong}
            color="primary"
            startIcon={<SaveIcon />}
            style={{
              fontWeight: 'bold',
              marginRight: 15
            }}
            onClick={() => setOpenSave(true)}
          >
            Approval
          </Button>
        ) : (
          <></>
        )}

        {canApprovel() && (formStatus === 0 || formStatus === 10) ? (
          <Button
            variant="contained"
            startIcon={<CancelIcon />}
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              if (adminRemark === '') {
                setOpenNeedRemark(true);
              } else {
                setOpenReject(true);
              }
            }}
          >
            Rejected
          </Button>
        ) : (
          <></>
        )}
      </Grid>

      <WarningDialog
        handleConfirm={() => {
          setOpenSave(false);
          handleSave();
        }}
        handleClose={() => {
          setOpenSave(false);
        }}
        content="Are you sure approval the application?"
        open={openSave}
      />
      <WarningDialog
        handleConfirm={() => {
          setOpenCompete(false);
          handleCompete();
        }}
        handleClose={() => {
          setOpenCompete(false);
        }}
        content="Are you sure complete the application?"
        open={openCompete}
      />
      <WarningDialog
        handleConfirm={() => {
          setOpenReject(false);
          handleReject();
        }}
        handleClose={() => {
          setOpenReject(false);
        }}
        content="Are you sure reject the application?"
        open={openReject}
      />
      <WarningDialog
        isHideConfirm
        handleClose={() => setOpenNeedRemark(false)}
        CancelText="OK"
        content="Please make a reason to remark"
        open={openNeedRemark}
      />
    </>
  );
};
export default memo(HandleRequestBTN);
