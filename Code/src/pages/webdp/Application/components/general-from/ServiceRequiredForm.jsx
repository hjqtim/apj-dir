import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  updateServiceRequired,
  // setHospitalList,
  setHospitalBlock,
  selectHospitalEffect
} from '../../../../../redux/webDP/webDP-actions';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import API from '../../../../../api/webdp/webdp';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

const InputProps = {
  variant: 'outlined',
  fullWidth: true,
  size: 'small'
};

const ServiceRequiredForm = () => {
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  // const formType = useSelector((state) => state.webDP.formType);
  const serviceRequiredInformation = useSelector((state) => state.webDP.serviceRequired);
  const { hospitalList = [], hospitalLocation } = serviceRequiredInformation || {};
  const error = useSelector((state) => state.webDP.error.serviceRequired.hospitalLocation);
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const dispatch = useDispatch();

  // 获取某间医院的街道信息
  const queryHospitalBlock = (data) => {
    API.getBlockByHospCodeList(data).then((blockResult) => {
      const block = blockResult?.data?.data?.blockByHospCodeList || [];
      dispatch(setHospitalBlock(block));
    });
  };

  const fieldsUpdateHandler = (e) => {
    dispatch(updateServiceRequired(e));
  };
  return (
    <Grid container>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Service Required</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={6}>
          <TextField
            {...InputProps}
            label="Institution Reference"
            value={serviceRequiredInformation.hospitalRef}
            id="hospitalRef"
            onChange={fieldsUpdateHandler}
            disabled={viewOnly}
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={6}>
          <Autocomplete
            id="hospitalLocation"
            value={hospitalLocation?.hospitalName ? hospitalLocation : null}
            options={hospitalList}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            onChange={(e, value) => {
              const newHospitalLocation = {
                target: {
                  id: 'hospitalLocation',
                  value: value || {}
                }
              };
              fieldsUpdateHandler(newHospitalLocation); // 保存选中的医院

              dispatch(selectHospitalEffect()); // 清除block,floor,existing data port
              if (value?.hospital) {
                queryHospitalBlock(value.hospital); // 获取选中医院的具体街道
              }
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...InputProps}
                label="Institution / Location *"
                error={error}
              />
            )}
            disabled={viewOnly}
          />
        </Grid>
      </Grid>
      {/* {formType === 'AP' && (
        <Grid style={{ padding: '0.3rem 0.3rem' }}>
          <Typography variant="body2" color="textSecondary">
            <strong>
              Note: If the WLAN is for access to clinical IT/IS systems, the requester has to inform
              CIPO about the WLAN installation.
            </strong>
          </Typography>
        </Grid>
      )} */}
    </Grid>
  );
};

export default ServiceRequiredForm;
