import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
// import { setPage } from '../../redux/page/pageActions';
// import store from '../../redux';
// import { getCurrentPage } from '../../utils/url';
import { useSelector } from 'react-redux';
import newRoutes from '../../routes/newRoutes';
import MessageBox from '../MessageBox';
import MessageAPI from '../../api/message';

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const LinkProps = {
  style: { textDecoration: 'none', color: '#229FFA', fontWeight: 'bold', fontSize: '0.8rem' }
};

const menuRoutes2 = _.cloneDeep(newRoutes);

export default function NaviBar() {
  // const { breadcrumbsList } = props;
  const [breadcrumbsList, setBreadcrumbsList] = useState([]);
  const location = useLocation();
  // const history = useHistory();

  const [switchMessage, setSwitchMessage] = useState(false);
  const [messageListSouce, setMessageListSouce] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [contentMSG, setContentMSG] = useState(``);
  const [messageIndex, setMessageIndex] = useState(0);
  const [previousDE, setPreviousDE] = useState(true);
  const [nextDE, setNextDE] = useState(false);
  const tempMessageList = useSelector((state) => state.userReducer.messageList);

  useEffect(() => {
    sourceMessageBox();
  }, [tempMessageList]);

  // 没模块名表示 login 就 showbox
  const sourceMessageBox = () => {
    if (tempMessageList?.length > 0) {
      // console.log('showMessageBox', tempMessageList);
      const tempArr = tempMessageList.filter(
        (item) => item.moduleName === '' || item.moduleName === null
      );
      setMessageListSouce([...tempMessageList]);
      if (tempArr?.length > 0) {
        setContentMSG(tempArr[0]?.content);
        setMessageList([...tempArr]);
        setSwitchMessage(true);
        hasReadThisMessage(tempArr[0]?.id);
      }
    }
  };

  useEffect(() => {
    const parsedPath = location.pathname.split('/').filter((item) => item.length !== 0);
    const pathArray = [];

    let menuRoutes3 = [];
    for (let i = 0; i < newRoutes.length; i += 1) {
      if (newRoutes[i]?.children !== null) {
        const child = newRoutes[i]?.children;
        for (let i2 = 0; i2 < child.length; i2 += 1) {
          if (Object.prototype.hasOwnProperty.call(child[i2], 'children')) {
            const child2 = child[i2]?.children;
            menuRoutes2[i].children = child2;
            for (let i3 = 0; i3 < child2.length; i3 += 1) {
              menuRoutes3 = [...menuRoutes3, child2[i3]];
            }
          } else {
            menuRoutes3 = [...menuRoutes3, child[i2]];
          }
        }
      } else {
        menuRoutes3 = [...menuRoutes3, newRoutes[i]];
      }
    }
    // console.log('menuRoutes3', menuRoutes3);

    let isBreak = false;
    menuRoutes3.forEach((item) => {
      if (isBreak) return;
      // console.log('item', `/${parsedPath[0]}/${parsedPath[1]}`, item);
      const temp = item.path.split('/');
      // console.log('temp', temp);
      if (
        // `/${temp[1]}` === `/${parsedPath[0]}`
        `/${temp[1]}/${temp[2]}` === `/${parsedPath[0]}/${parsedPath[1]}`
      ) {
        pathArray.push(item.name);
        isBreak = true;
      }
    });
    setBreadcrumbsList(pathArray);
    filterMessage(pathArray);
  }, [location]);

  // 根据 模块 名 过滤 出来，就 showbox
  const filterMessage = (pathArray) => {
    const tempArr = messageListSouce.filter((item) => item.moduleName === pathArray[0]);
    const retempArr = messageListSouce.filter((item) => item.moduleName !== pathArray[0]);
    setMessageListSouce([...retempArr]);
    // console.log('filterMessage', pathArray[0], messageListSouce, tempArr, retempArr);

    if (tempArr?.length > 0) {
      setContentMSG(tempArr[0]?.content);
      setMessageList([...tempArr]);
      setSwitchMessage(true);
      hasReadThisMessage(tempArr[0]?.id);
    }
  };

  const closeMessageBox = () => {
    setSwitchMessage(false);
  };
  const previousMSG = () => {
    // console.log('previousMSG', messageIndex);
    let tempIndex;
    if (messageIndex - 1 > 0) {
      tempIndex = messageIndex - 1;
      setNextDE(false);
      setPreviousDE(false);
      setMessageIndex(tempIndex);
    } else {
      tempIndex = 0;
      setPreviousDE(true);
      setNextDE(false);
      setMessageIndex(tempIndex);
    }
    setContentMSG(messageList[tempIndex].content);
    hasReadThisMessage(messageList[tempIndex].id);
  };
  const nextMSG = () => {
    // console.log('nextMSG', messageIndex);
    let tempIndex;
    if (messageIndex + 1 < messageList.length - 1) {
      tempIndex = messageIndex + 1;
      setNextDE(false);
      setPreviousDE(false);
      setMessageIndex(tempIndex);
    } else {
      tempIndex = messageList.length - 1;
      setNextDE(true);
      setPreviousDE(false);
      setMessageIndex(tempIndex);
    }
    setContentMSG(messageList[tempIndex].content);
    hasReadThisMessage(messageList[tempIndex].id);
  };
  const hasReadThisMessage = (messageId) => {
    MessageAPI.hasReadMessage(messageId).then((res) => {
      console.log('hasReadMessage', res?.data);
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#E5EAF0',
        width: '100%',
        height: '2.5rem',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.7)',
        paddingLeft: '25px'
      }}
    >
      <Breadcrumbs aria-label="Breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        <Link to="/" {...LinkProps}>
          SENSE
        </Link>
        {breadcrumbsList?.map((el, i) => (
          <Typography key={i} style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
            {el}
          </Typography>
        ))}
      </Breadcrumbs>
      <MessageBox
        open={switchMessage}
        title="Message"
        content={contentMSG}
        isHideFooter={!(messageList.length > 1)}
        previousDE={previousDE}
        nextDE={nextDE}
        handleClose={closeMessageBox}
        handlePrevious={previousMSG}
        handleNext={nextMSG}
      />
    </div>
  );
}

/* <Typography style={getLinkStyle(el)} onClick={() => handleClick(el)} key={i + el.title}>
              {el.title}
            </Typography> */
