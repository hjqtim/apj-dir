import React from 'react';
import { useSelector } from 'react-redux';
import List from './components/List';
import CommonPage from '../../../components/CommonPage';

export default function Index() {
  const currentUser = useSelector((state) => state.userReducer.currentUser);

  const getUserName = (value) => {
    const arr = value?.split?.(',') || [];
    if (arr?.[0]) {
      return arr[0];
    }
    return '';
  };

  const config = {
    title: `List of user(s) with read-only permission to all ${getUserName(
      currentUser.displayName
    )}'s requests`,
    List
  };

  return (
    <>
      <CommonPage {...config} />
    </>
  );
}
