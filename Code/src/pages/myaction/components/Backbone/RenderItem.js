import React, { memo, useEffect, useState, useCallback } from 'react';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import { HAKeyboardDatePicker } from '../../../../components';
import { commonProps6, commonProps2, commonProps4, autocompleteProps } from './FormControlProps';

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
  values,
  handleChange,
  handleBlur,
  setFieldValue
}) => {
  // console.log(portItems);
  const { cabinetAOptions, cabinetBOptions } = values;
  const classes = useStyles();
  const {
    closetLocationVoList,
    cableTypeList,
    fibreCoreQtyList,
    facePlateList,
    conduitTypeList,
    statusSelect
  } = optionsData;
  const [oldData] = useState(item); // 初始化数据
  const [isFibreCore, setIsFibreCore] = useState(true);

  // 数据初始化
  useEffect(() => {
    // 初始化Cabinet
    if (item?.closetidAend) {
      getCabinetOptions(item?.closetidAend, 'cabinetAOptions');
    }
    if (item?.closetidBend) {
      getCabinetOptions(item?.closetidBend, 'cabinetBOptions');
    }
    if (item?.cableType) {
      const cable = cableTypeList.find((v) => v.optionValue === item?.cableType);
      if (cable?.category === 'Fibre') {
        setIsFibreCore(false);
        setFieldValue(`portItems[${index}].facePlate`, 'LC Duplex');
      } else {
        setFieldValue(`portItems[${index}].facePlate`, 'RJ45');
      }
    }
  }, []);

  // 根据closet ID获取 Cabinet Option
  /**
   *
   * @param {*} value
   * @param {string} name // Object Name
   */
  const getCabinetOptions = (value, name) => {
    if (!Object.prototype.hasOwnProperty.call(values?.[name], value || '')) {
      API.getCabinetIDList({ closetID: value }).then((res) => {
        const resData = res?.data?.data || [];
        setFieldValue(name, {
          ...values?.[name],
          [value]: resData
        });
      });
    }
  };

  // 生成新的BackboneID
  const generateBackboneId = ({ closetidAend, closetidBend }) => {
    const closetIdAEnd = closetidAend || item?.closetidAend;
    const closetIdBEnd = closetidBend || item?.closetidBend;
    if (closetIdAEnd && closetIdBEnd && !item?.backboneId) {
      const params = {
        closetIdAEnd,
        closetIdBEnd,
        oldBackboneId: oldData?.backboneId
      };
      API.generateBackboneId(params).then((res) => {
        const backboneId = res?.data?.data || item.backboneId;
        setFieldValue(`portItems[${index}].backboneId`, backboneId || '');
        item.backboneId = backboneId;
      });
    }
  };

  // 校验Backbone是否唯一
  const verifyBackboneId = useCallback(
    _.debounce((value) => {
      if (value && value !== oldData.backboneId) {
        API.verifyBackboneId({ backboneId: value }).then((res) => {
          const only = res?.data?.data || false;
          setFieldValue(`portItems[${index}].onlyBackboneId`, only);
        });
      }
    }, 800),
    []
  );

  return (
    <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemRoot}>
      <Typography variant="h6">Connection Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Building Closet && Building Cabinet */}
        <Grid {...commonProps6}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={8} lg={8}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={closetLocationVoList || []}
                  // getOptionLabel={(option) => `${option?.closetId}`}
                  value={item?.closetidAend || null}
                  // inputValue={item?.closetidAend || ''}
                  // filterOptions={(options) => options}
                  // disableClearable
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].closetidAend`, value);
                    setFieldValue(`portItems[${index}].cabinetidAend`, '');
                    item.cabinetidAend = '';
                    generateBackboneId({
                      closetidAend: value
                    });
                    getCabinetOptions(value, 'cabinetAOptions');
                  }}
                  name={`portItems[${index}].closetidAend`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...autocompleteProps}
                      label="Core/Building Closet"
                      error={Boolean(errors?.closetidAend && touched?.closetidAend)}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={4} lg={4}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={cabinetAOptions?.[item?.closetidAend] || []}
                  value={item?.cabinetidAend || null}
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].cabinetidAend`, value);
                  }}
                  name={`portItems[${index}].cabinetidAend`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...autocompleteProps}
                      label="Building Cabinet"
                      error={Boolean(errors?.cabinetidAend && touched?.cabinetidAend)}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Floor Closet && Floor Cabinet */}
        <Grid {...commonProps6}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={8} lg={8}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={closetLocationVoList || []}
                  value={item?.closetidBend || null}
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].closetidBend`, value);
                    setFieldValue(`portItems[${index}].cabinetidBend`, '');
                    item.cabinetidBend = '';
                    generateBackboneId({
                      closetidBend: value
                    });
                    getCabinetOptions(value, 'cabinetBOptions');
                  }}
                  name={`portItems[${index}].closetidBend`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...autocompleteProps}
                      label="Building/Floor Closet"
                      error={Boolean(errors?.closetidBend && touched?.closetidBend)}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={4} lg={4}>
              <FormControl fullWidth {...autocompleteProps}>
                <Autocomplete
                  autoSelect
                  disabled={isDetail}
                  options={cabinetBOptions?.[item?.closetidBend] || []}
                  value={item?.cabinetidBend || null}
                  onChange={(e, value) => {
                    setFieldValue(`portItems[${index}].cabinetidBend`, value);
                  }}
                  name={`portItems[${index}].cabinetidBend`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...autocompleteProps}
                      label="Floor Cabinet"
                      error={Boolean(errors?.cabinetidBend && touched?.cabinetidBend)}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h6">Cable Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Cable Type */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Cable Type</InputLabel>
            <Select
              label="Cable Type"
              disabled={isDetail}
              name={`portItems[${index}].cableType`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].cableType`, params?.props?.value || '');
                const type = params?.props?.item?.category;
                if (type === 'Cu') {
                  setIsFibreCore(true);
                  setFieldValue(`portItems[${index}].fibreCoreQty`, '');
                  setFieldValue(`portItems[${index}].facePlate`, 'RJ45');
                } else {
                  setIsFibreCore(false);
                  setFieldValue(`portItems[${index}].facePlate`, 'LC Duplex');
                }
              }}
              value={item?.cableType || ''}
            >
              {cableTypeList.map((items) => (
                <MenuItem key={items.id} item={items} value={items.optionValue}>
                  {items.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Conduit */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Conduit</InputLabel>
            <Select
              label="Conduit"
              disabled={isDetail}
              name={`portItems[${index}].conduitType`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].conduitType`, params?.props?.value || '');
              }}
              value={item?.conduitType || ''}
            >
              {conduitTypeList.map((items) => (
                <MenuItem key={items.id} value={items.optionValue}>
                  {items.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Fibre Core */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Fibre Core</InputLabel>
            <Select
              label="Fibre Core"
              disabled={isDetail || isFibreCore}
              name={`portItems[${index}].fibreCoreQty`}
              onChange={(e, params) => {
                const value = params?.props?.value;
                if (value < oldData?.fibreCoreQty) {
                  API.verifyOutlet({
                    backboneId: oldData?.backboneId
                  }).then((res) => {
                    if (res?.data) {
                      setFieldValue(`portItems[${index}].fibreCoreQty`, value || '');
                    } else {
                      CommonTip.error(`Please select.`);
                    }
                  });
                } else {
                  setFieldValue(`portItems[${index}].fibreCoreQty`, value || '');
                }
              }}
              value={item?.fibreCoreQty || ''}
            >
              {fibreCoreQtyList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Port Outlet */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Port Outlet</InputLabel>
            <Select
              label="Port Outlet"
              disabled={isDetail}
              name={`portItems[${index}].facePlate`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].facePlate`, params?.props?.value || '');
              }}
              value={item?.facePlate || ''}
            >
              {facePlateList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Cable Length */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Cable Length"
            fullWidth
            name={`portItems[${index}].cableLength`}
            onChange={handleChange}
            error={Boolean(errors?.cableLength && touched?.cableLength)}
            value={item?.cableLength || 0}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Backbone Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Backbone ID */}
        <Grid {...commonProps4}>
          <TextField
            {...autocompleteProps}
            label="Backbone ID"
            fullWidth
            disabled={isDetail}
            name={`portItems[${index}].backboneId`}
            onChange={(e) => {
              const { value } = e.target;
              handleChange(e);
              verifyBackboneId(value);
            }}
            onBlur={handleBlur}
            error={Boolean(errors?.backboneId && touched?.backboneId)}
            helperText={errors?.backboneId && touched?.backboneId ? errors?.backboneId : ''}
            value={item?.backboneId || ''}
          />
        </Grid>

        {/* Project */}
        {/* <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Project"
            fullWidth
            disabled
            name={`portItems[${index}].project`}
            onChange={handleChange}
            error={Boolean(errors?.project && touched?.project)}
            value={item?.project || ''}
          />
        </Grid> */}

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
