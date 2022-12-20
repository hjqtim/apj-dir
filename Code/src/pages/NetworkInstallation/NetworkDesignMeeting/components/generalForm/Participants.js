import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  makeStyles,
  Grid,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Tabs,
  Tab
} from '@material-ui/core';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux'; // load from redux
import { useParams } from 'react-router';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import webDPAPI from '../../../../../api/webdp/webdp';
import { validEmail } from '../../../../../utils/tools';
import { setParticipants } from '../../../../../redux/NetworkMeeting/Action';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 600,
    backgroundColor: theme.palette.background.paper,
    '& .MuiTab-textColorPrimary.Mui-selected': {
      background: '#f0f8ff'
    }
  }
}));

const Index = () => {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const classes = useStyles();
  const participantsReduce = useSelector((state) => state.networkMeeting.participants); // load from redux
  // const memberListRedux = participantsReduce.memberList;
  // const closeListRedux = participantsReduce.closeList;
  // console.log('participantsReduce', participantsReduce);

  const dispatch = useDispatch();
  const fromStatusURL = useParams().status;
  let fromStatus = 'add';
  if (typeof fromStatusURL !== 'undefined') {
    fromStatus = fromStatusURL;
  }

  const formik = useFormik({
    initialValues: {
      meeting: {
        memberList: [
          {
            id: _.uniqueId(`id_`),
            corpId: _.uniqueId(`corp_`),
            display: '',
            title: '',
            email: '',
            phone: '',
            checkStatus: 0
          }
        ],
        closeList: []
      },
      defultUserInfo: {
        id: _.uniqueId(`id_`),
        corpId: _.uniqueId(`corp_`),
        display: '',
        title: '',
        email: '',
        phone: '',
        checkStatus: 0
      },
      teamList: [
        {
          teamName: 'TeamA',
          memList: [
            {
              id: _.uniqueId(),
              corpId: _.uniqueId(),
              display: 'Teama01',
              title: 'Teama01',
              email: 'abc@mail.com',
              phone: '12345678',
              checkStatus: 0
            },
            {
              id: _.uniqueId(),
              corpId: _.uniqueId(),
              display: 'Teama02',
              title: 'Teama02',
              email: 'abc2@mail.com',
              phone: '12345678',
              checkStatus: 0
            }
          ]
        },
        {
          teamName: 'TeamB',
          memList: [
            {
              id: _.uniqueId(),
              corpId: _.uniqueId(),
              display: 'TeamB01',
              title: 'TeamB01',
              email: 'abc@mail.com',
              phone: '12345678',
              checkStatus: 0
            },
            {
              id: _.uniqueId(),
              corpId: _.uniqueId(),
              display: 'TeamB02',
              title: 'TeamB02',
              email: 'abc2@mail.com',
              phone: '12345678',
              checkStatus: 0
            }
          ]
        }
      ]
    }
  });
  const { meeting, defultUserInfo, teamList } = formik.values;
  const { memberList, closeList } = meeting;
  // memberList = memberListRedux;
  // closeList = closeListRedux;
  const { setFieldValue, handleChange } = formik;

  const [staffList, setstaffList] = useState([]);
  const optionsStaff = useMemo(
    () => staffList.map((optionItem) => optionItem.display),
    [staffList]
  );

  // 获取 用户 资料
  const getStaffList = useCallback(
    _.debounce((value, index) => {
      const obj = {};
      obj.username = value;
      setFieldValue(`member.${index}.loading`, true);
      webDPAPI
        .getADUserList(obj)
        .then((res) => {
          // console.log('getADUserList', res.data.data);
          if (res.data.code === 200) {
            const tempData = res.data.data;
            let tempArr = [];
            tempData.forEach((item) => {
              let obj = {};
              obj = item;
              obj.email = item.mail;
              obj.corpId = item.corp;
              obj.staffCorpId = item.corp;
              tempArr = [...tempArr, obj];
            });
            setstaffList([...tempArr]);
          }
        })
        .finally(() => {
          setFieldValue(`member.${index}.loading`, false);
        });
    }, 2000),
    []
  );

  // 匹配 onblur autoComplete
  const setmemberInfo = (val, index) => {
    if (val !== '') {
      const temp = staffList.filter((item) => item.display === val);
      if (temp.length > 0) {
        setFieldValue(`meeting.memberList.${index}`, temp?.[0]);
      } else {
        setFieldValue(`meeting.memberList.${index}.display`, val);
      }
    }
  };

  // 增加 与会成员
  const hanldmemAdd = () => {
    let tempMemberList = _.cloneDeep(memberList);
    tempMemberList = [...tempMemberList, defultUserInfo];
    setFieldValue('meeting.memberList', tempMemberList);
    set2Reducer('memberList', tempMemberList);
  };
  // 减少 与会成员
  const hanldmemDel = (corpId) => {
    const tempMemberList = memberList;
    let tempCloseList = closeList;
    const result = tempMemberList.filter((item) => item.corpId !== corpId);
    const close = tempMemberList.filter((item) => item.corpId === corpId);
    tempCloseList = [...tempCloseList, ...close];
    if (result.length > 0) {
      setFieldValue('meeting.memberList', result);
      setFieldValue('meeting.closeList', tempCloseList);
      const obj = {};
      obj.memberList = result;
      obj.closeList = tempCloseList;
      set2Reducer('meeting', obj);
    }
  };

  // 验证 电话
  const handleChangePhone = (value, index) => {
    // console.log('handleChangePhone', value);
    if (value && /^[0-9]*$/.test(value) && value?.length < 9) {
      setFieldValue(`meeting.memberList.${index}.phone`, value);
    } else if (value && /^[0-9]*$/.test(value) && value?.length === 9) {
      setFieldValue(`meeting.memberList.${index}.phone`, value.substring(0, 8));
    } else if (!value) {
      setFieldValue(`meeting.memberList.${index}.phone`, value);
    }
  };
  // 验证 邮箱
  const toValidEmail = (index) => {
    const tempList = memberList;
    const result = validEmail(tempList[index].mail);
    console.log('validEmail', result);
  };

  // 批量追加 与会人员
  const [packageVal, setPackageVal] = useState(0);
  const handleChangePackage = (e, val) => {
    // console.log('handleChangePackage', e, val);
    setPackageVal(val);
    let temp = _.cloneDeep(memberList);
    temp = [...teamList[val].memList, ...temp];
    uniqueArr(temp);

    // console.log('teamList', temp);
    // setFieldValue(`meeting.memberList`, temp);
  };
  // 去重处理
  const uniqueArr = (arrayObj) => {
    const res1 = arrayObj.filter(
      (currentValue, currentIndex, selfArr) =>
        selfArr.findIndex((x) => x.display === currentValue.display) === currentIndex
    );
    const res2 = arrayObj.filter(
      (currentValue, currentIndex, selfArr) =>
        selfArr.findIndex((x) => x.display === currentValue.display) !== currentIndex
    );
    // console.log('uniqueArr', res1, res2);
    const obj = {};
    obj.memberList = res1;
    obj.closeList = [...closeList, ...res2];
    set2Reducer('meeting', obj);
  };

  // 更新到 reduce
  const set2Reducer = (field, value) => {
    if (field === 'meeting') {
      dispatch(setParticipants(value));
    }
    if (field === 'memberList') {
      const temp = _.cloneDeep(participantsReduce);
      temp.memberList = value;
      dispatch(setParticipants(temp));
    }
    if (field === 'memberList') {
      const temp = _.cloneDeep(participantsReduce);
      temp.memberList = value;
      dispatch(setParticipants(temp));
    }
    if (field === 'emailBlur') {
      const temp = _.cloneDeep(participantsReduce);
      temp.memberList = memberList;
      dispatch(setParticipants(temp));
    }
  };
  // useEffect(() => {
  //   set2Reducer();
  // }, [memberList, closeList]);

  const setFormikData = (participantsReduce) => {
    formik.setFieldValue('meeting', participantsReduce);
  };
  useEffect(() => {
    setFormikData(participantsReduce);
  }, [participantsReduce]);

  return (
    <>
      <div>
        <Grid container>
          <Grid {...TitleProps}>
            <Typography variant="h6" style={{ color: webdpColor.title }}>
              <strong>Participants</strong>
            </Typography>
          </Grid>

          <Grid {...FormControlProps} md={6} lg={12}>
            {fromStatus === 'detail' ? null : (
              <Tabs
                className={classes.root}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                value={packageVal}
                onChange={handleChangePackage}
                disabled={fromStatus === 'detail' || false}
              >
                {teamList.map((item, index) => {
                  const label = item.teamName;
                  return <Tab label={`${label}`} key={index} />;
                })}

                {/* <Tab label="Team A" />
              <Tab label="Team B" />
              <Tab label="Team C" />
              <Tab label="Team D" />
              <Tab label="Team E" />
              <Tab label="Team F" />
              <Tab label="Team G" />
              <Tab label="Team H" />
              <Tab label="Team I" />
              <Tab label="Team J" />
              <Tab label="Team K" /> */}
              </Tabs>
            )}
          </Grid>

          {memberList?.map((item, index) => {
            console.log('meeting.memberList', memberList, item, index);
            return (
              <React.Fragment key={item.id}>
                <Grid {...FormControlProps} md={6} lg={2}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    // freeSolo
                    id="StaffName"
                    value={item.display || null}
                    options={optionsStaff || []}
                    onChange={(_, value) => {
                      //   console.log('staffName Slect', _, value);
                      setmemberInfo(value, index);
                      // jobTypeReducer('staffName', value);
                      // dispatch(setTouch({ field: 'jobType', data: { staffName: true } }));
                    }} // 选择下拉 时 触发
                    disabled={fromStatus === 'detail' || false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Staff Name *"
                        variant="outlined"
                        size="small"
                        value={item.display || null}
                        onChange={(e) => {
                          const staffNameTemp = e.target.value;
                          //   console.log('staffNameTemp', staffNameTemp);
                          if (staffNameTemp.length > 2) {
                            getStaffList(e.target.value, index);
                          }
                        }} // 手写时 触发
                        onBlur={(e) => {
                          // console.log('staffName onBlur:', e.target.value);
                          setmemberInfo(e.target.value, index);
                          //   jobTypeReducer('staffName', e.target.value);
                        }}
                        // for loading
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {item.loading ? <CircularProgress size={20} color="inherit" /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                        // error={Boolean(touches?.jobType?.staffName)}
                      />
                    )}
                  />
                </Grid>
                <Grid {...FormControlProps} md={6} lg={3}>
                  <TextField
                    label="Title "
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{ width: '100%' }}
                    value={item.title}
                    onChange={handleChange(`meeting.memberList.${index}.title`)}
                    //   error={Boolean(touches?.memberList?.[index]?.title)}
                    disabled={fromStatus === 'detail' || false}
                  />
                </Grid>
                <Grid {...FormControlProps} md={6} lg={3}>
                  <TextField
                    label="Email *"
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{ width: '100%' }}
                    value={item.email}
                    onChange={handleChange(`meeting.memberList.${index}.email`)}
                    onBlur={() => {
                      toValidEmail(index);
                      set2Reducer('emailBlur');
                    }}
                    //   error={Boolean(touches?.memberList?.[index]?.mail)}
                    disabled={fromStatus === 'detail' || false}
                  />
                </Grid>
                <Grid {...FormControlProps} md={6} lg={2}>
                  <TextField
                    label="Phone *"
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{ width: '100%' }}
                    value={item.phone}
                    onChange={(e) => handleChangePhone(e.target.value, index)}
                    // error={Boolean(touches?.memberList?.[index]?.phone)}
                    disabled={fromStatus === 'detail' || false}
                    onBlur={() => {
                      set2Reducer('emailBlur');
                    }}
                  />
                </Grid>
                {fromStatus === 'detail' ? null : (
                  <Grid {...FormControlProps} md={6} lg={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        hanldmemAdd();
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => {
                        hanldmemDel(item.corpId);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                )}
              </React.Fragment>
            );
          })}
        </Grid>
      </div>
    </>
  );
};
export default memo(Index);
