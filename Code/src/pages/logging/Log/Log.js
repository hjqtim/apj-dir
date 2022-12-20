import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Toolbar
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { SearchBar, TablePagination, HAPaper } from '../../../components';
import API from '../../../api/log';
import formatDateTime from '../../../utils/formatDateTime';
import Detail from './Detail';

const useStyles = makeStyles(() => ({
  paper: {
    width: '100%',
    padding: 0,
    marginTop: '4vh'
  },
  row: {
    '&hover': {
      cursor: 'pointer'
    }
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '1vw',
    marginRight: '1vw'
  }
}));
const Row = withStyles((theme) => ({
  root: {
    '&:hover': {
      cursor: 'pointer'
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const ToolbarTitle = styled.div`
  min-width: 400px;
`;

const Cell = withStyles(() => ({
  root: {
    border: '1px solid #E5E5E5',
    height: '0.8vh',
    fontSize: 14
  }
}))(TableCell);

const HeadCell = withStyles(() => ({
  head: {
    backgroundColor: '#E6EBF1',
    border: '1px solid white',
    height: '4.7vh',
    padding: 0,
    paddingLeft: 16
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

// 渲染 data
const title = 'Log';
const columns = [
  { id: 'page', label: 'Page', width: 15 },
  { id: 'req', label: 'Request Path', width: 50 },
  { id: 'res', label: 'Response Code', width: 15 },
  { id: 'createAt', label: 'Request At', width: 15 }
];

export default function List() {
  const classes = useStyles();

  const [request, setRequest] = useState('');
  const [response, setResponse] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      // const { id, page, request, response } = el;
      const rowModel = {
        id: el.id,
        page: el.page,
        request: el.request,
        response: el.response,
        createdAt: formatDateTime(el.createdAt)
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  useEffect(() => {
    API.list({ ...query, limit: rowsPerPage, page: page + 1 }).then((responseList) => {
      setTotal(responseList.data.total);
      handleData(responseList.data.data);
    });
  }, [page, rowsPerPage, query]);

  const searchBarFieldList = [
    {
      id: 'request',
      label: 'Request path',
      type: 'text',
      disabled: false,
      value: request
    },
    {
      id: 'response',
      label: 'Response Code',
      type: 'text',
      disabled: false,
      value: response
    },
    {
      id: 'requestedDate',
      label: 'Requested Date',
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: requestedDate
    }
  ];

  const handleClear = () => {
    setRequest('');
    setResponse('');
    setRequestedDate('');
    setQuery({
      request: '',
      response: '',
      requestedDate: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      request,
      response,
      requestedDate
    });
    setPage(0);
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'request':
        setRequest(value);
        break;
      case 'response':
        setResponse(value);
        break;
      case 'requestedDate':
        setRequestedDate(value);
        break;
      default:
        break;
    }
  };

  const handleClick = (row) => {
    setRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRow({});
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getResPath = (req) => {
    const { url, headers } = req;
    if (url.includes('://')) {
      return url.split('://')[1];
    }
    const { host } = headers;
    return host + url;
  };

  return (
    <>
      <Helmet title={title} />
      <div style={{ marginTop: 30 }}>
        <Typography variant="h3" gutterBottom display="inline">
          {title}
        </Typography>
        <SearchBar
          onSearchFieldChange={handleFieldChange}
          onSearchButton={handleSearch}
          onClearButton={handleClear}
          fieldList={searchBarFieldList}
        />
        <HAPaper className={classes.paper}>
          <Toolbar style={{ paddingLeft: 20 }}>
            <ToolbarTitle>
              <Typography variant="h4" id="tableTitle">
                List
              </Typography>
            </ToolbarTitle>
          </Toolbar>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Table aria-labelledby="tableTitle" size="medium" aria-label="Log List">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <HeadCell
                      key={column.id}
                      align={column.align ? column.align : 'left'}
                      style={{ width: `${column.width}vw` }}
                    >
                      {column.label}
                    </HeadCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows &&
                  rows.map((row) => (
                    <Row
                      className={classes.row}
                      key={row.id}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      onClick={() => handleClick(row)}
                    >
                      <Cell align={columns[0].align ? columns[0].align : 'left'}>{row.page}</Cell>
                      <Cell align={columns[0].align ? columns[0].align : 'left'}>
                        {getResPath(row.request)}
                      </Cell>
                      <Cell align={columns[0].align ? columns[0].align : 'left'}>
                        {row.response && row.response.status}
                      </Cell>
                      <Cell align={columns[0].align ? columns[0].align : 'left'}>
                        {row.createdAt}
                      </Cell>
                    </Row>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </HAPaper>
        <Detail open={open} row={row} onClose={handleClose} />
      </div>
    </>
  );
}
