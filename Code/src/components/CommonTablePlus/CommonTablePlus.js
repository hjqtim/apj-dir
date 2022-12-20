import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  CircularProgress
} from '@material-ui/core';

// import {
//   RemoveRedEye as RemoveRedEyeIcon,
//   BorderColorOutlined as BorderColorIcon
// } from '@material-ui/icons';
import { EnhancedTableToolbar, EnhancedTableHead } from '../index';
import CommentTip from '../CommonTip';
import Loading from '../Loading';
import getIcons from '../../utils/getIcons';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const StyledTableCell = withStyles(() => ({
  root: {
    border: '1px solid #E5E5E5',
    height: '0.8vh',
    fontSize: 14
  }
}))(TableCell);

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
  if (!array) return [];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function CommonTablePlus(props) {
  const {
    rows,
    tableName,
    deleteAPI,
    handleSearch,
    // path,
    headCells,
    fieldList,
    hideDetail,
    // hideUpdate,
    hideCreate,
    hideCheckBox,
    customCreate,
    actionList,
    marginTop,
    showDownLoad,
    page,
    loading: tableLoading = false, // 表格是否显示“加载中”
    hideToolBar = false, // 是否隐藏toolbar
    hideActionColumn = false, // 是否隐藏action栏
    createTitle
  } = props;
  let { hideUpdate } = props;
  const history = useHistory();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('customer');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const path = useLocation().pathname;

  const handleDelete = () => {
    if (loading || !deleteAPI) return;
    setLoading(true);
    Loading.show();
    deleteAPI({ idList: selected })
      .then(() => {
        CommentTip.success('Success');
        handleSearch();
        setLoading(false);
        setSelected([]);
        Loading.hide();
      })
      .catch(() => {
        setLoading(false);
        Loading.hide();
      });
  };

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

  const handleDetail = (_, id) => {
    console.log(`path${path}`);
    history.push({ pathname: `${path}detail/${id}` });
  };

  const handleUpdate = (_, id) => {
    history.push({ pathname: `${path}update/${id}` });
  };

  const display = (action, row) => {
    // return action.display && action.display(row)
    if (action.display) {
      return action.display(row);
    }
    return true;
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <div
      style={{
        marginTop: marginTop ? `${marginTop}vh` : 0,
        paddingLeft: 20,
        paddingRight: 20
      }}
    >
      {!hideToolBar && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          tableName={tableName}
          createPath="/create"
          onDelete={handleDelete}
          hideDelete={!deleteAPI}
          hideCreate={hideCreate}
          customCreate={customCreate}
          showDownLoad={showDownLoad}
          page={page}
          createTitle={createTitle}
        />
      )}

      <TableContainer style={{ position: 'relative' }}>
        {tableLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <CircularProgress />
          </div>
        )}

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
            {/* 给表格最低高度 */}
            {!rows?.length && <tr style={{ height: '300px' }} />}
            {rows &&
              stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                const temphideUpdate = hideUpdate;
                if (Object.keys(row).indexOf('allowupdate') !== -1) {
                  hideUpdate = row.allowupdate;
                } else {
                  hideUpdate = temphideUpdate;
                }

                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row.id}-${index}`}
                    selected={isItemSelected}
                  >
                    {!hideCheckBox && (
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onClick={(event) => handleSelect(event, row.id)}
                        />
                      </StyledTableCell>
                    )}
                    {fieldList &&
                      fieldList.map((el, i) => (
                        <StyledTableCell
                          key={`${el.field}__${i}`}
                          align={el.align}
                          padding={el.padding ? el.padding : 'normal'}
                          className={el.cellClassName || ''}
                        >
                          {el.renderCell ? el.renderCell(row) : row[el.field]}
                          {/* <div theme={{ marginleft: '20px' }}> */}
                          {/*  {row[el.field]} */}
                          {/* </div> */}
                        </StyledTableCell>
                      ))}
                    <StyledTableCell
                      padding="none"
                      align="left"
                      style={{ display: hideActionColumn ? 'none' : '' }}
                    >
                      {!hideDetail && (
                        <Tooltip title="Detail">
                          <IconButton
                            aria-label="detail"
                            onClick={(event) => handleDetail(event, row.id)}
                          >
                            {getIcons('detaiEyeIcon')}
                          </IconButton>
                        </Tooltip>
                      )}

                      {!hideUpdate && (
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="update"
                            onClick={(event) => handleUpdate(event, row.id)}
                          >
                            {getIcons('edictIcon')}
                          </IconButton>
                        </Tooltip>
                      )}
                      {actionList &&
                        actionList.map((action, i) => {
                          // console.log('map', action, i, row);
                          if (action.label === 'Disable') {
                            return display(action, row) && row.ifCancel === 1 ? (
                              <Tooltip title={action.label} key={`${i * i * i}_${action.label}`}>
                                <IconButton
                                  disabled={Boolean(action?.disabled)}
                                  key={`${i}_${action.label}`}
                                  aria-label={action.label}
                                  onClick={(e) => action.handleClick(e, row, index)}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            ) : null;
                          }
                          if (action.label === 'Enable') {
                            return display(action, row) && row.ifCancel === 0 ? (
                              <Tooltip title={action.label} key={`${i * i * i}_${action.label}`}>
                                <IconButton
                                  disabled={Boolean(action?.disabled)}
                                  key={`${i}_${action.label}`}
                                  aria-label={action.label}
                                  onClick={(e) => action.handleClick(e, row, index)}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            ) : null;
                          }
                          return display(action, row) ? (
                            <Tooltip title={action.label} key={`${i * i * i}_${action.label}`}>
                              <IconButton
                                disabled={Boolean(action?.disabled)}
                                key={`${i}_${action.label}`}
                                aria-label={action.label}
                                onClick={(e) => action.handleClick(e, row, index)}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ) : null;
                        })}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CommonTablePlus;
