import React, { memo, useState } from 'react';
import { makeStyles, Switch } from '@material-ui/core';
import { CommonDataGrid } from '../../../../../components';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-root': {
      // border: 'none',
      fontSize: '0.8rem',
      height: '100%'
    },
    '& .MuiDataGrid-columnHeaderWrapper': {
      backgroundColor: '#E6EBF1'
    },
    '& .MuiDataGrid-footerContainer': {
      minHeight: 'auto'
    },
    '& .MuiDataGrid-footerContainer .MuiIconButton-root': {
      padding: 0
    },
    '& .MuiTablePagination-root .MuiTablePagination-toolbar': {
      minHeight: '30px'
    },
    '& .MuiDataGrid-columnsContainer .data-grid-edit-class': {
      color: '#229FFA'
    },
    '& .my-select-item-color': {
      backgroundColor: 'rgba(63, 81, 181, 0.2) !important'
    },
    '& .my-table-active-color': {
      backgroundColor: 'rgba(63, 81, 181, 0.2)'
    },
    '& .my-table-even-color': {
      backgroundColor: '#f5f5f5'
    },
    '& .MuiDataGrid-row:hover': {
      // backgroundColor: 'rgba(63, 81, 181, 0.2)'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      padding: 0
    }
  },
  btnHover: {
    padding: '6px 8px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(15, 62, 91, 0.04)'
    }
  }
}));

const NCSTable = (props) => {
  // selectItem 选中的item对象
  const { columns, rows, selectItem, components, ...others } = props;

  const [isOpenColumnsShow] = useState(!components?.ColumnsPanel); // 如果没有传递ColumnsPanel，需要该组件内部开启显示与隐藏columns功能
  const [columnsDisplay, setColumnsDisplay] = useState({});

  const classes = useStyles();

  const newColumns = columns.map((item) => {
    const newItem = { ...item };
    // 如果可修改，表头颜色将会被修改
    if (newItem.editable) {
      newItem.headerClassName = 'data-grid-edit-class';
    }

    if (isOpenColumnsShow) {
      newItem.hide = Boolean(columnsDisplay[newItem.field]);
    }
    return newItem;
  });

  // columns显示与隐藏组件
  const ColumnsPanel = () => (
    <div style={{ padding: 10, overflow: 'auto', width: '100%' }}>
      {newColumns.map((item) => (
        <div key={item.field}>
          <Switch
            size="small"
            color="primary"
            checked={!item.hide}
            onChange={(e, v) => {
              setColumnsDisplay({ ...columnsDisplay, [item.field]: !v });
            }}
          />
          &nbsp;
          {item.headerName}
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#0F3E5B',
          fontWeight: 600
        }}
      >
        <div
          className={classes.btnHover}
          onClick={() => {
            const newColumnsDisplay = {};
            newColumns.forEach((item) => {
              newColumnsDisplay[item.field] = true;
            });
            setColumnsDisplay(newColumnsDisplay);
          }}
        >
          Hide all
        </div>
        <div
          className={classes.btnHover}
          onClick={() => {
            const newColumnsDisplay = {};
            newColumns.forEach((item) => {
              newColumnsDisplay[item.field] = false;
            });
            setColumnsDisplay(newColumnsDisplay);
          }}
        >
          Show all
        </div>
      </div>
    </div>
  );

  if (isOpenColumnsShow && components) {
    components.ColumnsPanel = ColumnsPanel;
  }

  rows.forEach((item, index) => {
    // 隔行换色
    item.tableIndex = index;
  });

  const pageSize = 100;
  // console.log(columns, rows, newColumns);
  return (
    <div className={classes.root}>
      <CommonDataGrid
        rows={rows}
        columns={newColumns}
        pageSize={pageSize}
        rowHeight={20}
        style={{ height: '100%' }}
        autoHeight={false}
        hideFooterSelectedRowCount
        filterMode="server"
        headerHeight={20}
        rowsPerPageOptions={[pageSize]}
        // hideFooter={rows.length <= pageSize}
        sortingMode="server"
        components={{ ...components }}
        isRowSelectable={() => false}
        getRowClassName={(params) => {
          const { row } = params;
          if (selectItem.find((item) => item?.id === row.id)) {
            return 'my-select-item-color';
          }
          if (selectItem?.id === row.id) {
            return 'my-select-item-color';
          }
          return row.tableIndex % 2 === 1 ? 'my-table-even-color' : '';
        }}
        {...others}
      />
    </div>
  );
};

export default memo(NCSTable);
