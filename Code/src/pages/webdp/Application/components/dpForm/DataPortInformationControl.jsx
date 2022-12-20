import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
  FormHelperText,
  IconButton
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  removeFloorPlan,
  updateApDpDetails,
  addFloorPlan
} from '../../../../../redux/webDP/webDP-actions';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import WarningDialog from '../../../../../components/WarningDialog';
import CommonTip from '../../../../../components/CommonTip';
import fileAPI from '../../../../../api/file/file';
import { uploadFileCheck } from '../../../../../utils/auth';
import downBySharedDisk from '../../../../../utils/downBySharedDisk';

const DataPortInformationControl = ({ index }) => {
  const formType = useSelector((state) => state.webDP.formType);
  const [open, setOpen] = useState(false); // open delete dialog

  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const dfi = useSelector((state) => state.webDP.apDpDetails.items[index]);

  // floor plan = [ { id: dfi.key, file: e.currentTarget.files[0] } ]
  const floorPlans = useSelector((state) => state.webDP.apDpDetails.floorPlan);
  const curentFloorPlan = floorPlans.find((fp) => fp.key === dfi.key);

  // Errors flag
  const amountError = useSelector((state) => state.webDP.error.dpDetails[index].amount);
  const serviceTypeError = useSelector((state) => state.webDP.error.dpDetails[index].service.type);
  const otherServiceError = useSelector(
    (state) => state.webDP.error.dpDetails[index].service.others
  );
  const existingLocationError = useSelector(
    (state) => state.webDP.error.dpDetails[index].service.existingLocation
  );
  const secondaryDataPortIDError = useSelector(
    (state) => state.webDP.error.dpDetails[index].service.secondaryDataPortID
  );
  const serviceTypeOption = useSelector((state) => state.webDP.apDpDetails.serviceTypeOption);
  const conduitTypeOption = useSelector((state) => state.webDP.apDpDetails.conduitTypeOption);
  const conduitError = useSelector((state) => state.webDP.error.dpDetails[index].conduitType);
  const projectError = useSelector((state) => state.webDP.error.dpDetails[index].project.project);
  const otherProjectError = useSelector(
    (state) => state.webDP.error.dpDetails[index].project.others
  );
  const externalNetworkError = useSelector(
    (state) => state.webDP.error.dpDetails[index]?.externalNetworkRequirement
  );
  // end of Error flag

  const projectList = useSelector((state) => state.webDP.apDpDetails.projectList);
  const dispatch = useDispatch();
  const fieldsUpdateHandler = (e) => {
    dispatch(updateApDpDetails(e));
  };

  // add floor plan to floor plan arrary
  const floorPlanHandler = (e) => {
    const file = e.currentTarget.files[0];
    if (uploadFileCheck(file)) dispatch(addFloorPlan(dfi.key, file));
  };

  // remove file for by dfi key
  const removeFloorPlanHandler = () => {
    if (curentFloorPlan?.file?.id) {
      setOpen(true);
    } else {
      dispatch(removeFloorPlan(dfi.key));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // delete confirm event
  const handleConfirm = () => {
    fileAPI.deleteFile(curentFloorPlan?.file?.id).then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('The file has been remotely deleted');
        dispatch(removeFloorPlan(dfi.key));
        handleClose();
      }
    });
  };

  const color = useWebDPColor().typography;

  const getExistingLabel = () => {
    if (formType === 'AP') {
      return 'Existing AP ID *';
    }
    if (formType === 'DP' && dfi.dataPortInformation.service.type === 'R') {
      return 'Existing Data Port ID *';
    }

    if (formType === 'DP' && dfi.dataPortInformation.service.type === 'L') {
      return 'Existing Data Port ID 1 *';
    }
    return '';
  };

  const getAmountsDisabled = () => {
    if (viewOnly) {
      return true;
    }

    const { type } = dfi.dataPortInformation?.service || {};
    return type === 'R' || type === 'L';
  };

  const getConduitTypeOption = () => {
    if (dfi.dataPortInformation.conduitType === 'P') {
      return conduitTypeOption;
    }
    return conduitTypeOption.filter((item) => item.remark !== 'P');
  };

  const getServiceTypeOption = () => {
    if (dfi.dataPortInformation?.projectInfo?.project?.remarks === 'MNI') {
      return serviceTypeOption.filter((item) => item.remark !== 'D' && item.remark !== 'L');
    }

    return serviceTypeOption;
  };

  const projectString = dfi.dataPortInformation.projectInfo.project?.project;

  return (
    <Grid item xs={12} lg={4} md={4}>
      <Grid container>
        <Grid {...FormControlProps}>
          <Typography variant="h6" style={{ color }}>
            {formType === 'AP' ? 'WLAN AP Information' : 'Data Port Information'}
          </Typography>
        </Grid>
        {formType === 'DP' && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              type="number"
              label="Quantity of Service Required"
              id={`${index}-amount`}
              value={dfi.amount}
              error={amountError}
              onChange={fieldsUpdateHandler}
              disabled={getAmountsDisabled()}
            />
          </Grid>
        )}
        <Grid {...FormControlProps}>
          <FormControl {...FormControlInputProps} error={serviceTypeError}>
            <InputLabel htmlFor={`${index}-dataPortInformation-service-type`}>
              Service Type *
            </InputLabel>
            <Select
              native
              label="Service Type *"
              value={dfi.dataPortInformation.service.type}
              onChange={(e) => {
                fieldsUpdateHandler(e);
                if (e.target.value === 'R' || e.target.value === 'L') {
                  const newAmount = {
                    currentTarget: {
                      id: `${index}-amount`,
                      value: 1
                    }
                  };
                  fieldsUpdateHandler(newAmount);
                }
              }}
              inputProps={{
                name: `${index}-dataPortInformation-service-type`,
                id: `${index}-dataPortInformation-service-type`
              }}
              disabled={viewOnly}
            >
              <option aria-label="None" value="" />

              {getServiceTypeOption().map((serviceItem) => (
                <option key={serviceItem.id} value={serviceItem.remark}>
                  {serviceItem.optionValue}
                </option>
              ))}
              <option value="O">Others</option>
            </Select>
            {dfi.dataPortInformation.service.type === 'R' && (
              <FormHelperText style={{ color }}>
                The original data port will be disabled 1 month after the new data port is installed
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {dfi.dataPortInformation.service.type === 'O' && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              label="Please specify the Service Type *"
              id={`${index}-dataPortInformation-service-others`}
              value={dfi.dataPortInformation.service.others}
              onChange={fieldsUpdateHandler}
              error={otherServiceError}
              disabled={viewOnly}
            />
          </Grid>
        )}
        {(dfi.dataPortInformation.service.type === 'R' ||
          dfi.dataPortInformation.service.type === 'L') && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              label={getExistingLabel()}
              id={`${index}-dataPortInformation-service-existingLocation`}
              value={dfi.dataPortInformation.service.existingLocation}
              onChange={fieldsUpdateHandler}
              error={existingLocationError}
              disabled={viewOnly}
            />
          </Grid>
        )}
        {formType === 'DP' && dfi.dataPortInformation.service.type === 'L' && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              label="Existing Data Port ID 2 *"
              id={`${index}-dataPortInformation-service-secondaryDataPortID`}
              value={dfi.dataPortInformation.service.secondaryDataPortID}
              onChange={fieldsUpdateHandler}
              error={secondaryDataPortIDError}
              disabled={viewOnly}
            />
          </Grid>
        )}
        {formType === 'DP' && (
          <Grid {...FormControlProps}>
            <FormControl {...FormControlInputProps} error={conduitError}>
              <InputLabel htmlFor={`${index}-dataPortInformation-service-type`}>
                Conduit Type *
              </InputLabel>
              <Select
                native
                label="Conduit Type * "
                value={dfi.dataPortInformation.conduitType}
                onChange={fieldsUpdateHandler}
                inputProps={{
                  name: `${index}-dataPortInformation-conduitType`,
                  id: `${index}-dataPortInformation-conduitType`
                }}
                disabled={viewOnly}
              >
                <option aria-label="None" value="" />
                {getConduitTypeOption().map((conduitItem) => (
                  <option key={conduitItem.id} value={conduitItem.remark}>
                    {conduitItem.optionValue}
                  </option>
                ))}
                {/* <option value="Metallic">Metallic</option>
                <option value="Plastic">Plastic</option>
                <option value="None">None</option> */}
              </Select>
              {dfi.dataPortInformation.conduitType === 'P' && (
                <FormHelperText style={{ color }}>
                  Please seek and provide approval from Facility Management of the hospital
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
        <Grid {...FormControlProps}>
          <FormControl {...FormControlInputProps}>
            <Autocomplete
              id={`${index}-dataPortInformation-projectInfo-project`}
              value={
                dfi.dataPortInformation?.projectInfo?.project.project
                  ? dfi.dataPortInformation.projectInfo.project
                  : null
              }
              options={projectList}
              getOptionSelected={(option, value) => option?.project === value?.project}
              getOptionLabel={(option) =>
                option.description ? `${option.project}---${option.description}` : option.project
              }
              renderOption={(row) => (
                <span style={{ color: row.remarks === 'MNI' ? '#078080' : '' }}>
                  {row.project}
                  {row.description ? '---' : ''}
                  {row.description || ''}
                </span>
              )}
              onChange={(e, value) => {
                const newProject = {
                  currentTarget: {
                    id: `${index}-dataPortInformation-projectInfo-project`,
                    value: value || {}
                  }
                };
                fieldsUpdateHandler(newProject);
              }}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  {...FormControlInputProps}
                  label="Project *"
                  // onChange={fieldsUpdateHandler}
                  error={projectError}
                />
              )}
              disabled={viewOnly}
            />
          </FormControl>
        </Grid>
        {projectString === 'Others' && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              label="Please specify a Project *"
              id={`${index}-dataPortInformation-projectInfo-others`}
              value={dfi.dataPortInformation.projectInfo.others}
              onChange={fieldsUpdateHandler}
              error={otherProjectError}
              disabled={viewOnly}
            />
          </Grid>
        )}
        {projectString === 'Others-External Network' && (
          <Grid {...FormControlProps}>
            <TextField
              {...FormControlInputProps}
              label="Please specify a Project *"
              id={`${index}-dataPortInformation-externalNetworkRequirement`}
              value={dfi.dataPortInformation.externalNetworkRequirement}
              onChange={fieldsUpdateHandler}
              error={externalNetworkError}
              disabled={viewOnly}
            />
          </Grid>
        )}
        {/* button for floor plan upload */}
        {formType === 'AP' && !curentFloorPlan?.key && (
          <Grid {...FormControlProps}>
            <Button
              variant="contained"
              color="primary"
              component="label"
              size="small"
              style={{ marginRight: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}
              disabled={viewOnly}
            >
              Floor Plan
              <input type="file" hidden onChange={floorPlanHandler} />
            </Button>
          </Grid>
        )}
        {/* shows file name and cancel button */}
        {formType === 'AP' && curentFloorPlan && (
          <Grid {...FormControlProps}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                wordWrap: 'break-word',
                wordBreak: 'break-all'
                // backgroundColor: curentFloorPlan?.file?.id && !viewOnly ? 'rgba(82,196,26,0.2)' : ''
              }}
            >
              {curentFloorPlan.file.name}
              <div>
                {curentFloorPlan?.file?.id && (
                  <IconButton onClick={() => downBySharedDisk(curentFloorPlan?.file?.fileUrl)}>
                    <GetAppIcon fontSize="small" color="primary" />
                  </IconButton>
                )}
                <IconButton size="small" onClick={removeFloorPlanHandler} disabled={viewOnly}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      {/* ap delete file dialog */}
      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Are you sure you want to delete file ${curentFloorPlan?.file?.name} on the remote`}
      />
    </Grid>
  );
};

export default DataPortInformationControl;
