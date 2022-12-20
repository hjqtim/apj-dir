import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import DetailPage from '../../../../../components/DetailPage';
import CommonTip from '../../../../../components/CommonTip';
import ADGroupApi from '../../../../../api/adGroup';
import { checkEmpty, getCheckExist } from '../../untils/ADGroupCheck';
import { L } from '../../../../../utils/lang';

// const listPath = '/aaa-service/adgroup';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const nameErr = await nameCheck();
    if (nameErr || saving) return;
    setSaving(true);
    ADGroupApi.create({ name: map && map.get('name') })
      .then(() => {
        CommonTip.success(L('Success'));
        // history.push({ pathname: listPath });
        history.goBack();
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    const list = [
      {
        id: 'name',
        label: L('Name'),
        type: 'text',
        required: true,
        readOnly: false,
        value: map && map.get('name'),
        error: nameError,
        helperText: nameHelperText
      }
    ];
    setFormFieldList(list);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const errors = {
      name: {
        error: nameError,
        helperText: nameHelperText
      }
    };
    setErrors(errors);
  }, [nameError, nameHelperText]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'name':
        map && map.set('name', value);
        break;
      default:
        break;
    }
  };

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('name', map && map.get('name'));
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, map && map.get('name'));
      setNameError(error);
      setNameHelperText(msg);
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

export default Create;
