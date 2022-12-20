import React, { useEffect, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/tenant';
import formatDateTime from '../../../../../utils/formatDateTime';
import CommonTip from '../../../../../components/CommonTip';

import { checkEmpty } from '../../untils/tenantFieldCheck';
import adGroupApi from '../../../../../api/adGroup';
import { L } from '../../../../../utils/lang';
import returnType from '../../../../../utils/variable/returnType';
import roleAPI from '../../../../../api/role';
import Loading from '../../../../../components/Loading';

/* eslint-disable camelcase */
function Update() {
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState('');
  const [managerGroupId, setManagerGroupId] = useState('');
  const [supporterGroupId, setSupporterGroupId] = useState('');
  const [groupId, setGroupId] = useState('');

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
  const [saving, setSaving] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = async () => {
    const nameErr = await nameCheck();
    const mappErr = await mappingGroupCheck();
    const roleErr = await roleCheck();
    const justificationErr = await justificationCheck();
    const budget_typeErr = await budget_typeCheck();
    const project_ownerErr = await project_ownerCheck();
    const contact_personErr = await contact_personCheck();
    const project_estimatioErr = await project_estimationCheck();
    const methodology_textErr = await methodology_textCheck();
    if (
      nameErr ||
      justificationErr ||
      budget_typeErr ||
      project_ownerErr ||
      contact_personErr ||
      project_estimatioErr ||
      methodology_textErr ||
      saving ||
      mappErr ||
      roleErr
    ) {
      return;
    }
    setSaving(true);
    Loading.show();
    API.update(id, {
      name,
      manager_group_id: managerGroupId,
      supporter_group_id: supporterGroupId,
      group_id: groupId,
      roleId: role,
      mappingGroupId: mappingGroup,
      justification,
      budget_type,
      project_owner,
      contact_person,
      project_estimation,
      methodology_text
    })
      .then(() => {
        CommonTip.success(L('Success'));
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
    roleAPI.list().then(({ data }) => {
      data?.data && setRoleList(data?.data);
    });
  }, []);

  useEffect(() => {
    adGroupApi
      .list({ limit: 999, page: 1 })
      .then(({ data }) => {
        if (data && data.data) {
          return data.data.rows;
        }
        return [];
      })
      .then((returnObj) => {
        API.listGroup({ limit: 999, page: 1 })
          .then(({ data }) => {
            if (data && data.data) {
              return {
                adGroupList: returnObj,
                groupList: data.data.rows
              };
            }
            return {
              adGroupList: returnObj,
              groupList: []
            };
          })
          .then((returnObj) => {
            API.detail(id).then(({ data }) => {
              const {
                name,
                manager_group_id,
                supporter_group_id,
                group_id,
                justification,
                budget_type,
                project_owner,
                contact_person,
                project_estimation,
                methodology_text
              } = data.data;
              setName(name);
              setManagerGroupId(manager_group_id);
              setSupporterGroupId(supporter_group_id);
              setGroupId(group_id);
              setjustification(justification);
              setbudget_type(budget_type);
              setproject_owner(project_owner);
              setcontact_person(contact_person);
              setproject_estimation(project_estimation);
              setmethodology_text(methodology_text);
              setSaving(false);

              const defaultValue = data.data;

              const list = [
                {
                  id: 'code',
                  label: L('Code'),
                  type: 'text',
                  readOnly: true,
                  disabled: true,
                  value: defaultValue.code
                },
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
                  id: 'mappingGroup',
                  label: L('Mapping Group'),
                  type: 'select',
                  required: true,
                  itemList: returnObj.adGroupList,
                  labelField: 'name',
                  valueField: 'id',
                  value: defaultValue.mapping_group_id,
                  error: mappingGroupError,
                  helperText: mappingGroupHelperText
                },
                {
                  id: 'managerGroupId',
                  label: L('Manager Group'),
                  type: 'select',
                  required: true,
                  readOnly: false,
                  itemList: returnObj.adGroupList,
                  value: defaultValue.manager_group_id,
                  labelField: 'name',
                  valueField: 'id'
                },
                {
                  id: 'role',
                  label: L('Role'),
                  type: 'select',
                  required: true,
                  itemList: roleList,
                  labelField: 'right',
                  valueField: 'id',
                  value: defaultValue.role_id,
                  error: roleError,
                  helperText: roleHelperText
                },
                {
                  id: 'supporterGroupId',
                  label: L('Supporter Group'),
                  type: 'select',
                  required: true,
                  readOnly: false,
                  itemList: returnObj.adGroupList,
                  value: defaultValue.supporter_group_id,
                  labelField: 'name',
                  valueField: 'id'
                },
                {
                  id: 'groupId',
                  label: L('Group'),
                  required: true,
                  itemList: returnObj.groupList,
                  type: 'select',
                  labelField: 'name',
                  valueField: 'id',
                  value: defaultValue.group_id
                },
                {
                  id: 'justification',
                  label: L('justification'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: defaultValue.justification,
                  error: justificationError,
                  helperText: justificationHelperText
                },
                {
                  id: 'budget_type',
                  label: L('budget_type'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: defaultValue.budget_type,
                  error: budget_typeError,
                  helperText: budget_typeHelperText
                },
                {
                  id: 'project_owner',
                  label: L('project_owner'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: defaultValue.project_owner,
                  error: project_ownerError,
                  helperText: project_ownerHelperText
                },
                {
                  id: 'contact_person',
                  label: L('contact_person'),
                  required: true,
                  readOnly: false,
                  value: defaultValue.contact_person,
                  type: 'searchInput',
                  apiValue: { returnType: returnType.U },
                  error: contact_personError,
                  helperText: contact_personHelperText
                },
                {
                  id: 'project_estimation',
                  label: L('project_estimation'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: defaultValue.project_estimation,
                  error: project_estimationError,
                  helperText: project_estimationHelperText
                },
                {
                  id: 'methodology_text',
                  label: L('methodology_text'),
                  type: 'text',
                  required: true,
                  readOnly: false,
                  value: defaultValue.methodology_text,
                  error: methodology_textError,
                  helperText: methodology_textHelperText
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
          });
      });
    // eslint-disable-next-line
  }, [id, roleList]);

  useEffect(() => {
    const errors = {
      name: {
        error: nameError,
        helperText: nameHelperText
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
        setGroupId(value);
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

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('Name', name);
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
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
