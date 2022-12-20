import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import DetailPage from '../../../../../components/DetailPage';
import CommonTip from '../../../../../components/CommonTip';
import API from '../../../../../api/IPAssignment';
import DCAPI from '../../../../../api/dc';
import { L } from '../../../../../utils/lang';
import { checkEmpty, getCheckExist } from '../../untils/IPAssignmentCheck';

const listPath = '/resources/IPAddress';

function Update(props) {
  const { map } = props;
  const { id } = useParams();
  const history = useHistory();
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(true);
  const [ipError, setIpError] = useState(false);
  const [ipHelperText, setIpHelperText] = useState('');
  const [dcError, setDcError] = useState(false);
  const [dcHelperText, setDcHelperText] = useState('');
  const [vlanIdError, setVlanIdError] = useState(false);
  const [vlanIdHelperText, setVlanIdHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const ipError = await ipCheck();
    const dcError = await dcCheck();
    const vlanError = await vlanIdCheck();
    if (ipError || dcError || vlanError || saving) return;
    setSaving(true);
    API.update(id, {
      ip: map.get('ip'),
      dc: map.get('dc'),
      hostname: map.get('hostname'),
      projectTeam: map.get('projectTeam'),
      networkType: map.get('networkType'),
      ipPool: map.get('ipPool'),
      vlanId: map.get('vlanId'),
      remark: map.get('remark')
    })
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: listPath });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    DCAPI.list()
      .then(({ data }) => {
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        API.detail({ id }).then(({ data }) => {
          const { IP, DC, hostname, projectTeam, networkType, IPPool, vlanId, remark } = data.data;
          setSaving(false);

          const list = [
            {
              id: 'ip',
              label: L('IP'),
              type: 'text',
              required: true,
              readOnly: false,
              value: IP,
              error: ipError,
              helperText: ipHelperText
            },
            {
              id: 'dc',
              label: L('DC'),
              type: 'select',
              required: false,
              labelWidth: 30,
              readOnly: false,
              value: DC ? DC.id : '',
              itemList: returnObj,
              valueField: 'id',
              labelField: 'name',
              error: dcError,
              helperText: dcHelperText
            },
            {
              id: 'hostname',
              label: L('Hostname'),
              type: 'text',
              required: false,
              readOnly: false,
              value: hostname
            },
            {
              id: 'projectTeam',
              label: L('Project Team'),
              type: 'text',
              required: false,
              readOnly: false,
              value: projectTeam
            },
            {
              id: 'networkType',
              label: L('Network Type'),
              type: 'text',
              required: false,
              readOnly: false,
              value: networkType
            },
            {
              id: 'ipPool',
              label: L('Ip Pool'),
              type: 'text',
              required: false,
              readOnly: false,
              value: IPPool
            },
            {
              id: 'vlanId',
              label: L('Vlan ID'),
              type: 'text',
              required: false,
              readOnly: false,
              value: vlanId
            },
            {
              id: 'remark',
              label: L('Remark'),
              type: 'text',
              required: false,
              readOnly: false,
              value: remark
            }
          ];
          list.forEach((_) => {
            map.set(_.id, _.value);
          });
          setFormFieldList(list);
        });
      });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const errors = {
      ip: {
        error: ipError,
        helperText: ipHelperText
      },
      dc: {
        error: dcError,
        helperText: dcHelperText
      },
      vlanId: {
        error: vlanIdError,
        helperText: vlanIdHelperText
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [ipHelperText, dcHelperText, vlanIdHelperText]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    map.set(id, value);
  };

  const ipCheck = async () => {
    const emptyCheck = checkEmpty('ip', map.get('ip'));
    setIpError(emptyCheck.error);
    setIpHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(id, map.get('ip'));
      setIpError(error);
      setIpHelperText(msg);
      emptyCheck.error = error;
    }

    if (!emptyCheck.error) {
      const reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(map.get('ip'))) {
        setIpError(true);
        setIpHelperText(L('Only accept ip'));
        emptyCheck.error = true;
      }
    }
    return emptyCheck.error;
  };

  const dcCheck = async () => {
    const emptyCheck = checkEmpty('dc', map.get('dc'));
    setDcError(emptyCheck.error);
    setDcHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const vlanIdCheck = async () => {
    let error = false;
    if (map.get('vlanId')) {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(map.get('vlanId'))) {
        setVlanIdError(true);
        setVlanIdHelperText(L('Only accept positive integer'));
        error = true;
      }
    }
    if (!error) {
      setVlanIdError(error);
      setVlanIdHelperText('');
    }
    return error;
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

export default Update;
