import React, { useEffect, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/inventory';
import CommonTip from '../../../../../components/CommonTip';

import { checkEmpty, getCheckExist } from '../../untils/NetworkFieldCheck';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';
import { map2object } from '../../../../../utils/map2object';

function Update(props) {
  const { map } = props;
  const { id } = useParams();
  const history = useHistory();
  const [_IDError, setIDError] = useState(false);
  const [_IDHelperText, setIDHelperText] = useState('');
  const [EquipTypeError, setEquipTypeError] = useState(false);
  const [EquipTypeHelperText, setEquipTypeHelperText] = useState('');
  const [PortQtyError, setPortQtyError] = useState(false);
  const [PortQtyHelperText, setPortQtyHelperText] = useState('');
  const [inventory, setInventory] = useState([]);
  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(true);

  const handleClick = async () => {
    const _IDError = await _IDCheck();
    const EquipTypeError = await EquipTypeCheck();
    const PortQtyError = await PortQtyCheck();
    if (_IDError || EquipTypeError || PortQtyError || saving) return;
    setSaving(true);
    API.update(id, map2object(map))
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/resources/network' });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    API.listStatus({ limit: 999, page: 1 })
      .then(({ data }) => {
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        API.listEquipType({ limit: 999, page: 1 })
          .then(({ data }) => {
            if (data && data.data) {
              return {
                InventoryStatus: returnObj,
                EquipType: data.data.filter((_) => _.EquipType !== 'EqServer')
              };
            }
            return {
              InventoryStatus: returnObj,
              EquipType: []
            };
          })
          .then((returnObj) => {
            API.detail(id).then(({ data }) => {
              const {
                oldID,
                UnitCode,
                AssetID,
                ModelCode,
                ModelDesc,
                ClosetID,
                Rack,
                RLU,
                ItemOwner,
                Status,
                Remark,
                UnitNo,
                PortQty,
                ReqNo,
                DOB,
                DeliveryDate,
                DeliveryNoteReceivedDate,
                MaintID,
                EquipType
              } = data.data;
              setSaving(false);

              const list = [
                {
                  id: 'oldID',
                  label: L('Ref. ID'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: oldID,
                  error: _IDError,
                  helperText: _IDHelperText
                },
                {
                  id: 'UnitCode',
                  label: L('New'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: UnitCode
                },
                {
                  id: 'AssetID',
                  label: L('Asset No'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: AssetID,
                  error: false,
                  helperText: ''
                },
                {
                  id: 'ModelCode',
                  label: L('Model Code'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: ModelCode
                },
                {
                  id: 'ModelDesc',
                  label: L('Description'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: ModelDesc
                },
                {
                  id: 'ClosetID',
                  label: L('Closet ID'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: ClosetID,
                  error: false,
                  helperText: ''
                },
                {
                  id: 'Rack',
                  label: L('Cabinet'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: Rack
                },
                {
                  id: 'RLU',
                  label: L('Pos. (U)'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: RLU
                },
                {
                  id: 'ItemOwner',
                  label: L('Item Owner'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: ItemOwner
                },
                {
                  id: 'Status',
                  label: L('Status'),
                  type: 'select',
                  value: Status,
                  itemList: returnObj.InventoryStatus,
                  labelField: 'ServiceStatus',
                  valueField: 'id'
                },
                {
                  id: 'Remark',
                  label: L('Remark'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: Remark
                },
                {
                  id: 'EquipType',
                  label: L('EquipType'),
                  type: 'select',
                  value: EquipType,
                  itemList: returnObj.EquipType,
                  labelField: 'EquipType',
                  valueField: 'id',
                  required: true,
                  error: EquipTypeError,
                  helperText: EquipTypeHelperText
                },
                {
                  id: 'UnitNo',
                  label: L('Unit No'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: UnitNo
                },
                {
                  id: 'PortQty',
                  label: L('Built-in Port'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: PortQty,
                  error: PortQtyError,
                  helperText: PortQtyHelperText
                },
                {
                  id: 'ReqNo',
                  label: L('Req. Form'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: ReqNo
                },
                {
                  id: 'DOB',
                  label: L('DOB'),
                  type: 'date',
                  required: false,
                  readOnly: false,
                  value: DOB ? formatDateTime(DOB) : ''
                },
                {
                  id: 'DeliveryDate',
                  label: L('Delivery Date'),
                  type: 'date',
                  required: false,
                  readOnly: false,
                  value: DeliveryDate ? formatDateTime(DeliveryDate) : ''
                },
                {
                  id: 'DeliveryNoteReceivedDate',
                  label: L('Delivery Note Received Date'),
                  type: 'date',
                  required: false,
                  readOnly: false,
                  value: DeliveryNoteReceivedDate ? formatDateTime(DeliveryNoteReceivedDate) : ''
                },
                {
                  id: 'MaintID',
                  label: L('MaintID'),
                  type: 'text',
                  required: false,
                  readOnly: false,
                  value: MaintID
                }
              ];
              list.forEach((_) => {
                map.set(_.id, _.value);
              });
              setInventory(list);
            });
          });
      });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const error = {
      oldID: {
        error: _IDError,
        helperText: _IDHelperText
      },
      EquipType: {
        error: EquipTypeError,
        helperText: EquipTypeHelperText
      },
      PortQty: {
        error: PortQtyError,
        helperText: PortQtyHelperText
      }
    };
    setErrors(error);
    // eslint-disable-next-line
  }, [_IDHelperText, EquipTypeHelperText, PortQtyHelperText]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    map.set(id, value);
  };

  const _IDCheck = async () => {
    const emptyCheck = checkEmpty('Ref. ID', map.get('oldID'));
    setIDError(emptyCheck.error);
    setIDHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(id, map.get('oldID'));
      setIDError(error);
      setIDHelperText(msg);
      emptyCheck.error = error;
    }

    return emptyCheck.error;
  };

  const EquipTypeCheck = async () => {
    const emptyCheck = checkEmpty('EquipType', map.get('EquipType'));
    setEquipTypeError(emptyCheck.error);
    setEquipTypeHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const PortQtyCheck = async () => {
    let error = false;
    if (map.get('PortQty')) {
      const reg = /^(0|\d+)(\.\d+)?$/;
      if (!reg.test(map.get('PortQty'))) {
        error = true;
        setPortQtyError(error);
        setPortQtyHelperText(L('Only accept positive float'));
      }
    }
    if (!error) {
      setPortQtyError(error);
      setPortQtyHelperText();
    }
    return error;
  };

  return (
    <>
      <DetailPage
        onFormFieldChange={onFormFieldChange}
        formFieldList={inventory}
        errorFieldList={errors}
        showBtn
        onBtnClick={handleClick}
        showRequiredField
      />
    </>
  );
}

export default Update;
