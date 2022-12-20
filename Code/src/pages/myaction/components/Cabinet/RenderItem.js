import React, { memo } from 'react';
import {
  Grid,
  Typography,
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
// import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import API from '../../../../api/webdp/webdp';
import { HAKeyboardDatePicker } from '../../../../components';
import { commonProps2, commonProps4, autocompleteProps } from './FormControlProps';

const useStyles = makeStyles((theme) => ({
  renderItemRoot: {
    paddingBottom: theme.spacing(4),
    borderBottom: '3px solid #0F3E5B',
    marginTop: theme.spacing(3)
  },
  renderItemBox: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}));

const RenderItem = ({
  item,
  isDetail,
  errors,
  touched,
  index,
  optionsData,
  handleChange,
  setFieldValue,
  contractNo
  // values: { portItems }
}) => {
  const { statusSelect, partNoList, closetLocationVoList } = optionsData;
  const classes = useStyles();

  // 生成CabinetId
  const generateCabinetId = () => {
    console.log('generateCabinetId');
    const closetId = item?.closetId;
    const partNo = item?.partNo;
    if (closetId && partNo && contractNo && !item?.cabinetId) {
      API.generateCabinetId({
        closetId,
        partNo,
        contractNo
      }).then((res) => {
        console.log(res);
        if (res?.data?.data) {
          setFieldValue(`portItems[${index}].cabinetId`, res?.data?.data || '');
        }
      });
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" className={classes.renderItemRoot}>
      <Typography variant="h6">Cabinet Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Closet Location */}
        <Grid {...commonProps4}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            options={closetLocationVoList || []}
            getOptionLabel={(option) => `${option?.closetId}`}
            // value={item?.closetId || null}
            inputValue={item?.closetId || ''}
            filterOptions={(options) => options}
            disableClearable
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].closetId`, value.closetId || '');
              item.closetId = value.closetId;
              setTimeout(() => {
                generateCabinetId();
              }, 300);
            }}
            name={`portItems[${index}].closetId`}
            renderInput={(params) => (
              <TextField {...params} {...autocompleteProps} label="Closet Location" />
            )}
          />
          {/* <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Closet Location</InputLabel>
            <Select
              label="Closet Location"
              disabled={isDetail}
              name={`portItems[${index}].closetId`}
              onChange={(e, params) => {
                const value = params?.props?.value || '';
                setFieldValue(`portItems[${index}].closetId`, value || '');
              }}
              value={item?.closetId || ''}
            >
              {closetLocationVoList.map((item) => (
                <MenuItem key={item.id} item={item} value={item.closetId}>
                  {item.closetId}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Grid>

        {/* Part No */}
        <Grid {...commonProps2}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            options={partNoList || []}
            getOptionLabel={(option) =>
              `${option?.PartNo} - ${option?.ShortDesc} - ${option?.Size}`
            }
            inputValue={item?.partNo || ''}
            filterOptions={(options) => options}
            disableClearable
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].partNo`, value?.PartNo || '');
              item.partNo = value?.PartNo;
              setFieldValue(`portItems[${index}].cabinetDesc`, value?.ShortDesc || '');
              setTimeout(() => {
                generateCabinetId();
              }, 300);
            }}
            name={`portItems[${index}].partNo`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...autocompleteProps}
                error={Boolean(errors?.partNo && touched?.partNo)}
                label="Part No"
              />
            )}
          />
        </Grid>

        {/* Description */}
        <Grid {...commonProps4}>
          <TextField
            {...autocompleteProps}
            label="Description"
            fullWidth
            disabled
            name={`portItems[${index}].cabinetDesc`}
            error={Boolean(errors?.cabinetDesc && touched?.cabinetDesc)}
            value={item?.cabinetDesc || ''}
          />
        </Grid>

        {/* Cabinet Size (WxDxH) */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Cabinet Size (WxDxH)"
            fullWidth
            disabled
            name={`portItems[${index}].cabinetSize`}
            onChange={handleChange}
            error={Boolean(errors?.cabinetSize && touched?.cabinetSize)}
            value={item?.cabinetSize || ''}
          />
        </Grid>

        {/* Equip. ID */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Equip. ID"
            fullWidth
            disabled={isDetail}
            name={`portItems[${index}].HAEquipId`}
            onChange={handleChange}
            error={Boolean(errors?.HAEquipId && touched?.HAEquipId)}
            value={item?.HAEquipId || ''}
          />
        </Grid>

        {/* Cabinet Key No */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Cabinet Key No"
            fullWidth
            disabled={isDetail}
            name={`portItems[${index}].keyLabel`}
            onChange={handleChange}
            error={Boolean(errors?.keyLabel && touched?.keyLabel)}
            value={item?.keyLabel || ''}
          />
        </Grid>

        {/* Delivery Note */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Delivery Note"
            fullWidth
            disabled={isDetail}
            name={`portItems[${index}].deliveryNote`}
            onChange={handleChange}
            error={Boolean(errors?.deliveryNote && touched?.deliveryNote)}
            value={item?.deliveryNote || ''}
          />
        </Grid>

        {/* Status */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              disabled={isDetail}
              name={`portItems[${index}].status`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].status`, params?.props?.value || '');
              }}
              value={item?.status || ''}
            >
              {statusSelect.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Remarks */}
        <Grid {...commonProps4}>
          <TextField
            {...autocompleteProps}
            label="Remarks"
            fullWidth
            disabled={isDetail}
            name={`portItems[${index}].remark`}
            onChange={handleChange}
            error={Boolean(errors?.remark && touched?.remark)}
            value={item?.remark || ''}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Installation Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Target Date */}
        <Grid {...commonProps2}>
          <HAKeyboardDatePicker
            name={`portItems[${index}].targetDate`}
            {...autocompleteProps}
            label="Target Date"
            disabled={isDetail}
            value={item?.targetDate || ''}
            onChange={(value) => {
              setFieldValue(`portItems[${index}].targetDate`, value || '');
            }}
            fullWidth
          />
        </Grid>

        {/* DOB */}
        <Grid {...commonProps2}>
          <HAKeyboardDatePicker
            name={`portItems[${index}].acceptDate`}
            {...autocompleteProps}
            label="DOB"
            disabled={isDetail}
            value={item?.acceptDate || ''}
            onChange={(value) => {
              setFieldValue(`portItems[${index}].acceptDate`, value || '');
            }}
            fullWidth
          />
        </Grid>

        {/* Contact Person */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Contact Person"
            fullWidth
            disabled
            name={`portItems[${index}].contactPerson`}
            onChange={handleChange}
            error={Boolean(errors?.contactPerson && touched?.contactPerson)}
            value={item?.contactPerson || ''}
          />
        </Grid>

        {/* Phone */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Phone"
            fullWidth
            disabled
            name={`portItems[${index}].phone`}
            onChange={handleChange}
            error={Boolean(errors?.phone && touched?.phone)}
            value={item?.phone || ''}
          />
        </Grid>

        {/* Email */}
        <Grid {...commonProps4}>
          <TextField
            {...autocompleteProps}
            label="Email"
            fullWidth
            disabled
            name={`portItems[${index}].email`}
            onChange={handleChange}
            error={Boolean(errors?.email && touched?.email)}
            value={item?.email || ''}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(RenderItem);
