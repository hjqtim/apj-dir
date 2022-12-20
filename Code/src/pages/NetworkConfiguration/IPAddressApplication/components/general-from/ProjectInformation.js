import React, { useMemo, memo } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import { FormControlInputProps } from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import TextAreaProps from '../../../../../models/webdp/PropsModels/TextAreaProps';
import {
  setProjectInfo,
  setTouch,
  setBaseData
} from '../../../../../redux/IPAdreess/ipaddrActions';
import useValidationIPForm from './useValidationIPForm';
import webdpAPI from '../../../../../api/webdp/webdp';

const ProjectInformation = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const errors = useValidationIPForm()?.projectInfo || {};
  const projectInfo = useSelector((state) => state.IPAdreess.projectInfo);
  const touches = useSelector((state) => state.IPAdreess.touches.projectInfo);
  const hospitalList = useSelector((state) => state.IPAdreess.hospitalList) || [];
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  const fieldsUpdateHandler = (data) => {
    dispatch(setProjectInfo(data));
  };
  const getBlockData = () => {
    if (projectInfo.hospital) {
      webdpAPI.getBlockByHospCodeList(projectInfo.hospital).then((blockResult) => {
        const blockList = blockResult?.data?.data?.blockByHospCodeList || [];
        dispatch(setBaseData({ blockList }));
      });
    } else {
      dispatch(setBaseData({ blockList: [] }));
    }
  };

  const hospitalVal = useMemo(
    () => hospitalList.find((item) => item.hospital === projectInfo.hospital),
    [hospitalList, projectInfo.hospital]
  );

  return (
    <Grid container>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Project Information</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps}>
          <Autocomplete
            value={hospitalVal || null}
            options={hospitalList}
            disabled={isMyApproval || isMyRequest}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            onChange={(e, data) => {
              fieldsUpdateHandler({ field: 'hospital', data: data?.hospital || '' });
            }}
            onBlur={() => {
              dispatch(setTouch({ field: 'projectInfo', data: { hospital: true } }));
              getBlockData();
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Institution *"
                error={Boolean(errors?.hospital) && Boolean(touches?.hospital)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...TextAreaProps}
            label="Remarks"
            minRows={3}
            onBlur={() => {
              dispatch(setTouch({ field: 'projectInfo', data: { remark: true } }));
            }}
            error={Boolean(errors?.remark) && Boolean(touches?.remark)}
            disabled={isMyApproval || isMyRequest}
            value={projectInfo.remark}
            onChange={(e) => {
              const data = e?.target?.value || '';
              fieldsUpdateHandler({ field: 'remark', data });
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(ProjectInformation);
