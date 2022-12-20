import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import API from '../../../api/webdp/webdp';

export default function AddressBook() {
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100
    },
    {
      field: 'hospCode',
      headerName: 'Institution',
      width: 150
    },
    {
      field: 'hospname',
      headerName: 'Name',
      width: 350
    },
    {
      field: 'contactPoint',
      headerName: 'Contact Point',
      width: 150
    },
    {
      field: 'contactNbr1',
      headerName: 'Contact Number(Office Hr)',
      width: 150
    },
    {
      field: 'contactNbrNonOffH1',
      headerName: 'Contact Number(Non-Office Hr)',
      width: 350
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 300
    }
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const obj = {};
    obj.pageIndex = 1;
    obj.pageSize = 1000;
    API.getAddressBookHospital(obj).then((res) => {
      const { items } = res.data.data;
      //   console.log('getAddressBookHospital', items);
      let temp = [];
      temp = [...items];
      for (let i = 0; i < temp.length; i += 1) {
        temp[i].id = i;
      }
      setRows([...temp]);
    });
  }, []);

  return (
    <div style={{ height: 720, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} disableColumnMenu />
    </div>
  );
}
