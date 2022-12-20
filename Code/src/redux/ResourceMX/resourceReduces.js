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
  bindAppForm: {
    requestType: '',
    requestNo: '',
    networkDesign: ''
  },
  jobType: {
    jobType: '',
    serviceType: '',
    staffName: '',
    startDate: '',
    endDate: ''
  },

  moreInfo: {
    html: '<p>Please...</p>',
    text: 'Please...'
  },
  resourceStatus: '',
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
    serviceFormACL: [
      {
        id: '',
        key: Date.now().toString(36) + Math.random().toString(36).substr(2),
        switchIp: '',
        switchPort: '',
        Details: ''
      }
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
  errors: {},
  fileAttachment: [],
  detailData: {}
};

export default function reducer(state = defaultValue, actions) {
  const { type, payload } = actions || {};
  let newData;
  switch (type) {
    case types.SET_REQUESTER:
      newData = { [payload?.field]: payload?.data };
      return { ...state, requestInfo: { ...state.requestInfo, ...newData } };

    case types.SET_BIND_APPFORM:
      return {
        ...state,
        ...{ bindAppForm: payload }
      };

    case types.SET_JOB_TYPE:
      return {
        ...state,
        ...{ jobType: payload }
      };

    case types.SET_SERIVCE_FORM:
      return {
        ...state,
        ...{ serviceForm: payload }
      };

    case types.SET_MORE_INFO:
      return {
        ...state,
        ...{ moreInfo: payload }
      };

    case types.SET_STATUS_INFO:
      return {
        ...state,
        ...{ resourceStatus: payload }
      };

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

    case types.SET_RESET: {
      return {
        ...state,
        moreInfo: {},
        requestInfo: defaultValue.requestInfo,
        serviceForm: defaultValue.serviceForm,
        touches: defaultValue.touches,
        resourceStatus: defaultValue.resourceStatus,
        fileAttachment: []
      };
    }
    case types.SET_RESET_FORM: {
      return {
        ...state,
        serviceForm: payload,
        touches: defaultValue.touches
      };
    }

    case types.SET_RESET_Touch: {
      return {
        ...state,
        touches: defaultValue.touches,
        fileAttachment: defaultValue.fileAttachment
      };
    }

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
