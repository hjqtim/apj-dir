import React, { memo, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import webdpAPI from '../../../../../api/webdp/webdp';
import ipassignAPI from '../../../../../api/ipassign';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import {
  setDetailItems,
  setItemTouch,
  setCopyItem,
  setDeleteItem,
  setBaseData
} from '../../../../../redux/IPAdreess/ipaddrActions';
import useValidationIPForm from './useValidationIPForm';

const Right = ({ values, index, length }) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const errors = useValidationIPForm()?.items?.[index] || {};
  const touches = useSelector((state) => state.IPAdreess.touches.items[index]);
  const blockList = useSelector((state) => state.IPAdreess.blockList) || [];
  const blockOptions = blockList?.map((blockItem) => blockItem.block) || [];
  const projectInfo = useSelector((state) => state.IPAdreess.projectInfo);
  const floorListMap = useSelector((state) => state.IPAdreess.floorListMap);
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  const fieldsUpdateHandler = (data) => {
    dispatch(setDetailItems(data));
  };

  const fieldsHandlerBlur = (field) => {
    dispatch(setItemTouch({ field, index }));
  };

  const optionsMemo = useMemo(() => {
    const result = options
      .map((item) => item.outletID)
      .filter((filterItem) =>
        filterItem?.toLowerCase?.()?.includes(values.dataPortId?.toLowerCase?.())
      );
    return result;
  }, [options, values.dataPortId]);

  const floorOptionsMemo = useMemo(
    () => floorListMap?.[values.block]?.map((floorItem) => floorItem.floor || []),
    [floorListMap, values.block]
  );

  const outIDBlur = () => {
    const count = _.countBy(values?.dataPortId)['.'];
    if (count > 3 && values.dataPortId?.substr(values?.length - 1) !== '.') {
      ipassignAPI.getInfoByOutLetID({ outletID: values.dataPortId }).then((res) => {
        const resData = res?.data?.data?.outlet || {};
        fieldsUpdateHandler({ field: 'block', data: { index, value: resData?.block || '' } });
        fieldsUpdateHandler({ field: 'floor', data: { index, value: resData?.floor || '' } });
        fieldsUpdateHandler({ field: 'room', data: { index, value: resData?.room || '' } });
        handleGetFloorList(resData?.block);
      });
    }
  };
  const handleGetFloorList = (block) => {
    const floorParams = { block, hospCode: projectInfo.hospital };

    if (!Object.prototype.hasOwnProperty.call(floorListMap, block)) {
      webdpAPI.getBlockAndFloorByHospCodeList(floorParams).then((res) => {
        const resData = res?.data?.data?.blockAndFloorByHospCodeList || [];
        const floorListMap = { ...floorListMap, [block]: resData };
        dispatch(setBaseData({ floorListMap }));
      });
    }
  };

  const outIdInputChange = (e) => {
    const value = e?.target?.value || '';
    fieldsUpdateHandler({ field: 'dataPortId', data: { index, value } });
    //   当输入第三个点的时候;.
    const count = _.countBy(value)['.'];
    if (count === 3 && value.substr(value?.length - 1) === '.' && projectInfo.hospital) {
      setLoading(true);
      webdpAPI
        .deRequestCheckLikeID({
          outletID: value,
          hospital: projectInfo.hospital
        })
        .then((res) => {
          const newOptions = res?.data?.data || [];
          setOptions(newOptions);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!value) {
      setOptions([]);
    }
  };

  const getOutletIDDisabled = () => {
    if (isMyApproval || isMyRequest) return true;
    if (values?.ipType === 'DHCP RANGE') return true;
    if (!projectInfo?.hospital) return true;
    return false;
  };

  const handleBlockBlur = () => {
    if (values?.block) {
      handleGetFloorList(values.block);
    }
  };

  const ButtonProps = { size: 'small', variant: 'contained', fullWidth: true, color: 'primary' };
  return (
    <Grid item xs={12} md={4}>
      <Grid container>
        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            value={values.dataPortId || ''}
            onChange={(event, value) => {
              fieldsUpdateHandler({ field: 'dataPortId', data: { index, value: value || '' } });
              if (!value) setOptions([]);
            }}
            options={optionsMemo || []}
            onBlur={outIDBlur}
            disabled={getOutletIDDisabled()}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Outlet ID"
                InputProps={{
                  ...inputParams.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20} color="inherit" /> : null}
                      {inputParams.InputProps.endAdornment}
                    </>
                  )
                }}
                onChange={outIdInputChange}
              />
            )}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            value={values?.block || null}
            onChange={(e, data) => {
              fieldsUpdateHandler({ field: 'block', data: { index, value: data || '' } });
              fieldsUpdateHandler({ field: 'floor', data: { index, value: '' } });
            }}
            options={blockOptions}
            onBlur={handleBlockBlur}
            disabled={isMyApproval || isMyRequest}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Block *"
                onBlur={() => {
                  fieldsHandlerBlur('block');
                }}
                onChange={(e) => {
                  fieldsUpdateHandler({
                    field: 'block',
                    data: { index, value: e.target.value || '' }
                  });
                }}
                error={Boolean(errors?.block) && Boolean(touches?.block)}
              />
            )}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <Autocomplete
            freeSolo
            value={values?.floor || null}
            options={floorOptionsMemo || []}
            disabled={isMyApproval || isMyRequest}
            onChange={(e, data) => {
              fieldsUpdateHandler({ field: 'floor', data: { index, value: data || '' } });
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Floor  *"
                onBlur={() => {
                  fieldsHandlerBlur('floor');
                }}
                onChange={(e) => {
                  fieldsUpdateHandler({
                    field: 'floor',
                    data: { index, value: e.target.value || '' }
                  });
                }}
                error={Boolean(errors?.floor) && Boolean(touches?.floor)}
              />
            )}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Room / Other Location"
            disabled={isMyApproval || isMyRequest}
            value={values?.room || ''}
            onChange={(e) => {
              fieldsUpdateHandler({ field: 'room', data: { index, value: e.target.value } });
            }}
          />
        </Grid>
        {!isMyApproval && !isMyRequest && (
          <Grid {...FormControlProps}>
            <Grid container spacing={3}>
              <Grid item xs={length > 1 ? 6 : 12}>
                <Button
                  {...ButtonProps}
                  onClick={() => {
                    dispatch(setCopyItem({ index }));
                  }}
                >
                  <FileCopyIcon fontSize="small" /> &nbsp;
                  <strong>Copy</strong>
                </Button>
              </Grid>

              {length > 1 && (
                <Grid item xs={6}>
                  <Button
                    {...ButtonProps}
                    color="inherit"
                    onClick={() => {
                      dispatch(setDeleteItem({ index }));
                    }}
                  >
                    <DeleteIcon /> &nbsp;
                    <strong>Delete</strong>
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default memo(Right);
