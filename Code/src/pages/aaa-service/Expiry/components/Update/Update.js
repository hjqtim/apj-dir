import React, { useEffect, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/expiry';
import formatDateTime from '../../../../../utils/formatDateTime';
import CommonTip from '../../../../../components/CommonTip';
import { L } from '../../../../../utils/lang';

import { checkEmpty, checkFuture } from '../../untils/expiryFieldCheck';
import Loading from '../../../../../components/Loading';
import message from '../../../../../utils/variable/message';

function Update() {
  const { id } = useParams();
  const history = useHistory();
  const [expiryDate, setExpiryDate] = useState('');
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [expiryDateHelperText, setExpiryDateHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const expiryDateCheck = async () => {
    const emptyCheck = checkEmpty('expiryDate', expiryDate, 'Expiry Date');
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

  const handleClick = async () => {
    const expiryError = await expiryDateCheck();
    if (expiryError || saving) return;
    setSaving(true);
    Loading.show();
    API.update(id, { expiryDate })
      .then(() => {
        CommonTip.success(L('Success'));
        Loading.hide();
        history.push({ pathname: '/' });
      })
      .catch(() => {
        Loading.hide();
        setSaving(false);
      });
  };

  useEffect(() => {
    API.detail({ id }).then(({ data }) => {
      if (!data?.data) {
        CommonTip.error(message.VALUE_NOT_FOUND);
        history.push('/');
      }
      const { tenant, expiryDate } = data.data;
      const tenantName = tenant?.name || '';

      const defaultValue = data.data;
      const list = [
        {
          id: 'tenant',
          label: L('Tenant'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: tenantName
        },
        {
          id: 'expiryDate',
          label: L('Expiry Date'),
          type: 'date',
          disabled: false,
          readOnly: false,
          required: true,
          value: formatDateTime(expiryDate),
          error: expiryDateError,
          helperText: expiryDateHelperText
        },
        {
          id: 'createdAt',
          label: L('Created At'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: formatDateTime(defaultValue.createdAt)
        },
        {
          id: 'updatedAt',
          label: L('Updated At'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: formatDateTime(defaultValue.updatedAt)
        }
      ];
      setFormFieldList(list);
    });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const errors = {
      expiryDate: {
        error: expiryDateError,
        helperText: expiryDateHelperText
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [expiryDateHelperText]);

  // 字段改变
  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'expiryDate':
        setExpiryDate(formatDateTime(value));
        break;
      default:
        break;
    }
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
