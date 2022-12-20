import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/inventory';
import { L } from '../../../../../utils/lang';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, getCheckExist } from '../../untils/NetworkFieldCheck';
import { map2object } from '../../../../../utils/map2object';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [_IDError, setIDError] = useState(false);
  const [_IDHelperText, setIDHelperText] = useState('');
  const [EquipTypeError, setEquipTypeError] = useState(false);
  const [EquipTypeHelperText, setEquipTypeHelperText] = useState('');
  const [PortQtyError, setPortQtyError] = useState(false);
  const [PortQtyHelperText, setPortQtyHelperText] = useState('');
  const [inventory, setInventory] = useState([]);

  const [saving, setSaving] = useState(false);
  const [InventoryStatus, setInventoryStatus] = useState([]);
  const [EquipTypes, setEquipTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const _IDError = await _IDCheck();
    const EquipTypeError = await EquipTypeCheck();
    const PortQtyError = await PortQtyCheck();
    if (_IDError || EquipTypeError || PortQtyError || saving) return;
    setSaving(true);
    API.create(map2object(map))
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/resources/network' });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    API.listStatus({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        setInventoryStatus(data.data);
      }
    });
  }, []);

  useEffect(() => {
    API.listEquipType({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        setEquipTypes(data.data.filter((_) => _.EquipType !== 'EqServer'));
      }
    });
  }, []);

  useEffect(() => {
    const inventoryList = [
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
        id: 'UnitCode',
        label: L('New'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'AssetID',
        label: L('Asset No'),
        type: 'text',
        required: false,
        readOnly: false,
        value: '',
        error: false,
        helperText: ''
      },
      {
        id: 'ModelCode',
        label: L('Model Code'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'ModelDesc',
        label: L('Description'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'ClosetID',
        label: L('Closet ID'),
        type: 'text',
        required: false,
        readOnly: false,
        value: '',
        error: false,
        helperText: ''
      },
      {
        id: 'Rack',
        label: L('Cabinet'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'RLU',
        label: L('Pos. (U)'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'ItemOwner',
        label: L('Item Owner'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'Status',
        label: L('Status'),
        type: 'select',
        value: '',
        itemList: InventoryStatus,
        labelField: 'ServiceStatus',
        valueField: 'id'
      },
      {
        id: 'Remark',
        label: L('Remark'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'EquipType',
        label: L('EquipType'),
        type: 'select',
        value: '',
        itemList: EquipTypes,
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
        value: ''
      },
      {
        id: 'PortQty',
        label: L('Built-in Port'),
        type: 'text',
        required: false,
        readOnly: false,
        value: '',
        error: PortQtyError,
        helperText: PortQtyHelperText
      },
      {
        id: 'ReqNo',
        label: L('Req. Form'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'DOB',
        label: L('DOB'),
        type: 'date',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'DeliveryDate',
        label: L('Delivery Date'),
        type: 'date',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'DeliveryNoteReceivedDate',
        label: L('Delivery Note Received Date'),
        type: 'date',
        required: false,
        readOnly: false,
        value: ''
      },
      {
        id: 'MaintID',
        label: L('MaintID'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ''
      }
    ];
    setInventory(inventoryList);
    // eslint-disable-next-line
  }, [EquipTypes, InventoryStatus]);

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
      const { error, msg } = await checkExist(0, map.get('oldID'));
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

export default Create;
