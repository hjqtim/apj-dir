import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/expiry';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, checkFuture, getCheckExist } from '../../untils/expiryFieldCheck';
import { L } from '../../../../../utils/lang';
import tenantAPI from '../../../../../api/tenant';

export default function Create() {
  const history = useHistory();
  const [tenantId, setTenantId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tenantError, setTenantError] = useState(false);
  const [tenantHelperText, setTenantHelperText] = useState('');
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [expiryDateHelperText, setExpiryDateHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const tenantError = await tenantCheck();
    const expiryDateError = await expiryDateCheck();
    if (tenantError || expiryDateError || saving) return;
    setSaving(true);
    API.create({ tenantId, expiryDate })
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/' });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    tenantAPI
      .list()
      .then(({ data }) => ({
        tenantList: data?.data?.rows
      }))
      .then((returnObj) => {
        const list = [
          {
            id: 'tenant',
            label: L('Tenant'),
            type: 'select',
            value: tenantId,
            required: true,
            itemList: returnObj.tenantList,
            labelField: 'name',
            valueField: 'id',
            error: tenantError,
            helperText: tenantHelperText,
            labelWidth: 30
          },
          {
            id: 'expiryDate',
            label: L('Expiry Date'),
            type: 'date',
            disabled: false,
            readOnly: false,
            required: true,
            value: expiryDate,
            error: expiryDateError,
            helperText: expiryDateHelperText
          }
        ];
        setFormFieldList(list);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const errors = {
      tenant: {
        error: tenantError,
        helperText: tenantHelperText
      },
      expiryDate: {
        error: expiryDateError,
        helperText: expiryDateHelperText
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [tenantHelperText, expiryDateHelperText]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'tenant':
        setTenantId(value);
        break;
      case 'expiryDate':
        setExpiryDate(dayjs(new Date(value)).format('YYYY-MM-DD'));
        break;
      default:
        break;
    }
  };

  const expiryDateCheck = async () => {
    const emptyCheck = checkEmpty('Expiry Date', expiryDate, 'Expiry date');
    setExpiryDateError(emptyCheck.error);
    setExpiryDateHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const { error, msg } = checkFuture(expiryDate);
      setExpiryDateError(error);
      setExpiryDateHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  const tenantCheck = async () => {
    const emptyCheck = checkEmpty('Tenant', tenantId, 'Tenant');
    setTenantError(emptyCheck.error);
    setTenantHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, tenantId);
      setTenantError(error);
      setTenantHelperText(msg);
      return error;
    }
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
