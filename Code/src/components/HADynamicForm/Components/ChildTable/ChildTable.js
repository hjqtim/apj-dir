import React, { useState, memo, useContext } from 'react';
import {
  Checkbox,
  TableCell,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  Typography,
  Tooltip,
  Button,
  Toolbar,
  TableBody,
  IconButton
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  AddCircle as AddIcon,
  BorderColorOutlined as BorderColorIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
import styled from 'styled-components';
import { DynamicContext } from '../../HADynamicForm';
import ChildForm from '../ChildForm';

const ToolbarTitle = styled.div`
  min-width: 400px;
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const MemoChildForm = memo(ChildForm);

export default function ChildTable() {
  const { logic, style } = useContext(DynamicContext);

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

  const [selected, setSelected] = useState([]);

  const [open, setOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const useStyles = makeStyles(() => ({
    container: { width: '100%', ...(style ? style.childTable : {}) },
    table: { ...(style ? style.childTable : {}) },
    header: { minHeight: '3em', ...(style ? style.childTable : {}) },
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
    toolbar: { ...(style ? style.childTable : {}) },
    toolbarTitle: { marginLeft: -10, ...(style ? style.childTable : {}) },
    toolbarSelectText: { ...(style ? style.childTable : {}) },
    toolbarTitleText: {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      ...(style ? style.childTable : {})
    },
    toolbarButton: { display: 'flex', ...(style ? style.childTable : {}) },
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
    rowCell: { padding: '0 1.2em', ...(style ? style.rowCell : {}) },
    rowActionCell: { padding: '0', ...(style ? style.rowActionCell : {}) }
    // toolbar: Object.assign({}, style ? style.container : {}),
  }));

  const classes = useStyles();

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
    if (event.target.checked && logic.childrenDataList.length) {
      const newSelectedList = [];
      for (let i = 0; i < logic.childrenDataList.length; i += 1) {
        newSelectedList.push(i);
      }
      setSelected(newSelectedList);
      return;
    }
    setSelected([]);
  };

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setCurrentIndex(-1);
  };

  const handleDelete = () => {
    logic && logic.deleteChild(selected);
    setSelected([]);
  };

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <ToolbarTitle className={classes.toolbarTitle}>
          {selected.length > 0 ? (
            <Typography color="inherit" variant="subtitle1" className={classes.toolbarSelectText}>
              {selected.length} selected
            </Typography>
          ) : (
            <Typography variant="h4" id="tableTitle" className={classes.toolbarTitleText}>
              {logic && logic.getChildTableTitle()}
            </Typography>
          )}
        </ToolbarTitle>
        <Spacer />
        <div className={classes.toolbarButton}>
          {selected.length > 0 && logic && !logic.hideDelete ? (
            <Tooltip title="Delete">
              <Button
                variant="contained"
                size="small"
                className={classes.toolbarDeleteButton}
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Tooltip>
          ) : logic && !logic.hideCreate ? (
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
              {logic && !logic.hideCheckBox && (
                <TableCell
                  align="center"
                  padding="checkbox"
                  className={classes.headerCell}
                  style={{ padding: 0 }}
                >
                  <Checkbox
                    className={classes.headerCheckBox}
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < (logic.childrenDataList ? logic.childrenDataList.length : 0)
                    }
                    checked={
                      (logic.childrenDataList ? logic.childrenDataList.length : 0) > 0 &&
                      selected.length ===
                        (logic.childrenDataList ? logic.childrenDataList.length : 0)
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}
              {logic &&
                logic.childHeaderCellList &&
                logic.childHeaderCellList.map((headCell) => (
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
            {logic &&
              logic.childrenDataList.map((row, index) => (
                <StyledTableRow key={`childList_${index}`}>
                  {logic && !logic.hideCheckBox && (
                    <StyledTableCell padding="checkbox">
                      <Checkbox checked={isSelected(index)} onClick={() => handleSelect(index)} />
                    </StyledTableCell>
                  )}
                  {logic.childHeaderCellList &&
                    logic.childHeaderCellList.map((cell, i) =>
                      cell.id !== 'action' ? (
                        <StyledTableCell
                          className={classes.rowCell}
                          key={`childList _${index}cell_${i}`}
                        >
                          {logic && logic.getChildLabelValue(cell.id, row.get(cell.id))}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell
                          className={classes.rowActionCell}
                          align="left"
                          key={`childList _${index}cell_${i}`}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              aria-label="edit"
                              onClick={() => {
                                setCurrentIndex(index);
                                setOpen(true);
                              }}
                            >
                              <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />
                            </IconButton>
                          </Tooltip>
                          {logic && !logic.hideDelete && (
                            <Tooltip title="Remove">
                              <IconButton
                                aria-label="Remove"
                                onClick={() => {
                                  logic && logic.deleteChild([index]);
                                  setSelected([...selected]);
                                }}
                              >
                                <DeleteIcon fontSize="small" style={{ color: '#F44336' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </StyledTableCell>
                      )
                    )}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MemoChildForm open={open} currentIndex={currentIndex} onClose={handleClose} />
    </>
  );
}
