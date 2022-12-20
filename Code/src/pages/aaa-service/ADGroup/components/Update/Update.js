import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import formatDateTime from '../../../../../utils/formatDateTime';
import DetailPage from '../../../../../components/DetailPage';
import CommonTip from '../../../../../components/CommonTip';
import ADGroupApi from '../../../../../api/adGroup';
import { checkEmpty, getCheckExist } from '../../untils/ADGroupCheck';
import { L } from '../../../../../utils/lang';
import Loading from '../../../../../components/Loading';

// const listPath = '/aaa-service/adgroup';
const formTitle = 'Update';

function Update(props) {
  const { map } = props;
  const { id } = useParams();
  const history = useHistory();
  // const [ name, setName ] = useState('')
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const nameErr = await nameCheck();
    if (nameErr || saving) return;
    setSaving(true);
    ADGroupApi.update(id, { name: map && map.get('name') })
      .then(() => {
        CommonTip.success('Success');
        // history.push({ pathname: listPath });
        history.goBack();
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    Loading.show();
    ADGroupApi.detail(id)
      .then(({ data }) => {
        const { name } = data.data;
        map && map.set('name', name);
        setSaving(false);
        const defaultValue = data.data;
        const list = [
          {
            id: 'name',
            label: L('Name'),
            type: 'text',
            required: true,
            readOnly: false,
            value: defaultValue.name,
            error: nameError,
            helperText: nameHelperText
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
      })
      .finally(() => Loading.hide())
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
    // eslint-disable-next-line
  }, [id]);

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
    map && map.set(id, value);
  };

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('name', map && map.get('name'));
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(id, map && map.get('name'));
      setNameError(error);
      setNameHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };
  const onFormFieldBlur = (_, id) => {
    switch (id) {
      case 'name':
        nameCheck();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <DetailPage
        formTitle={formTitle}
        onFormFieldChange={onFormFieldChange}
        onFormFieldBlur={onFormFieldBlur}
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
