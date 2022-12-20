import React, { useEffect, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/server';
import inventoryAPI from '../../../../../api/inventory';
// import dayjs from "dayjs"
import CommonTip from '../../../../../components/CommonTip';

import { checkEmpty, getCheckExist } from '../../untils/ServerFieldCheck';
import { L } from '../../../../../utils/lang';
import { map2object2 } from '../../../../../utils/map2object';

function Detail(props) {
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
    API.update(id, map2object2(map))
      .then(() => {
        CommonTip.success(L('Success'));
        history.goBack();
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    inventoryAPI
      .listStatus({ limit: 999, page: 1 })
      .then(({ data }) => {
        // return data.data
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        inventoryAPI
          .listEquipType({ limit: 999, page: 1 })
          .then(({ data }) => {
            if (data && data.data) {
              return {
                InventoryStatus: returnObj,
                EquipTypes: data.data.filter((_) => _.EquipType === 'EqServer')
              };
            }
            return {
              InventoryStatus: returnObj,
              EquipTypes: []
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
                  value: AssetID
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
                  value: ClosetID
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
                  itemList: returnObj.EquipTypes,
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
                  value: DOB
                },
                {
                  id: 'DeliveryDate',
                  label: L('Delivery Date'),
                  type: 'date',
                  required: false,
                  readOnly: false,
                  value: DeliveryDate
                },
                {
                  id: 'DeliveryNoteReceivedDate',
                  label: L('Delivery Note Received Date'),
                  type: 'date',
                  required: false,
                  readOnly: false,
                  value: DeliveryNoteReceivedDate
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
      const { error, msg } = await checkExist(id, map.get('oldID'));
      setIDError(error);
      setIDHelperText(msg);
      emptyCheck.error = error;
    }

    return emptyCheck.error;
  };

  // const AssetIDCheck = async () => {
  //   let error = false
  //   if (map.get("AssetID")) {
  //     const reg = /^[1-9]\d*$/
  //     if (!reg.test(map.get("AssetID"))) {
  //       error = true
  //       setAssetIDError(error)
  //       setAssetIDHelperText(L('Only accept positive integer'))
  //     }
  //   }
  //   if (!error) {
  //     setAssetIDError(error)
  //     setAssetIDHelperText()
  //   }
  //   return error
  // }
  //
  // const ClosetIDCheck = async () => {
  //   let error = false
  //   if (map.get("ClosetID")) {
  //     const reg = /^[1-9]\d*$/
  //     if (!reg.test(map.get("ClosetID"))) {
  //       error = true
  //       setClosetIDError(error)
  //       setClosetIDHelperText(L('Only accept positive integer'))
  //     }
  //   }
  //   if (!error) {
  //     setClosetIDError(error)
  //     setClosetIDHelperText()
  //   }
  //   return error
  // }

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

export default Detail;
