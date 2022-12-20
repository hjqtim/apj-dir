import { useDispatch } from 'react-redux';
import { setReqManBudTouch } from '../../redux/myAction/my-action-actions';

const useSetReqManBudTouch = () => {
  const dispatch = useDispatch();

  const setReqManBudTouchByFiled = (filed) => {
    const value = {
      [filed]: true
    };

    dispatch(setReqManBudTouch(value));
  };

  return setReqManBudTouchByFiled;
};

export default useSetReqManBudTouch;
