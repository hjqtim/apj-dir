import { useSelector } from 'react-redux';

const useValidationForm = () => {
  const errors = {
    requesterInfo: {}
  };
  const requesterInfo = useSelector((state) => state.resourceMX.requestInfo) || {};

  if (
    !requesterInfo.userPhone ||
    (!!requesterInfo.userPhone && requesterInfo.userPhone?.length < 8)
  ) {
    errors.requesterInfo.userPhone = true;
  } else {
    errors.requesterInfo.userPhone = false;
  }

  return errors;
};

export default useValidationForm;
