import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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

const SiteVisitArrangement = () => {
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const formType = useSelector((state) => state.webDP.formType);
  const [data, setData] = useState({});
  const readOnly = data.readOnly || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const [locationList, setLocationList] = useState([]);
  const [arrangesitevisit, setArrangesitevisit] = useState('N');
  const [siteSurveyRemark, setSiteSurveyRemark] = useState('');
  const TitleProps = useTitleProps();

  useEffect(() => {
    let newLocationList = [];
    let newData = {};
    if (Object.keys(requestForm)?.length) {
      newData = requestForm;
      if (formType === 'DP') {
        newLocationList = requestForm?.dpLocationList || [];
      } else if (formType === 'AP') {
        newLocationList = requestForm?.apLocationList || [];
      }
    }

    setLocationList(JSON.parse(JSON.stringify(newLocationList)));
    setData(JSON.parse(JSON.stringify(newData)));
    setSiteSurveyRemark(newData?.dpRequest?.siteSurveyRemark || '');
    setArrangesitevisit(newData?.dpRequest?.arrangesitevisit || 'N');
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

  const networkDesignSubmitter = () => {
    const locationListMap = locationList.map((item) => ({
      id: item.id,
      isSiteSurvey: item.isSiteSurvey || 'N'
    }));
    const saveParams = {
      appType: formType,
      arrangesitevisit: arrangesitevisit || 'N',
      dpId: data?.dpRequest?.id,
      requestNo: data?.dpRequest?.requestNo,
      siteSurveyList: locationListMap,
      siteSurveyRemark: siteSurveyRemark || ''
    };
    Loading.show();
    API.saveSiteVisit(saveParams)
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

  const changeLocationByIndex = (index, field, value) => {
    try {
      if (locationList?.[index]) {
        const newLocationList = [...locationList];
        newLocationList[index][field] = value;
        setLocationList(newLocationList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    const hasIsSiteSurvey = locationList.find((item) => item.isSiteSurvey === 'Y');

    if (arrangesitevisit === 'Y' && data.dpRequest?.dprequeststatusno === 30 && hasIsSiteSurvey) {
      return false;
    }

    if (arrangesitevisit === 'N' && data.dpRequest?.dprequeststatusno === 30) {
      return false;
    }

    return true;
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (data.dpRequest?.dprequeststatusno === 30) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}> Site Visit Arrangement</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <WebdpRadioField
          label="Is site visit required? *"
          value={arrangesitevisit}
          options={options}
          onChange={(e, v) => {
            setArrangesitevisit(v);
          }}
          row
          disabled={getFormDisabled()}
        />
      </Grid>
      <>
        {arrangesitevisit === 'Y' && (
          <Grid item xs={12} style={{ marginBottom: '0.5rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Site Visit</TableCell>
                  <TableCell align="center">Contact Person</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
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
                        disabled={getFormDisabled()}
                        checked={item.isSiteSurvey === 'Y'}
                        onChange={(e, v) => {
                          changeLocationByIndex(index, 'isSiteSurvey', v ? 'Y' : 'N');
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" width={300}>
                      {item.isSiteSurvey === 'Y' && (
                        <WebdpTextField
                          label="Site Visit Person"
                          value={item.siteContactPerson}
                          disabled
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" width={300}>
                      {item.isSiteSurvey === 'Y' && (
                        <WebdpTextField label="Email" value={item.siteContactEmail} disabled />
                      )}
                    </TableCell>
                    <TableCell align="center" width={300}>
                      {item.isSiteSurvey === 'Y' && (
                        <WebdpTextField label="Phone" value={item.siteContactPhone} disabled />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}

        <Grid item xs={12} style={{ margin: '0.5rem 0' }}>
          <WebdpTextField
            id="remark"
            value={siteSurveyRemark || ''}
            onChange={(e) => {
              setSiteSurveyRemark(e.target.value);
            }}
            label="Remark"
            multiline
            disabled={getFormDisabled()}
            minRows={5}
          />
        </Grid>

        <Grid item xs={12}>
          {/* <SubmitButton
            // label="Arrange Site Visit"
            label="Confirm"
            submitAction={networkDesignSubmitter}
            title="Site Visit Arrangement"
            message={`You confirm site visit for ${requestId}, confirm?`}
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

export default memo(SiteVisitArrangement);
