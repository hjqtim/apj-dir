import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HAPaper } from '../../../components';
import GeneralForm from './components/general-from';
import DetailHeader from './components/general-from/DetailHeader';

import { setBaseData, setClearData } from '../../../redux/IPAdreess/ipaddrActions';

const IPAddressApplicationDetail = ({ requestNo }) => {
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBaseData({ isMyRequest: true, isMyApproval: false }));
    return () => {
      dispatch(setClearData());
    };
  }, []);

  return (
    <>
      <HAPaper style={{ padding: '0.8em' }}>
        {isMyRequest && <DetailHeader requestNo={requestNo} />}
        <GeneralForm requestNo={requestNo} />
      </HAPaper>
    </>
  );
};
export default memo(IPAddressApplicationDetail);
