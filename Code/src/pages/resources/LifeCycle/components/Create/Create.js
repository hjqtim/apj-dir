import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/inventoryLifeCycle';
import { L } from '../../../../../utils/lang';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, getCheckExist } from '../../untils/LifeCycleFieldCheck';
import { map2object } from '../../../../../utils/map2object';
import actionType from '../../untils/actionType';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [_IDError, setIDError] = useState(false);
  const [_IDHelperText, setIDHelperText] = useState('');
  const [LifeCycles, setLifeCycles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const _IDError = await _IDCheck();
    if (_IDError || saving) return;
    setSaving(true);
    API.create(map2object(map))
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/resources/life-cycle' });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    API.listInventorys()
      .then(({ data }) => {
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        const lifeCycleList = [
          {
            id: 'oldID',
            label: L('Ref. ID'),
            type: 'text',
            required: true,
            readOnly: false,
            value: '',
            error: _IDError,
            helperText: _IDHelperText
          },
          {
            id: 'InventoryID',
            label: L('Inventory'),
            type: 'select',
            value: '',
            itemList: returnObj,
            labelField: 'oldID',
            valueField: 'oldID'
          },
          {
            id: 'AssetID',
            label: L('Asset No'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'RecordCreatedOn',
            label: L('Record Created Date'),
            type: 'date',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'ActionType',
            label: L('Action Type'),
            type: 'select',
            itemList: actionType,
            labelField: 'label',
            valueField: 'value',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'ActionDetails',
            label: L('Action Details'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'SuccessorInventoryID',
            label: L('Successor Inventory ID'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'ActionDate',
            label: L('Action Date'),
            type: 'date',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'RespStaff',
            label: L('Resp Staff'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'RespStaffDisplayName',
            label: L('Resp Staff Display Name'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'Reason',
            label: L('Reason'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          },
          {
            id: 'CaseRef',
            label: L('Case Ref'),
            type: 'text',
            required: false,
            readOnly: false,
            value: ''
          }
        ];
        setLifeCycles(lifeCycleList);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const errors = {
      oldID: {
        error: _IDError,
        helperText: _IDHelperText
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [_IDHelperText]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    map.set(id, value);
  };

  const _IDCheck = async () => {
    const emptyCheck = checkEmpty('Ref. ID', map.get('oldID'));
    setIDError(emptyCheck.error);
    setIDHelperText(emptyCheck.msg);
    // if (!emptyCheck.error) {
    //   const reg = /^[1-9]\d*$/
    //   if (!reg.test(map.get("_ID"))) {
    //     setIDError(true)
    //     setIDHelperText(L('Only accept positive integer'))
    //     emptyCheck.error = true
    //   }
    // }
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, map.get('oldID'));
      setIDError(error);
      setIDHelperText(msg);
      emptyCheck.error = error;
    }

    return emptyCheck.error;
  };

  return (
    <>
      <DetailPage
        onFormFieldChange={onFormFieldChange}
        formFieldList={LifeCycles}
        errorFieldList={errors}
        showBtn
        onBtnClick={handleClick}
        showRequiredField
      />
    </>
  );
}

export default Create;
