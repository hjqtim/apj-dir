import dayjs from 'dayjs';
import applyBudgetValidate from './applyBudgetValidate';
import { validEmail } from './tools';

export default (state) => {
  // console.log('Validate', state);
  const tempError = state.error;
  let isSubmittable = true;
  // validate requester phone
  // if (state.requester.phone.trim().length === 0) {
  if (state.requester.phone.trim().length < 8) {
    tempError.requester.phone = true;
    isSubmittable = false;
  }
  // validate service required
  if (!state.serviceRequired.hospitalLocation?.hospital) {
    tempError.serviceRequired.hospitalLocation = true;
    isSubmittable = false;
  }

  if (state.rManager?.corp) {
    if (state.rManager.phone.length !== 8) {
      tempError.rManager.phone = true;
      isSubmittable = false;
    }

    if (!state.rManager.email || !validEmail(state.rManager.email)) {
      tempError.rManager.email = true;
      isSubmittable = false;
    }
  }

  // ExternalNetworkM adminContact name
  if (
    state.externalNetwork?.adminContact?.phone &&
    !state.externalNetwork?.adminContact?.contactPerson
  ) {
    tempError.externalNetwork.acContactPerson = true;
    isSubmittable = false;
  }

  // ExternalNetworkM adminContact phone
  if (
    (state.externalNetwork?.adminContact?.contactPerson &&
      state.externalNetwork?.adminContact?.phone?.trim().length < 8) ||
    (!state.externalNetwork?.adminContact?.contactPerson &&
      state.externalNetwork?.adminContact?.phone &&
      state.externalNetwork?.adminContact?.phone?.trim().length < 8)
  ) {
    tempError.externalNetwork.acPhone = true;
    isSubmittable = false;
  }

  // ExternalNetworkM adminContact name
  if (
    state.externalNetwork?.technicalContact?.phone &&
    !state.externalNetwork?.technicalContact?.contactPerson
  ) {
    tempError.externalNetwork.tcContactPerson = true;
    isSubmittable = false;
  }

  // ExternalNetworkM adminContact phone
  if (
    (state.externalNetwork?.technicalContact?.contactPerson &&
      state.externalNetwork?.technicalContact?.phone?.trim().length < 8) ||
    (!state.externalNetwork?.technicalContact?.contactPerson &&
      state.externalNetwork?.technicalContact?.phone &&
      state.externalNetwork?.technicalContact?.phone?.trim().length < 8)
  ) {
    tempError.externalNetwork.tcPhone = true;
    isSubmittable = false;
  }

  // Vendor Information  phone
  if (
    ((state.externalNetwork?.vendor?.vendorName ||
      state.externalNetwork?.vendor?.implementalPerson) &&
      state.externalNetwork?.vendor?.implementalPhone?.trim().length < 8) ||
    ((!state.externalNetwork?.vendor?.vendorName ||
      !state.externalNetwork?.vendor?.implementalPerson) &&
      state.externalNetwork?.vendor?.implementalPhone &&
      state.externalNetwork?.vendor?.implementalPhone?.trim().length < 8)
  ) {
    tempError.externalNetwork.iPhone = true;
    isSubmittable = false;
  }
  // Maintenance Information  phone
  if (
    (state.externalNetwork?.vendor?.maintenancePerson &&
      state.externalNetwork?.vendor?.maintenancePhone?.trim().length < 8) ||
    (!state.externalNetwork?.vendor?.maintenancePerson &&
      state.externalNetwork?.vendor?.maintenancePhone &&
      state.externalNetwork?.vendor?.maintenancePhone?.trim().length < 8)
  ) {
    tempError.externalNetwork.mPhone = true;
    isSubmittable = false;
  }

  // validate ap dp details for each item
  state.apDpDetails.items.forEach((item, idx) => {
    // amount validation
    if (
      state.formType === 'DP' &&
      item.dataPortInformation.service.type !== 'O' &&
      item.amount < 1
    ) {
      tempError.dpDetails[idx].amount = true;
      isSubmittable = false;
    }
    // service type validation
    if (item.dataPortInformation.service.type.trim().length === 0) {
      tempError.dpDetails[idx].service.type = true;
      isSubmittable = false;
    }
    // existing location validation
    if (
      (item.dataPortInformation.service.type === 'R' ||
        item.dataPortInformation.service.type === 'L') &&
      !item.dataPortInformation.service.existingLocation?.trim()
    ) {
      tempError.dpDetails[idx].service.existingLocation = true;
      isSubmittable = false;
    }

    if (item.dataPortInformation.service.type === 'L' && state.formType === 'DP') {
      if (!item.dataPortInformation.service.secondaryDataPortID?.trim()) {
        tempError.dpDetails[idx].service.secondaryDataPortID = true;
        isSubmittable = false;
      } else if (
        item.dataPortInformation.service.secondaryDataPortID?.trim() ===
        item.dataPortInformation.service.existingLocation?.trim()
      ) {
        tempError.dpDetails[idx].service.secondaryDataPortID = true;
        isSubmittable = false;
      }
    }

    // service type - others validation
    if (
      item.dataPortInformation.service.type === 'O' &&
      item.dataPortInformation.service.others.trim().length === 0
    ) {
      tempError.dpDetails[idx].service.others = true;
      isSubmittable = false;
    }
    // conduit validation
    if (state.formType === 'DP' && item.dataPortInformation.conduitType.trim().length === 0) {
      tempError.dpDetails[idx].conduitType = true;
      isSubmittable = false;
    }
    // project validation
    if (!item.dataPortInformation.projectInfo?.project?.project) {
      tempError.dpDetails[idx].project.project = true;
      isSubmittable = false;
    }
    // project others validation
    if (
      item.dataPortInformation.projectInfo.project?.project === 'Others' &&
      item.dataPortInformation.projectInfo.others.trim().length === 0
    ) {
      tempError.dpDetails[idx].project.others = true;
      isSubmittable = false;
    }

    if (
      item.dataPortInformation.projectInfo.project?.project === 'Others-External Network' &&
      !item.dataPortInformation.externalNetworkRequirement?.trim()
    ) {
      tempError.dpDetails[idx].externalNetworkRequirement = true;
      isSubmittable = false;
    }

    // block validation
    if (item.locationInformation.block.trim().length === 0) {
      tempError.dpDetails[idx].block = true;
      isSubmittable = false;
    }
    // floor validation
    if (item.locationInformation.floor.trim().length === 0) {
      tempError.dpDetails[idx].floor = true;
      isSubmittable = false;
    }
    if (state.formType === 'DP') {
      // public area validation
      // const { publicAreas, icm, awp } = item.locationInformation;
      const { publicAreas } = item.locationInformation;
      if (publicAreas === '' || publicAreas === undefined || publicAreas === null) {
        tempError.dpDetails[idx].publicAreas = true;
        isSubmittable = false;
      }

      // Infection Control Measure validation
      //   if (icm === '' || icm === undefined || icm === null) {
      //     tempError.dpDetails[idx].icm = true;
      //     isSubmittable = false;
      //   }

      //   // Aerial Working Platform validation
      //   if (awp === '' || awp === undefined || awp === null) {
      //     tempError.dpDetails[idx].awp = true;
      //     isSubmittable = false;
      //   }
    }

    // site contact person validation
    if (item.siteContactInformation.contactPerson.trim().length === 0) {
      tempError.dpDetails[0].siteContactPerson = true;
      isSubmittable = false;
    }
    // site contact person phone validation
    if (item.siteContactInformation.phone.trim().length < 8) {
      tempError.dpDetails[idx].phone = true;
      isSubmittable = false;
    }
    if (!item.siteContactInformation.email.includes('@')) {
      tempError.dpDetails[idx].email = true;
      isSubmittable = false;
    }
  });
  // files size validation
  let totalBytes = 0;
  state.fileAttachment.forEach((file) => {
    totalBytes += file.size;
  });
  if (Math.round(totalBytes / 1024 / 1024) > 10) {
    tempError.fileAttachment = true;
    isSubmittable = false;
  }
  // end of files size validation

  const currentDate = dayjs(new Date()).format('YYYY-MM-DD');
  const expectedCompleteDate = dayjs(state.apDpDetails.expectedCompleteDate).format('YYYY-MM-DD');

  if (state.requestAll.dpRequest?.dprequeststatusno > 1) {
    // 已经提交过的form,一般修改会走这里
    if (
      !state.apDpDetails.expectedCompleteDate ||
      state.apDpDetails.expectedCompleteDate?.toString?.() === 'Invalid Date'
    ) {
      isSubmittable = false;
      tempError.expectedDate = true;
    }
  } else if (
    !state.apDpDetails.expectedCompleteDate ||
    state.apDpDetails.expectedCompleteDate?.toString?.() === 'Invalid Date' ||
    dayjs(expectedCompleteDate).diff(currentDate, 'day') < 14
  ) {
    // 用户第一次提交form或在草稿中提交form走这里
    isSubmittable = false;
    tempError.expectedDate = true;
  }

  // 验证budget holder
  if (applyBudgetValidate(state.myBudgetHolder)) {
    isSubmittable = false;
  }

  return { submittable: isSubmittable, error: tempError };
};
