import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
// import { CommonDataGrid } from '../../../../components';
// import { makeStyles } from '@material-ui/core';
import API from '../../../../api/webdp/webdp';
import { useGlobalStyles } from '../../../../style';

// const useStyles = makeStyles({
//   myDataGrid: {
//     '& .MuiTablePagination-caption': {
//       width: 'auto!important',
//       padding: 'unset!important'
//     }
//   }
// });

export default function AddressBook() {
  // const classes = useStyles();
  const globalclasses = useGlobalStyles();

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100
    },
    {
      field: 'institution',
      headerName: 'Institution',
      width: 150
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 350
    },
    {
      field: 'contactPoint',
      headerName: 'Contact Point',
      width: 150
    },
    {
      field: 'contactNumberOfficeHr',
      headerName: 'Contact Number(Office Hr)',
      width: 150
    },
    {
      field: 'contactNumberNonOfficeHr',
      headerName: 'Contact Number(Non-Office Hr)',
      width: 350
    }
    // {
    //   field: 'remarks',
    //   headerName: 'Remarks',
    //   width: 300
    // }
  ];

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const defaultValue = {
    pageNo: 1,
    pageSize: 10
  };
  const [params, setParams] = useState(defaultValue);

  useEffect(() => {
    API.getInstitutionProfile().then((res) => {
      const items = res.data.data;
      setTotal(items.length);
      console.log('getInstitutionProfile', res);
      let temp = [];
      temp = [...items];
      for (let i = 0; i < temp.length; i += 1) {
        temp[i].id = i;
      }
      setRows([...temp]);
    });
  }, []);

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageNo: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };
  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageNo: pageIndex
    };
    setParams(newParams);
  };

  return (
    <div style={{ width: '100%', height: '78vh' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        pageSize={params.pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        // className={classes.myDataGrid}
        className={globalclasses.fixDatagrid}
      />
    </div>
  );
}
