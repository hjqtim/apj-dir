import { memo, useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getSwitchTime, maxSwitchTime, quictSwitch, hasIsSwitch } from '../utils/switchRose';
import { CommonTip } from './index';

const SwitchTimeOut = () => {
  const ref = useRef();
  const [value, setValue] = useState('');
  const isSwitch = useSelector((state) => state.userReducer.isSwitch);

  useEffect(() => {
    if (!isSwitch) {
      return;
    }

    ref.current = setInterval(() => {
      const nowTime = dayjs().format();
      const endTime = dayjs(getSwitchTime()).add(maxSwitchTime, 's');
      const timeDiff = dayjs(endTime).diff(dayjs(nowTime), 's');

      if (timeDiff >= 0) {
        const newValue = dayjs('2000-01-01 00:00:00').add(timeDiff, 's').format('HH:mm:ss');
        setValue(newValue);
      } else {
        if (hasIsSwitch()) {
          CommonTip.error('Switching expired');
        }
        clearInterval(ref.current);
        setValue('');
        quictSwitch();
      }
    }, 1000);
  }, []);
  return value;
};

export default memo(SwitchTimeOut);
