import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { fade } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { Grid, Button, makeStyles, InputLabel } from '@material-ui/core';

import { L } from '../../../../../../../utils/lang';
import { useGlobalStyles } from '../../../../../../../style';
import API from '../../../../../../../api/project/project';
import { HAPaper, CommonInput, CommonTip } from '../../../../../../../components';
import CommonSelect from '../../../../../../../components/CommonSelect';
import Loading from '../../../../../../../components/Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(12),
    background: '#fff',
    borderRadius: '15px 15px 0px 0px',
    '& .MuiGrid-spacing-xs-10 > .MuiGrid-item': {
      padding: '5px !important '
    }
  },
  // 按钮
  btnFlex: {
    margin: theme.spacing(4, 0),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    '& button': {
      width: '5vw',
      marginLeft: '1vw',
      marginRight: '1vw',
      color: '#fff'
    },
    '& button:nth-child(2)': {
      color: '#5c5c5c',
      background: '#E0E0E0'
    }
  },
  // 下拉框label
  title2: (props) => ({
    color: props.isDetail ? '#909090' : 'rgba(0,0,0,.85)',
    fontSize: '1.2em',
    margin: theme.spacing(4, 0)
  }),
  starts: (props) => ({
    color: props.isDetail ? 'rgba(0, 0, 0, 0.38)' : 'red'
  }),
  // 栅格样式
  gridstyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '& div[class*=makeStyles-formControl]': {
      width: '15.5vw',
      minWidth: '150px !important',
      margin: '0 !important',
      '& .MuiSelect-select': {
        padding: '10.5px 14px'
      }
    },
    '& div[class*=makeStyles-root]': {
      minWidth: '150px'
    },
    '& .MuiOutlinedInput-root.MuiInputBase-formControl': {
      minWidth: '150px'
    }
  },
  // 下拉选择框
  selectStyle: {
    '& .MuiInputBase-input:focus': {
      borderColor: '#80bdff',
      borderWidth: '2px',
      borderRadius: 4,
      outline: 'none',
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#80bdff',
      borderWidth: '2px'
    }
  }
}));
export default function Main() {
  // 详情页和编辑页传进来的id
  const { id } = useParams();
  const history = useHistory();
  // 当前url
  const url = history.location;
  const globalClaess = useGlobalStyles();
  // 是否是详情
  const [isDetail, setIsDetail] = useState(false);
  const [currentProjectName, setCurrentProjectName] = React.useState('');
  const classes = useStyles({ isDetail });

  useEffect(() => {
    // 详情页还是编辑
    if (!_.isUndefined(id)) {
      //  获取数据
      searchDetailDate();
      if (url?.pathname.indexOf('detail') !== -1) {
        setIsDetail(true);
      }
    }
  }, []);

  // 收集搜索的字段
  const formik = useFormik({
    // 初始值
    initialValues: {
      project: '',
      description: '',
      appType: ['AP'],
      status: 'Active',
      projectType: '',
      website: '',
      team: '',
      section: '',
      tenant: '',
      ipType: ''
    },
    // 表单验证
    validationSchema: Yup.object({
      project: Yup.string().required(L('subjectPlease')).max(255),
      // .test('project validation for server', L('projectAlreadyExists'), (projectName) => {
      //   if (projectName === currentProjectName) return true;
      //   API.checkProject({ projectName }).then((res) => !Boolean(res?.data?.data?.status));
      // }),
      description: Yup.string().required(L('descriptionPlease')).max(100),
      team: Yup.string().max(100),
      section: Yup.string().max(100),
      tenant: Yup.string().max(100),
      website: Yup.string().max(100),
      projectType: Yup.string().required(L('projectType')),
      appType: Yup.array().required().min(1, L('appTypePlease')),
      status: Yup.string().required(L('statusPlease'))
    }),
    validate: (values) => {
      const dynamicErrors = {};
      if (values.appType.includes('IP') && !values.ipType) {
        dynamicErrors.ipType = 'Please select a IP Type.';
      }
      return dynamicErrors;
    },
    // 提交
    onSubmit: (value) => {
      const data = {
        id,
        ...value,
        appType: value.appType.join(','),
        projectNameEn: value.project
      };
      handleClickSubmit(data);
    }
  });

  // 获取详情数据回显
  const searchDetailDate = async () => {
    Loading.show();
    API.searchDetailById({ id })
      .then((res) => {
        if (res?.data?.data) {
          const {
            project,
            projectType,
            section,
            status,
            team,
            tenant,
            appType,
            description,
            website,
            ipType,
            dataFrom
          } = res.data.data;
          setCurrentProjectName(project);
          formik.setValues({
            team,
            project,
            appType: appType?.split(',') || [],
            status,
            website,
            tenant,
            section,
            description,
            projectType: projectType !== '' ? projectType : 'NORMAL',
            ipType,
            dataFrom
          });
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // 提交保存
  const handleClickSubmit = (data) => {
    // 修改邮件模板;
    if (!_.isUndefined(id)) {
      Loading.show();
      API.modifyProject(data)
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success(L('modifyTheSuccess'));
            history.goBack();
          } else {
            CommonTip.error(L('modifyTheFail'));
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } else {
      Loading.show();
      API.insertProject(data)
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success(L('successfullyAdded'));
            history.goBack();
          } else {
            CommonTip.error(L('AddFailure'));
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };

  // 提交前再走一次校验，否则网很慢时候会有问题
  const checkProjectExitSubmit = () => {
    // 编辑时俩个文件相同就直接允许提交
    if (formik.values.project === currentProjectName) {
      formik.handleSubmit();
      return;
    }
    // 否则发请求校验
    API.checkProject({ projectName: formik.values.project }).then((res) => {
      if (res?.data?.data?.status) {
        formik.setFieldError('project', L('projectAlreadyExists'));
      } else {
        formik.handleSubmit();
      }
    });
  };

  // 验证模板名是存在
  const checkedProjectExit = (e) => {
    // 未输入直接返回
    if (formik.values.project === '') return;
    // 编辑时的名字可以跟原来的一样
    if (formik.values.project === currentProjectName) return;
    formik.handleBlur(e);
    API.checkProject({ projectName: formik.values.project }).then((res) => {
      if (res?.data?.data?.status) {
        formik.setFieldError('project', L('projectAlreadyExists'));
      }
    });
  };

  // 字段名
  const filedList = [
    {
      filed: 'project',
      type: 'string',
      require: true,
      onBlur: checkedProjectExit,
      labelName: L('project')
    },
    {
      filed: 'description',
      type: 'string',
      require: true,
      labelName: L('description')
    },
    {
      filed: 'appType',
      type: 'select',
      require: true,
      labelName: L('appType'),
      multiple: true,
      itemList: [
        { label: 'AP', value: 'AP' },
        { label: 'DP', value: 'DP' },
        { label: 'IP', value: 'IP' }
      ]
    },
    {
      filed: 'ipType',
      type: 'select',
      labelName: 'IP Type',
      require: formik.values.appType.includes('IP'),
      itemList: [
        { label: 'None', value: '' },
        { label: 'STATIC', value: 'STATIC' },
        { label: 'DHCP RESERVED', value: 'DHCP RESERVED' },
        { label: 'DHCP RANGE', value: 'DHCP RANGE' }
      ]
    },
    {
      filed: 'status',
      type: 'select',
      require: true,
      labelName: L('status'),
      itemList: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      filed: 'projectType',
      type: 'select',
      require: true,
      labelName: L('projectType'),
      itemList: [
        { label: 'MNI', value: 'MNI' },
        { label: 'NORMAL', value: 'NORMAL' }
      ]
    },
    {
      filed: 'team',
      type: 'string',
      require: false,
      labelName: L('team')
    },
    {
      filed: 'section',
      type: 'string',
      require: false,
      labelName: L('section')
    },
    {
      filed: 'tenant',
      type: 'string',
      require: false,
      labelName: L('tenant')
    },
    {
      filed: 'website',
      type: 'string',
      require: false,
      labelName: L('website')
    }
  ];

  // 点击返回按钮
  const handleClickCancel = () => {
    history.goBack();
  };

  // 响应列
  const flexRows = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
  };

  // 抽出来防止重复渲染
  const stylePros = useMemo(() => ({ width: '100%' }), []);

  const getDisabled = (item) => {
    if (!id) {
      return false;
    }

    if (isDetail) {
      return true;
    }

    if (item?.filed === 'project') {
      return true;
    }

    if (formik.values.dataFrom === 1 && ['description', 'team', 'section'].includes(item?.filed)) {
      return true;
    }

    return false;
  };

  return (
    <HAPaper
      className={globalClaess.haPaper}
      style={{
        width: '70%',
        minWidth: '450px',
        color: isDetail ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0,0,0,.85)'
      }}
    >
      <div className={classes.root}>
        <Grid container spacing={10} style={{ minWidth: '400px' }}>
          {filedList &&
            filedList.map((item) => (
              <Fragment key={item.filed}>
                {item.type === 'string' ? (
                  <Grid item {...flexRows} className={classes.gridstyle}>
                    <CommonInput
                      name={item.filed}
                      disabled={getDisabled(item)}
                      labels={item.labelName}
                      style={stylePros}
                      onBlur={item?.onBlur || null}
                      onChange={formik.handleChange}
                      require={item.require || false}
                      value={formik.values[item.filed] || ''}
                      helperText={formik.touched[item.filed] && formik.errors[item.filed]}
                      error={formik.errors[[item.filed]] && formik.touched[item.filed]}
                    />
                  </Grid>
                ) : (
                  <Grid item {...flexRows} className={classes.gridstyle}>
                    {/* 下拉框 */}
                    <div className={classes.selectStyle}>
                      <InputLabel className={classes.title2}>
                        {item.require && <span className={classes.starts}>*</span>}
                        {item.labelName}:
                      </InputLabel>
                      <CommonSelect
                        outlined
                        size="small"
                        key="status"
                        labelWidth={0}
                        disabled={getDisabled(item)}
                        name={item.filed || ''}
                        itemList={item.itemList}
                        onSelectChange={formik.handleChange}
                        value={formik.values[item.filed] || ''}
                        error={Boolean(formik.errors[[item.filed]] && formik.touched[item.filed])}
                        helperText={formik.touched[item.filed] && formik.errors[item.filed]}
                        style={{ width: '15.5vw', margin: 0 }}
                        multiple={item.multiple || false}
                      />
                    </div>
                  </Grid>
                )}
              </Fragment>
            ))}

          {/* 保存返回按钮 */}
          <div className={classes.btnFlex}>
            <Button
              variant="contained"
              disabled={url?.pathname.indexOf('detail') !== -1}
              style={{
                background: url?.pathname.indexOf('detail') !== -1 ? '#E0E0E0' : '#229FFA'
              }}
              onClick={checkProjectExitSubmit}
            >
              {L('Submit')}
            </Button>
            <Button variant="contained" onClick={handleClickCancel}>
              {isDetail ? L('Close') : L('Cancel')}
            </Button>
          </div>
        </Grid>
      </div>
    </HAPaper>
  );
}
