import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@material-ui/core';
import { EnhancedTableToolbar, EnhancedTableHead } from '../index';

function FormTable(props) {
  const {
    rows,
    title,
    titleLevel,
    handleDelete,
    headCells,
    fieldList,
    actionList,
    hideCreate,
    hideCheckBox,
    customCreate
  } = props;
  const [selected, setSelected] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let rowList = [];
      if (rows) {
        rowList = rows;
      }
      const newSelectedList = rowList.map((n) => n.id);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <>
      <EnhancedTableToolbar
        numSelected={selected.length}
        tableName={title}
        titleLevel={titleLevel}
        onDelete={(e) => handleDelete(e, selected)}
        hideCreate={hideCreate}
        customCreate={customCreate}
      />
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows ? rows.length : 0}
            headCells={headCells}
            hideCheckBox={hideCheckBox}
          />
          <TableBody>
            {rows &&
              rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row.id}-${index}`}
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
                          <div style={{ marginRight: '26px' }}>{row[el.field]}</div>
                        </TableCell>
                      ))}
                    <TableCell padding="none" align="right">
                      <Box mt={2}>
                        {actionList &&
                          actionList.map((action, i) => (
                            <IconButton
                              key={`${i}__${action.label}`}
                              aria-label={action.label}
                              onClick={(e) => action.handleClick(e, i)}
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
    </>
  );
}

export default FormTable;
