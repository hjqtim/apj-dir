import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Avatar,
  Divider,
  List,
  ListItem as MuiListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import store from '../redux';
import { setUserGroupStatus } from '../redux/user/userActions';
import { setNewRoutes } from '../redux/page/pageActions';
// import { flushSync } from 'react-dom';
import newRoutes from '../routes/newRoutes';

import { getUser } from '../utils/auth';
import { adGroup } from '../utils/config';
import {
  BASE_VER,
  BASE_VES
  // SENSE_UR,
  // SENSE_RF,
  // SENSE_PO,
  // SENSE_DP,
  // SENSE_ND,
  // SENSE_AP,
  // SENSE_EN,
  // SENSE_VM,
  // SENSE_ODC,
  // SENSE_ADM
} from '../utils/constant';
import { adGroupMenu } from '../utils/adgroupmenu';

const ListItem = withStyles({
  root: {
    '&$selected': {
      backgroundColor: '#078080',
      color: 'white'
    },
    '&:hover': {
      backgroundColor: '#229FFA',
      color: 'white'
    }
  },
  selected: {}
})(MuiListItem);

const ListIconProps = {
  style: {
    display: 'flex',
    justifyContent: 'center',
    height: '25px',
    color: 'white'
  }
};

let userinfo = {};
userinfo = getUser();

const adgroup = adGroup();

const newRoutes2 = _.cloneDeep(newRoutes);

const DashboardDrawer = () => {
  // console.log(
  //   'DashboardDrawer',
  //   useSelector((state) => state.userReducer.groupInfo)
  // );

  // const G_SENSE_UR = SENSE_UR.split(','); // 0 SENSE User
  // const G_SENSE_RF = SENSE_RF.split(','); // 1 N3 Request Form Admin
  // const G_SENSE_PO = SENSE_PO.split(','); // 2 N3 Procurement Admin
  // const G_SENSE_DP = SENSE_DP.split(','); // 3 N3 DP Admin
  // const G_SENSE_ND = SENSE_ND.split(','); // 4 N3 Network Designer
  // const G_SENSE_AP = SENSE_AP.split(','); // 5 N4 AP support
  // const G_SENSE_EN = SENSE_EN.split(','); // 6 N5 External Network Support
  // const G_SENSE_VM = SENSE_VM.split(','); // 7 T2 Linux VM Provisionning Support
  // const G_SENSE_ODC = SENSE_ODC.split(','); // 8 For APJ developer
  // const G_SENSE_ADM = SENSE_ADM.split(','); // 9 SENSE Admin

  const requester = useSelector((state) => state.userReducer.requester);
  if (requester?.displayName && requester.displayName !== userinfo.displayName) {
    userinfo = requester;
    // console.log('requester', requester);
  }

  const [temparr, setTemparr] = useState([]);

  const history = useHistory();
  const location = useLocation();
  const [selected, setSelected] = useState();

  const [open, setOpen] = useState('');
  const handleClick = (e) => {
    if (open === e) {
      setOpen('');
    } else {
      setOpen(e);
    }
  };

  const [open2, setOpen2] = useState('');
  const handleClick2 = (e) => {
    // console.log('handleClick2', e);
    if (open2 === e) {
      setOpen2('');
    } else {
      setOpen2(e);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setSelected(currentPath);
  }, [location, selected]);

  useEffect(() => {
    adGroupMenu(
      adgroup,
      userinfo,
      newRoutes2,
      temparr,
      setTemparr,
      store,
      setNewRoutes,
      setUserGroupStatus
    );
    // const value = authUserInfo();
  }, [requester]);

  // console.log('Yancy Auth', G_SENSE_RF);

  // const adGroupMenu = () => {
  //   // console.log('Userinfo1', userinfo);

  //   // sensesc1 Requester [9]
  //   // sensesc2 Network Desiger [7]
  //   // sensesc3 Request Form Admin [4]
  //   // sensesc4 Procurment Admin [5]
  //   // sensesc5 DP Admin [6]
  //   // sensesc6 N4 AP Supper [3]
  //   // sensesc7 N5 EN [2]
  //   // sensesc8 T2 Linux VM Provisioning Support [8] / [1] sense_admin

  //   let menuList = adgroup[10].list; // Defult Guest
  //   let groupName = 'Guest'; // Defult
  //   const temp = [];
  //   const groupInfo = {
  //     groupName: 'Guest',
  //     Guest: true, // Guest
  //     G_SENSE_UR: false, // Request
  //     G_SENSE_RF: false, // Request Form Admin
  //     G_SENSE_PO: false, // Procurment Admin
  //     G_SENSE_ND: false, // Network Desiger
  //     G_SENSE_DP: false, // DP Admin
  //     G_SENSE_AP: false, // AP Support
  //     G_SENSE_EN: false, // External Network Support
  //     G_SENSE_VM: false, // VM support
  //     G_SENSE_ADM: false, // SENSE Admin
  //     G_SENSE_ODC: false // Developers
  //   };

  //   if (userinfo.name === 'HO IT&HI SENSE System Account 1') {
  //     menuList = adgroup[9].list;
  //     groupInfo.G_SENSE_UR = true;
  //     groupInfo.groupName = 'TEST';
  //     groupName = 'G_SENSE_UR';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 2') {
  //     menuList = adgroup[7].list;
  //     groupInfo.G_SENSE_ND = true;
  //     groupInfo.groupName = 'sense_ND-support';
  //     groupName = 'G_SENSE_ND';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 3') {
  //     menuList = adgroup[4].list;
  //     groupInfo.G_SENSE_RF = true;
  //     groupInfo.groupName = 'sense_RF-support';
  //     groupName = 'G_SENSE_RF';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 4') {
  //     menuList = adgroup[5].list;
  //     groupInfo.G_SENSE_PO = true;
  //     groupInfo.groupName = 'sense_PO-support';
  //     groupName = 'G_SENSE_PO';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 5') {
  //     menuList = adgroup[6].list;
  //     groupInfo.G_SENSE_DP = true;
  //     groupInfo.groupName = 'sense_DP-support';
  //     groupName = 'G_SENSE_DP';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 6') {
  //     menuList = adgroup[3].list;
  //     groupInfo.G_SENSE_AP = true;
  //     groupInfo.groupName = 'sense_AP-support';
  //     groupName = 'G_SENSE_AP';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 7') {
  //     menuList = adgroup[2].list;
  //     groupInfo.G_SENSE_EN = true;
  //     groupInfo.groupName = 'sense_EN-support';
  //     groupName = 'G_SENSE_EN';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else if (userinfo.name === 'HO IT&HI SENSE System Account 8') {
  //     menuList = adgroup[1].list;
  //     groupInfo.G_SENSE_ADM = true;
  //     groupInfo.groupName = 'sense_admin';
  //     groupName = 'G_SENSE_ADM';

  //     for (let i = 0; i < menuList.length; i += 1) {
  //       for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //         if (menuList[i].name === newRoutes2[i2].name) {
  //           const { children } = newRoutes2[i2];
  //           if (children && children !== null) {
  //             const menuListChildren = menuList[i].children;
  //             const temp2 = [];
  //             for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //               for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                 if (menuListChildren[i3].name === children[i4].name) {
  //                   temp2.push(children[i4]);
  //                 }
  //               }
  //             }
  //             const temp1 = newRoutes2[i2];
  //             temp1.children = temp2;
  //             temp.push(temp1);
  //           } else {
  //             temp.push(newRoutes2[i2]);
  //           }
  //         }
  //       }
  //     }
  //     setTemparr([...temp]);
  //   } else {
  //     // console.log('groupList:', userinfo);
  //     const groups = userinfo.groupList;

  //     if (groups.length !== 0) {
  //       // 0 find Requester
  //       let status0 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status0) {
  //           for (let i2 = 0; i2 < G_SENSE_UR.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_UR[i2]) {
  //               groupName = 'G_SENSE_UR';
  //               groupInfo.G_SENSE_UR = true;
  //               groupInfo.groupName = groups[i].name;
  //               status0 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 1 find N3 Request Form Admin
  //       let status1 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status1) {
  //           for (let i2 = 0; i2 < G_SENSE_RF.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_RF[i2]) {
  //               groupName = 'G_SENSE_RF';
  //               groupInfo.G_SENSE_RF = true;
  //               groupInfo.groupName = groups[i].name;
  //               status1 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 2 find N3 Procurement Admin
  //       let status2 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status2) {
  //           for (let i2 = 0; i2 < G_SENSE_PO.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_PO[i2]) {
  //               groupName = 'G_SENSE_PO';
  //               groupInfo.G_SENSE_PO = true;
  //               groupInfo.groupName = groups[i].name;
  //               status2 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 3 find N3 DP Admin
  //       let status3 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status3) {
  //           for (let i2 = 0; i2 < G_SENSE_DP.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_DP[i2]) {
  //               groupName = 'G_SENSE_DP';
  //               groupInfo.G_SENSE_DP = true;
  //               groupInfo.groupName = groups[i].name;
  //               status3 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 4 find N3 Network Designer
  //       let status4 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status4) {
  //           for (let i2 = 0; i2 < G_SENSE_ND.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_ND[i2]) {
  //               groupName = 'G_SENSE_ND';
  //               groupInfo.G_SENSE_ND = true;
  //               groupInfo.groupName = groups[i].name;
  //               status4 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 5 find N3 AP Support
  //       let status5 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status5) {
  //           for (let i2 = 0; i2 < G_SENSE_AP.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_AP[i2]) {
  //               groupName = 'G_SENSE_AP';
  //               groupInfo.G_SENSE_AP = true;
  //               groupInfo.groupName = groups[i].name;
  //               status5 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 6 find N5 External Network Support
  //       let status6 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status6) {
  //           for (let i2 = 0; i2 < G_SENSE_EN.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_EN[i2]) {
  //               groupName = 'G_SENSE_EN';
  //               groupInfo.G_SENSE_EN = true;
  //               groupInfo.groupName = groups[i].name;
  //               status6 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 7 find T2 VM
  //       let status7 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status7) {
  //           for (let i2 = 0; i2 < G_SENSE_VM.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_VM[i2]) {
  //               groupName = 'G_SENSE_VM';
  //               groupInfo.G_SENSE_VM = true;
  //               groupInfo.groupName = groups[i].name;
  //               status7 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 8 find T2 VM
  //       let status8 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status8) {
  //           for (let i2 = 0; i2 < G_SENSE_ADM.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_ADM[i2]) {
  //               groupName = 'G_SENSE_ADM';
  //               groupInfo.G_SENSE_ADM = true;
  //               groupInfo.groupName = groups[i].name;
  //               status8 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // 9 find ODC Developers
  //       let status9 = true;
  //       for (let i = 0; i < groups.length; i += 1) {
  //         if (status9) {
  //           for (let i2 = 0; i2 < G_SENSE_ODC.length; i2 += 1) {
  //             if (groups[i].name === G_SENSE_ODC[i2]) {
  //               groupName = 'G_SENSE_ODC';
  //               groupInfo.G_SENSE_ODC = true;
  //               groupInfo.groupName = groups[i].name;
  //               status9 = false;
  //               break;
  //             }
  //           }
  //         } else {
  //           break;
  //         }
  //       }

  //       // console.log('groupName', groupName);
  //       // X find Menu List
  //       if (groupName !== 'Guest') {
  //         for (let i = 0; i < adgroup.length; i += 1) {
  //           if (groupName === adgroup[i].name) {
  //             menuList = adgroup[i].list;
  //             break;
  //           }
  //         }
  //       }

  //       // builder adgroup Menu father

  //       for (let i = 0; i < menuList.length; i += 1) {
  //         for (let i2 = 0; i2 < newRoutes2.length; i2 += 1) {
  //           if (menuList[i].name === newRoutes2[i2].name) {
  //             const { children } = newRoutes2[i2];
  //             if (children && children !== null) {
  //               const menuListChildren = menuList[i].children;
  //               const temp2 = [];
  //               for (let i3 = 0; i3 < menuListChildren.length; i3 += 1) {
  //                 for (let i4 = 0; i4 < children.length; i4 += 1) {
  //                   if (menuListChildren[i3].name === children[i4].name) {
  //                     temp2.push(children[i4]);
  //                   }
  //                 }
  //               }
  //               // const temp1 = JSON.parse(JSON.stringify(newRoutes2[i2]));
  //               const temp1 = newRoutes2[i2];
  //               temp1.children = temp2;
  //               // console.log('temp1', temp1, temp2);
  //               temp.push(temp1);

  //               // temp.push(newRoutes2[i2]);
  //             } else {
  //               temp.push(newRoutes2[i2]);
  //             }
  //           }
  //         }
  //       }
  //       // console.log('temparr:', temp);
  //       setTemparr([...temp]);
  //     }
  //   }
  //   localStorage.setItem('GN1', groupName);
  //   // localStorage.setItem('GN2', JSON.stringify(groupInfo));
  //   store.dispatch(setUserGroupStatus(groupInfo));
  //   store.dispatch(setNewRoutes(temp));
  // };

  // The menu refresh menu is not expanded
  useEffect(() => {
    // console.log('history', history);
    temparr?.find((item) => {
      if (item?.children?.length !== 0) {
        const data = item?.children?.find((data) => data?.path === history?.location?.pathname);
        // console.log('historydata', data);
        if (data) {
          setOpen(item.id);
          return true;
        }
      }
      return false;
    });
  }, [temparr]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F3E5B' }}>
      <div
        style={{
          minHeight: '64px',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          backgroundColor: '#E5EAF0',
          padding: 10
        }}
      >
        <Avatar
          alt="Logo"
          variant="square"
          style={{
            width: '40px',
            height: '40px',
            textAlign: 'center',
            margin: '0',
            marginRight: '10px'
          }}
          src="/static/img/logo/sidebar.svg"
        />
        <Typography variant="h4">SENSE Platform</Typography>
        {BASE_VER ? (
          <div
            style={{ color: '#1a70ff', transform: 'rotate(0deg)', margin: '-15px 0px 0px 10px' }}
          >
            <div
              style={{
                color: '#fff',
                background: '#ff0000',
                textAlign: 'center',
                padding: 5,
                borderRadius: 5
              }}
            >
              {BASE_VER}
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          marginTop: -20,
          textAlign: 'right',
          fontSize: 14,
          fontWeight: 500
        }}
      >
        {`Ver ${BASE_VES}`}
      </div>
      <Divider />
      <List
        component="nav"
        aria-label="SENSE menubar"
        style={{ color: 'white', backgroundColor: '#0F3E5B' }}
      >
        {/* {newRoutes.map((module) => */}
        {temparr.map((module) =>
          module?.children === null || module?.id === 'My Request' || module?.id === 'My Action' ? (
            <ListItem
              key={`${module.id}`}
              selected={selected === module.path}
              button
              onClick={() => history.push(module.path)}
            >
              <ListItemIcon {...ListIconProps}>{module.icon}</ListItemIcon>
              <ListItemText primary={module.id} />
            </ListItem>
          ) : (
            <div key={module.id}>
              <ListItem key={module.id} button onClick={() => handleClick(module.id)}>
                <ListItemIcon {...ListIconProps}>{module.icon}</ListItemIcon>
                <ListItemText primary={module.id} />
                {open === module.id && <ExpandLess />}
                {open !== module.id && <ExpandMore />}
              </ListItem>
              <Collapse
                key={`${module.id}Collapse`}
                in={open === module.id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div">
                  {module.children.map((child) => {
                    if (!child.isHidden) {
                      if (child?.children) {
                        const gChildren = child?.children;
                        // console.log('have children', gChildren);
                        return (
                          <div key={child.id}>
                            <ListItem key={child.id} button onClick={() => handleClick2(child.id)}>
                              <ListItemText primary={child.id} style={{ marginLeft: 32 }} />
                              {open2 === child.id && <ExpandLess />}
                              {open2 !== child.id && <ExpandMore />}
                            </ListItem>
                            <Collapse
                              key={`${child.id}-Collapse`}
                              in={open2 === child.id}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div">
                                {gChildren.map((child2) => {
                                  // console.log('child2', child2);
                                  if (!child2?.isHidden) {
                                    return (
                                      <ListItem
                                        key={`${child2.name}`}
                                        selected={selected === child2.path}
                                        button
                                        onClick={() => {
                                          if (child2.isBlank) {
                                            window.open(child2.path);
                                          } else {
                                            history.push(child2.path);
                                          }
                                        }}
                                      >
                                        <ListItemText
                                          primary={child2.name}
                                          style={{ paddingLeft: '2.5rem' }}
                                        />
                                      </ListItem>
                                    );
                                  }
                                  return null;
                                })}
                              </List>
                            </Collapse>
                          </div>
                        );
                      }
                      return (
                        <ListItem
                          key={`${child.name}`}
                          selected={selected === child.path}
                          button
                          onClick={() => {
                            if (child.isBlank) {
                              window.open(child.path);
                            } else {
                              history.push(child.path);
                            }
                          }}
                        >
                          <ListItemText primary={child.name} style={{ paddingLeft: '2rem' }} />
                        </ListItem>
                      );
                    }
                    return null;
                  })}
                </List>
              </Collapse>
            </div>
          )
        )}
      </List>
    </div>
  );
};

export default DashboardDrawer;
