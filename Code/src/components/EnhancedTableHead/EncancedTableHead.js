import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TableHead, TableSortLabel, TableRow, TableCell, Checkbox } from '@material-ui/core';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#E6EBF1',
    border: '1px solid white',
    height: '4.7vh',
    padding: 0
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

// const StyledTableCellAction = withStyles(() => ({
//   head: {
//     backgroundColor: '#E6EBF1',
//     border: '1px solid white',
//     height: '4.7vh',
//     width: '10%',
//     padding: 0,
//   },
//   body: {
//     fontSize: 14,
//   },
// }))(TableCell)

const ActionCell = withStyles(() => ({
  head: {
    backgroundColor: '#E6EBF1',
    border: '1px solid white',
    height: '4.7vh',
    width: '10%',
    padding: '1em'
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableCheckCell = withStyles(() => ({
  head: {
    backgroundColor: '#E6EBF1',
    border: '0.5px solid white',
    height: '4.7vh',
    width: '48px',
    padding: 0
  }
}))(TableCell);

const StyledTableSortLabel = withStyles(() => ({
  root: {
    paddingLeft: 16
  }
}))(TableSortLabel);

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    hideCheckBox
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {!hideCheckBox && (
          <StyledTableCheckCell align="center" padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all' }}
            />
          </StyledTableCheckCell>
          // <TableCell padding="checkbox">
          //   <Checkbox
          //     indeterminate={numSelected > 0 && numSelected < rowCount}
          //     checked={rowCount > 0 && numSelected === rowCount}
          //     onChange={onSelectAllClick}
          //     inputProps={{ 'aria-label': 'select all' }}
          //   />
          // </TableCell>
        )}
        {headCells &&
          headCells.map(
            (headCell) =>
              headCell.label === 'Actions' ? (
                <ActionCell
                  key={headCell.id}
                  align={headCell.alignment}
                  className={headCell?.headerClassName || ''}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </ActionCell>
              ) : (
                <StyledTableCell
                  key={headCell.id}
                  align={headCell.alignment}
                  className={headCell?.headerClassName || ''}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <StyledTableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </StyledTableSortLabel>
                </StyledTableCell>
              )
            // <TableCell
            //   key={headCell.id}
            //   align={headCell.alignment}
            //   padding={headCell.disablePadding ? 'none' : 'default'}
            //   sortDirection={orderBy === headCell.id ? order : false}
            // >
            //   <TableSortLabel
            //     active={orderBy === headCell.id}
            //     direction={orderBy === headCell.id ? order : 'asc'}
            //     onClick={createSortHandler(headCell.id)}
            //   >
            //     {headCell.label}
            //   </TableSortLabel>
            // </TableCell>
          )}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
