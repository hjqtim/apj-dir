import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/tenant';
import CommonTip from '../../../../../components/CommonTip';
import { checkEmpty, getCheckExist } from '../../untils/tenantFieldCheck';
import adGroupApi from '../../../../../api/adGroup';
import roleAPI from '../../../../../api/role';
import { L } from '../../../../../utils/lang';
import returnType from '../../../../../utils/variable/returnType';
import Loading from '../../../../../components/Loading';

function Create() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [codeHelperText, setCodeHelperText] = useState('');
  const [managerGroupId, setManagerGroupId] = useState('');
  const [managerGroupIdError, setManagerGroupIdError] = useState(false);
  const [managerGroupIdHelperText, setManagerGroupIdHelperText] = useState('');
  const [supporterGroupId, setSupporterGroupId] = useState('');
  const [supporterGroupIdError, setSupporterGroupIdError] = useState(false);
  const [supporterGroupIdHelperText, setSupporterGroupIdHelperText] = useState('');
  const [groupId, setgroupId] = useState('');
  const [groupIdError, setgroupIdError] = useState(false);
  const [groupIdHelperText, setgroupIdHelperText] = useState('');
  const [justification, setjustification] = useState('');
  const [justificationError, setjustificationError] = useState(false);
  const [justificationHelperText, setjustificationHelperText] = useState('');
  const [budget_type, setbudget_type] = useState('');
  const [budget_typeError, setbudget_typeError] = useState(false);
  const [budget_typeHelperText, setbudget_typeHelperText] = useState('');
  const [project_owner, setproject_owner] = useState('');
  const [project_ownerError, setproject_ownerError] = useState(false);
  const [project_ownerHelperText, setproject_ownerHelperText] = useState('');
  const [contact_person, setcontact_person] = useState('');
  const [contact_personError, setcontact_personError] = useState(false);
  const [contact_personHelperText, setcontact_personHelperText] = useState('');
  const [project_estimation, setproject_estimation] = useState('');
  const [project_estimationError, setproject_estimationError] = useState(false);
  const [project_estimationHelperText, setproject_estimationHelperText] = useState('');
  const [methodology_text, setmethodology_text] = useState('');
  const [methodology_textError, setmethodology_textError] = useState(false);
  const [methodology_textHelperText, setmethodology_textHelperText] = useState('');
  const [role, setRole] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [roleError, setRoleError] = useState(false);
  const [roleHelperText, setRoleHelperText] = useState('');
  const [mappingGroup, setMappingGroup] = useState('');
  const [mappingGroupError, setMappingGroupError] = useState(false);
  const [mappingGroupHelperText, setMappingGroupHelperText] = useState('');
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [adGroupList, setAdGroupList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [errors, setErrors] = useState({});

  // 获取 adGroupList
  useEffect(() => {
    adGroupApi.list({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        const { rows } = data.data;
        setAdGroupList(rows);
      }
    });
  }, []);
  // 获取 groupList
  useEffect(() => {
    API.listGroup({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        const { rows } = data.data;
        setGroupList(rows);
      }
    });
  }, []);
  // 获取 roleList
  useEffect(() => {
    roleAPI.list().then(({ data }) => {
      data?.data && setRoleList(data?.data);
    });
  }, []);

  const handleClick = async () => {
    const nameErr = await nameCheck();
    const codeErr = await codeCheck();
    const mappErr = await mappingGroupCheck();
    const manaErr = await managerGroupCheck();
    const roleErr = await roleCheck();
    const suppErr = await supporterGroupCheck();
    const groupIdErr = await groupIdCheck();
    const justificationErr = await justificationCheck();
    const budget_typeErr = await budget_typeCheck();
    const project_ownerErr = await project_ownerCheck();
    const contact_personErr = await contact_personCheck();
    const project_estimatioErr = await project_estimationCheck();
    const methodology_textErr = await methodology_textCheck();
    if (
      nameErr ||
      codeErr ||
      manaErr ||
      suppErr ||
      groupIdErr ||
      mappErr ||
      justificationErr ||
      budget_typeErr ||
      roleErr ||
      project_ownerErr ||
      contact_personErr ||
      project_estimatioErr ||
      methodology_textErr ||
      saving
    ) {
      return;
    }
    Loading.show();
    setSaving(true);
    API.create({
      name,
      code,
      manager_group_id: managerGroupId,
      supporter_group_id: supporterGroupId,
      group_id: groupId,
      mappingGroupId: mappingGroup,
      roleId: role,
      justification,
      budget_type,
      project_owner,
      contact_person,
      project_estimation,
      methodology_text
    })
      .then(() => {
        CommonTip.success('Success');
        Loading.hide();
        // history.push({ pathname: '/aaa-service/tenant' });
        history.goBack();
      })
      .catch(() => {
        Loading.hide();
        setSaving(false);
      });
  };

  useEffect(() => {
    const list = [
      {
        id: 'code',
        label: L('Code'),
        type: 'text',
        required: true,
        readOnly: false,
        value: code,
        error: codeError,
        helperText: codeHelperText
      },
      {
        id: 'name',
        label: L('Name'),
        type: 'text',
        required: true,
        readOnly: false,
        value: name,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'mappingGroup',
        label: L('Mapping Group'),
        type: 'select',
        required: true,
        itemList: adGroupList,
        labelField: 'name',
        valueField: 'id',
        value: mappingGroup,
        error: mappingGroupError,
        helperText: mappingGroupHelperText,
        width: 1.2,
        labelWidth: 104
      },
      {
        id: 'managerGroupId',
        label: L('Manager Group'),
        required: true,
        itemList: adGroupList,
        type: 'select',
        labelField: 'name',
        valueField: 'id',
        value: managerGroupId,
        error: managerGroupIdError,
        helperText: managerGroupIdHelperText,
        width: 1.2,
        labelWidth: 104
      },
      {
        id: 'role',
        label: L('Role'),
        type: 'select',
        required: true,
        itemList: roleList,
        labelField: 'right',
        valueField: 'id',
        value: role,
        error: roleError,
        helperText: roleHelperText,
        width: 1.2,
        labelWidth: 104
      },
      {
        id: 'supporterGroupId',
        label: L('Supporter Group'),
        required: true,
        itemList: adGroupList,
        type: 'select',
        labelField: 'name',
        valueField: 'id',
        value: supporterGroupId,
        error: supporterGroupIdError,
        helperText: supporterGroupIdHelperText,
        width: 1.2,
        labelWidth: 108
      },
      {
        id: 'groupId',
        label: L('Group'),
        required: true,
        itemList: groupList,
        type: 'select',
        labelField: 'name',
        valueField: 'id',
        value: groupId,
        error: groupIdError,
        helperText: groupIdHelperText,
        width: 1.2,
        labelWidth: 108
      },
      {
        id: 'justification',
        label: L('justification'),
        type: 'text',
        required: true,
        readOnly: false,
        value: justification,
        error: justificationError,
        helperText: justificationHelperText
      },
      {
        id: 'budget_type',
        label: L('budget_type'),
        type: 'text',
        required: true,
        readOnly: false,
        value: budget_type,
        error: budget_typeError,
        helperText: budget_typeHelperText
      },
      {
        id: 'project_owner',
        label: L('project_owner'),
        type: 'text',
        required: true,
        readOnly: false,
        value: project_owner,
        error: project_ownerError,
        helperText: project_ownerHelperText
      },
      {
        id: 'contact_person',
        label: L('contact_person'),
        type: 'searchInput',
        required: true,
        readOnly: false,
        apiValue: { returnType: returnType.U },
        value: contact_person,
        error: contact_personError,
        helperText: contact_personHelperText
      },
      {
        id: 'project_estimation',
        label: L('project_estimation'),
        type: 'text',
        required: true,
        readOnly: false,
        value: project_estimation,
        error: project_estimationError,
        helperText: project_estimationHelperText
      },
      {
        id: 'methodology_text',
        label: L('methodology_text'),
        type: 'text',
        required: true,
        readOnly: false,
        value: methodology_text,
        error: methodology_textError,
        helperText: methodology_textHelperText
      }
    ];
    setFormFieldList(list);
    // eslint-disable-next-line
  }, [adGroupList, groupList, roleList]);

  useEffect(() => {
    const errors = {
      name: {
        error: nameError,
        helperText: nameHelperText
      },
      code: {
        error: codeError,
        helperText: codeHelperText
      },
      mappingGroup: {
        error: mappingGroupError,
        helperText: mappingGroupHelperText
      },
      role: {
        error: roleError,
        helperText: roleHelperText
      },
      managerGroupId: {
        error: managerGroupIdError,
        helperText: managerGroupIdHelperText
      },
      supporterGroupId: {
        error: supporterGroupIdError,
        helperText: supporterGroupIdHelperText
      },
      groupId: {
        error: groupIdError,
        helperText: groupIdHelperText
      },
      justification: {
        error: justificationError,
        helperText: justificationHelperText
      },
      budget_type: {
        error: budget_typeError,
        helperText: budget_typeHelperText
      },
      project_owner: {
        error: project_ownerError,
        helperText: project_ownerHelperText
      },
      contact_person: {
        error: contact_personError,
        helperText: contact_personHelperText
      },
      project_estimation: {
        error: project_estimationError,
        helperText: project_estimationError
      },
      methodology_text: {
        error: methodology_textError,
        helperText: methodology_textError
      }
    };
    setErrors(errors);
    // eslint-disable-next-line
  }, [
    nameHelperText,
    codeHelperText,
    managerGroupIdHelperText,
    supporterGroupIdHelperText,
    groupIdHelperText,
    justificationHelperText,
    budget_typeHelperText,
    project_ownerHelperText,
    contact_personHelperText,
    project_estimationError,
    methodology_textError,
    mappingGroupHelperText,
    roleHelperText
  ]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      case 'code':
        setCode(value);
        break;
      case 'mappingGroup':
        setMappingGroup(value);
        break;
      case 'managerGroupId':
        setManagerGroupId(value);
        break;
      case 'role':
        setRole(value);
        break;
      case 'supporterGroupId':
        setSupporterGroupId(value);
        break;
      case 'groupId':
        setgroupId(value);
        break;
      case 'justification':
        setjustification(value);
        break;
      case 'budget_type':
        setbudget_type(value);
        break;
      case 'project_owner':
        setproject_owner(value);
        break;
      case 'contact_person':
        setcontact_person(value);
        break;
      case 'project_estimation':
        setproject_estimation(value);
        break;
      case 'methodology_text':
        setmethodology_text(value);
        break;
      default:
        break;
    }
  };

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('Name', name);
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, name);
      setNameError(error);
      setNameHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  const codeCheck = async () => {
    const emptyCheck = checkEmpty('Code', code);
    setCodeError(emptyCheck.error);
    setCodeHelperText(emptyCheck.msg);
    if (!emptyCheck.error) {
      const checkExist = getCheckExist();
      const { error, msg } = await checkExist(0, code);
      setCodeError(error);
      setCodeHelperText(msg);
      return error;
    }
    return emptyCheck.error;
  };

  const managerGroupCheck = async () => {
    const emptyCheck = checkEmpty('Manager Group', managerGroupId);
    setManagerGroupIdError(emptyCheck.error);
    setManagerGroupIdHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const supporterGroupCheck = async () => {
    const emptyCheck = checkEmpty('Supporter Group', supporterGroupId);
    setSupporterGroupIdError(emptyCheck.error);
    setSupporterGroupIdHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const groupIdCheck = async () => {
    const emptyCheck = checkEmpty('Group ID', groupId);
    setgroupIdError(emptyCheck.error);
    setgroupIdHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const justificationCheck = async () => {
    const emptyCheck = checkEmpty('Justification', justification);
    setjustificationError(emptyCheck.error);
    setjustificationHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const budget_typeCheck = async () => {
    const emptyCheck = checkEmpty('Budget type', budget_type);
    setbudget_typeError(emptyCheck.error);
    setbudget_typeHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const project_ownerCheck = async () => {
    const emptyCheck = checkEmpty('Project owner', project_owner);
    setproject_ownerError(emptyCheck.error);
    setproject_ownerHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const contact_personCheck = async () => {
    const emptyCheck = checkEmpty('Contact person', contact_person);
    setcontact_personError(emptyCheck.error);
    setcontact_personHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const project_estimationCheck = async () => {
    const emptyCheck = checkEmpty('Project estimation', project_estimation);
    setproject_estimationError(emptyCheck.error);
    setproject_estimationHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const methodology_textCheck = async () => {
    const emptyCheck = checkEmpty('Methodology', methodology_text);
    setmethodology_textError(emptyCheck.error);
    setmethodology_textHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const mappingGroupCheck = async () => {
    const emptyCheck = checkEmpty('Mapping Group', mappingGroup);
    setMappingGroupError(emptyCheck.error);
    setMappingGroupHelperText(emptyCheck.msg);
    return emptyCheck.error;
  };

  const roleCheck = async () => {
    const emptyCheck = checkEmpty('Role', role);
    setRoleError(emptyCheck.error);
    setRoleHelperText(emptyCheck.msg);
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
