import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Menu, MenuItem, Typography, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { signOut, getUserFromLocalStorage } from '../utils/auth';
import { quictSwitch } from '../utils/switchRose';
import getIcons from '../utils/getIcons';
import API from '../api/webdp/webdp';
import MessageAPI from '../api/message';
import { CommonTip } from './index';
import SwitchTimeOut from './SwitchTimeOut';
// import Loading from './Loading';
// import MessageBox from './MessageBox';
// import { BASE_VER } from '../utils/constant';
// import { adGroupinfo } from '../utils/adgroupinfo';
import store from '../redux';
import { setUserMessageList } from '../redux/user/userActions';

const UserMenu = () => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  // const [switchMessage, setSwitchMessage] = useState(false);
  // const [messageList, setMessageList] = useState([]);
  // const [contentMSG, setContentMSG] = useState(``);
  // const [messageIndex, setMessageIndex] = useState(0);
  // const [previousDE, setPreviousDE] = useState(true);
  // const [nextDE, setNextDE] = useState(false);

  const currentUser = useSelector((state) => state.userReducer.currentUser); // true user
  const loginUser = useSelector((state) => state.userReducer.loginUser); // switch user
  const isSwitch = useSelector((state) => state.userReducer.isSwitch);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSwitchBack = () => {
    const switchId = getUserFromLocalStorage().username;

    API.switchBack(switchId).then((res) => {
      if (res?.data?.status === 200) {
        CommonTip.success('Success');
        quictSwitch();
      }
    });
  };

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    // const groupNamearr = adGroupinfo(currentUser.groupList);
    // console.log('loginUser', groupNamearr);
    // Loading.show();
    MessageAPI.getMessage4user({
      // groupName: groupNamearr[0],
      corpId: currentUser.name,
      forSystem: 'sense'
    }).then((res) => {
      if (res?.data?.code === 200) {
        const messageList = res?.data?.data;
        if (messageList?.length > 0) {
          store.dispatch(setUserMessageList(messageList));
          // setMessageList(messageList);
          // setContentMSG(messageList[0].content);
          // setSwitchMessage(true);
        }
      }
    });
    // .finally(() => {
    //   Loading.hide();
    // });
  };

  // const closeMessageBox = () => {
  //   setSwitchMessage(false);
  // };
  // const previousMSG = () => {
  //   // console.log('previousMSG', messageIndex);
  //   let tempIndex;
  //   if (messageIndex - 1 > 0) {
  //     tempIndex = messageIndex - 1;
  //     setNextDE(false);
  //     setPreviousDE(false);
  //     setMessageIndex(tempIndex);
  //   } else {
  //     tempIndex = 0;
  //     setPreviousDE(true);
  //     setNextDE(false);
  //     setMessageIndex(tempIndex);
  //   }
  //   setContentMSG(messageList[tempIndex].content);
  // };

  // const nextMSG = () => {
  //   // console.log('nextMSG', messageIndex);
  //   let tempIndex;
  //   if (messageIndex + 1 < messageList.length - 1) {
  //     tempIndex = messageIndex + 1;
  //     setNextDE(false);
  //     setPreviousDE(false);
  //     setMessageIndex(tempIndex);
  //   } else {
  //     tempIndex = messageList.length - 1;
  //     setNextDE(true);
  //     setPreviousDE(false);
  //     setMessageIndex(tempIndex);
  //   }
  //   setContentMSG(messageList[tempIndex].content);
  // };

  return (
    <>
      <Grid container spacing={2} style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <Grid item>
          {/* <Avatar alt="" style={{ width: '30px', height: '30px' }}>
            <AccountCircle />
          </Avatar> */}
        </Grid>
        {isSwitch && (
          <>
            <Grid item>
              <Typography color="primary">
                <SwitchTimeOut />
              </Typography>
            </Grid>
            <Grid item>
              <Typography style={{ color: '#40d8b5', textAlign: 'right' }}>
                <span>{currentUser.displayName}</span>
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Switch Back">
                <IconButton aria-haspopup="true" onClick={handleSwitchBack} color="inherit">
                  {getIcons('switchBack')}
                </IconButton>
              </Tooltip>
            </Grid>
          </>
        )}

        <Grid item>
          <Typography color="primary">
            {isSwitch ? loginUser.displayName : currentUser.displayName}
          </Typography>
        </Grid>
        <Grid>
          {/* <div style={{ right: 0, color: 'red', transform: 'rotate(45deg)', position: 'absolute' }}>
            {BASE_VER}
          </div> */}
          <Tooltip title="Logout">
            <IconButton
              aria-owns={anchorMenu ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={toggleMenu}
              color="inherit"
            >
              {/* <Power /> */}
              {getIcons('logoutIcon')}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu id="menu-appbar" anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={closeMenu}>
        {/* <MenuItem onClick={closeMenu}>
          Profile
        </MenuItem> */}
        <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
      </Menu>
      {/* <MessageBox
        open={switchMessage}
        title="Message"
        content={contentMSG}
        isHideFooter={!(messageList.length > 1)}
        previousDE={previousDE}
        nextDE={nextDE}
        handleClose={closeMessageBox}
        handlePrevious={previousMSG}
        handleNext={nextMSG}
      /> */}
    </>
  );
};

export default UserMenu;
