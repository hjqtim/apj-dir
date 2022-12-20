import dayjs from 'dayjs';
import _ from 'lodash';
import * as types from './constants';
import { getUserFromLocalStorage } from '../../utils/auth';

const user = getUserFromLocalStorage() || {};
const getUserName = () => {
  const arr = user?.displayName?.split?.(',') || [];
  if (arr?.[0]) {
    return arr[0];
  }
  return '';
};

const defaultValue = {
  requestInfo: {
    logonDomain: user.department || '',
    name: getUserName(),
    title: user.displayName?.split(',')?.[1]?.trim() || '',
    userPhone: user.phone || '',
    logonName: user?.username?.toLowerCase?.(),
    userName: user?.displayName
  },
  baseEl: {
    dateRanges: {
      start: dayjs().format('DD-MMM-YYYY HH:mm:ss'),
      end: dayjs().add(2, 'hour').format('DD-MMM-YYYY HH:mm:ss')
    },
    timeValid: false,
    meetingFormSelectList: [
      { label: 'Virtual', value: 1 },
      { label: 'Physical', value: 2 }
    ],
    meetingForm: 1,
    place: ''
  },
  participants: {
    memberList: [
      {
        id: _.uniqueId(),
        corpId: _.uniqueId(`corp_`),
        display: '',
        title: '',
        mail: '',
        phone: ''
      }
    ],
    closeList: []
  },
  selector: {
    right: [],
    closeLeft: []
  },
  moreInfo: {
    html: '',
    text: ''
  },
  fileAttachment: [],
  orderStatus: '',
  touches: {
    requesterInfo: { userPhone: false },
    bindAppForm: {
      requestType: false,
      requestNo: false,
      networkDesign: false
    },
    jobType: {
      endDate: false,
      serviceType: false,
      staffName: false,
      startDate: false
    },
    serviceForm: [
      // {
      //   switchIp: false,
      //   switchPort: false,
      //   vLan: false,
      //   Details: false
      // }
    ],
    installationList: [
      // {
      //   staffName: false,
      //   staffPhone: false,
      //   staffEmail: false,
      //   rangeDate: { startDate: false, endDate: false },
      //   subForm1: [
      //     {
      //       Equipment: false,
      //       sourceOfGoods: false,
      //       orderNo: false,
      //       PRCode: false,
      //       availableDate: false
      //     }
      //   ],
      //   closetID: false,
      //   rackID: false,
      //   position: false,
      //   powerSource: false,
      //   ip: false,
      //   subForm2: [
      //     {
      //       priBackboneID: false,
      //       priBackboneType: false,
      //       secBackboneID: false,
      //       secBackboneType: false,
      //       availableDate: false
      //     }
      //   ],
      //   subForm3: [
      //     {
      //       switchPort: false,
      //       outletID: false,
      //       activate: false,
      //       remarks: false
      //     }
      //   ]
      // }
    ]
  },
  detailData: {}
};

export default function reducer(state = defaultValue, actions) {
  const { type, payload } = actions || {};
  let newData;
  switch (type) {
    case types.SET_REQUESTER:
      newData = { [payload?.field]: payload?.data };
      return { ...state, requestInfo: { ...state.requestInfo, ...newData } };

    case types.SET_BASEEL:
      return {
        ...state,
        ...{ baseEl: payload }
      };

    case types.SET_PARTICIPANTS:
      return {
        ...state,
        ...{ participants: payload }
      };

    case types.SET_SELECTOR:
      return {
        ...state,
        ...{ selector: payload }
      };

    // WangEditor
    case types.SET_MORE_INFO:
      return {
        ...state,
        ...{ moreInfo: payload }
      };

    // upload file
    case types.UPDATE_ATTACHEDMENTS: {
      return { ...state, fileAttachment: [...state.fileAttachment, actions.payload] };
    }
    case types.REMOVE_ATTACHMENT: {
      const index = actions.payload.split('-')[0];
      const filteredfiles = state.fileAttachment.filter((file, idx) => idx !== parseInt(index, 10));
      return { ...state, fileAttachment: filteredfiles };
    }
    case types.SET_FILES: {
      return { ...state, fileAttachment: actions.payload };
    }

    // check and set touch for error
    case types.SET_TOUCH: {
      const { field, data } = payload || {};
      // console.log('SET_TOUCH', field, data);
      let touches = {};

      if (field === '') {
        touches = data;
      } else {
        touches = { ...state.touches, [field]: { ...state.touches[field], ...data } };
      }
      return { ...state, touches };
    }
    // order Status
    case types.SET_STATUS_INFO:
      return {
        ...state,
        ...{ orderStatus: payload }
      };
    // reset all
    case types.SET_RESET: {
      return {
        ...state,
        moreInfo: {},
        requestInfo: defaultValue.requestInfo,
        touches: defaultValue.touches,
        baseEl: defaultValue.baseEl,
        participants: defaultValue.participants,
        selector: defaultValue.selector,
        fileAttachment: defaultValue.fileAttachment
      };
    }
    // rest touch
    case types.SET_RESET_Touch: {
      return { ...state, touches: defaultValue.touches };
    }
    // detail
    case types.SET_DETAIL: {
      return {
        ...state,
        ...{ detailData: payload }
      };
    }

    default:
      return state;
  }
}
