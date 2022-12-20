import React, { memo } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  myDataGrid: (props) => ({
    display: 'block !important',
    '& .MuiDataGrid-autoHeight': {
      minHeight: props.minHeight
    },
    '& .MuiDataGrid-root': {
      background: '#fff'
    }
  })
}));

const CommonDataGrid = (props) => {
  const {
    rows = [],
    columns = [],
    checkboxSelection = false,
    pageSize = 10,
    page,
    rowsPerPageOptions = [10, 30, 50, 100],
    onPageChange,
    onCellEditCommit,
    components,
    minHeight = '460px',
    loading = false,
    style = {},
    autoHeight = true,
    ...others
  } = props;
  const classes = useStyles({ minHeight });
  const handleOnPageChange = (page) => {
    !loading && onPageChange && onPageChange(page + 1);
  };

  return (
    <div className={classes.myDataGrid} style={style}>
      <DataGrid
        {...others}
        loading={loading}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        page={page !== undefined ? page - 1 : undefined}
        checkboxSelection={checkboxSelection}
        autoHeight={autoHeight}
        disableColumnMenu
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={handleOnPageChange}
        onCellEditCommit={onCellEditCommit}
        components={components}
      />
    </div>
  );
};

export default memo(CommonDataGrid);
