import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropsType from 'prop-types';
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  updateApDpDetails,
  setFloorOption,
  clearFloor
} from '../../../../../redux/webDP/webDP-actions';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import RadioProps from '../../../../../models/webdp/PropsModels/RadioProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import API from '../../../../../api/webdp/webdp';

const LocationDetailsControl = ({ dfi, index }) => {
  const formType = useSelector((state) => state.webDP.formType);
  // use for define if on Detail page
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const blockByHospCodeList = useSelector((state) => state.webDP.apDpDetails.blockByHospCodeList);
  const hospitalLocation = useSelector((state) => state.webDP.serviceRequired.hospitalLocation); // 选中的医院对象
  const blockError = useSelector((state) => state.webDP.error.dpDetails[index].block);
  const floorError = useSelector((state) => state.webDP.error.dpDetails[index].floor);
  const publicAreasError = useSelector((state) => state.webDP.error.dpDetails[index].publicAreas);
  // const icmError = useSelector((state) => state.webDP.error.dpDetails[index].icm);
  // const awpError = useSelector((state) => state.webDP.error.dpDetails[index].awp);
  const dispatch = useDispatch();
  const [publicAreasWarning, setPublicAreasWarning] = useState(false);
  const fieldsUpdateHandler = (e) => {
    console.log(
      'fieldsUpdateHandler',
      e.currentTarget.id,
      e.currentTarget.value,
      e.currentTarget.row
    );
    dispatch(updateApDpDetails(e));
  };
  const titleColor = useWebDPColor().typography;
  const blockOptions = blockByHospCodeList?.map((blockItem) => blockItem.block) || [];
  const floorOptions = dfi.locationInformation?.blockAndFloorByHospCodeList?.map(
    (floorItem) => floorItem.floor || []
  );

  // 楼层离焦 同步数据
  const handleSyncData = (e) => {
    const hospital = hospitalLocation?.hospital || '';
    const block = dfi?.locationInformation?.block || '';
    const floor = e?.target?.value || '';
    if (index === 0 && hospital && block && floor) {
      API.closetSync({ block, floor, hospital });
    }
  };

  return (
    <Grid item xs={12} lg={5} md={5}>
      <Grid container>
        <Grid {...FormControlProps}>
          <Typography variant="h6" style={{ color: titleColor }}>
            Location Details
          </Typography>
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Department"
            value={dfi.locationInformation.department}
            id={`${index}-locationInformation-department`}
            onChange={fieldsUpdateHandler}
            disabled={viewOnly}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            id={`${index}-locationInformation-block`}
            value={dfi.locationInformation.block}
            options={blockOptions}
            onChange={(e, value) => {
              const newBlock = {
                currentTarget: {
                  id: `${index}-locationInformation-block`,
                  value: value || ''
                }
              };
              fieldsUpdateHandler(newBlock);
              dispatch(clearFloor(index)); // 清空floor
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Block *"
                onChange={fieldsUpdateHandler}
                error={blockError}
              />
            )}
            onBlur={() => {
              // 失焦后获取Floor下拉列表数据
              if (dfi.locationInformation?.block && hospitalLocation?.hospital) {
                const floorParams = {
                  block: dfi.locationInformation.block,
                  hospCode: hospitalLocation.hospital
                };

                API.getBlockAndFloorByHospCodeList(floorParams).then((floorResult) => {
                  const blockAndFloorByHospCodeList =
                    floorResult?.data?.data?.blockAndFloorByHospCodeList || [];
                  const newFloorOption = {
                    data: blockAndFloorByHospCodeList,
                    index
                  };
                  dispatch(setFloorOption(newFloorOption));
                });
              }
            }}
            disabled={viewOnly}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            id={`${index}-locationInformation-floor`}
            value={dfi.locationInformation.floor}
            options={floorOptions}
            onChange={(e, value) => {
              const newFloor = {
                currentTarget: {
                  id: `${index}-locationInformation-floor`,
                  value: value || ''
                }
              };
              fieldsUpdateHandler(newFloor);
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Floor *"
                onChange={fieldsUpdateHandler}
                onBlur={handleSyncData}
                error={floorError}
              />
            )}
            disabled={viewOnly}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Room / Ward"
            id={`${index}-locationInformation-roomOrWard`}
            value={dfi.locationInformation.roomOrWard}
            onChange={fieldsUpdateHandler}
            disabled={viewOnly}
          />
        </Grid>
        <>
          {formType === 'DP' && (
            <>
              <FormControl
                {...RadioProps}
                onMouseOver={() => setPublicAreasWarning(true)}
                onMouseLeave={() => setPublicAreasWarning(false)}
                error={publicAreasError}
                disabled={viewOnly}
              >
                <FormLabel component="legend">Located at Public Areas *</FormLabel>
                <RadioGroup
                  aria-label="publicAreas"
                  name="publicAreas"
                  style={{ flexDirection: 'row' }}
                  defaultValue={null}
                  value={dfi.locationInformation.publicAreas}
                  onChange={fieldsUpdateHandler}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio id={`${index}-locationInformation-publicAreas`} />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio id={`${index}-locationInformation-publicAreas`} />}
                    label="No"
                  />
                </RadioGroup>
                {publicAreasWarning && (
                  <FormHelperText style={{ color: titleColor }}>
                    Public areas mean areas that can be reached by the public without specific
                    access arrangement, eg. lift lobbies, waiting halls, counters, canteens. Wards,
                    laboratories and office are not included
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}

          <FormControl {...RadioProps} disabled={viewOnly}>
            <FormLabel component="legend">Dust Control</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="icm"
              style={{ flexDirection: 'row' }}
              value={dfi.locationInformation.icm}
              onChange={fieldsUpdateHandler}
            >
              <FormControlLabel
                value={1}
                control={<Radio id={`${index}-locationInformation-icm`} />}
                label="Yes"
              />
              <FormControlLabel
                value={0}
                control={<Radio id={`${index}-locationInformation-icm`} />}
                label="No"
              />
            </RadioGroup>
            {dfi.locationInformation.icm === 0 && (
              <FormHelperText style={{ color: titleColor }}>
                If actual environment requires Dust Control, related cost will be billed
              </FormHelperText>
            )}
          </FormControl>
          <FormControl {...RadioProps} disabled={viewOnly}>
            <FormLabel component="legend">Aerial Working Platform</FormLabel>
            <RadioGroup
              aria-label="awp"
              name="awp"
              style={{ flexDirection: 'row' }}
              value={dfi.locationInformation.awp}
              onChange={fieldsUpdateHandler}
            >
              <FormControlLabel
                value={1}
                control={<Radio id={`${index}-locationInformation-awp`} />}
                label="Yes"
              />
              <FormControlLabel
                value={0}
                control={<Radio id={`${index}-locationInformation-awp`} />}
                label="No"
              />
            </RadioGroup>
            {dfi.locationInformation.awp === 0 && (
              <FormHelperText style={{ color: titleColor }}>
                If actual environment requires Aerial Working Platform, related cost will be billed
              </FormHelperText>
            )}
          </FormControl>
        </>
      </Grid>
    </Grid>
  );
};

LocationDetailsControl.propTypes = {
  FromcontrolProps: PropsType.object,
  InputProps: PropsType.object,
  RowTitleProps: PropsType.object,
  index: PropsType.number,
  dfi: PropsType.object
};

export default LocationDetailsControl;
