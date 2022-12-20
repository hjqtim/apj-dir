import React from 'react';
import { TablePagination } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledTablePagination = withStyles((theme) => ({
  actions: {
    '& .MuiIconButton-root': {
      backgroundColor: theme.palette.primary.main,
      color: '#FFF',
      padding: '3px',
      fontSize: '1.125rem',
      marginRight: theme.spacing(4)
    }
  }
}))(TablePagination);

export default function TablePagin(props) {
  const {
    rowsPerPageOptions,
    count,
    rowsPerPage,
    page,
    onChangePage,
    onChangeRowsPerPage,
    loading = false
  } = props;
  return (
    <StyledTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(e, value) => {
        if (!loading) {
          onChangePage(e, value);
        }
      }}
      onRowsPerPageChange={onChangeRowsPerPage}
    />
  );
}
