import { useSelector } from 'react-redux';

const useHandleMaximum = () => {
  const isNeedManager = useSelector((state) => state.myAction.managerInformation?.isNeedManager);
  const rmanagerid = useSelector((state) => state.myAction.managerInformation?.rmanagerid);
  const requesterid = useSelector((state) => state.myAction.requestForm?.dpRequest?.requesterid);
  const budgetholderid = useSelector((state) => state.myAction.myBudgetHolder?.budgetholderid);
  const paymentmethod = useSelector((state) => state.myAction.myBudgetHolder?.paymentmethod);
  const username = useSelector((state) => state.userReducer.currentUser?.username);
  const fundconfirmed = useSelector((state) => state.myAction.myBudgetHolder?.fundconfirmed);
  const quotationtotal = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.quotationtotal
  );
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );

  const handleToLowerCase = (value) => value?.toLowerCase();

  const getMaximumError = () => {
    if (Number(fundconfirmed) >= Number(quotationtotal)) {
      return false;
    }

    // requester approve
    if (dprequeststatusno === 100) {
      // 如果指定manager和budget holder， 并且 requester、manager、budget holder同一个人
      if (
        isNeedManager &&
        budgetholderid &&
        parseInt(paymentmethod) === 1 &&
        handleToLowerCase(username) === handleToLowerCase(requesterid) &&
        handleToLowerCase(username) === handleToLowerCase(rmanagerid) &&
        handleToLowerCase(username) === handleToLowerCase(budgetholderid)
      ) {
        return true;
      }

      // 不指定manage和指定budget holder 并且 requester、budget holder同一个人
      if (
        !isNeedManager &&
        budgetholderid &&
        parseInt(paymentmethod) === 1 &&
        handleToLowerCase(username) === handleToLowerCase(requesterid) &&
        handleToLowerCase(username) === handleToLowerCase(budgetholderid)
      ) {
        return true;
      }
    }

    // manager approve
    if (dprequeststatusno === 110) {
      if (
        budgetholderid &&
        parseInt(paymentmethod) === 1 &&
        handleToLowerCase(username) === handleToLowerCase(rmanagerid) &&
        handleToLowerCase(username) === handleToLowerCase(budgetholderid)
      ) {
        return true;
      }
    }

    // budget holder approve
    if (dprequeststatusno === 120) {
      return true;
    }

    return false;
  };

  return getMaximumError();
};

export default useHandleMaximum;
