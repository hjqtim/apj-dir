import React, { memo, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  makeStyles,
  Button,
  FormControl,
  InputLabel,
  Chip,
  Select,
  MenuItem
} from '@material-ui/core';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import API from '../../../../api/webdp/webdp';
import { commonProps2, commonProps4, commonProps6, autocompleteProps } from './FormControlProps';
import { HAKeyboardDatePicker, WarningDialog } from '../../../../components';

const useStyles = makeStyles((theme) => ({
  renderItemRoot: {
    marginBottom: theme.spacing(0)
  },
  buttonStyle: {
    marginRight: theme.spacing(2)
  },
  textCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'cnter'
  }
}));

const RenderDualItem = ({
  item,
  isDetail,
  errors,
  closet,
  touched,
  index,
  genOutletId,
  tip,
  formik,
  cableOptions,
  outletOptions
}) => {
  const classes = useStyles();
  const {
    handleChange,
    setFieldValue,
    values: { portItems, portIdOptions, equipmentOptions, equipModuleOptions }
  } = formik;
  const [equipPorts, setEquipPorts] = useState([]);
  const [equipModuleLoading, setEquipModuleLoading] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [portidLoading, setportidLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isSelectPortId = [];
    portItems.forEach((data) => {
      if (data?.primary?.ownEquipId === item.ownEquipId) {
        isSelectPortId.push(data?.primary?.portid);
      }
      if (data?.second?.ownEquipId === item.ownEquipId) {
        isSelectPortId.push(data?.second?.portid);
      }
    });
    let newData =
      portIdOptions?.[item.ownEquipId]?.filter((x) => !isSelectPortId.some((val) => x === val)) ||
      [];
    if (item.portid) {
      newData = [...newData, String(item.portid)];
    }
    newData.sort((a, b) => Number(a) - Number(b));
    setEquipPorts(newData);
  }, [portItems, portIdOptions]);

  // 获取下拉数据
  useEffect(() => {
    if (item.closetid) getEquipmentOptions(item.closetid);
    if (item.equipid) getEquipModule(item.equipid, false);
    if (item.ownEquipId) getEquipPort(item.ownEquipId, false);
  }, []);

  const getEquipmentOptions = (value) => {
    if (!Object.prototype.hasOwnProperty.call(equipmentOptions, value || '')) {
      setEquipmentLoading(true);
      API.getEquipment({ closetId: value })
        .then((res) => {
          const resData = res?.data?.data?.equipment || [];
          const equipmentListData = [];
          const newEquipmentMap = {};
          resData.forEach((item) => {
            if (item.equipid) {
              equipmentListData.push(item);
              newEquipmentMap[item.equipid] = item;
            }
          });
          equipmentListData.sort((a, b) => `${a.equipid}`?.localeCompare(`${b.equipid}`));
          setFieldValue('equipmentOptions', {
            ...equipmentOptions,
            [value]: equipmentListData,
            [`${value}Map`]: newEquipmentMap
          });
          //
        })
        .finally(() => {
          setEquipmentLoading(false);
        });
    }
  };

  /**
   *
   * @param {*} value
   * @param {*} isSelect 是否是手动选择的
   */
  const getEquipModule = (value, isSelect) => {
    if (!Object.prototype.hasOwnProperty.call(equipModuleOptions, value || '')) {
      setEquipModuleLoading(true);
      API.getEquipModule({ equipId: value })
        .then((res) => {
          const resData = res?.data?.data?.equipModule || [];
          // 返回的数据中是否存在 moduleDesc 是 Buit-in port的，有则自动填充
          const isExitBuitInPort = resData?.find((item) => item?.moduleDesc === 'Buit-in port');
          const ListData = [];
          const DataMap = {};
          resData.forEach((item) => {
            if (item.ownEquipId) {
              ListData.push(item);
              DataMap[item.ownEquipId] = item;
            }
          });
          setFieldValue('equipModuleOptions', {
            ...equipModuleOptions,
            [value]: ListData,
            [`${value}Map`]: DataMap
          });

          if (!_.isUndefined(isExitBuitInPort) && isSelect) {
            getEquipPort(isExitBuitInPort?.ownEquipId, true);
          }
        })
        .finally(() => {
          setEquipModuleLoading(false);
        });
    } else {
      const equipModuleData = equipModuleOptions?.[value] || [];
      const isExitBuitInPort = equipModuleData?.find((item) => item?.moduleDesc === 'Buit-in port');
      if (!_.isUndefined(isExitBuitInPort) && isSelect) {
        getEquipPort(isExitBuitInPort?.ownEquipId, true);
      }
    }
  };

  /**
   *
   * @param {*} value
   * @param {*} isSelect 是否是手动选择的
   */
  const getEquipPort = (value, isSelect) => {
    if (!Object.prototype.hasOwnProperty.call(portIdOptions, value || '')) {
      setportidLoading(true);
      API.getEquipPort({ equipId: value })
        .then((res) => {
          const resData = res?.data?.data?.equipPorts || [];
          const newData = resData.map((item) => String(item?.portid || ''));
          autoFillPortId2(newData, value, isSelect);
          setFieldValue('portIdOptions', {
            ...portIdOptions,
            [value]: newData
          });
        })
        .finally(() => {
          setportidLoading(false);
        });
    } else {
      autoFillPortId2(portIdOptions?.[value], value, isSelect);
    }
  };

  // 生成 key 名
  const genName = (field, idx = index) =>
    tip === 'Primary' ? `portItems[${idx}].primary.${field}` : `portItems[${idx}].second.${field}`;

  // 自动填充 portId
  const autoFillPortId = (value) => {
    setFieldValue(genName('outletid'), '');
    setFieldValue(genName('portid'), value || '');
    // 选出需要填充的事数据
    const key = tip === 'Primary' ? 'primary' : 'second';

    const underPortItems = [];
    if (value) {
      portItems.forEach((itemData, idx) => {
        if (idx === index) {
          underPortItems.push(null);
        } else if (idx !== index) {
          if (
            itemData?.[key]?.portid ||
            idx < index ||
            itemData?.[key]?.ownEquipId !== item?.ownEquipId
          ) {
            underPortItems.push(null);
          } else {
            underPortItems.push(itemData);
          }
        }
      });
      let valueIndex = equipPorts?.indexOf(value);

      underPortItems.forEach((itemData, idx) => {
        if (!_.isNull(itemData) && equipPorts?.[valueIndex + 1]) {
          valueIndex += 1;
          setFieldValue(genName('portid', idx), equipPorts?.[valueIndex] || '');
          item.portid = equipPorts?.[valueIndex] || '';
        }
      });
      setTimeout(() => {
        setFieldValue(genName('portid'), value || '');
      }, 0);
    }
  };
  // 选择 equipModule时填充  portId
  const autoFillPortId2 = (equipPortsData, value, isSelect) => {
    const key = tip === 'Primary' ? 'primary' : 'second';
    if (isSelect) {
      // 自动填充Value
      portItems.forEach((itemData, idx) => {
        if (!itemData?.[key]?.ownEquipId && itemData?.[key]?.equipid === item.equipid) {
          setFieldValue(genName('ownEquipId', idx), value);
          if (tip === 'Primary') {
            itemData.primary.ownEquipId = value;
          } else {
            itemData.second.ownEquipId = value;
          }
        }
      });

      // 记录页面中已经存在的 portid
      const isSelectPortId = [];
      portItems.forEach((data) => {
        if (data?.primary?.ownEquipId === item.ownEquipId) {
          isSelectPortId.push(data?.primary?.portid);
        }
        if (data?.second?.ownEquipId === item.ownEquipId) {
          isSelectPortId.push(data?.second?.portid);
        }
      });
      // 过滤掉页面中 portid
      equipPortsData =
        equipPortsData?.filter((x) => !isSelectPortId.some((val) => x === val)) || [];

      // 选出要填充的数据
      const underPortItems = [];
      portItems.forEach((itemData) => {
        if (itemData?.[key]?.portid || itemData?.[key]?.ownEquipId !== item?.ownEquipId) {
          underPortItems.push(null);
        } else {
          underPortItems.push(itemData);
        }
      });
      let valueIndex = 0;

      // 填充数据
      underPortItems.forEach((itemData, idx) => {
        if (!_.isNull(itemData) && equipPortsData?.[valueIndex]) {
          setFieldValue(genName('portid', idx), equipPortsData?.[valueIndex] || '');
          item.portid = equipPortsData?.[valueIndex] || '';
          valueIndex += 1;
        }
      });
    }
  };
  // 生成 OutletId
  const handleGenOutletId = () => {
    const queryData = [
      {
        closetId: item.closetid,
        equipId: item.equipid
      }
    ];
    genOutletId(queryData, [{ index, type: tip === 'Primary' ? 'primary' : 'second' }]);
    setOpen(false);
  };

  const btnProps = { color: 'primary', variant: 'contained', className: classes.buttonStyle };
  return (
    <Grid container spacing={2} alignItems="center" className={classes.renderItemRoot}>
      <Grid item xs={12} style={{ padding: '0 0 0 6px' }}>
        {tip || ''}
      </Grid>
      <Grid {...commonProps2}>
        <Autocomplete
          autoSelect
          disabled={isDetail}
          name={genName('closetid')}
          value={closet?.includes(item?.closetid) ? item?.closetid : null}
          options={closet || []}
          onChange={(e, value) => {
            setFieldValue(genName('closetid'), value || '');
            item.closetid = value || '';
            setFieldValue(genName('equipid'), '');
            item.equipid = '';
            setFieldValue(genName('ownEquipId'), '');
            item.ownEquipId = '';
            setFieldValue(genName('portid'), '');
            item.portid = '';
            setFieldValue(genName('outletid'), '');
            item.outletid = '';

            if (value) getEquipmentOptions(value);

            // 自动填充Value
            portItems.forEach((itemData, idx) => {
              const type = tip === 'Primary' ? 'primary' : 'second';
              if (!itemData?.[type]?.closetid) {
                setFieldValue(genName('closetid', idx), value);
              }
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...autocompleteProps}
              error={Boolean(errors?.closetid && touched?.closetid)}
              label="Closet ID"
            />
          )}
        />
      </Grid>
      <Grid {...commonProps4}>
        <Autocomplete
          disabled={isDetail}
          autoSelect
          loading={equipmentLoading}
          name={genName('equipid')}
          getOptionLabel={(option) =>
            `${option.ipaddress}---${option.modeldesc}---${option.status}`
          }
          value={equipmentOptions?.[`${item?.closetid}Map`]?.[item?.equipid] || null}
          options={equipmentOptions?.[item?.closetid] || []}
          onChange={(e, value) => {
            setFieldValue(genName('equipid'), value?.equipid || '');
            item.equipid = value?.equipid || '';
            setFieldValue(genName('ownEquipId'), '');
            item.ownEquipId = '';
            setFieldValue(genName('portid'), '');
            item.portid = '';
            setFieldValue(genName('outletid'), '');
            item.outletid = '';

            // 自动填充Value
            portItems.forEach((itemData, idx) => {
              const type = tip === 'Primary' ? 'primary' : 'second';
              if (!itemData?.[type]?.equipid && itemData?.[type]?.closetid === item.closetid) {
                setFieldValue(genName('equipid', idx), value?.equipid);
                if (tip === 'Primary') {
                  itemData.primary.ownEquipId = value?.equipid;
                } else {
                  itemData.second.ownEquipId = value?.equipid;
                }
              }
            });

            if (value?.equipid) getEquipModule(value?.equipid, true);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...autocompleteProps}
              error={Boolean(errors?.equipid && touched?.equipid)}
              label="Equipment ID"
            />
          )}
        />
      </Grid>
      <Grid {...commonProps4}>
        <Autocomplete
          disabled={isDetail}
          autoSelect
          loading={equipModuleLoading}
          name={genName('equipid')}
          value={equipModuleOptions?.[`${item?.equipid}Map`]?.[item?.ownEquipId] || null}
          options={equipModuleOptions?.[item?.equipid] || []}
          getOptionLabel={(option) => `${option?.ownEquipId}---${option?.moduleDesc}`}
          onChange={(e, value) => {
            setFieldValue(genName('ownEquipId'), value?.ownEquipId || '');
            item.ownEquipId = value?.ownEquipId || '';
            setFieldValue(genName('portid'), '');
            item.portid = '';
            setFieldValue(genName('outletid'), '');
            item.outletid = '';

            if (value?.ownEquipId) getEquipPort(value?.ownEquipId, true);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...autocompleteProps}
              error={Boolean(errors?.ownEquipId && touched?.ownEquipId)}
              label="Equipment Module"
            />
          )}
        />
      </Grid>
      <Grid {...commonProps2}>
        <Autocomplete
          autoSelect
          disabled={isDetail}
          loading={portidLoading}
          name={genName('portid')}
          value={String(item?.portid || '')}
          options={equipPorts || []}
          onChange={(e, value) => {
            autoFillPortId(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...autocompleteProps}
              error={Boolean(errors?.portid && touched?.portid)}
              label="Port ID"
            />
          )}
        />
      </Grid>
      <Grid {...commonProps2}>
        <TextField
          label="Outlet ID"
          {...autocompleteProps}
          fullWidth
          disabled={isDetail}
          name={genName('outletid')}
          onChange={handleChange}
          error={Boolean(errors?.outletid && touched?.outletid)}
          value={item?.outletid || ''}
        />
      </Grid>
      <Grid {...commonProps4}>
        <HAKeyboardDatePicker
          name={genName('targetDate')}
          disabled={isDetail}
          label="Target Date"
          value={item.targetDate || ''}
          onChange={(value) => {
            setFieldValue(genName('targetDate'), value || '');
          }}
          {...autocompleteProps}
        />
      </Grid>
      <Grid {...commonProps4}>
        <Grid container spacing={2}>
          <Grid {...commonProps6}>
            <FormControl fullWidth {...autocompleteProps}>
              <InputLabel>Cable Type</InputLabel>
              <Select
                label="Cable Type"
                disabled={isDetail}
                name={genName('cableType')}
                onChange={(e, params) => {
                  setFieldValue(genName('cableType'), params?.props?.value || '');
                }}
                value={cableOptions?.includes(item?.cableType) ? item?.cableType : ''}
              >
                {cableOptions.map((item, index) => (
                  <MenuItem key={item || index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid {...commonProps6}>
            <FormControl fullWidth {...autocompleteProps}>
              <InputLabel>Outlet Type</InputLabel>
              <Select
                label="Outlet Type"
                disabled={isDetail}
                name={genName('outletType')}
                onChange={(e, params) => {
                  setFieldValue(genName('outletType'), params?.props?.value || '');
                }}
                value={item.outletType || ''}
              >
                {outletOptions.map((item, index) => (
                  <MenuItem key={item || index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid {...commonProps2}>
        <Button
          {...btnProps}
          disabled={!(item.closetid && item.equipid && item.portid) || isDetail}
          onClick={() => {
            if (item.outletid) {
              setOpen(true);
              return;
            }
            handleGenOutletId();
          }}
        >
          Gen
        </Button>
        {item?.portstatus && <Chip label={item?.portstatus || 'Reversed'} />}
      </Grid>

      {open && (
        <WarningDialog
          open={open}
          handleConfirm={handleGenOutletId}
          handleClose={() => setOpen(false)}
          content="The existing Outlet ID will be recovered.  Are you sure to continue?"
        />
      )}
    </Grid>
  );
};

export default memo(RenderDualItem);
