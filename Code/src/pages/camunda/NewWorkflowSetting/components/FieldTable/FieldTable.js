import React, { memo, useEffect, useImperativeHandle, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Table
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  BorderColorOutlined as BorderColorIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
import { L } from '../../../../../utils/lang';
import getStyle from '../../../../../utils/dynamicForm/style';
import FieldDialog from '../FieldDialog';

const Dialog = memo(FieldDialog);

const ToolbarTitle = styled.div`
  min-width: 400px;
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const headerCellList = [
  { id: 'fieldName', alignment: 'left', label: L('Field Name') },
  { id: 'fieldDisplayName', alignment: 'left', label: L('Field Display Name') },
  { id: 'inputType', alignment: 'left', label: L('Type') },
  { id: 'showOnRequest', alignment: 'left', label: L('Show On Request') },
  { id: 'action', alignment: 'left', label: L('Action') }
];

const FieldTable = React.forwardRef((props, ref) => {
  const { hideDelete, hideCreate, hideCheckBox, initDataList, formDetail, tableTitle, hide } =
    props;

  useImperativeHandle(ref, () => ({
    ref: ref.current,
    dataList
  }));

  const style = getStyle('');
  const useStyles = makeStyles(() => ({
    container: {
      width: '100%',
      ...(style ? style.childTable : {})
    },
    table: { ...(style ? style.childTable : {}) },
    header: {
      minHeight: '3em',
      ...(style ? style.childTable : {})
    },
    headerRow: {
      backgroundColor: '#E6EBF1',
      ...(style ? style.childTable : {})
    },
    headerCheckBox: {
      backgroundColor: '#E6EBF1',
      height: '4.7vh',
      width: '48px',
      padding: 0,
      ...(style ? style.childTable : {})
    },
    headerCell: {
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#fff',
      height: '3em',
      padding: '0 1.2em',
      fontSize: '14px',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      ...(style ? style.childTable : {})
    },
    toolbar: {
      width: '100%'
    },
    toolbarTitle: {
      marginLeft: -10,
      ...(style ? style.childTable : {})
    },
    toolbarSelectText: { ...(style ? style.childTable : {}) },
    toolbarTitleText: {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      ...(style ? style.childTable : {})
    },
    toolbarButton: {
      display: 'flex',
      ...(style ? style.childTable : {})
    },
    toolbarAddButton: {
      marginRight: -10,
      backgroundColor: '#D3DCFC',
      color: '#325df4',
      fontWeight: 'bold',
      ...(style ? style.childTable : {})
    },
    toolbarDeleteButton: {
      marginRight: -10,
      backgroundColor: '#DC004E',
      color: 'white',
      fontWeight: 'bold',
      ...(style ? style.childTable : {})
    },
    rowCell: { ...(style ? style.rowCell : {}) },
    rowActionCell: { ...(style ? style.rowActionCell : {}) }
  }));
  const classes = useStyles();

  const [dataList, setDataList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    initDataList && setDataList(initDataList);
  }, [initDataList]);

  const StyledTableRow = withStyles(() => ({
    root: {
      '&:nth-of-type(even)': {
        backgroundColor: '#F9F9F9'
      },
      ...(style ? style.childTableRow : {})
    }
  }))(TableRow);

  const StyledTableCell = withStyles(() => ({
    root: {
      borderLeft: '1px solid #E5E5E5',
      borderRight: '1px solid #E5E5E5',
      padding: '0 0.6em',
      height: '3em',
      fontSize: 14,
      ...(style ? style.childTableCell : {})
    }
  }))(TableCell);

  const isSelected = (index) => selected.indexOf(index) !== -1;

  const handleSelect = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];
    switch (selectedIndex) {
      case -1:
        newSelected = newSelected.concat(selected, index);
        break;
      case 0:
        newSelected = newSelected.concat(selected.slice(1));
        break;
      case selected.length - 1:
        newSelected = newSelected.concat(selected.slice(0, -1));
        break;
      default:
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
        break;
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked && dataList.length) {
      const newSelectedList = [];
      for (let i = 0; i < dataList.length; i++) {
        newSelectedList.push(i);
      }
      setSelected(newSelectedList);
      return;
    }
    setSelected([]);
  };

  const handleDialogSave = (obj) => {
    const Newobj = {
      fieldDisplayName: 'TEST333',
      fieldName: 'test333',
      fieldType: 'string',
      foreignDisplayKey: null,
      foreignKey: null,
      foreignTable: null,
      inputType: 'text',
      readable: '0',
      required: '0',
      showOnRequest: '0',
      writable: '0'
    };
    if (currentIndex === -1) {
      dataList.push(Newobj);
    } else {
      dataList[currentIndex] = obj;
    }
  };

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentIndex(-1);
  };

  const handleDeleteSelected = () => {
    setDataList(dataList.filter((_, i) => selected.indexOf(i) === -1));
    setSelected([]);
  };

  const getLabelValue = (fieldName, value) => {
    if (fieldName === 'showOnRequest') {
      return value === '1' ? 'true' : 'false';
    }
    if (!value || !formDetail) return `${value}`;
    const [field] = formDetail.filter((item) => item.fieldName === fieldName);
    if (!field) return `${value}`;
    const { valueField, labelField, itemList } = field;
    if (!valueField || !labelField || !itemList) {
      return value;
    }
    const [targetItem] = itemList.filter((el) => `${el[valueField]}` === `${value}`);
    if (!targetItem) return value;
    return targetItem[labelField];
  };

  const handleDelete = (index) => {
    setDataList(dataList.filter((_, i) => index !== i));
  };

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        visibility: hide ? 'hidden' : 'visible',
        height: hide ? 0 : 'unset',
        overflow: 'hidden'
      }}
    >
      <Toolbar className={classes.toolbar}>
        <ToolbarTitle className={classes.toolbarTitle}>
          {selected.length > 0 ? (
            <Typography color="inherit" variant="subtitle1" className={classes.toolbarSelectText}>
              {selected.length} selected
            </Typography>
          ) : (
            <Typography variant="h4" id="tableTitle" className={classes.toolbarTitleText}>
              {L(tableTitle || 'Field List')}
            </Typography>
          )}
        </ToolbarTitle>
        <Spacer />
        <div className={classes.toolbarButton}>
          {selected.length > 0 && !hideDelete ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                size="small"
                className={classes.toolbarDeleteButton}
                onClick={handleDeleteSelected}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Tooltip>
          ) : !hideCreate ? (
            <Tooltip title="Add">
              <Button
                variant="contained"
                size="small"
                className={classes.toolbarAddButton}
                startIcon={<AddIcon />}
                onClick={() => handleOpen(-1)}
              >
                Add
              </Button>
            </Tooltip>
          ) : null}
        </div>
      </Toolbar>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="Child Table"
        >
          <TableHead className={classes.header}>
            <TableRow className={classes.headerRow}>
              {!hideCheckBox && (
                <TableCell
                  align="center"
                  padding="checkbox"
                  className={classes.headerCell}
                  style={{ padding: 0 }}
                >
                  <Checkbox
                    className={classes.headerCheckBox}
                    indeterminate={selected.length > 0 && selected.length < dataList.length}
                    checked={dataList.length > 0 && selected.length === dataList.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}
              {headerCellList &&
                headerCellList.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignment}
                    className={classes.headerCell}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList &&
              dataList.map((row, index) => (
                <StyledTableRow key={`childList_${index}`}>
                  {!hideCheckBox && (
                    <StyledTableCell padding="checkbox">
                      <Checkbox checked={isSelected(index)} onClick={() => handleSelect(index)} />
                    </StyledTableCell>
                  )}
                  {headerCellList &&
                    headerCellList.map((cell, i) =>
                      cell.id !== 'action' ? (
                        <StyledTableCell
                          className={classes.rowCell}
                          key={`childList _${index}cell_${i}`}
                        >
                          {getLabelValue(cell.id, row[cell.id])}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell
                          className={classes.rowActionCell}
                          align="left"
                          key={`childList _${index}cell_${i}`}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              boxSizing: 'border-box',
                              paddingLeft: '0.5em'
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleOpen(index)}
                                style={{ padding: 0 }}
                              >
                                <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />
                              </IconButton>
                            </Tooltip>
                            {!hideDelete && (
                              <div style={{ marginLeft: '1em' }}>
                                <Tooltip title="Remove">
                                  <IconButton
                                    aria-label="Remove"
                                    onClick={() => {
                                      handleDelete(index);
                                      setSelected([...selected]);
                                    }}
                                    style={{
                                      padding: 0
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" style={{ color: '#F44336' }} />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </StyledTableCell>
                      )
                    )}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <Dialog
          open={open}
          initData={dataList[currentIndex]}
          onClose={() => handleClose()}
          handleSave={handleDialogSave}
        />
      )}
    </div>
  );
});

export default FieldTable;
