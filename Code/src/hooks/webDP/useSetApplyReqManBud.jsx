import { useDispatch } from 'react-redux';
import { setApplyReqManBudTouch } from '../../redux/webDP/webDP-actions';

const useSetApplyReqManBud = () => {
  const dispatch = useDispatch();

  const setApplyReqManBudByFiled = (filed) => {
    const value = {
      [filed]: true
    };

    dispatch(setApplyReqManBudTouch(value));
  };

  return setApplyReqManBudByFiled;
};

export default useSetApplyReqManBud;
