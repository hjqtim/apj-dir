import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CombinededForm from './components';
import { setForm } from '../../../redux/webDP/webDP-actions';

const DpApplicationForm = () => {
  const dispatch = useDispatch();
  const [init, setInit] = useState(false);

  useEffect(() => {
    dispatch(setForm('DP'));
    setInit(true);
  }, []);
  return <div style={{ marginTop: '1rem' }}>{init && <CombinededForm />}</div>;
};

export default DpApplicationForm;
