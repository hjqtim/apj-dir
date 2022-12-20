import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/vm';
import formatDateTime from '../../../../../utils/formatDateTime';
import { L } from '../../../../../utils/lang';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const {
          rid,
          dataPortIP,
          serialNumber,
          model,
          assignedMemory,
          assignedCPUCores,
          CPUType,
          diskVolumeName,
          CSVName,
          diskSize,
          status,
          hostname,
          VMClusterName,
          OS,
          serverRole,
          hostIP,
          ATLIP,
          magementHost,
          extraIPs,
          remarks,
          projectCode,
          projectContact,
          projectManager,
          section,
          createdAt,
          updatedAt
        } = data.data;
        const list = [
          {
            id: 'rid',
            label: L('RID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: rid
          },
          {
            id: 'serialNumber',
            label: L('Serial Number'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: serialNumber
          },
          {
            id: 'model',
            label: L('Model'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: model
          },
          {
            id: 'assignedMemory',
            label: L('Assigned Memory(GB)'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: assignedMemory
          },
          {
            id: 'assignedCPUCores',
            label: L('Assigned CPU Cores'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: assignedCPUCores
          },
          {
            id: 'CPUType',
            label: L('CPU Type'),
            type: 'test',
            disabled: true,
            readOnly: true,
            value: CPUType
          },
          {
            id: 'diskVolumeName',
            label: L('Disk Volume Name'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: diskVolumeName
          },
          {
            id: 'CSVName',
            label: L('CSV Name'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: CSVName
          },
          {
            id: 'diskSize',
            label: L('Disk Size'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: diskSize
          },
          {
            id: 'status',
            label: L('Status'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: status
          },
          {
            id: 'hostname',
            label: L('Hostname'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: hostname
          },
          {
            id: 'VMClusterName',
            label: L('VM Cluster'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: VMClusterName
          },
          {
            id: 'OS',
            label: L('OS'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: OS
          },
          {
            id: 'serverRole',
            label: L('Server Role'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: serverRole
          },
          {
            id: 'hostIP',
            label: L('Host IP'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: hostIP
          },
          {
            id: 'ATLIP',
            label: L('ATL IP'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ATLIP
          },
          {
            id: 'dataPortIP',
            label: L('Data port IP'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: dataPortIP
          },
          {
            id: 'magementHost',
            label: L('Magement Host'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: magementHost
          },
          {
            id: 'extraIPs',
            label: L('Extra IPs'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: extraIPs
          },
          {
            id: 'remarks',
            label: L('Remarks'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: remarks
          },
          {
            id: 'projectCode',
            label: L('Project Code'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: projectCode
          },
          {
            id: 'projectContact',
            label: L('Project Contact'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: projectContact
          },
          {
            id: 'projectManager',
            label: L('Project Manager'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: projectManager
          },
          {
            id: 'section',
            label: L('Section'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: section
          },
          {
            id: 'createdAt',
            label: L('Created At'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: formatDateTime(createdAt)
          },
          {
            id: 'updatedAt',
            label: L('Updated At'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: formatDateTime(updatedAt)
          }
        ];
        setFormFieldList(list);
      }
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default Detail;
