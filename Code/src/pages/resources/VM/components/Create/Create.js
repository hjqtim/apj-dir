import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/vm';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, checkEmptyAre, getCheckExist } from '../../untils/VMFieldCheck';
import tenantApi from '../../../../../api/tenant';
import { L } from '../../../../../utils/lang';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [serialNumberError, setSerialNumberError] = useState(false);
  const [serialNumberHelperText, setSerialNumberHelperText] = useState('');
  const [assignedMemoryError, setAssignedMemoryError] = useState(false);
  const [assignedMemoryHelperText, setAssignedMemoryHelperText] = useState('');
  const [assignedCPUCoresError, setAssignedCPUCoresError] = useState(false);
  const [assignedCPUCoresHelperText, setAssignedCPUCoresHelperText] = useState('');
  const [CPUTypeError, setCPUTypeError] = useState(false);
  const [CPUTypeHelperText, setCPUTypeHelperText] = useState('');
  const [diskSizeError, setDiskSizeError] = useState(false);
  const [diskSizeHelperText, setDiskSizeHelperText] = useState('');
  const [VMClusterIdError, setVMClusterIdError] = useState(false);
  const [VMClusterIdHelperText, setVMClusterIdHelperText] = useState('');
  const [clusterList, setClusterList] = useState([]);
  const [tenantError, setTenantError] = useState(false);
  const [tenantHelperText, setTenantHelperText] = useState('');
  const [tenantList, setTenantList] = useState([]);
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const serialNumberError = await serialNumberCheck();
    const assignedMemoryError = await assignedMemoryCheck();
    const assignedCPUCoresError = await assignedCPUCoresCheck();
    const diskSizeError = await diskSizeCheck();
    const tenantError = await tenantCheck();
    const vmClusterError = await VMClusterIdCheck();
    const CPUTypeError = await CPUTypeCheck();
    if (
      serialNumberError ||
      assignedMemoryError ||
      assignedCPUCoresError ||
      vmClusterError ||
      CPUTypeError ||
      diskSizeError ||
      tenantError ||
      saving
    )
      return;
    let projectCode;
    let projectContact;
    let projectManager;
    let VMClusterName;
    tenantList.forEach((_) => {
      if (_.id === map.get('tenantId')) {
        projectCode = _.code;
        projectContact = _.contact_person;
        projectManager = _.manager_group.name;
      }
    });
    clusterList.forEach((_) => {
      if (_.id === map.get('VMClusterId')) {
        VMClusterName = _.VMClusterName;
      }
    });
    setSaving(true);
    API.create({
      rid: map.get('rid'),
      dataPortIP: map.get('dataPortIP'),
      serialNumber: map.get('serialNumber'),
      model: map.get('model'),
      assignedMemory: map.get('assignedMemory'),
      assignedCPUCores: map.get('assignedCPUCores'),
      diskVolumeName: map.get('diskVolumeName'),
      CSVName: map.get('CSVName'),
      diskSize: map.get('diskSize'),
      hostname: map.get('hostname'),
      VMClusterId: map.get('VMClusterId'),
      VMClusterName,
      OS: map.get('OS'),
      serverRole: map.get('serverRole'),
      hostIP: map.get('hostIP'),
      ATLIP: map.get('ATLIP'),
      magementHost: map.get('magementHost'),
      extraIPs: map.get('extraIPs'),
      remarks: map.get('remarks'),
      tenantId: map.get('tenantId'),
      projectCode,
      projectContact,
      projectManager,
      section: map.get('section'),
      CPUType: map.get('CPUType')
    })
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/resources/vm' });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    tenantApi
      .list({ limit: 999, page: 1 })
      .then(({ data }) => {
        if (data && data.data) {
          return data.data.rows;
        }
        return [];
      })
      .then((returnObj) => {
        API.listCluster({ limit: 999, page: 1 })
          .then(({ data }) => {
            if (data && data.data) {
              return {
                tenantList: returnObj,
                clusterList: data.data.rows
              };
            }
            return {
              tenantList: returnObj,
              clusterList: []
            };
          })
          .then((returnObj) => {
            setTenantList(returnObj.tenantList);
            setClusterList(returnObj.clusterList);
            const list = [
              {
                id: 'rid',
                label: L('RID'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'serialNumber',
                label: L('SerialNumber'),
                type: 'text',
                required: true,
                readOnly: false,
                value: '',
                error: serialNumberError,
                helperText: serialNumberHelperText
              },
              {
                id: 'model',
                label: L('Model'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'assignedMemory',
                label: L('Assigned Memory(GB)'),
                type: 'text',
                required: true,
                readOnly: false,
                value: '',
                error: assignedMemoryError,
                helperText: assignedMemoryHelperText
              },
              {
                id: 'assignedCPUCores',
                label: L('Assigned CPU Cores'),
                type: 'text',
                required: true,
                readOnly: false,
                value: '',
                error: assignedCPUCoresError,
                helperText: assignedCPUCoresHelperText
              },
              {
                id: 'CPUType',
                label: L('CPU Type'),
                type: 'text',
                required: true,
                readOnly: false,
                value: '',
                error: CPUTypeError,
                helperText: CPUTypeHelperText
              },
              {
                id: 'diskVolumeName',
                label: L('Disk Volume Name'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'CSVName',
                label: L('CSV Name'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'diskSize',
                label: L('Disk Size'),
                type: 'text',
                required: true,
                readOnly: false,
                value: '',
                error: diskSizeError,
                helperText: diskSizeHelperText
              },
              {
                id: 'hostname',
                label: L('Hostname'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'VMClusterId',
                label: L('VM Cluster'),
                type: 'select',
                required: true,
                value: '',
                itemList: returnObj.clusterList,
                labelField: 'VMClusterName',
                valueField: 'id',
                error: VMClusterIdError,
                helperText: VMClusterIdHelperText
              },
              {
                id: 'OS',
                label: L('OS'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'serverRole',
                label: L('Server Role'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'hostIP',
                label: L('Host IP'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'ATLIP',
                label: L('ATL IP'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'dataPortIP',
                label: L('Data port IP'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'magementHost',
                label: L('Magement Host'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'extraIPs',
                label: L('Extra IPs'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'remarks',
                label: L('Remarks'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              },
              {
                id: 'tenantId',
                label: L('Tenant'),
                type: 'select',
                required: true,
                value: '',
                itemList: returnObj.tenantList,
                labelField: 'name',
                valueField: 'id',
                error: tenantError,
                helperText: tenantHelperText
              },
              {
                id: 'section',
                label: L('Section'),
                type: 'text',
                required: false,
                readOnly: false,
                value: ''
              }
            ];
            setFormFieldList(list);
          });
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const errors = {
      serialNumber: {
        error: serialNumberError,
        helperText: serialNumberHelperText
      },
      assignedMemory: {
        error: assignedMemoryError,
        helperText: assignedMemoryHelperText
      },
      assignedCPUCores: {
        error: assignedCPUCoresError,
        helperText: assignedCPUCoresHelperText
      },
      CPUType: {
        error: CPUTypeError,
        helperText: CPUTypeHelperText
      },
      diskSize: {
        error: diskSizeError,
        helperText: diskSizeHelperText
      },
      VMClusterId: {
        error: VMClusterIdError,
        helperText: VMClusterIdHelperText
      },
      tenantId: {
        error: tenantError,
        helperText: tenantHelperText
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [
    serialNumberHelperText,
    assignedMemoryHelperText,
    assignedCPUCoresHelperText,
    CPUTypeHelperText,
    diskSizeHelperText,
    VMClusterIdHelperText,
    tenantHelperText
  ]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    map.set(id, value);
  };

  const serialNumberCheck = async () => {
    const emptyCheck = checkEmpty('Serial number', map.get('serialNumber'));
    setSerialNumberError(emptyCheck.error);
    setSerialNumberHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, map.get('serialNumber'));
      setSerialNumberError(error);
      setSerialNumberHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  const assignedMemoryCheck = async () => {
    const emptyCheck = checkEmpty('Assigned memory', map.get('assignedMemory'));
    setAssignedMemoryError(emptyCheck.error);
    setAssignedMemoryHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const reg = /^(0|\d+)(\.\d+)?$/;
      if (!reg.test(map.get('assignedMemory'))) {
        setAssignedMemoryError(true);
        setAssignedMemoryHelperText(L('Only accept positive float'));
        return true;
      }
    }
    return emptyCheck.error;
  };

  const assignedCPUCoresCheck = async () => {
    const emptyCheck = checkEmptyAre('Assigned CPU cores', map.get('assignedCPUCores'));
    setAssignedCPUCoresError(emptyCheck.error);
    setAssignedCPUCoresHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(map.get('assignedCPUCores'))) {
        setAssignedCPUCoresError(true);
        setAssignedCPUCoresHelperText(L('Only accept positive integer'));
        return true;
      }
    }
    return emptyCheck.error;
  };

  const CPUTypeCheck = async () => {
    const emptyCheck = checkEmpty('CPU type', map.get('CPUType'));
    setCPUTypeError(emptyCheck.error);
    setCPUTypeHelperText(emptyCheck.msg);
    return CPUTypeCheck.error;
  };

  const diskSizeCheck = async () => {
    const emptyCheck = checkEmpty('Disk size', map.get('diskSize'));
    setDiskSizeError(emptyCheck.error);
    setDiskSizeHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(map.get('diskSize'))) {
        setDiskSizeError(true);
        setDiskSizeHelperText(L('Only accept positive integer'));
        return true;
      }
    }
    return emptyCheck.error;
  };

  const VMClusterIdCheck = async () => {
    const emptyCheck = checkEmpty('VM Cluster', map.get('VMClusterId'));
    setVMClusterIdError(emptyCheck.error);
    setVMClusterIdHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const tenantCheck = async () => {
    const emptyCheck = checkEmpty('Tenant', map.get('tenantId'));
    setTenantError(emptyCheck.error);
    setTenantHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  return (
    <>
      <DetailPage
        onFormFieldChange={onFormFieldChange}
        formFieldList={formFieldList}
        errorFieldList={errors}
        showBtn
        onBtnClick={handleClick}
        showRequiredField
      />
    </>
  );
}

export default Create;
