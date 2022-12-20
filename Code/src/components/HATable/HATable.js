import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';

import { AddOutlined as AddIcon } from '@material-ui/icons';

import styled from 'styled-components';
import { EnhancedTableHead } from '../index';

const ToolbarTitle = styled.div`
  min-width: 400px;
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (!array) return;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function HATable(props) {
  const {
    rows,
    tableName,
    headCells,
    fieldList,
    actionList,
    marginTop,
    titleLevel,
    hideCheckBox,
    addChild,
    hideCreate,
    complexActionList
  } = props;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('customer');
  const [selected, setSelected] = useState([]);

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedList = rows ? rows.map((n) => n.id) : [];
      setSelected(newSelectedList);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (_, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    switch (selectedIndex) {
      case -1:
        newSelected = newSelected.concat(selected, id);
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

  const isSelected = (index) => selected.indexOf(index) !== -1;

  const handleShow = (row, el) => (el.field && row[el.field] ? row[el.field].label : '');

  return (
    <div style={{ marginTop: marginTop ? `${marginTop}vh` : 0 }}>
      <Toolbar>
        <ToolbarTitle>
          {selected.length > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {selected.length} selected
            </Typography>
          ) : (
            <Typography variant={titleLevel ? `h${titleLevel}` : 'h4'} id="tableTitle">
              {tableName}
            </Typography>
          )}
        </ToolbarTitle>
        <Spacer />
        <div>
          {selected.length > 0 && complexActionList ? (
            complexActionList.map((el, i) => (
              <Tooltip title={el.title} key={`${el.title}__${i}`}>
                <IconButton aria-label="el.title" onClick={el.onClick}>
                  {el.icon}
                </IconButton>
              </Tooltip>
            ))
          ) : !hideCreate ? (
            <Tooltip title="Create">
              <IconButton aria-label="Create" onClick={addChild}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
      </Toolbar>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows ? rows.length : 0}
            headCells={headCells}
            hideCheckBox={hideCheckBox}
          />
          <TableBody>
            {rows &&
              stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(index);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row[fieldList[0].field]}-${index}`}
                    selected={isItemSelected}
                  >
                    {!hideCheckBox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onClick={(event) => handleSelect(event, row.id)}
                        />
                      </TableCell>
                    )}
                    {fieldList &&
                      fieldList.map((el, i) => (
                        <TableCell key={`${el.field}__${i}`} align={el.align}>
                          <div style={{ marginRight: '26px' }}>{handleShow(row, el)}</div>
                        </TableCell>
                      ))}
                    <TableCell padding="none" align="right">
                      <Box>
                        {actionList &&
                          actionList.map((action, i) => (
                            <IconButton
                              key={`${i}_${action.label}`}
                              aria-label={action.label}
                              onClick={action.onClick && ((e) => action.onClick(e, index))}
                            >
                              {action.icon}
                            </IconButton>
                          ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default HATable;
