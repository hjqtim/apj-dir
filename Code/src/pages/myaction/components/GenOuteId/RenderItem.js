import React, { memo, useEffect, useState, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import {
  Grid,
  Typography,
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
import { HAKeyboardDatePicker, WarningDialog } from '../../../../components';
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
  },
  buttonStyle: {
    // marginRight: theme.spacing(2)
    width: '100%'
  }
}));

const RenderItem = ({
  item,
  closet,
  isDetail,
  errors,
  touched,
  index,
  genOutletId,
  optionsData,
  handleChange,
  setFieldValue,
  portItems,
  cabinetOptions,
  portIdOptions,
  equipmentOptions
}) => {
  const {
    // blockAndFoolList,
    cableTypeList,
    // closetLocationVoList,
    conduitTypeList,
    isPublicAreaList,
    duplexList,
    facePlateList,
    outletStatusList,
    outletTypeList,
    polarityList,
    portSecurityList,
    portSpeedList,
    pstypeList,
    vlanIDList
  } = optionsData;

  // const conduitTypeOption = useSelector((state) => state.webDP.apDpDetails.conduitTypeOption);

  const classes = useStyles();
  const [cabinetLoading, setCabinetLoading] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  // const [equipModuleLoading, setEquipModuleLoading] = useState(false);
  // const [portidLoading, setportidLoading] = useState(false);
  const [equipPorts, setEquipPorts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isFibreCore, setIsFibreCore] = useState(true);

  const btnProps = { color: 'primary', variant: 'contained', className: classes.buttonStyle };

  // 过滤筛选portID下拉列表
  useEffect(() => {
    const sameOwnEquipId = portItems.filter((data) => data.ownEquipId === item.ownEquipId);
    const isSelectPortId = _.map(sameOwnEquipId, 'portid');
    let newData =
      portIdOptions?.[item.ownEquipId]?.filter(
        (x) => !isSelectPortId.some((item) => x?.portid === item)
      ) || [];
    if (item.portid) {
      newData = [
        ...newData,
        {
          portid: item?.portid,
          ownEquipId: item?.ownEquipId,
          newPortId: item?.newPortId
        }
      ];
    }
    newData.sort((a, b) => Number(a.portid) - Number(b.portid));
    setEquipPorts(newData);
  }, [portItems, portIdOptions]);

  // 详情获取下拉数据
  useEffect(() => {
    if (item?.closetID) {
      getEquipmentOptions(item?.closetID);
      getCabinetOptions(item?.closetID);
    }
    // if (item?.equipid) getEquipModule(item?.equipid, false);
    if (item?.equipid) getEquipPort(item?.equipid, false);

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

  const getEquipmentOptions = (value) => {
    if (!Object.prototype.hasOwnProperty.call(equipmentOptions, value || '')) {
      setEquipmentLoading(true);
      API.getEquipment({ closetId: value })
        .then((res) => {
          const resData = res?.data?.data?.equipment || [];
          const equipmentListData = [];
          const newEquipmentMap = {};
          resData.forEach((item) => {
            if (item?.equipid) {
              equipmentListData.push(item);
              newEquipmentMap[item?.equipid] = item;
            }
          });
          equipmentListData.sort((a, b) => `${a.equipid}`?.localeCompare(`${b.equipid}`));
          setFieldValue('equipmentOptions', {
            ...equipmentOptions,
            [value]: equipmentListData,
            [`${value}Map`]: newEquipmentMap
          });
        })
        .finally(() => {
          setEquipmentLoading(false);
        });
    }
  };

  // Equipment ID 变动获取 Equipment Module
  /**
   *
   * @param {*} value
   * @param {*} isSelect 是否是手动选择的
   */
  // const getEquipModule = (value, isSelect) => {
  //   if (!Object.prototype.hasOwnProperty.call(equipModuleOptions, value || '')) {
  //     setEquipModuleLoading(true);
  //     API.getEquipModule({ equipId: value })
  //       .then((res) => {
  //         const resData = res?.data?.data?.equipModule || [];
  //         // 返回的数据中是否存在 moduleDesc 是 Buit-in port的，有则自动填充
  //         const isExitBuitInPort = resData?.find((item) => item?.moduleDesc === 'Buit-in port');
  //         const ListData = [];
  //         const DataMap = {};
  //         resData.forEach((item) => {
  //           if (item?.ownEquipId) {
  //             ListData.push(item);
  //             DataMap[item?.ownEquipId] = item;
  //           }
  //         });
  //         setFieldValue('equipModuleOptions', {
  //           ...equipModuleOptions,
  //           [value]: ListData,
  //           [`${value}Map`]: DataMap
  //         });
  //         if (!_.isUndefined(isExitBuitInPort) && isSelect) {
  //           getEquipPort(isExitBuitInPort?.ownEquipId, true);
  //         }
  //       })
  //       .finally(() => {
  //         setEquipModuleLoading(false);
  //       });
  //   } else {
  //     const equipModuleData = equipModuleOptions?.[value] || [];
  //     const isExitBuitInPort = equipModuleData?.find((item) => item?.moduleDesc === 'Buit-in port');
  //     if (!_.isUndefined(isExitBuitInPort) && isSelect) {
  //       getEquipPort(isExitBuitInPort?.ownEquipId, true);
  //     }
  //   }
  // };

  /**
   *
   * @param {*} value
   * @param {*} isSelect 是否是手动选择的
   */
  const getEquipPort = (value, isSelect) => {
    if (!Object.prototype.hasOwnProperty.call(portIdOptions, value || '')) {
      // setportidLoading(true);
      API.getEquipPort({ equipId: value }).then((res) => {
        const resData = res?.data?.data?.equipPorts || [];
        const newData = resData.map((item) => ({
          portid: item?.portid,
          ownEquipId: item?.equipid,
          newPortId: item?.newPortId
        }));
        autoFillPortId2(newData, value, isSelect);
        setFieldValue('portIdOptions', {
          ...portIdOptions,
          [value]: newData
        });
      });
      // .finally(() => {
      //   setportidLoading(false);
      // });
    } else {
      autoFillPortId2(portIdOptions?.[value], value, isSelect);
    }
  };

  // 根据closet ID获取 Cabinet Option
  /**
   *
   * @param {*} value
   */
  const getCabinetOptions = (value) => {
    if (!Object.prototype.hasOwnProperty.call(cabinetOptions, value || '')) {
      setCabinetLoading(true);
      API.getCabinetIDList({ closetID: value })
        .then((res) => {
          const resData = res?.data?.data || [];
          setFieldValue('cabinetOptions', {
            ...cabinetOptions,
            [value]: resData
          });
        })
        .finally(() => {
          setCabinetLoading(false);
        });
    }
  };

  // 选择 portId 时填充  portId
  const autoFillPortId = (value) => {
    const { portid, ownEquipId, newPortId } = value;
    setFieldValue(`portItems[${index}].outletId`, '');
    setFieldValue(`portItems[${index}].portid`, portid || '');
    setFieldValue(`portItems[${index}].ownEquipId`, ownEquipId || '');
    setFieldValue(`portItems[${index}].newPortId`, newPortId || '');
    console.log(value);
    // // 选出需要填充的事数据
    if (portid) {
      const underPortItems = portItems.map((itemData, idx) => {
        let data = itemData;
        if (idx === index) {
          data = null;
        } else if (idx !== index) {
          if (itemData?.portid || idx < index || itemData?.ownEquipId !== item?.ownEquipId) {
            data = null;
          }
        }

        return data;
      });
      let valueIndex = equipPorts?.indexOf(value);

      underPortItems.forEach((itemData, idx) => {
        if (!_.isNull(itemData) && equipPorts?.[valueIndex + 1]) {
          valueIndex += 1;
          setFieldValue(`portItems[${idx}].portid`, equipPorts?.[valueIndex]?.portid || '');
          setFieldValue(`portItems[${idx}].ownEquipId`, equipPorts?.[valueIndex]?.ownEquipId || '');
          setFieldValue(`portItems[${idx}].newPortId`, equipPorts?.[valueIndex]?.newPortId || '');
        }
      });
      setTimeout(() => {
        setFieldValue(`portItems[${index}].portid`, portid || '');
        setFieldValue(`portItems[${index}].ownEquipId`, ownEquipId || '');
        setFieldValue(`portItems[${index}].newPortId`, newPortId || '');
      }, 0);
    }
  };

  // 选择 equipModule时填充  portId
  const autoFillPortId2 = (equipPortsData, value, isSelect) => {
    // 选择触发的
    if (isSelect) {
      console.log(equipPortsData, value, isSelect);
      portItems.forEach((itemData, idx) => {
        if (!itemData?.ownEquipId && itemData?.equipid === item?.equipid) {
          setFieldValue(`portItems[${idx}].ownEquipId`, value);
          itemData.ownEquipId = value;
        }
      });

      const sameOwnEquipId = portItems.filter((data) => data.ownEquipId === value);
      // 记录页面中已经存在的 portid 并且 ownEquipId 相同的数据
      const isSelectPortId = _.map(sameOwnEquipId, 'portid');
      // 过滤掉页面中 portid
      equipPortsData =
        equipPortsData?.filter((x) => !isSelectPortId.some((item) => x === item)) || [];

      // 选出要填充的数据
      const underPortItems = portItems.map((itemData) => {
        let data = itemData;
        if (itemData?.portid || itemData?.ownEquipId !== item?.ownEquipId) {
          data = null;
        }
        return data;
      });
      let valueIndex = 0;

      // 填充数据
      underPortItems.forEach((itemData, idx) => {
        if (!_.isNull(itemData) && equipPortsData?.[valueIndex]) {
          setFieldValue(`portItems[${idx}].portid`, equipPortsData?.[valueIndex]?.portid || '');
          itemData.portid = equipPortsData?.[valueIndex]?.portid || '';
          valueIndex += 1;
        }
      });
    }
  };

  // 修改cable length更新status
  const changeCableLength = useCallback(
    _.debounce((value) => {
      if (value > 0) {
        setFieldValue(`portItems[${index}].status`, 'Production');
        item.status = 'Production';
      }
    }, 800),
    []
  );

  // 生成 OutletId
  const handleGenOutletId = () => {
    const queryData = [
      {
        closetId: item?.closetID,
        equipId: item?.equipid
      }
    ];
    genOutletId(queryData, [index]);
    setOpen(false);
  };

  // 过滤ConduitType
  // const getConduitTypeOption = () => {
  //   if (item?.conduitType === 'P') {
  //     return conduitTypeOption;
  //   }
  //   return conduitTypeOption.filter((item) => item.remark !== 'P');
  // };

  return (
    <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemRoot}>
      <Typography variant="h6">Connection Info</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Closet ID */}
        <Grid {...commonProps2}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            options={closet || []}
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].closetID`, value || '');
              item.closetID = value || '';
              setFieldValue(`portItems[${index}].cabinetID`, '');
              item.cabinetID = '';
              setFieldValue(`portItems[${index}].equipid`, '');
              item.equipid = '';
              setFieldValue(`portItems[${index}].ownEquipId`, '');
              item.ownEquipId = '';
              setFieldValue(`portItems[${index}].portid`, '');
              item.portid = '';
              setFieldValue(`portItems[${index}].outletId`, '');
              item.outletId = '';

              if (value) {
                getEquipmentOptions(value);
                getCabinetOptions(value);
              }

              if (value) {
                // 自动填充Value
                portItems.forEach((itemData, idx) => {
                  if (!itemData?.closetID) {
                    setFieldValue(`portItems[${idx}].closetID`, value);
                    setFieldValue(`portItems[${idx}].cabinetID`, '');
                    setFieldValue(`portItems[${idx}].equipid`, '');
                    setFieldValue(`portItems[${idx}].ownEquipId`, '');
                    setFieldValue(`portItems[${idx}].portid`, '');
                    setFieldValue(`portItems[${idx}].outletId`, '');
                  }
                });
              }
            }}
            value={item?.closetID || null}
            name={`portItems[${index}].closetID`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...autocompleteProps}
                label="Closet ID"
                error={Boolean(errors?.closetID && touched?.closetID)}
              />
            )}
          />
        </Grid>

        {/* Cabinet */}
        <Grid {...commonProps2}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            loading={cabinetLoading}
            name={`portItems[${index}].cabinetID`}
            value={item?.cabinetID ? String(item?.cabinetID) : null}
            options={cabinetOptions?.[`${item?.closetID}`] || []}
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].cabinetID`, value || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...autocompleteProps}
                error={Boolean(errors?.cabinetID && touched?.cabinetID)}
                label="Cabinet"
              />
            )}
          />
        </Grid>

        {/* Equipment ID */}
        <Grid {...commonProps2}>
          <Autocomplete
            disabled={isDetail}
            autoSelect
            loading={equipmentLoading}
            name={`portItems[${index}].equipid`}
            getOptionLabel={(option) =>
              `${option.ipaddress}---${option.modeldesc}---${option.status}`
            }
            // inputValue={item?.equipid || ''}
            // filterOptions={(options) => options}
            value={equipmentOptions?.[`${item?.closetID}Map`]?.[item?.equipid] || null}
            options={equipmentOptions?.[item?.closetID] || []}
            onChange={(e, value) => {
              setFieldValue(`portItems[${index}].equipid`, value?.equipid || '');
              item.equipid = value?.equipid || '';
              setFieldValue(`portItems[${index}].ownEquipId`, '');
              item.ownEquipId = '';
              setFieldValue(`portItems[${index}].portid`, '');
              item.portid = '';
              setFieldValue(`portItems[${index}].outletId`, '');
              item.outletId = '';

              if (value?.equipid) {
                // 自动填充Value
                portItems.forEach((itemData, idx) => {
                  if (!itemData?.equipid && itemData?.closetID === item?.closetID) {
                    setFieldValue(`portItems[${idx}].equipid`, value?.equipid);
                    itemData.equipid = value?.equipid;
                  }
                });

                getEquipPort(value?.equipid, true);
                // getEquipModule(value?.equipid, true);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...autocompleteProps}
                variant="outlined"
                error={Boolean(errors?.equipid && touched?.equipid)}
                label="Equipment ID"
              />
            )}
          />
        </Grid>

        {/* Port ID */}
        <Grid {...commonProps2}>
          <Autocomplete
            autoSelect
            disabled={isDetail}
            // loading={portidLoading}
            name={`portItems[${index}].portid`}
            // value={item?.portid ? String(item?.portid) : ''}
            inputValue={item?.portid ? String(item?.portid) : ''}
            options={equipPorts || []}
            getOptionLabel={(option) => `${option?.newPortId}`}
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

        {/* Panel ID && P.PortID */}
        <Grid {...commonProps4}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                {...autocompleteProps}
                label="Panel ID"
                fullWidth
                name={`portItems[${index}].patchPanelID`}
                onChange={handleChange}
                error={Boolean(errors?.patchPanelID && touched?.patchPanelID)}
                value={item?.patchPanelID || ''}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                {...autocompleteProps}
                label="P.PortID"
                fullWidth
                name={`portItems[${index}].patchPanelPort`}
                onChange={handleChange}
                error={Boolean(errors?.patchPanelPort && touched?.patchPanelPort)}
                value={item?.patchPanelPort || ''}
              />
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
              {cableTypeList.map((item) => (
                <MenuItem key={item.id} item={item} value={item.optionValue}>
                  {item.optionValue}
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
              {conduitTypeList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Face Plate */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Face Plate</InputLabel>
            <Select
              label="Face Plate"
              disabled={isDetail || isFibreCore}
              name={`portItems[${index}]facePlate`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].facePlate`, params?.props?.value || '');
              }}
              value={item?.facePlate || ''}
            >
              {facePlateList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
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
            name={`portItems[${index}].cablelength`}
            type="number"
            onChange={(e) => {
              const { value } = e.target;
              handleChange(e);
              changeCableLength(value);
            }}
            error={Boolean(errors?.cablelength && touched?.cablelength)}
            value={item?.cablelength || 0}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Outlet Info & network configuration</Typography>
      <Grid container spacing={2} alignItems="flex-start" className={classes.renderItemBox}>
        {/* Outlet ID */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Outlet ID"
            fullWidth
            disabled={isDetail || !item?.outletId}
            name={`portItems[${index}].outletId`}
            onChange={handleChange}
            error={Boolean(errors?.outletId && touched?.outletId)}
            value={item?.outletId || ''}
          />
        </Grid>

        {/* Gen */}
        <Grid {...commonProps2}>
          <Button
            {...btnProps}
            disabled={!(item?.closetID && item?.equipid && item?.portid) || isDetail}
            onClick={() => {
              if (item?.outletId) {
                setOpen(true);
                return;
              }
              handleGenOutletId();
            }}
          >
            Gen this outlet ID
          </Button>
          {item?.portstatus && <Chip label={item?.portstatus || 'Reversed'} />}
        </Grid>

        {/* Port Security */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Port Security</InputLabel>
            <Select
              label="Port Security"
              name={`portItems[${index}].portSecurity`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].portSecurity`, params?.props?.value || '');
              }}
              value={item?.portSecurity || ''}
            >
              {portSecurityList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              {outletStatusList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Outlet Type */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Outlet Type</InputLabel>
            <Select
              label="Outlet Type"
              disabled={isDetail}
              name={`portItems[${index}].outletType`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].outletType`, params?.props?.value || '');
              }}
              value={item?.outletType || ''}
            >
              {outletTypeList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* PS Type */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Pri or Sec</InputLabel>
            <Select
              label="Pri or Sec"
              disabled={isDetail}
              name={`portItems[${index}].pstype`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].pstype`, params?.props?.value || '');
              }}
              value={item?.pstype || ''}
            >
              {pstypeList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Link Port */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Link Port"
            fullWidth
            name={`portItems[${index}].linkPort`}
            onChange={handleChange}
            error={Boolean(errors?.linkPort && touched?.linkPort)}
            value={item?.linkPort || ''}
          />
        </Grid>

        {/* Project */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Project"
            fullWidth
            name={`portItems[${index}].project`}
            onChange={handleChange}
            error={Boolean(errors?.project && touched?.project)}
            value={item?.project || ''}
          />
        </Grid>

        {/* VLan ID */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>VLan ID</InputLabel>
            <Select
              label="VLan ID"
              name={`portItems[${index}].vlanID`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].vlanID`, params?.props?.value || '');
              }}
              value={item?.vlanID || ''}
            >
              {vlanIDList.map((item) => (
                <MenuItem key={item.id} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Port Speed */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Port Speed</InputLabel>
            <Select
              label="Port Speed"
              name={`portItems[${index}].portSpeed`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].portSpeed`, params?.props?.value || '');
              }}
              value={item?.portSpeed || ''}
            >
              {portSpeedList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Duplex */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Duplex</InputLabel>
            <Select
              label="Duplex"
              name={`portItems[${index}].duplex`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].duplex`, params?.props?.value || '');
              }}
              value={item?.duplex || ''}
            >
              {duplexList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Polarity */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Polarity</InputLabel>
            <Select
              label="Polarity"
              name={`portItems[${index}].polarity`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].polarity`, params?.props?.value || '');
              }}
              value={item?.polarity || ''}
            >
              {polarityList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
                  {item.optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Located at Public Area */}
        <Grid {...commonProps2}>
          <FormControl fullWidth {...autocompleteProps}>
            <InputLabel>Located at Public Area</InputLabel>
            <Select
              label="Located at Public Area"
              name={`portItems[${index}].isPublicArea`}
              onChange={(e, params) => {
                setFieldValue(`portItems[${index}].isPublicArea`, params?.props?.value || '');
              }}
              value={item?.isPublicArea || ''}
            >
              {isPublicAreaList.map((item, index) => (
                <MenuItem key={item.id || index} value={item.optionValue}>
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

        {/* Contact person */}
        <Grid {...commonProps2}>
          <TextField
            {...autocompleteProps}
            label="Contact person"
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
        <Grid {...commonProps2}>
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

export default memo(RenderItem);
