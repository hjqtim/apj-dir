import React, { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { HAPaper } from '../../../components';
import GeneralForm from './components/general-from';
import { setBaseData, setClearData } from '../../../redux/IPAdreess/ipaddrActions';

const IPAddressApplication = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBaseData({ isMyRequest: false, isMyApproval: false }));
    return () => {
      dispatch(setClearData());
    };
  }, []);
  return (
    <HAPaper style={{ padding: '0.8em' }}>
      <GeneralForm />
    </HAPaper>
  );
};

export default memo(IPAddressApplication);
