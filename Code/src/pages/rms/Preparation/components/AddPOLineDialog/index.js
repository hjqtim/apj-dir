import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { useFormik } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import * as Yup from 'yup';
import { CommonDialog, CommonTip } from '../../../../../components';
import API from '../../../../../api/webdp/webdp';

const AddPOLineDialog = (props) => {
  const { addOpen, setAddOpen, addOneItem } = props;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [PONoOptions, setPONoOptions] = useState([]);

  useEffect(() => {
    API.getPoNo().then((res) => {
      setPONoOptions(res?.data?.data?.poNoList || []);
    });
  }, []);

  const getOptions = useCallback(
    _.debounce((inputValue) => {
      if (inputValue) {
        setLoading(true);
        API.getProductDescription(inputValue)
          .then((optionRes) => {
            const newOptions = optionRes?.data?.data?.productDescriptionList || [];
            newOptions.sort((a, b) =>
              `${a.partNo}`
                .replace(/[. /-]/g, '')
                ?.localeCompare(`${b.partNo}`.replace(/[. /-]/g, ''))
            );
            // console.log('newOptions', newOptions);
            setOptions(newOptions);
          })
          .catch(() => {
            setOptions([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 800),
    []
  );

  const formik = useFormik({
    initialValues: {
      poNo: '',
      poLineNo: '',
      shortFormEquipId: '',
      qty: '',
      POitem: [
        {
          key: _.uniqueId(),
          poLineNo: '',
          shortFormEquipId: '',
          qty: '',
          shortDesc: ''
        }
      ]
    },
    validationSchema: Yup.object({
      poNo: Yup.string().required('Can not be empty'),
      // poLineNo: Yup.string().required('Can not be empty'),
      // shortFormEquipId: Yup.string().required('Can not be empty'),
      // qty: Yup.string().required('Can not be empty')
      POitem: Yup.array().of(
        Yup.object().shape({
          poLineNo: Yup.string().required('Can not be empty'),
          shortDesc: Yup.string().required('Can not be empty'),
          qty: Yup.string().required('Can not be empty')
        })
      )
    }),
    onSubmit: (values) => {
      if (isSaving) {
        return;
      }
      const { poNo, POitem } = values;
      // console.log('POitem', poNo, POitem);
      let addParams = [];
      for (let i = 0; i < POitem.length; i += 1) {
        const obj = {};
        obj.id = 0;
        obj.poLineNoId = 0;
        obj.poNo = poNo;
        obj.poLineNo = POitem[i].poLineNo;
        obj.shortFormEquipId = POitem[i].shortFormEquipId;
        obj.qty = POitem[i].qty;
        addParams = [...addParams, obj];
      }

      setIsSaving(true);
      API.savePoLineItem(addParams)
        .then((res) => {
          if (res?.data?.code === 200 && res?.data?.data) {
            CommonTip.success('Success', 2000);
            formik.handleReset();
            handleClose();
            setOptions([]);
            // const optionItem = options.find((item) => item.shortFormEquipId === shortFormEquipId);
            // const newItem = res.data.data;
            // newItem.shortDesc = optionItem?.shortDesc;
            addOneItem();
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  });

  const defaultValue = {
    key: _.uniqueId(),
    id: 0,
    poLineNoId: 0,
    poNo: '',
    poLineNo: '',
    shortFormEquipId: '',
    qty: '',
    shortDesc: ''
  };

  const { POitem } = formik.values;
  const { setFieldValue } = formik;
  // console.log('error', formik.errors, formik.touched);

  const handleClose = () => {
    setAddOpen(false);
  };

  const optionsDes = useMemo(() => options.map((optionItem) => optionItem.shortDesc), [options]);

  const subFormAdd = () => {
    // console.log('subFormAdd');
    const obj = defaultValue;
    setFieldValue(`POitem`, [...POitem, obj]);
  };
  const subFormDel = (key) => {
    // console.log('subFormDel', key);
    if (POitem.length > 1) {
      const result = POitem.filter((item) => item.key !== key);
      setFieldValue(`POitem`, [...result]);
    }
  };

  const handlePolineNo = (e, key) => {
    for (let i = 0; i < POitem.length; i += 1) {
      if (POitem[i].key === key) {
        POitem[i].poLineNo = e.target.value;
      }
    }
  };
  const handleShortFormEquipId = (_, val, key) => {
    // console.log('handleShortFormEquipId', val, key, _);
    const result = options.find((item) => item.shortDesc === val);
    // console.log('handleShortFormEquipId', result);
    for (let i = 0; i < POitem.length; i += 1) {
      if (POitem[i].key === key) {
        setFieldValue(`POitem.${i}.shortDesc`, result.shortDesc);
        setFieldValue(`POitem.${i}.shortFormEquipId`, result.shortFormEquipId);
        break;
      }
    }
  };
  return (
    <>
      <CommonDialog
        title="Add Record"
        open={addOpen}
        handleClose={handleClose}
        handleConfirm={formik.handleSubmit}
        isHideFooter={false}
        // maxWidth="xs"
        maxWidth="md"
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Autocomplete
                  style={{ height: '100%' }}
                  onChange={(event, val) => {
                    formik.setFieldValue('poNo', val || '');
                    formik.setFieldValue('shortFormEquipId', '');
                    setOptions([]);
                    getOptions(val);
                  }}
                  value={formik.values.poNo}
                  options={PONoOptions}
                  onBlur={formik.handleBlur}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      variant="outlined"
                      fullWidth
                      size="small"
                      label="PO No. *"
                      name="poNo"
                      error={Boolean(formik.errors.poNo && formik.touched.poNo)}
                    />
                  )}
                />
              </Grid>

              {POitem.map((item, index) => (
                <React.Fragment key={item.key}>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      label="PO Line No. *"
                      name="poLineNo"
                      value={formik.values.POitem.poLineNo}
                      onBlur={formik.handleBlur(`POitem.${index}.poLineNo`)}
                      error={Boolean(
                        formik.errors?.POitem?.[index]?.poLineNo &&
                          formik.touched?.POitem?.[index]?.poLineNo
                      )}
                      onChange={(e) => handlePolineNo(e, item.key)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Autocomplete
                      style={{ height: '100%' }}
                      onChange={(_, val) => {
                        handleShortFormEquipId(_, val, item.key);
                      }}
                      value={item.shortDesc}
                      options={optionsDes || []}
                      onBlur={formik.handleBlur(`POitem.${index}.shortDesc`)}
                      loading={loading}
                      renderInput={(inputParams) => (
                        <TextField
                          {...inputParams}
                          variant="outlined"
                          fullWidth
                          size="small"
                          label="Product Description *"
                          name="shortFormEquipId"
                          error={Boolean(
                            formik.errors?.POitem?.[index]?.shortDesc &&
                              formik.touched?.POitem?.[index]?.shortDesc
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      label="Qty *"
                      name="qty"
                      value={item.qty}
                      onBlur={formik.handleBlur(`POitem.${index}.qty`)}
                      error={Boolean(
                        formik.errors?.POitem?.[index]?.qty && formik.touched?.POitem?.[index]?.qty
                      )}
                      onChange={(e) => {
                        const newQty = e.target.value;
                        if (newQty === '0') {
                          return;
                        }
                        if (/^[0-9]*$/.test(newQty)) {
                          formik.setFieldValue(`POitem.${index}.qty`, newQty);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        subFormAdd(index);
                      }}
                      style={{ marginRight: 10 }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => {
                        subFormDel(item.key);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(AddPOLineDialog);
