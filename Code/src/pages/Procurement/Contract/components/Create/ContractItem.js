import React, { memo } from 'react';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AddCircle as AddIcon } from '@material-ui/icons';
import { HAPaper } from '../../../../../components';
import { ContainerProps } from '../../../../../models/procurement/contract/FormControlProps';
import RenderItem from './RenderItem';

const useStyles = makeStyles((theme) => ({
  addIcon: {
    paddingRight: theme.spacing(2)
  }
}));

const ContractItem = ({
  values,
  handleChange,
  setFieldValue,
  genNewItem,
  errors,
  touched,
  isDetal,
  backData
}) => {
  const classes = useStyles();
  const history = useHistory();
  const url = history?.location?.pathname;

  const deleteItem = (index) => {
    const newValues = values?.items.filter((item, idx) => index !== idx);
    setFieldValue(`contractItems.items`, newValues);
  };

  const fieldValueChange = (filed, index, value) => {
    // 特殊处理的字段-----------------
    if (filed === 'id' && url.indexOf('update') !== -1) {
      // 修改页面修改id
      const { items } = values;
      if (items?.[index].id !== 0) {
        // 存在冲突的item，修改 partNo, 修改为不冲突后，则这个Item id设为0，表示新增
        const arr = items.filter((item) => item.id === items?.[index].id);
        if (arr.length > 1 && value !== items?.[index]?.partNo) {
          setFieldValue(`contractItems.items[${index}].${filed}`, 0);
        }
      }
      //
      const obj = backData?.contractItems?.find((item) => item.partNo === value);
      if (obj) {
        setFieldValue(`contractItems.items[${index}].${filed}`, obj.id);
      }
    } else {
      setFieldValue(`contractItems.items[${index}].${filed}`, value);
    }
  };

  return (
    <HAPaper>
      <Grid {...ContainerProps}>
        <Grid item xs={12}>
          <Typography variant="h3">Contract Items</Typography>
        </Grid>
      </Grid>
      <br />

      {values?.items.map((item, index) => (
        <RenderItem
          key={item.key}
          item={item}
          index={index}
          isDetal={isDetal}
          errors={errors?.items?.[index]}
          touched={touched?.items?.[index]}
          deleteItem={deleteItem}
          handleChange={handleChange}
          fieldValueChange={fieldValueChange}
          setFieldValue={setFieldValue}
        />
      ))}

      {!isDetal && (
        <Grid {...ContainerProps}>
          <Grid item xs={10}>
            <Grid {...ContainerProps} justifyContent="flex-end" className={classes.addIcon}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setFieldValue(`contractItems.items[${values?.items?.length}]`, genNewItem());
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </HAPaper>
  );
};

export default memo(ContractItem);
