import React, { useEffect, useState } from 'react';
import { Grid, Switch } from '@material-ui/core';
import { useFormik } from 'formik';
import getIcons from '../../../../utils/getIcons';

import {
  CommonTablePlus,
  SearchBar,
  TablePagination,
  HAPaper,
  Loading,
  CommonTip,
  WarningDialog
} from '../../../../components';
import ListDialog from './ListDialog';

import API from '../../../../api/message';

const List = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [openDelete, setOpenDelete] = useState(false);
  const [cruentRow, setCruentRow] = useState({});

  const [isDetail, setIsDetail] = useState(false);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [systemName, setSystemName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [dateTime, setDateTime] = useState({});

  useEffect(() => {
    getMessagesList();
  }, [title, systemName, moduleName, dateTime, pageSize]);

  const closeAddDialog = () => {
    setCruentRow({});
    setIsDetail(false);
    setOpen(false);
  };

  const getMessagesList = (newPage) => {
    Loading.show();
    const obj = {};
    obj.pageIndex = newPage + 1 || pageIndex + 1;
    obj.pageSize = pageSize;

    if (title !== '' && title !== null) {
      obj.title = title;
    }
    if (systemName !== '' && systemName !== null) {
      obj.systemName = systemName;
    }
    if (moduleName !== '' && moduleName !== null) {
      obj.moduleName = moduleName;
    }
    if (startTime !== '' && startTime !== null) {
      obj.startTime = `${startTime} 00:00:00`;
    }
    if (endTime !== '' && endTime !== null) {
      obj.endTime = `${endTime} 23:59:59`;
    }

    API.getMessagePage(obj)
      .then((res) => {
        // console.log('getMessagePage', res);
        if (res?.data?.code === 200) {
          const tempArr = res?.data?.data;
          // console.log('getMessagePage', tempArr);
          const { records, total } = tempArr;
          setRows(records);
          setTotal(total);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const formik = useFormik({
    initialValues: {
      open: false
    },
    onSubmit: () => {
      const subject = searchBarLogsList[0].value;
      const systemName = searchBarLogsList[1].value;
      const moduleName = searchBarLogsList[2].value;

      const dateTime = searchBarLogsList[3].value;
      const { startDate } = dateTime;
      const { endDate } = dateTime;
      setTitle(subject);
      setSystemName(systemName);
      setModuleName(moduleName);

      if (startDate !== '') {
        setStartTime(startDate);
      }
      if (endDate !== '') {
        setEndTime(endDate);
      }
      setDateTime(dateTime);
    }
  });

  const handleClear = () => {
    setSearchBarLogsList([
      {
        id: 'title',
        label: 'Title',
        type: 'text',
        value: ''
      },
      {
        id: 'system',
        label: 'System',
        type: 'text',
        value: ''
      },
      {
        id: 'moduleName',
        label: 'Module Name',
        type: 'text',
        value: ''
      },
      {
        id: 'time',
        type: 'dateRange',
        disabled: false,
        readOnly: false,
        value: {
          startDate: '',
          endDate: ''
        },
        endMinDate: null,
        startDisableFuture: false,
        endDisableFuture: false
      }
    ]);
    formik.handleSubmit();
  };

  const [searchBarLogsList, setSearchBarLogsList] = useState([
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      value: ''
    },
    {
      id: 'system',
      label: 'System',
      type: 'text',
      value: ''
    },
    {
      id: 'moduleName',
      label: 'Module Name',
      type: 'text',
      value: ''
    },
    {
      id: 'time',
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: {
        startDate: '',
        endDate: ''
      },
      endMinDate: null,
      startDisableFuture: false,
      endDisableFuture: false
    }
  ]);

  const headCells = [
    { id: 'title', alignment: 'left', label: 'Title' },
    { id: 'remark', alignment: 'left', label: 'Remark' },
    { id: 'startTime', alignment: 'left', label: 'Start' },
    { id: 'endTime', alignment: 'left', label: 'End' },
    { id: 'forSystem', alignment: 'left', label: 'System' },
    { id: 'moduleName', alignment: 'left', label: 'Module Name' },
    { id: 'userGroupType', alignment: 'left', label: 'ADGroups' },
    { id: 'ifCancel', alignment: 'left', label: 'Pause' },
    { id: 'Action', alignment: 'left', label: 'Actions' }
  ];

  const fieldList = [
    { field: 'title', align: 'left' },
    { field: 'remark', align: 'left' },
    { field: 'startTime', align: 'left' },
    { field: 'endTime', align: 'left' },
    { field: 'forSystem', align: 'left' },
    { field: 'moduleName', align: 'left' },
    { field: 'userGroupType', align: 'left' },
    {
      field: 'ifCancel',
      align: 'left',
      renderCell: (row) => (
        <Switch
          checked={Boolean(row?.ifCancel)}
          onChange={(e) => {
            closeClick(e, row);
          }}
        />
      )
    }
  ];

  const onChangePage = (_, newPage) => {
    console.log('on change page', newPage);
    setPageIndex(newPage);
    getMessagesList(newPage);
  };

  const onChangeRowsPerPage = (e) => {
    // console.log('onChangeRowsPerPage', e.target.value);
    setPageSize(e.target.value);
  };

  const editClick = (e, row) => {
    setCruentRow(row);
    setOpen(true);
  };
  const detailClick = (e, row) => {
    setCruentRow(row);
    setOpen(true);
    setIsDetail(true);
  };
  const closeClick = (_, row) => {
    let obj = {};
    obj = { ...row };
    if (row.ifCancel === 1) {
      obj.ifCancel = 0;
    } else {
      obj.ifCancel = 1;
    }
    delete obj.startTime;
    delete obj.endTime;
    delete obj.createdDate;
    delete obj.lastUpdatedDate;
    let index = 0;
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i].id === row.id) {
        index = i;
        break;
      }
    }

    updateMessageContent(obj, index);
  };
  const deleteClick = (_, row) => {
    setCruentRow(row);
    setOpenDelete(true);
  };

  const updateMessageContent = (obj, index) => {
    API.updateMessage(obj).then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('Success');
        const tempRows = [...rows];
        // console.log('updateMessageContent', index, tempRows);
        tempRows[index].ifCancel = obj.ifCancel;
        setRows([...tempRows]);
      } else {
        CommonTip.error('Fail');
      }
    });
    // .finally(() => {
    //   getMessagesList();
    // });
  };
  const deleteMessageContent = (id) => {
    API.deleteMessage(id)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          closeAddDialog();
        } else {
          CommonTip.error('Fail');
        }
      })
      .finally(() => {
        getMessagesList();
      });
  };

  const actionList = [
    {
      label: 'Detail',
      icon: getIcons('detail'),
      handleClick: detailClick
    },
    {
      label: 'Edit',
      icon: getIcons('edictIcon'),
      handleClick: editClick
    },
    {
      label: 'Delete',
      icon: getIcons('delete'),
      handleClick: deleteClick
    }
  ];

  const customCreate = () => {
    setOpen(true);
  };

  const SearchFieldOnChange = (data, id) => {
    if (id === 'title') {
      const temp = [...searchBarLogsList];
      temp[0] = {
        id: 'title',
        label: 'Title',
        type: 'text',
        value: data.target.value
      };
      setSearchBarLogsList([...temp]);
    }
    if (id === 'system') {
      const temp = [...searchBarLogsList];
      temp[1] = {
        id: 'system',
        label: 'System',
        type: 'text',
        value: data.target.value
      };
      setSearchBarLogsList([...temp]);
    }
    if (id === 'moduleName') {
      const temp = [...searchBarLogsList];
      temp[2] = {
        id: 'moduleName',
        label: 'Module Name',
        type: 'text',
        value: data.target.value
      };
      setSearchBarLogsList([...temp]);
    }

    if (id === 'time') {
      const temp = [...searchBarLogsList];
      temp[3] = {
        id: 'time',
        type: 'dateRange',
        disabled: false,
        readOnly: false,
        value: {
          startDate: data.target.value.startDate,
          endDate: data.target.value.endDate
        },
        endMinDate: data.target.value.startDate,
        startDisableFuture: false,
        endDisableFuture: false
      };
      setSearchBarLogsList([...temp]);
    }
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SearchBar
            onSearchFieldChange={(data, id) => {
              SearchFieldOnChange(data, id);
            }}
            onSearchButton={formik.handleSubmit}
            onClearButton={handleClear}
            fieldList={searchBarLogsList}
          />
          <HAPaper style={{ width: '100%' }}>
            <>
              <CommonTablePlus
                hideUpdate
                // hideCreate
                customCreate={customCreate}
                hideDetail
                rows={rows}
                hideCheckBox
                tableName="List"
                headCells={headCells}
                fieldList={fieldList}
                actionList={actionList}
                // loading={loading}
              />
              <TablePagination
                count={total}
                component="div"
                onChangePage={onChangePage}
                page={pageIndex}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[10, 50, 100]}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </>
          </HAPaper>
        </Grid>
      </Grid>

      {/* 对话框 */}
      <ListDialog {...{ open, cruentRow, isDetail, closeAddDialog, getMessagesList }} />

      <WarningDialog
        handleConfirm={() => {
          setOpenDelete(false);
          setCruentRow({});
          cruentRow?.id;
          deleteMessageContent(cruentRow?.id);
        }}
        handleClose={() => {
          setOpenDelete(false);
          setCruentRow({});
        }}
        content="Are you sure delete the record?"
        open={openDelete}
      />
    </>
  );
};

export default List;
