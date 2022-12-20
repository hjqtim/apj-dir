import React, { memo, useEffect, useState } from 'react';
import {
  Grid,
  makeStyles,
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';

import CommonTip from '../../../../../../components/CommonTip';
import { InputControlProps } from '../../../../../../models/rms/req/FormControlProps';
import { formatterMoney } from '../../../../../../utils/tools';
import API from '../../../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    padding: theme.spacing(4)
  },
  acquisitionItem: {
    marginTop: theme.spacing(4)
  },
  table: {
    border: '1px  #C4C4C4 solid'
  },
  money: {
    width: '50%',
    textAlign: 'right'
  },
  tableFooter: {
    width: '100%',
    border: '1px  #C4C4C4 solid',
    padding: theme.spacing(4),
    borderTop: 0
  },
  footerNo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  footerMoney: {
    display: 'flex',
    justifyContent: 'flex-end !important',
    alignItems: 'center',
    '& input': {
      textAlign: 'right'
    }
  }
}));

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      decimalScale={2}
      isNumericString
    />
  );
};

const AcquisitionItem = ({
  isDetail,
  currentContract,
  acquisitionItem,
  setAcquisitionItem,
  backboneExp,
  setBackboneExp
  // setIsShowGenId
}) => {
  const classes = useStyles();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInit, setIsInit] = useState(true);

  const [total, setTotal] = useState(0);
  const getContractItemList = (contract, reqSubForm) => {
    setLoading(true);
    API.getContractItemList({ contract, reqSubForm: reqSubForm || undefined })
      .then((res) => {
        const resData = res?.data?.data?.items || [];
        setItems(resData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    // 有合同号才发请求
    if (currentContract) getContractItemList(currentContract.contract, currentContract.reqSubForm);
  }, [currentContract]);

  const tableHead = [
    { label: 'Item No.', textAlign: 'left' },
    { label: 'Description', textAlign: 'left' },
    { label: 'Unit', textAlign: 'left' },
    { label: 'Unit price', textAlign: 'left' },
    { label: 'Qty', textAlign: 'left' },
    { label: 'Total', textAlign: 'left' }
  ];

  // acquisitionItem下拉选择宽的改变事件
  const handleSelectChange = (e, value, row, index) => {
    if (_.isNull(value)) {
      const newAcquisitionItem = acquisitionItem.filter((item) => row.key !== item.key);
      setAcquisitionItem(newAcquisitionItem);
      return;
    }

    // 判断是否选择相同选项
    // 如果是选择与原来相同的值，则不走这逻辑
    if (row?.itemNoObj?.partNo !== value.partNo) {
      const exitItem = acquisitionItem.filter((item) => {
        let flag;
        if (_.isEmpty(item.itemNoObj)) {
          flag = false;
        } else {
          flag = value.partNo === item.itemNoObj.partNo;
        }
        return flag;
      });
      if (exitItem.length !== 0) {
        CommonTip.error('Please do not select the same item.');
        return;
      }
    }

    let newAcquisitionItem = acquisitionItem.map((val) => {
      let newVal = {};
      if (val.key === row.key) {
        newVal = {
          ...val,
          itemNoObj: { ...value },
          qty: 1
        };
      } else {
        newVal = { ...val };
      }
      return newVal;
    });
    // 如果操作的是最后一项，则添加多一个空Item
    if (index === acquisitionItem.length - 1) {
      const lastItem = { key: new Date().getTime(), itemNoObj: {}, qty: 1 };
      newAcquisitionItem = [...newAcquisitionItem, lastItem];
    }
    setAcquisitionItem(newAcquisitionItem);
  };

  // 数量的改变
  const handleCountChange = (e, row) => {
    const { value } = e?.currentTarget;
    if (value < 1) return;

    // if (value?.indexOf('.') !== -1) {
    //   value.replaceAll('.', '');
    // }

    const newAcquisitionItem = acquisitionItem.map((val) => {
      let newVal = {};
      if (val.key === row.key) {
        newVal = {
          ...val,
          qty: Number(Math.floor(value))
        };
      } else {
        newVal = val;
      }
      return newVal;
    });
    setAcquisitionItem(newAcquisitionItem);
  };

  // 计算总金额
  const computerTotal = () => {
    let total = 0;
    acquisitionItem?.forEach((element, index) => {
      if (index !== acquisitionItem.length - 1) {
        total += element.itemNoObj.unitPrice * element.qty;
      }
    });
    setTotal(total);
  };

  // 监听 Acquisition Item、backboneExp的变化，进行总价的计算
  useEffect(() => {
    computerTotal();
  }, [acquisitionItem, backboneExp]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4">Acquisition Item *</Typography>
      </Grid>
      <Grid
        container
        justifyContent="space-between"
        spacing={2}
        className={classes.acquisitionItem}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableHead.map((item) => (
                  <TableCell key={item.label} align={item.textAlign}>
                    {item.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {acquisitionItem.map((row, index) => (
                <TableRow key={row.key}>
                  <TableCell width="15%">
                    <Autocomplete
                      autoComplete
                      loading={loading}
                      value={_.isEmpty(row.itemNoObj) ? null : row.itemNoObj}
                      options={
                        _.isNull(currentContract)
                          ? []
                          : items?.filter(
                              (x) =>
                                !acquisitionItem.some(
                                  (item) => x?.description === item?.itemNoObj?.description
                                )
                            )
                      }
                      disabled={isDetail || false}
                      getOptionLabel={(option) => `${option.partNo}---${option.description}`}
                      onChange={(e, value) => {
                        // if (acquisitionItem.length === 1 && value?.itemType === 0) {
                        //   setIsShowGenId(true);
                        // }
                        handleSelectChange(e, value, row, index);
                      }}
                      renderInput={(params) => <TextField {...params} {...InputControlProps} />}
                    />
                  </TableCell>
                  <TableCell width="25%">
                    <div>{row?.itemNoObj?.description || ''}</div>
                  </TableCell>
                  <TableCell width="15%">
                    <div>{row?.itemNoObj?.unit ? row?.itemNoObj?.unit : ''}</div>
                  </TableCell>
                  <TableCell width="10%">
                    <div className={classes.money}>
                      {formatterMoney(Number(row?.itemNoObj?.unitPrice))}
                    </div>
                  </TableCell>
                  <TableCell size="small" width="15%">
                    <TextField
                      value={row?.qty}
                      variant="outlined"
                      label=""
                      size="small"
                      type="number"
                      disabled={isDetail || index === acquisitionItem.length - 1}
                      onChange={(e) => {
                        handleCountChange(e, row);
                      }}
                    />
                  </TableCell>
                  <TableCell width="10%">
                    <div className={classes.money}>
                      {formatterMoney(Number(row.itemNoObj.unitPrice * row.qty))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid container className={classes.tableFooter}>
            <Grid item xs={6} md={6} lg={6} className={classes.footerNo}>
              <strong>Contract No. {currentContract?.contract || ''}</strong>
            </Grid>
            <Grid item xs={6} md={6} lg={6} className={classes.footerMoney}>
              <TextField
                disabled
                size="small"
                label="Dataport Exp."
                variant="outlined"
                value={Number(total - backboneExp).toFixed(2)}
                className={classes.footerMoney}
                c="outlined"
                InputProps={{
                  startAdornment: <p>$</p>,
                  inputComponent: NumberFormatCustom
                }}
              />
              <span style={{ margin: '5px', fontSize: '18px', fontWeight: 700 }}>+</span>
              <TextField
                size="small"
                value={Number(backboneExp).toFixed(2)}
                label="Backbone Exp."
                className={classes.footerMoney}
                variant="outlined"
                disabled={isDetail || total <= 0}
                onChange={(params) => {
                  const { value } = params.target;
                  if (value < total || isInit) {
                    setBackboneExp(Number(value).toFixed(2) || 0);
                  } else {
                    setBackboneExp(total);
                  }
                  setIsInit(false);
                }}
                InputProps={{
                  startAdornment: <p>$</p>,
                  inputComponent: NumberFormatCustom
                }}
              />
              <span style={{ margin: '5px', fontSize: '18px', fontWeight: 700 }}>=</span>
              <TextField
                label="Grand Total"
                value={Number(total).toFixed(2)}
                className={classes.footerMoney}
                variant="outlined"
                size="small"
                disabled
                InputProps={{
                  startAdornment: <p>$</p>,
                  inputComponent: NumberFormatCustom
                }}
              />
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default memo(AcquisitionItem);
