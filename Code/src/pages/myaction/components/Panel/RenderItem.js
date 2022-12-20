import React, { memo, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
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
import { commonProps2, commonProps4, commonProps6, autocompleteProps } from './FormControlProps';

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
  values: { cabinetOptions },
  contractNo,
  reqNo
}) => {
  const classes = useStyles();
  const { closetLocationVoList, partNoList, statusSelect } = optionsData;

  // 数据初始化
  useEffect(() => {
    // 初始化Cabinet
    if (item?.closetid) getCabinetOptions(item?.closetid);
  }, []);

  // 根据closet ID获取 Cabinet Option
  /**
   *
   * @param {*} value
   */
  const getCabinetOptions = (value) => {
    if (!Object.prototype.hasOwnProperty.call(cabinetOptions, value || '')) {
      API.getCabinetIDList({ closetID: value }).then((res) => {
        const resData = res?.data?.data || [];
        setFieldValue(`cabinetOptions`, {
          ...cabinetOptions,
          [value]: resData
        });
      });
    }
  };

  // 生成RefId
  const generateRefId = () => {
    console.log(item);
    const closetId = item?.closetid;
    const partNo = item?.partno;
    console.log(closetId, partNo);
    console.log(contractNo, item?.equipid);
    if (closetId && partNo && contractNo && !item?.equipid) {
      API.generateRefId({
        reqNo,
        partNo,
        contractNo
      }).then((res) => {
        console.log(res);
        if (res?.data?.data) {
          setFieldValue(`portItems[${index}].equipid`, res?.data?.data || '');
        }
      });
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" className={classes.renderItemRoot}>
      <Typography variant="h6">Panel Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Ref. ID */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Ref. ID"
            fullWidth
            disabled
            name={`portItems[${index}].equipid`}
            onChange={handleChange}
            error={Boolean(errors?.equipid && touched?.equipid)}
            value={item?.equipid || ''}
          />
        </Grid>

        {/* Closet Location && Cabinet ID */}
        <Grid {...commonProps4}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={closetLocationVoList || []}
                  getOptionLabel={(option) => `${option?.closetId}`}
                  // value={item?.closetId || null}
                  inputValue={item?.closetid || ''}
                  filterOptions={(options) => options}
                  // disableClearable
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].closetid`, value?.closetId || '');
                    item.closetid = value?.closetId;
                    getCabinetOptions(value.closetId);
                    setTimeout(() => {
                      generateRefId();
                    }, 300);
                  }}
                  name={`portItems[${index}].closetid`}
                  renderInput={(params) => (
                    <TextField {...params} {...autocompleteProps} label="Closet Location" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={cabinetOptions?.[item?.closetid] || []}
                  value={item?.cabinetid || null}
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].cabinetid`, value || '');
                  }}
                  name={`portItems[${index}].cabinetid`}
                  renderInput={(params) => (
                    <TextField {...params} {...autocompleteProps} label="Cabinet ID" />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Panel ID */}
        <Grid {...commonProps6}>
          <Grid container spacing={2}>
            <Grid {...commonProps4}>
              <TextField
                {...autocompleteProps}
                label="Panel ID"
                fullWidth
                name={`portItems[${index}].panelid`}
                onChange={handleChange}
                error={Boolean(errors?.panelid && touched?.panelid)}
                value={item?.panelid || ''}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Part No. */}
        <Grid {...commonProps2}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            options={partNoList || []}
            getOptionLabel={(option) =>
              `${option?.PartNo} - ${option?.ShortDesc} - ${option?.Size}`
            }
            inputValue={item?.partno || ''}
            filterOptions={(options) => options}
            disableClearable
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].partno`, value?.PartNo || '');
              item.partno = value?.PartNo;
              setFieldValue(`portItems[${index}].modeldesc`, value?.ShortDesc || '');

              setTimeout(() => {
                generateRefId();
              }, 300);
            }}
            name={`portItems[${index}].partno`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...autocompleteProps}
                error={Boolean(errors?.partno && touched?.partno)}
                label="Part No."
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
            name={`portItems[${index}].modeldesc`}
            error={Boolean(errors?.modeldesc && touched?.modeldesc)}
            value={item?.modeldesc || ''}
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

        {/* Delivery Note */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Delivery Note"
            fullWidth
            disabled={isDetail || !item?.deliverynote}
            name={`portItems[${index}].deliverynote`}
            onChange={handleChange}
            error={Boolean(errors?.deliverynote && touched?.deliverynote)}
            value={item?.deliverynote || ''}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Installation Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Target Date */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
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
          </FormControl>
        </Grid>

        {/* DOB */}
        <Grid {...commonProps2}>
          <HAKeyboardDatePicker
            name={`portItems[${index}].acceptancedate`}
            {...autocompleteProps}
            label="DOB"
            disabled={isDetail}
            value={item?.acceptancedate || ''}
            onChange={(value) => {
              setFieldValue(`portItems[${index}].acceptancedate`, value || '');
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
