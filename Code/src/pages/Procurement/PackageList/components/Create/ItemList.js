import { Button, Checkbox, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { parse } from 'qs';
import { useHistory } from 'react-router-dom';
import { GridToolbarContainer, GridToolbarFilterButton } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { CommonDataGrid } from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import API from '../../../../../api/webdp/webdp';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

function not(a, b) {
  return a.filter((values) => b.indexOf(values) === -1);
}

function intersection(a, b) {
  return a.filter((values) => b.indexOf(values) !== -1);
}

export default function ItemList(props) {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const history = useHistory();
  const [newitemrows, setnewItemRows] = useState([]);
  const [selectrows, setSelectRows] = useState([]);
  const [itemrows, setItemRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const globalClasses = useGlobalStyles();
  const [checked, setChecked] = useState([]);
  const urlObj = parse(history.location.search?.replace('?', '')) || {};
  props.sentObject(newitemrows);
  const newitemChecked = intersection(checked, selectrows);
  const itemChecked = intersection(checked, itemrows);

  //   const handleToggle = (value) => () => {
  //     const currentIndex = checked.indexOf(value);
  //     const newChecked = [...checked];

  //     if (currentIndex === -1) {
  //       newChecked.push(value);
  //     } else {
  //       newChecked.splice(currentIndex, 1);
  //     }

  //     setChecked(newChecked);
  //   };

  const handleAllRight = () => {
    setItemRows(itemrows.concat(newitemrows));
    setnewItemRows([]);
  };
  // 左移事件：
  const handleCheckedRight = () => {
    // newitem数据拼接
    setnewItemRows(newitemrows.concat(selectrows));

    // 左表所勾选数据清除
    const clearrows = [];
    // 清空勾选数据
    setSelectRows(clearrows);
  };

  const handleCheckedLeft = () => {
    setItemRows(newitemrows.concat(itemChecked));
    setnewItemRows(not(itemrows, itemChecked));
    setChecked(not(checked, itemChecked));
  };

  const handleAllLeft = () => {
    setItemRows(newitemrows.concat(itemrows));
    setnewItemRows([]);
    console.log(checked);
    console.log('newitemcheck', newitemChecked);
  };
  // 勾选事件
  const handleRowSelection = (ckecked, obj) => {
    // 判断是否勾选
    if (ckecked) {
      // 选中后数据
      setSelectRows([...selectrows, obj]);
      setChecked([...checked, obj.id]);
    } else if (!ckecked) {
      const newSelected = selectrows.filter((item) => item.id !== obj.id);
      const newSelectedId = selectrows.id.filter((item) => item.id !== obj.id);
      setSelectRows(newSelected);
      setChecked(newSelectedId);
    }
  };
  // Package List columns
  const itemcolumns = [
    {
      field: '',
      headerName: '',
      align: 'center',
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox
          color="primary"
          onChange={(e, ckecked) => handleRowSelection(ckecked, params.row)}
          checked={selectrows.some((item) => item.id === params?.id)}
        />
      )
    },
    {
      field: 'contractNo',
      headerName: 'ContractNo',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      valueFormatter: (param) => (param.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      flex: 1
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      valueFormatter: (param) => (param.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      flex: 1
    },
    {
      field: 'createdBy',
      headerName: 'CreatedBy',
      flex: 1
    },
    {
      field: 'lastUpdatedDate',
      headerName: 'LastUpdatedDate',
      valueFormatter: (param) => (param.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      flex: 1
    }
  ];

  // rows getData

  useEffect(() => {
    getItemLists();
  }, []);

  const getItemLists = (param) => {
    if (!param) {
      param = {
        id: urlObj?.id || undefined,
        itemtype: urlObj?.itemtype || undefined
      };
    }
    setLoading(true);

    API.getItemList(param)
      .then((res) => {
        const resData = res?.data?.data?.itemList || [];
        setItemRows(resData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  // const DataCheckBox = () => (
  //   <>
  //     <Checkbox checked={console.log(' ')} />
  //   </>
  // );
  const customList = (rows) => {
    console.log('customList');
    return (
      <>
        <CommonDataGrid
          className={globalClasses.fixDatagrid}
          // checkboxSelection
          rows={rows}
          columns={itemcolumns}
          // onSelectionModelChange={(newChecked) => {
          //   setChecked(newChecked);
          //   const newSelectRows = rows[checked.splice(-1) + 1];
          //   setSelectRows([...selectrows, newSelectRows]);
          //   // console.log(itemrows.filter(filterSelectedRows));
          //   // console.log(getSelectedRows(newChecked, itemrows));
          // }}
          // selectionModel={checked}
          loading={loading}
          components={{
            Toolbar: CustomToolbar
            // Checkbox: DataCheckBox
          }}
        />
      </>
    );
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Request Form Selector</strong>
        </Typography>
      </Grid>
      <Grid item xs={5}>
        {customList(itemrows)}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItem="center">
          <Button
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={newitemrows.length === 0}
            aria-label="move all right"
          >
            {`>>`}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            // disabled={newitemChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={itemChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={itemrows.length === 0}
            aria-label="move all left"
          >
            {`<<`}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        {/* <CommonDataGrid
          {...itemrows}
          className={globalClasses.fixDatagrid}
          rows={itemrows}
          checkboxSelection
          getSelectedRows
          onSelectionModelChange={(newChecked) => {
            setChecked(newChecked);
            console.log(itemrows.filter(filterSelectedRows));
            // console.log(getSelectedRows(newChecked, itemrows));
          }}
          selectionModel={checked}
          columns={itemcolumns}
          loading={loading}
          components={{
            Toolbar: CustomToolbar
            // Checkbox: DataCheckBox
          }}
        /> */}
        {customList(newitemrows)}
      </Grid>
    </Grid>
  );
}
