import { useSelector } from 'react-redux';

const useValidationIPForm = () => {
  const errors = {
    requesterInfo: {},
    contactPerson: {},
    projectInfo: {},
    items: []
  };

  const requesterInfo = useSelector((state) => state.IPAdreess.requester) || {};
  const contactPerson = useSelector((state) => state.IPAdreess.contactPerson) || {};
  const projectInfo = useSelector((state) => state.IPAdreess.projectInfo) || {};
  const items = useSelector((state) => state.IPAdreess.items) || [];

  //   Requester Info ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  if (
    !requesterInfo.userPhone ||
    (!!requesterInfo.userPhone && requesterInfo.userPhone?.length < 8)
  )
    errors.requesterInfo.userPhone = true;

  // Contact Person  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  if (
    (!!contactPerson.endUserName && !contactPerson.endUserPhone) ||
    (!!contactPerson.endUserName && contactPerson.endUserPhone?.length < 8)
  )
    errors.contactPerson.endUserPhone = true;

  // Project Info ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  if (!projectInfo.hospital) errors.projectInfo.hospital = true;
  if (projectInfo.remark?.length > 1000) errors.projectInfo.remark = true;

  // Details Request Items ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  items.forEach((item) => {
    const errorObj = {};

    if (!item.purpose) errorObj.purpose = true;

    if (!item.ipType) errorObj.ipType = true;

    if (!item.ipNumber) errorObj.ipNumber = true;

    if (item.ipType !== item.defaultIPType && !item.remarks) errorObj.remarks = true;

    if (!item.equpType) errorObj.equpType = true;

    if (item?.computerName?.length > 50) errorObj.computerName = true;

    const macReg = /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/i;
    const macReg2 = /^[0-9a-f]{2}(-[0-9a-f]{2}){5}$/i;

    if (
      item.ipType === 'DHCP RESERVED' &&
      !macReg.test(item.macAddress) &&
      !macReg2.test(item.macAddress)
    )
      errorObj.macAddress = true;

    if (!item.block || item?.block?.length > 50) errorObj.block = true;

    if (!item.floor || item?.floor?.length > 50) errorObj.floor = true;

    if (item?.isPerm === 'Temp' && !item.releaseDate) errorObj.releaseDate = true;

    errors.items.push(errorObj);
  });

  return errors;
};

export default useValidationIPForm;
