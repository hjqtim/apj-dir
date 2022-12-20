import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import Message from '../../pages/Message';

const MessageModule = {
  id: 'Message',
  name: 'Message',
  path: '/message',
  icon: <SendIcon />,
  component: Message,
  children: null
};

export default MessageModule;
