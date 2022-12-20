import React, { memo } from 'react';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector } from 'react-redux';
// import dataGridTooltip from '../../../../utils/dataGridTooltip';
import NCSTable from './NCSTable';
import NCSTitle from './NCSTitle';
import styleProps from './styleProps';
import dataGridTooltip from '../../../../utils/dataGridTooltip';

const Toolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
  </GridToolbarContainer>
);

const NCSModule = () => {
  const moduleList = useSelector((state) => state.networkCloset.moduleList); // 表格数据

  const columns = [
    {
      field: 'slotId',
      headerName: 'Slot',
      align: 'center',
      headerAlign: 'center',
      //   flex: 1,
      width: 70,
      hideSortIcons: true
    },
    {
      field: 'ownEquipId',
      headerName: 'Module Ref. ID',
      flex: 1,
      minWidth: 160,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'moduleDesc',
      headerName: 'Module Description',
      flex: 2,
      minWidth: 200,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'portQty',
      headerName: 'Port',
      align: 'center',
      headerAlign: 'center',
      //   flex: 1,
      width: 60,
      hideSortIcons: true
    },
    {
      field: 'itemOwner',
      headerName: 'Owner',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      hideSortIcons: true
    },
    {
      field: 'status',
      headerName: 'Status',
      //   flex: 1,
      width: 110,
      hideSortIcons: true
    }
  ];
  return (
    <div style={styleProps}>
      <NCSTitle title="Module" />
      <div style={{ flex: 1 }}>
        <NCSTable
          columns={columns}
          rows={moduleList}
          components={{
            Toolbar
          }}
        />
      </div>
    </div>
  );
};

export default memo(NCSModule);
