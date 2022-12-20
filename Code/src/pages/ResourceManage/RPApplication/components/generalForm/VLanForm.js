import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { Grid, TextField, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { setServiceForm } from '../../../../../redux/ResourceMX/resourceAction';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';

const Index = () => {
  const serviceForm = useSelector((state) => state.resourceMX.serviceForm);
  // console.log('VLAN serviceForm', serviceForm);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  const touches = useSelector((state) => state.resourceMX.touches);
  const dispatch = useDispatch();
  const { requestNo } = useParams();
  const orderStatus = useParams().status;

  const formik = useFormik({
    initialValues: {
      dataList: [
        {
          id: '',
          key: Date.now().toString(36) + Math.random().toString(36).substr(2),
          switchIp: '',
          switchPort: '',
          vLan: ''
        }
      ]
    }
  });
  const { dataList } = formik.values;
  const { handleChange, setFieldValue } = formik;

  const hanldAdd = () => {
    let { dataList } = formik.values;
    const obj = {
      id: '',
      key: Date.now().toString(36) + Math.random().toString(36).substr(2),
      switchIp: '',
      switchPort: '',
      vLan: ''
    };
    dataList = [...dataList, obj];
    setFieldValue('dataList', dataList);
  };
  const hanldDel = (key) => {
    const { dataList } = formik.values;
    if (dataList.length > 1) {
      const temp = dataList.filter((item) => item.key !== key);
      setFieldValue('dataList', temp);
    }
  };

  const setServiceFormReducer = () => {
    dispatch(setServiceForm(dataList));
  };

  const setFormikData = (serviceForm) => {
    if (typeof serviceForm !== 'undefined') {
      formik.setFieldValue('dataList', serviceForm);
    } else {
      formik.setFieldValue('dataList', dataList);
    }
  };
  useEffect(() => {
    setFormikData(serviceForm);
  }, [serviceForm]);

  return (
    <>
      {dataList?.map((item, index) => (
        <Grid container key={`dataList${item.key}`} style={{ marginTop: 10, marginBottom: 20 }}>
          <Grid container spacing={3}>
            <Grid {...FormControlProps} md={6} lg={3}>
              <TextField
                label="Switch IP *"
                variant="outlined"
                size="small"
                fullWidth
                style={{ width: '100%' }}
                value={dataList[index].switchIp}
                onChange={handleChange(`dataList.${index}.switchIp`)}
                onBlur={setServiceFormReducer}
                error={Boolean(touches?.serviceForm?.[index]?.switchIp)}
                disabled={
                  (resourceStatus === 'detailSubmited' && !requestNo) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone'
                }
              />
            </Grid>
            <Grid {...FormControlProps} md={6} lg={3}>
              <TextField
                label="Switch Port"
                variant="outlined"
                size="small"
                fullWidth
                style={{ width: '100%' }}
                value={dataList[index].switchPort}
                onChange={handleChange(`dataList.${index}.switchPort`)}
                onBlur={setServiceFormReducer}
                error={Boolean(touches?.serviceForm?.[index]?.switchPort)}
                disabled={
                  (resourceStatus === 'detailSubmited' && !requestNo) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone'
                }
              />
            </Grid>
            <Grid {...FormControlProps} md={6} lg={3}>
              <TextField
                name="vLan"
                label="VLAN *"
                variant="outlined"
                size="small"
                fullWidth
                style={{ width: '100%' }}
                value={item.vLan}
                onChange={handleChange(`dataList.${index}.vLan`)}
                onBlur={setServiceFormReducer}
                error={Boolean(touches?.serviceForm?.[index]?.vLan)}
                disabled={
                  (resourceStatus === 'detailSubmited' && !requestNo) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone'
                }
              />
            </Grid>

            {(resourceStatus === 'detailSubmited' && !requestNo) ||
            orderStatus === 'detail' ||
            resourceStatus === 'detailApproved' ||
            resourceStatus === 'detailDone' ? null : (
              <Grid {...FormControlProps} md={6} lg={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    hanldAdd();
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => {
                    hanldDel(item.key);
                  }}
                >
                  Delete
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
export default memo(Index);
