import React, { useState, useEffect, memo } from 'react';
// import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Checkbox,
  Typography,
  Button
} from '@material-ui/core';
// import SubmitButton from '../../../../components/Webdp/SubmitButton';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import WebdpRadioField from '../../../../components/Webdp/WebdpRadioField';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebdpColor from '../../../../hooks/webDP/useWebDPColor';

const options = [
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
];

const reasonOptions = [
  { label: 'Insufficient spare switch port', value: 0 },
  { label: 'No spare switch port', value: 1 },
  { label: 'No wiring closet', value: 2 },
  { label: 'Cabling length over 90m', value: 3 },
  { label: 'Non-standard Project', value: 4 },
  { label: 'Network infrastructure for a new hospital or building', value: 5 },
  { label: 'Network upgrade for the current hospital or building', value: 6 },
  { label: 'Other', value: 7 }
];

const NetworkDesignConformation = () => {
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const readOnly = requestForm?.readOnly || false;
  const [locationList, setLocationList] = useState([]);
  const dprequeststatusno = requestForm?.dpRequest?.dprequeststatusno;
  // const { requestId } = useParams();
  const formType = useSelector((state) => state.webDP.formType);

  const [needDesign, setNeedDesign] = useState('N');
  const TitleProps = useTitleProps();

  useEffect(() => {
    let newLocationList = [];
    if (Object.keys(requestForm)?.length) {
      if (formType === 'DP') {
        newLocationList = requestForm?.dpLocationList || [];
      } else if (formType === 'AP') {
        newLocationList = requestForm?.apLocationList || [];
      }
    }
    setLocationList(JSON.parse(JSON.stringify(newLocationList)));

    let newNeedDesign = 'N';
    if (
      requestForm.dpRequest.networkDesignStatus &&
      requestForm.dpRequest.networkDesignStatus !== 'N'
    ) {
      newNeedDesign = 'Y';
    }
    setNeedDesign(newNeedDesign);
  }, [requestForm]);

  // get Item name for AP & DP request
  const getServiceNameByDP = (v) => {
    let serviceTypeText = '';

    switch (v.serviceType) {
      case 'N':
        serviceTypeText = 'Install new data port ';
        break;
      case 'R':
        serviceTypeText = 'Relocate data port ';
        break;
      case 'D':
        serviceTypeText = 'Install new dual data port ';
        break;
      case 'L':
        serviceTypeText = 'Relocate new dual data port ';
        break;
      case 'O':
        serviceTypeText = `Others: ${v.otherServiceDesc} `;
        break;
      default:
    }

    let conduitTypeText = '';
    switch (v.conduitType) {
      case 'M':
        conduitTypeText = 'with metallic conduit protection';
        break;
      case 'P':
        conduitTypeText = 'with plastic conduit protection';
        break;
      case 'N':
        conduitTypeText = 'without conduit protection';
        break;
      default:
    }
    return serviceTypeText + conduitTypeText;
  };

  const getServiceNameByAP = (v) => {
    let serviceTypeText = '';
    switch (v.serviceType) {
      case 'N':
        serviceTypeText = 'Install new access point';
        break;
      case 'R':
        serviceTypeText = 'Relocate access point ';
        break;
      case 'O':
        serviceTypeText = `Others: ${v.otherServiceDesc}`;
        break;
      default:
    }
    return serviceTypeText;
  };
  // end of  get Item name for AP & DP request

  const networkDesignSubmitter = () => {
    const newLocationList = locationList.map((item) => ({
      id: item.id,
      isNetworkDesign: item.isNetworkDesign || 'N',
      reason: item.reason || '',
      remark: item.remark || ''
    }));
    const saveParams = {
      appType: formType,
      dpAndApNetWorkPojoList: needDesign === 'Y' ? newLocationList : [],
      requestNo: requestForm?.dpRequest?.requestNo
    };
    Loading.show();
    API.requireNetworkDesign(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success', 2000);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (dprequeststatusno === 40) {
      return false;
    }
    return true;
  };

  const changeLocationByIndex = (index, field, value) => {
    if (locationList?.[index]) {
      const newLocationList = [...locationList];
      newLocationList[index][field] = value;
      setLocationList(newLocationList);
    }
  };

  /**
   * 至少有一个选中Y，并且数组中不存在选中Y且不选reason的item
   * @returns
   */
  const getButtonDisabled = () => {
    const hasIsNetworkDesign = locationList.find((item) => item.isNetworkDesign === 'Y');
    const hasNoReason = locationList.find((item) => item.isNetworkDesign === 'Y' && !item.reason); // 打勾又没有选理由的
    if (needDesign === 'Y') {
      if (!hasIsNetworkDesign || hasNoReason) {
        return true;
      }
    }
    return getFormDisabled();
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}>Network Design</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <WebdpRadioField
          label="Is network design required? *"
          value={needDesign}
          options={options}
          onChange={(e, v) => {
            setNeedDesign(v);
          }}
          row
          disabled={getFormDisabled()}
        />
      </Grid>
      <>
        {needDesign === 'Y' && (
          <Grid item xs={12} style={{ marginBottom: '0.5rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Network Design</TableCell>
                  <TableCell align="center">Reason</TableCell>
                  <TableCell align="center">Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locationList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {formType === 'DP'
                        ? `${item.numOfDP} x ${getServiceNameByDP(item)}`
                        : getServiceNameByAP(item)}
                    </TableCell>
                    <TableCell align="center">
                      {item.room} {item.floor} {item.block} {item.dept}
                    </TableCell>

                    <TableCell align="center">
                      <Checkbox
                        checked={item.isNetworkDesign === 'Y'}
                        onChange={(e, v) => {
                          changeLocationByIndex(index, 'isNetworkDesign', v ? 'Y' : 'N');
                        }}
                        disabled={getFormDisabled()}
                      />
                    </TableCell>
                    <TableCell align="center" width={300}>
                      <WebdpTextField
                        select
                        value={item.reason || ''}
                        onChange={(e) => {
                          changeLocationByIndex(index, 'reason', e?.target?.value || '');
                        }}
                        disabled={getFormDisabled()}
                      >
                        {reasonOptions.map((option) => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </WebdpTextField>
                    </TableCell>
                    <TableCell align="center" width={300}>
                      <WebdpTextField
                        value={item.remark || ''}
                        placeholder="Remark"
                        minRows={2}
                        multiline
                        onChange={(e) => {
                          changeLocationByIndex(index, 'remark', e?.target?.value || '');
                        }}
                        disabled={getFormDisabled()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
        <Grid item xs={12}>
          {/* <SubmitButton
            label="Confirm"
            submitAction={networkDesignSubmitter}
            title="Network Design"
            message={`You confirm network design for ${requestId}, confirm?`}
            submitLabel="Confirm"
            disabled={getButtonDisabled()}
          /> */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={networkDesignSubmitter}
            disabled={getButtonDisabled()}
          >
            Confirm
          </Button>
        </Grid>
      </>
    </>
  );
};

export default memo(NetworkDesignConformation);
