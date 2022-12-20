import React, { useState, useRef } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import FundingTransferTemplate from '../../../Procurement/FundingTransfer/components/template/FundingTransferTemplate';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import API from '../../../../api/webdp/webdp';
import myactionAPI from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import { setMyDprequeststatusno } from '../../../../redux/myAction/my-action-actions';

const GenerateDoc = () => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const [data, setData] = useState([]);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const myDprequeststatusno = useSelector((state) => state.myAction.myDprequeststatusno);

  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const id = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const isN3 = useSelector((state) => state.myAction.requestForm?.isN3);
  const isN4 = useSelector((state) => state.myAction.requestForm?.isN4);
  const isN5 = useSelector((state) => state.myAction.requestForm?.isN5);

  const handleApprove = () => {
    if (myDprequeststatusno !== 105) {
      return;
    }
    const generateParams = { id, requestNo };
    Loading.show();
    myactionAPI
      .generateDocument(generateParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          dispatch(setMyDprequeststatusno(106));
          CommonTip.success('Success');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getData = () => {
    API.myActionPrintPDF({ dpReqNo: requestNo }).then((res) => {
      const resData = res?.data?.data?.getInfoToPDFList || [];
      setData(resData);
      setTimeout(() => {
        handlePrint();
      }, 0);
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      handleApprove();
    }
  });

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (isN3 || isN4 || isN5) {
      if (myDprequeststatusno === 105 || myDprequeststatusno === 106) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Bill Memo</strong>
        </Typography>
      </Grid>
      <Grid container style={{ margin: '0.5rem 0' }}>
        <Grid item xs={4}>
          <Button
            onClick={getData}
            variant="contained"
            color="primary"
            size="small"
            disabled={getButtonDisabled()}
          >
            Print
          </Button>
        </Grid>
      </Grid>

      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <FundingTransferTemplate isShowIssueBill selected={data} />
        </div>
      </div>
    </>
  );
};

export default GenerateDoc;
