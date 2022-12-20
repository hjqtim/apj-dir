import React, { useEffect, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/platform';
import formatDateTime from '../../../../../utils/formatDateTime';
import CommonTip from '../../../../../components/CommonTip';

import { checkEmpty, getCheckExist } from '../../untils/PlatformFieldCheck';
import { L } from '../../../../../utils/lang';

function Update(props) {
  const { map } = props;
  const { id } = useParams();
  const history = useHistory();
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  // const [ typeIdError, setTypeIdError ] = useState(false)
  // const [ typeIdHelperText, setTypeIdHelperText ] = useState("")
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(true);
  const [errors, setErrors] = useState({});

  const hanleClick = async () => {
    const nameErr = await nameCheck();
    // const typeIdErr = await typeIdCheck()
    // if (nameErr || typeIdErr || saving) return
    if (nameErr || saving) return;
    setSaving(true);
    API.update(id, { name: map.get('name') })
      .then(() => {
        CommonTip.success(L('Success'));
        history.goBack();
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    API.listType({ limit: 999, page: 1 })
      .then(({ data }) => {
        if (data && data.data) {
          return data.data.rows;
        }
        return [];
      })
      .then(() => {
        // returnObj
        API.detail(id).then((_) => {
          const { name, typeId } = _.data.data;
          map && map.set('name', name);
          map && map.set('typeId', typeId);
          setSaving(false);

          const defaultValue = _.data.data;
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
            // {
            //   id: 'typeId', label: L('Type'), type: 'select',
            //   value: defaultValue.typeId, itemList: returnObj,
            //   labelField: 'name', valueField: 'id', required: true,
            //   error: typeIdError, helperText: typeIdHelperText,
            // },
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
      name: {
        error: nameError,
        helperText: nameHelperText
      }
      // typeId: {
      //   error: typeIdError,
      //   helperText: typeIdHelperText,
      // },
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [
    nameHelperText
    // typeIdHelperText
  ]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    map.set(id, value);
  };

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('name', map.get('name'));
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(id, map.get('name'));
      setNameError(error);
      setNameHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  // const typeIdCheck = async () => {
  //   const emptyCheck = checkEmpty("typeId", map.get("typeId"))
  //   setTypeIdError(emptyCheck.error)
  //   setTypeIdHelperText(emptyCheck.msg)
  //   return emptyCheck.error
  // }

  return (
    <>
      <DetailPage
        onFormFieldChange={onFormFieldChange}
        formFieldList={formFieldList}
        errorFieldList={errors}
        showBtn
        onBtnClick={hanleClick}
        showRequiredField
      />
    </>
  );
}

export default Update;
