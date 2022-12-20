import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HAPaper } from '../../../components';
import GeneralForm from './components/general-from';
import DetailHeader from './components/general-from/DetailHeader';
import { setBaseData, setClearData } from '../../../redux/IPAdreess/ipaddrActions';
import WebdpAccordion from '../../../components/Webdp/WebdpAccordion';
import HandleRequest from './HandleRequest';

const IPApproval = () => {
  const dispatch = useDispatch();
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  useEffect(() => {
    dispatch(setBaseData({ isMyRequest: false, isMyApproval: true }));
    return () => {
      dispatch(setClearData());
    };
  }, []);

  return (
    <>
      <HAPaper style={{ padding: '0.8em' }}>
        {isMyApproval && <DetailHeader />}
        <br />
        <WebdpAccordion label="Application Form ( Click to Open )" content={<GeneralForm />} />
        <WebdpAccordion
          label="N3 Handle Request ( Click to Open )"
          content={<HandleRequest />}
          expandedSW
        />
      </HAPaper>
    </>
  );
};
export default memo(IPApproval);
