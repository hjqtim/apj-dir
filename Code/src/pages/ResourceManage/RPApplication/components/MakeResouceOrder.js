import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ResourceForm from './ResourceForm';
import { setRestData } from '../../../../redux/ResourceMX/resourceAction';

const MakeResouceOrder = ({ toggleDrawer, toGetCalendarList }) => {
  const dispatch = useDispatch();
  // const userInfo = JSON.parse(localStorage.getItem('user'));
  // dispatch(setStatusInfo(''));
  // dispatch(setRequest({ field: 'logonDomain', data: userInfo.department }));
  // dispatch(setRequest({ field: 'logonName', data: userInfo.username }));
  // dispatch(setRequest({ field: 'title', data: userInfo.title }));
  // dispatch(setRequest({ field: 'name', data: userInfo.name }));
  // dispatch(setRequest({ field: 'userPhone', data: userInfo.phone }));

  useEffect(() => {
    // console.log('MakeResouceOrder setRestData');
    dispatch(setRestData());
  }, []);

  return (
    <>
      <div style={{ width: '85vw' }}>
        <ResourceForm
          formType="make"
          toggleDrawer={toggleDrawer}
          toGetCalendarList={toGetCalendarList}
        />
      </div>
    </>
  );
};
export default memo(MakeResouceOrder);
