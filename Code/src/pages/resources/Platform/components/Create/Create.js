import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/platform';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, getCheckExist } from '../../untils/PlatformFieldCheck';
import { L } from '../../../../../utils/lang';

function Create(props) {
  const { map } = props;
  const history = useHistory();
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  // const [ typeIdError, setTypeIdError ] = useState(false)
  // const [ typeIdHelperText, setTypeIdHelperText ] = useState("")
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  // const [ typeList, setTypeList ] = useState([])
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const nameError = await nameCheck();
    // const typeIdErr = await typeIdCheck()
    // if (nameError || typeIdErr || saving) return
    if (nameError || saving) return;
    setSaving(true);
    API.create({ name: map.get('name') })
      .then(() => {
        CommonTip.success(L('Success'));
        // history.push({ pathname: '/resources/platform' });
        history.goBack();
      })
      .catch(() => {
        setSaving(false);
      });
  };

  // useEffect(() => {
  //   API.listType({ limit: 999, page: 1 }).then(({ data }) => {
  //     if (data && data.data) {
  //       const { rows } = data.data
  //       setTypeList(rows)
  //     }
  //   })
  // }, [])

  useEffect(
    () => {
      const list = [
        {
          id: 'name',
          label: L('Name'),
          type: 'text',
          required: true,
          readOnly: false,
          value: '',
          error: nameError,
          helperText: nameHelperText
        }
        // {
        //   id: 'typeId', label: L('Type'), type: 'select', required: true,
        //   value: '', itemList: typeList,
        //   labelField: 'name', valueField: 'id',
        //   error: typeIdError, helperText: typeIdHelperText,
        // },
      ];
      setFormFieldList(list);
      // eslint-disable-next-line
    },
    [
      // typeList
    ]
  );

  useEffect(() => {
    const errors = {
      name: {
        error: nameError,
        helperText: nameHelperText
      }
      // typeId: {
      //   error: typeIdError,
      //   helperText: typeIdHelperText,
      // }
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
      const { error, msg } = await checkExist(0, map.get('name'));
      setNameError(error);
      setNameHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  // const typeIdCheck = async () => {
  //   const emptyCheck = checkEmpty("typeId", map.get('typeId'))
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
        onBtnClick={handleClick}
        showRequiredField
      />
    </>
  );
}

export default Create;
