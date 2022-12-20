import React from 'react';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AddressBookHosp from '../../pages/AddressBookHosp';

const AddressBook = {
  id: 'Contact',
  name: 'Address Book Institution',
  path: '/addressbookhosp',
  icon: <AccountBalanceWalletOutlinedIcon />,
  component: AddressBookHosp,
  children: null
};

export default AddressBook;
