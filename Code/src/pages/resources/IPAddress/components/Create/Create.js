import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/IPAssignment';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, getCheckExist } from '../../untils/IPAssignmentCheck';
import dcAPI from '../../../../../api/dc';
import { L } from '../../../../../utils/lang';

const listPath = '/resources/IPAddress';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
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
    API.create({
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
    dcAPI
      .list()
      .then(({ data }) => {
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        const list = [
          {
            id: 'ip',
            label: L('IP'),
            type: 'text',
            value: '',
            error: ipError,
            helperText: ipHelperText,
            required: true,
            readOnly: false
          },
          {
            id: 'dc',
            label: L('DC'),
            type: 'select',
            value: '',
            itemList: returnObj,
            labelField: 'name',
            valueField: 'id',
            error: dcError,
            helperText: dcHelperText,
            required: true,
            readOnly: false
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
            id: 'projectTeam',
            label: L('Project Team'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'networkType',
            label: L('Network Type'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'ipPool',
            label: L('IP Pool'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'vlanId',
            label: L('VLan ID'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'remark',
            label: L('Remark'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          }
        ];
        setFormFieldList(list);
      });
    // eslint-disable-next-line
  }, []);

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
      const { error, msg } = await checkExist(0, map.get('ip'));
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

export default Create;
