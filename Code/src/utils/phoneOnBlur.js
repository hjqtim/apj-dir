import API from '../api/webdp/webdp';
import store from '../redux';
import { updateRequester } from '../redux/webDP/webDP-actions';
import { setUserFromLocalStorage } from './auth';

const phoneOnBlur = (corp, phone) => {
  if (corp && phone?.length === 8) {
    API.saveUserInfo({
      corp,
      phone
    }).then(() => {
      setUserFromLocalStorage({ phone });
      store.dispatch(
        updateRequester({
          target: {
            id: 'phone',
            value: phone
          }
        })
      );
    });
  }
};

export default phoneOnBlur;
