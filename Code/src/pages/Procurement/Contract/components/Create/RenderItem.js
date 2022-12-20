import React, { useState, memo } from 'react';
import {
  Grid,
  TextField,
  IconButton,
  makeStyles,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NumberFormat from 'react-number-format';
import {
  ContainerProps,
  InputControlProps
} from '../../../../../models/procurement/contract/FormControlProps';
import { WarningDialog, HAKeyboardDatePicker } from '../../../../../components';

const useStyles = makeStyles((theme) => ({
  renderItemRoot: {
    marginBottom: theme.spacing(4),
    '& .clearIcon': {
      marginLeft: '5px'
    },
    '&:hover .clearIcon': {
      visibility: 'visible !important'
    }
  },
  renderItem: (props) => ({
    border: `${
      props.blur ? 'rgb(237 239 242) 3px dashed' : `${theme.palette.primary.main} 3px dashed `
    }`
  })
}));

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      decimalScale={2}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
};

const RenderItem = ({
  item,
  isDetal,
  handleChange,
  fieldValueChange,
  index,
  deleteItem,
  errors,
  touched
}) => {
  const [blur, setBlur] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const classes = useStyles({ blur });

  const handlePartNoChange = (e) => {
    // 在编辑时，删除了一个Item，后又添加回相同的partNo，则将之前的id赋值回去
    fieldValueChange('id', index, e.target.value);
    handleChange(e);
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 3 };
  return (
    <>
      <Grid {...ContainerProps} className={classes.renderItemRoot} alignItems="center">
        <Grid item xs={11}>
          <Grid {...ContainerProps} className={classes.renderItem}>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                {...InputControlProps}
                label="Part No *"
                disabled={isDetal}
                name={`contractItems.items[${index}].partNo`}
                onChange={handlePartNoChange}
                error={errors?.partNo && touched?.partNo}
                value={item.partNo || ''}
              />
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
              <TextField
                {...InputControlProps}
                label="Description *"
                disabled={isDetal}
                name={`contractItems.items[${index}].description`}
                onChange={handleChange}
                error={errors?.description && touched?.description}
                value={item.description || ''}
              />
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
              <Grid {...ContainerProps}>
                <Grid item xs={6} md={6} lg={6}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel>Item Type *</InputLabel>
                    <Select
                      label="Item Type *"
                      disabled={isDetal}
                      name={`contractItems.items[${index}].itemType`}
                      value={Number(item?.itemType)}
                      onChange={handleChange}
                    >
                      <MenuItem value={0}>Cabling </MenuItem>
                      <MenuItem value={1}>Equipment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    {...InputControlProps}
                    label="Unit *"
                    disabled={isDetal}
                    name={`contractItems.items[${index}].unit`}
                    onChange={handleChange}
                    error={errors?.unit && touched?.unit}
                    value={item.unit || ''}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={9} lg={9}>
              <Grid {...ContainerProps}>
                <Grid {...commonProps}>
                  <TextField
                    {...InputControlProps}
                    label="Unit Price *"
                    disabled={isDetal}
                    name={`contractItems.items[${index}].unitPrice`}
                    onChange={handleChange}
                    error={errors?.unitPrice && touched?.unitPrice}
                    value={Number(item?.unitPrice).toFixed(2)}
                    InputProps={{
                      startAdornment: <span>$</span>,
                      inputComponent: NumberFormatCustom
                    }}
                  />
                </Grid>
                <Grid {...commonProps}>
                  <HAKeyboardDatePicker
                    label="Start Date *"
                    disabled={isDetal}
                    name="baseInfo.startTime"
                    value={item?.startTime || null}
                    maxDate={item?.endTime || undefined}
                    error={errors?.startTime && touched?.startTime}
                    onChange={(data) => {
                      fieldValueChange('startTime', index, data);
                    }}
                  />
                </Grid>

                <Grid {...commonProps}>
                  <HAKeyboardDatePicker
                    label="End Date *"
                    disabled={isDetal}
                    name="baseInfo.endTime"
                    value={item?.endTime || null}
                    minDate={item?.startTime || undefined}
                    error={errors?.endTime && touched?.endTime}
                    onChange={(data) => {
                      fieldValueChange('endTime', index, data);
                    }}
                  />
                </Grid>
                <Grid {...commonProps}>
                  <TextField
                    {...InputControlProps}
                    label="Asset Group *"
                    disabled={isDetal}
                    name={`contractItems.items[${index}].assetGroup`}
                    onChange={handleChange}
                    error={errors?.assetGroup && touched?.assetGroup}
                    value={item.assetGroup || ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          {!isDetal && (
            <Tooltip title="Delete">
              <IconButton
                onMouseEnter={() => {
                  setBlur(false);
                }}
                onMouseLeave={() => {
                  setBlur(true);
                }}
                className="clearIcon"
                style={{ visibility: 'hidden' }}
                color="primary"
                onClick={() => {
                  setDeleteDialog(true);
                  setDeleteIndex(index);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>

      <WarningDialog
        open={deleteDialog}
        handleConfirm={() => deleteItem(deleteIndex)}
        handleClose={() => setDeleteDialog(false)}
        content="Whether to delete Item ?"
      />
    </>
  );
};

export default memo(RenderItem);
