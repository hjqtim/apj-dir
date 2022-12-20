import _ from 'lodash';
import TYPES from './webDP-action-types';
import DefaultValue from './DefaultValue';
import WebdpItem from '../../models/webdp/request-form-models/WebdpItem';
import ErrorItems from '../../models/webdp/request-form-models/ErrorItems';

const INITIAL_STATE = new DefaultValue();

const webDP = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_FORM_TYPE: {
      return {
        ...state,
        formType: action.payload
      };
    }
    case TYPES.SET_VIEW_ONLY: {
      return { ...state, viewOnly: action.payload };
    }
    case TYPES.COPY_FORM: {
      return { ...state, requestId: '' };
    }
    case TYPES.RESTORE_EDIT_DATE: {
      return { ...action.payload };
    }
    case TYPES.UPDATE_ATTACHEDMENTS: {
      return { ...state, fileAttachment: [...state.fileAttachment, action.payload] };
    }
    case TYPES.REMOVE_ATTACHMENT: {
      const index = action.payload.split('-')[0];
      const filteredfiles = state.fileAttachment.filter((file, idx) => idx !== parseInt(index, 10));
      return { ...state, fileAttachment: filteredfiles };
    }
    case TYPES.ADD_FLOOR_PLAN: {
      return {
        ...state,
        apDpDetails: {
          ...state.apDpDetails,
          floorPlan: [...state.apDpDetails.floorPlan, action.payload]
        }
      };
    }
    case TYPES.REMOVE_FLOOR_PLAN: {
      const filteredFloorPlan = state.apDpDetails.floorPlan.filter(
        (fp) => fp.key !== action.payload
      );
      return { ...state, apDpDetails: { ...state.apDpDetails, floorPlan: filteredFloorPlan } };
    }
    case TYPES.UPDATE_REQUESTER: {
      const { id, value } = action.payload;
      switch (id) {
        case 'hospital': {
          return {
            ...state,
            requester: { ...state.requester, hospital: value }
          };
        }
        case 'name': {
          return { ...state, requester: { ...state.requester, name: value } };
        }
        case 'title': {
          return { ...state, requester: { ...state.requester, title: value } };
        }
        case 'phone': {
          if (value.length > 8) {
            return { ...state };
          }
          return {
            ...state,
            requester: { ...state.requester, phone: value },
            error: {
              ...state.error,
              requester: { ...state.error.requester, phone: false }
            }
          };
        }
        case 'email': {
          return { ...state, requester: { ...state.requester, email: value } };
        }
        default: {
          return { ...state };
        }
      }
    }
    case TYPES.SET_REQUESTER_MANAGER: {
      const { field, ...others } = action.payload;
      return {
        ...state,
        rManager: { ...state.rManager, ...others },
        error: {
          ...state.error,
          rManager: { ...state.error.rManager, [field]: false }
        }
      };
    }
    case TYPES.SET_BUDGET_HOLDER: {
      return { ...state, budgetHolder: action.payload };
    }
    case TYPES.UPDATE_SERVICE_REQUIRED: {
      const { id, value } = action.payload;
      switch (id) {
        case 'hospitalRef': {
          return {
            ...state,
            serviceRequired: { ...state.serviceRequired, hospitalRef: value }
          };
        }
        case 'hospitalLocation': {
          return {
            ...state,
            serviceRequired: {
              ...state.serviceRequired,
              hospitalLocation: value
            },
            error: {
              ...state.error,
              serviceRequired: {
                ...state.error.serviceRequired,
                hospitalLocation: false
              }
            }
          };
        }
        default: {
          break;
        }
      }
      break;
    }
    case TYPES.UPDATE_DATE_TIME: {
      const { id, value } = action.payload;
      switch (id) {
        case 'expectedCompleteDate': {
          if (value?.toString?.() === 'Invalid Date' || !value) {
            state.error.expectedDate = true;
          } else {
            state.error.expectedDate = false;
          }
          return {
            ...state,
            apDpDetails: { ...state.apDpDetails, expectedCompleteDate: value },
            error: {
              ...state.error
            }
          };
        }
        case 'expectedImplementalDate': {
          return { ...state };
        }
        case 'peakHourTo': {
          return {
            ...state,
            externalNetwork: {
              ...state.externalNetwork,
              networkTraffic: {
                ...state.externalNetwork.networkTraffic,
                peakHourTo: value
              }
            }
          };
        }
        case 'peakHourFrom': {
          return {
            ...state,
            externalNetwork: {
              ...state.externalNetwork,
              networkTraffic: {
                ...state.externalNetwork.networkTraffic,
                peakHourFrom: value
              }
            }
          };
        }
        default: {
          return { ...state };
        }
      }
    }
    case TYPES.UPDATE_ADDITIONAL_INFORMATION: {
      const { id, value } = action.payload;
      switch (id) {
        case 'addItem': {
          const randomNum = Math.ceil(Math.random() * 1000);
          const randomKey = new Date().getTime() + randomNum;
          return {
            ...state,
            error: {
              ...state.error,
              dpDetails: [...state.error.dpDetails, new ErrorItems()]
            },
            apDpDetails: {
              ...state.apDpDetails,
              items: [
                ...state.apDpDetails.items,
                {
                  ...new WebdpItem(),
                  dpId: state.apDpDetails.items?.[0]?.dpId || 0,
                  key: randomKey
                }
              ]
            }
          };
        }
        case 'remarks': {
          return {
            ...state,
            apDpDetails: { ...state.apDpDetails, remarks: value }
          };
        }
        case 'specialRequirements': {
          return {
            ...state,
            apDpDetails: { ...state.apDpDetails, specialRequirements: value }
          };
        }
        case 'justificationsForUsingWLAN': {
          return {
            ...state,
            apDpDetails: {
              ...state.apDpDetails,
              justificationsForUsingWLAN: value
            }
          };
        }
        default: {
          return { ...state };
        }
      }
    }
    case TYPES.UPDATE_AP_DP_DETAILS: {
      const { value, id } = action.payload;
      const splitId = id.split('-');
      // define the curent array index from id
      const index = parseInt(splitId[0], 10);
      const newErrorArray = [...state.error.dpDetails];
      // check the first level
      switch (splitId[1]) {
        case 'amount': {
          const newItemsArray = [...state.apDpDetails.items];
          newItemsArray[index].amount = value ? Number(value) : '';
          newErrorArray[index].amount = false;
          return {
            ...state,
            apDpDetails: { ...state.apDpDetails, items: newItemsArray },
            error: { ...state.error, dpDetails: newErrorArray }
          };
        }
        case 'dataPortInformation': {
          const newItemsArray = [...state.apDpDetails.items];
          const newErrorArray = [...state.error.dpDetails];
          switch (splitId[2]) {
            case 'service': {
              if (splitId[3] === 'type') {
                newItemsArray[index].dataPortInformation.service.type = value;
                newItemsArray[index].dataPortInformation.service.existingLocation = '';
                newItemsArray[index].dataPortInformation.service.secondaryDataPortID = '';
                newItemsArray[index].dataPortInformation.service.others = '';
                newErrorArray[index].service.type = false;
                newErrorArray[index].service.existingLocation = false;
                newErrorArray[index].service.secondaryDataPortID = false;
                newErrorArray[index].service.others = false;
                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              if (splitId[3] === 'existingLocation') {
                newItemsArray[index].dataPortInformation.service.existingLocation = value;
                newErrorArray[index].service.existingLocation = false;
                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              if (splitId[3] === 'others') {
                newItemsArray[index].dataPortInformation.service.others = value;
                newErrorArray[index].service.others = false;
                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              if (splitId[3] === 'secondaryDataPortID') {
                newItemsArray[index].dataPortInformation.service.secondaryDataPortID = value;
                newErrorArray[index].service.secondaryDataPortID = false;
                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              return { ...state };
            }
            case 'conduitType': {
              newItemsArray[index].dataPortInformation.conduitType = value;
              newErrorArray[index].conduitType = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'projectInfo': {
              if (splitId[3] === 'project') {
                newItemsArray[index].dataPortInformation.projectInfo.project = value;
                newItemsArray[index].dataPortInformation.projectInfo.others = '';
                newItemsArray[index].dataPortInformation.externalNetworkRequirement = '';
                newErrorArray[index].project.project = false;
                newErrorArray[index].project.others = false;
                newErrorArray[index].externalNetworkRequirement = false;
                // project选择MNI项目之后就清空相关数据
                if (
                  state.formType === 'DP' &&
                  value?.remarks === 'MNI' &&
                  ['D', 'L'].includes(newItemsArray[index].dataPortInformation.service.type)
                ) {
                  newItemsArray[index].dataPortInformation.service.type = '';
                  newItemsArray[index].dataPortInformation.service.existingLocation = '';
                  newItemsArray[index].dataPortInformation.service.secondaryDataPortID = '';
                  newItemsArray[index].dataPortInformation.service.others = '';
                  newErrorArray[index].service.type = false;
                  newErrorArray[index].service.existingLocation = false;
                  newErrorArray[index].service.secondaryDataPortID = false;
                  newErrorArray[index].service.others = false;
                }

                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              if (splitId[3] === 'others') {
                newItemsArray[index].dataPortInformation.projectInfo.others = value;
                newErrorArray[index].project.others = false;
                return {
                  ...state,
                  apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                  error: { ...state.error, dpDetails: newErrorArray }
                };
              }
              return { ...state };
            }

            case 'externalNetworkRequirement': {
              newItemsArray[index].dataPortInformation.externalNetworkRequirement = value;
              newErrorArray[index].externalNetworkRequirement = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            // case 'floorPlan': {
            //   newItemsArray[index].dataPortInformation.floorPlan.push(value);
            //   newErrorArray[index].floorPlan = false;
            //   return {
            //     ...state,
            //     apDpDetails: { ...state.apDpDetails, items: newItemsArray },
            //     error: { ...state.error, dpDetails: newErrorArray }
            //   };
            // }
            default:
              break;
          }
          break;
        }
        case 'locationInformation': {
          const newItemsArray = [...state.apDpDetails.items];
          switch (splitId[2]) {
            case 'department': {
              newItemsArray[index].locationInformation.department = value;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray }
              };
            }
            case 'block': {
              newItemsArray[index].locationInformation.block = value;
              newErrorArray[index].block = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'floor': {
              newItemsArray[index].locationInformation.floor = value;
              newErrorArray[index].floor = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'roomOrWard': {
              newItemsArray[index].locationInformation.roomOrWard = value;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray }
              };
            }
            case 'publicAreas': {
              newItemsArray[index].locationInformation.publicAreas = parseInt(value, 10);
              newErrorArray[index].publicAreas = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'icm': {
              newItemsArray[index].locationInformation.icm = parseInt(value, 10);
              newErrorArray[index].icm = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'awp': {
              newItemsArray[index].locationInformation.awp = parseInt(value, 10);
              newErrorArray[index].awp = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItemsArray },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            default: {
              break;
            }
          }
          return { ...state };
        }
        case 'siteContactInformation': {
          const newItems = [...state.apDpDetails.items];
          switch (splitId[2]) {
            case 'contactPerson':
              newItems[index].siteContactInformation.contactPerson = value;
              newErrorArray[index].siteContactPerson = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItems },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            case 'jobTitle': {
              newItems[index].siteContactInformation.jobTitle = value;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItems }
              };
            }
            case 'phone': {
              if (value.length > 8) {
                return { ...state };
              }
              newItems[index].siteContactInformation.phone = value;
              newErrorArray[index].phone = false;

              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItems },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            case 'email': {
              newItems[index].siteContactInformation.email = value;
              newErrorArray[index].email = false;
              return {
                ...state,
                apDpDetails: { ...state.apDpDetails, items: newItems },
                error: { ...state.error, dpDetails: newErrorArray }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        case 'copyItem': {
          const randomNum = Math.ceil(Math.random() * 1000);
          const randomKey = new Date().getTime() + randomNum;
          const targetitem = _.cloneDeep({
            ...state.apDpDetails.items[index],
            key: randomKey,
            id: 0
          });
          const targetError = _.cloneDeep(state.error.dpDetails[index]);
          return {
            ...state,
            error: {
              ...state.error,
              dpDetails: [...state.error.dpDetails, targetError]
            },
            apDpDetails: {
              ...state.apDpDetails,
              items: [...state.apDpDetails.items, targetitem]
            }
          };
        }
        case 'removeItem': {
          const { row = {} } = action.payload;
          const newDelIds = _.cloneDeep(state.delIds);
          if (row?.id) {
            newDelIds.push(row?.id);
          }
          const newFloorPlan = state.apDpDetails.floorPlan.filter((item) => item.key !== row.key);

          const removedItem = state.apDpDetails.items.filter((item, idx) => idx !== index);
          const filteredError = state.error.dpDetails.filter((item, idx) => idx !== index);
          return {
            ...state,
            delIds: newDelIds,
            apDpDetails: { ...state.apDpDetails, items: removedItem, floorPlan: newFloorPlan },
            error: { ...state.error, dpDetails: filteredError }
          };
        }
        default: {
          return { ...state };
        }
      }
      return { ...state };
    }
    case TYPES.UPDATE_EXTERNAL_NETWORK: {
      const { id, value } = action.payload;
      const separator = id.split('-');
      switch (separator[0]) {
        case 'adminContact': {
          switch (separator[1]) {
            case 'contactPerson': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  adminContact: {
                    ...state.externalNetwork.adminContact,
                    contactPerson: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    acContactPerson: false,
                    acPhone: false
                  }
                }
              };
            }
            case 'phone': {
              if (value.length > 8) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  adminContact: {
                    ...state.externalNetwork.adminContact,
                    phone: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    acPhone: false
                  }
                }
              };
            }
            case 'email': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  adminContact: {
                    ...state.externalNetwork.adminContact,
                    email: value
                  }
                }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        case 'technicalContact': {
          switch (separator[1]) {
            case 'contactPerson': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  technicalContact: {
                    ...state.externalNetwork.technicalContact,
                    contactPerson: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    tcContactPerson: false,
                    tcPhone: false
                  }
                }
              };
            }
            case 'phone': {
              if (value.length > 8) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  technicalContact: {
                    ...state.externalNetwork.technicalContact,
                    phone: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    tcPhone: false
                  }
                }
              };
            }
            case 'email': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  technicalContact: {
                    ...state.externalNetwork.technicalContact,
                    email: value
                  }
                }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        case 'system': {
          switch (separator[1]) {
            case 'existedNetwork': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    existedNetwork: value
                  }
                }
              };
            }
            case 'supplierName': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    supplierName: value
                  }
                }
              };
            }
            case 'pcLocation': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    pcLocation: value
                  }
                }
              };
            }
            case 'serverLocation': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    serverLocation: value
                  }
                }
              };
            }
            case 'haSystemIntegrate': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    haSystemIntegrate: value
                  }
                }
              };
            }
            case 'relatedProject': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    relatedProject: value
                  }
                }
              };
            }
            case 'relatedServer': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    relatedServer: value
                  }
                }
              };
            }
            case 'initiateTraffic': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    initiateTraffic: value
                  }
                }
              };
            }
            case 'projectDestination': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    projectDestination: value
                  }
                }
              };
            }
            case 'serverDestination': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    serverDestination: value
                  }
                }
              };
            }
            case 'expectedImplementalDate': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  system: {
                    ...state.externalNetwork.system,
                    expectedImplementalDate: value
                  }
                }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        case 'networkTraffic': {
          switch (separator[1]) {
            case 'deviceAmount': {
              if (value < 0) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    deviceAmount: value
                  }
                }
              };
            }
            case 'trafficPerDay': {
              if (value < 0) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    trafficPerDay: value
                  }
                }
              };
            }
            case 'perFileSize': {
              if (value < 0) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    perFileSize: value
                  }
                }
              };
            }
            case 'expectedResponseTime': {
              if (value < 0) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    expectedResponseTime: value
                  }
                }
              };
            }
            case 'peakHourFrom': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    peakHourFrom: value
                  }
                }
              };
            }
            case 'peakHourTo': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    peakHourTo: value
                  }
                }
              };
            }
            case 'networkResilience': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    networkResilience: value
                  }
                }
              };
            }
            case 'remoteMethod': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  networkTraffic: {
                    ...state.externalNetwork.networkTraffic,
                    remoteMethod: value
                  }
                }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        case 'vendor': {
          switch (separator[1]) {
            case 'vendorName': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    vendorName: value
                  }
                }
              };
            }
            case 'implementalPerson': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    implementalPerson: value
                  }
                }
              };
            }
            case 'implementalPhone': {
              if (value.length > 8) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    implementalPhone: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    iPhone: false
                  }
                }
              };
            }
            case 'implementalEmail': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    implementalEmail: value
                  }
                }
              };
            }
            case 'maintenancePerson': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    maintenancePerson: value
                  }
                }
              };
            }
            case 'maintenancePhone': {
              if (value.length > 8) {
                return { ...state };
              }
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    maintenancePhone: value
                  }
                },
                error: {
                  ...state.error,
                  externalNetwork: {
                    ...state.error.externalNetwork,
                    mPhone: false
                  }
                }
              };
            }
            case 'maintenanceEmail': {
              return {
                ...state,
                externalNetwork: {
                  ...state.externalNetwork,
                  vendor: {
                    ...state.externalNetwork.vendor,
                    maintenanceEmail: value
                  }
                }
              };
            }
            default: {
              return { ...state };
            }
          }
        }
        default: {
          return { ...state };
        }
      }
    }
    case TYPES.SET_HOSPITAL_LIST: {
      // 修改serviceRequired中的hospitalList，医院下拉框数据
      return {
        ...state,
        serviceRequired: { ...state.serviceRequired, hospitalList: action.payload }
      };
    }
    case TYPES.SET_HOSPITAL_OBJ: {
      // 修改选中的医院对象
      return {
        ...state,
        serviceRequired: { ...state.serviceRequired, hospitalLocation: action.payload }
      };
    }
    case TYPES.SET_HOSPITAL_BLOCK: {
      // 修改Block下拉框列表
      return {
        ...state,
        apDpDetails: { ...state.apDpDetails, blockByHospCodeList: action.payload }
      };
    }
    case TYPES.SET_FLOOR_OPTION: {
      // 修改Floor下拉列表数据
      const { data = [], index } = action.payload || {};
      if (index === undefined || index === '') {
        return { ...state };
      }
      const newApDpDetails = state.apDpDetails;
      if (newApDpDetails?.items?.[index]?.locationInformation?.blockAndFloorByHospCodeList) {
        newApDpDetails.items[index].locationInformation.blockAndFloorByHospCodeList = data;
      }
      return { ...state, apDpDetails: newApDpDetails };
    }
    case TYPES.CLEAR_BLOCK: {
      // 清空某个item中的block
      const { index } = action;
      if (index === undefined || index === '') {
        return { ...state };
      }
      const newApDpDetails = state.apDpDetails;
      if (newApDpDetails?.items?.[index]?.locationInformation) {
        newApDpDetails.items[index].locationInformation.block = '';
      }
      return { ...state, apDpDetails: newApDpDetails };
    }
    case TYPES.CLEAR_FLOOR: {
      // 清空某个item中的floor和blockAndFloorByHospCodeList
      const { index } = action;
      if (index === undefined || index === '') {
        return { ...state };
      }
      const newApDpDetails = state.apDpDetails;
      if (newApDpDetails?.items?.[index]?.locationInformation) {
        newApDpDetails.items[index].locationInformation.floor = '';
        newApDpDetails.items[index].locationInformation.blockAndFloorByHospCodeList = [];
      }
      return { ...state, apDpDetails: newApDpDetails };
    }
    case TYPES.CLEAR_BLOCK_AND_FLOOR: {
      // 清除Block和Floor,existing data port
      const newApDpDetails = { ...state.apDpDetails };
      newApDpDetails.blockByHospCodeList = []; // 清空block下拉列表数据
      newApDpDetails?.items?.forEach((apDpDetailsItem) => {
        if (apDpDetailsItem?.locationInformation) {
          apDpDetailsItem.locationInformation.block = '';
          apDpDetailsItem.locationInformation.floor = '';
          apDpDetailsItem.locationInformation.blockAndFloorByHospCodeList = [];
          apDpDetailsItem.dataPortInformation.service.existingLocation = '';
          apDpDetailsItem.dataPortInformation.service.secondaryDataPortID = '';
        }
      });
      return {
        ...state,
        apDpDetails: newApDpDetails
      };
    }
    case TYPES.SET_CONTACT_PERSON: {
      // 修改site contact
      const {
        index = -1,
        requestTitle = '',
        requestPhone = '',
        contactPerson = '',
        email = ''
      } = action.payload || {};
      if (index === -1) {
        return { ...state };
      }
      const newApDpDetails = state.apDpDetails;
      if (newApDpDetails.items?.[index]?.siteContactInformation) {
        newApDpDetails.items[index].siteContactInformation.jobTitle = requestTitle;
        newApDpDetails.items[index].siteContactInformation.phone = requestPhone;
        newApDpDetails.items[index].siteContactInformation.contactPerson = contactPerson;
        newApDpDetails.items[index].siteContactInformation.email = email;
      }
      if (state.error?.dpDetails?.[index]) {
        if (requestPhone) {
          state.error.dpDetails[index].phone = false;
        }
        if (email) {
          state.error.dpDetails[index].email = false;
        }
      }
      return {
        ...state,
        apDpDetails: newApDpDetails,
        error: {
          ...state.error
        }
      };
    }
    case TYPES.SET_CONTACT_OBJ: {
      // edit contactObj
      const { contactObj = {}, index } = action.payload || {};
      const newApDpDetails = state.apDpDetails;
      if (newApDpDetails.items?.[index]?.siteContactInformation) {
        newApDpDetails.items[index].siteContactInformation.contactObj = contactObj;
      }
      return {
        ...state,
        apDpDetails: newApDpDetails
      };
    }
    case TYPES.SET_PROJECT_LIST: {
      const { payload = [] } = action;
      const newApDpDetails = state.apDpDetails;
      newApDpDetails.projectList = payload;
      return { ...state, apDpDetails: newApDpDetails };
    }

    case TYPES.SET_ADMIN: {
      // 修改姓名、电话
      const { phone = '' } = action.payload;
      const newExternalNetwork = state.externalNetwork;
      newExternalNetwork.adminContact.phone = phone;
      return { ...state, externalNetwork: newExternalNetwork };
    }

    case TYPES.SET_IT: {
      // 修改it姓名、电话
      const { phone = '' } = action.payload;
      const newExternalNetwork = state.externalNetwork;
      newExternalNetwork.technicalContact.phone = phone;
      return { ...state, externalNetwork: newExternalNetwork };
    }

    case TYPES.RESET_WEBDP: {
      return new DefaultValue();
    }
    case TYPES.SET_SERVICE_CONDUIT_OPTION: {
      const { serviceTypeOption = [], conduitTypeOption = [] } = action.payload;
      const newApDpDetails = _.cloneDeep(state.apDpDetails);
      newApDpDetails.serviceTypeOption = serviceTypeOption;
      newApDpDetails.conduitTypeOption = conduitTypeOption;
      return { ...state, apDpDetails: newApDpDetails };
    }

    case TYPES.SET_WEBDP: {
      const data = action.payload || {};
      const oldWebDP = state;

      try {
        const {
          requesterphone,
          hospitalreference,
          expectedcompletiondate,
          otherservices,
          remark,
          serviceathosp,
          id,
          requestNo,
          dprequeststatus,
          requestertitle,
          requestername,
          requesterhosp,
          requesterid,
          rmanagername,
          rmanagertitle,
          rmanagerphone,
          rmanageremail,
          rmanagerid,
          fundtransferredtohsteam,
          fundparty,
          paymentmethod,
          chartofaccount,
          budgetholdername,
          budgetholdertitle,
          budgetholderphone,
          budgetholderemail,
          budgetholderid,
          extbillcompanyname,
          extbillcontactname,
          extbillcontactphone,
          extbillcompanyadd,
          otherpaymentmethod
        } = data.dpRequest || {};

        const { detail = {} } = data;

        let location = [];

        if (state.formType === 'DP') {
          location = data.dpLocationList || [];
          oldWebDP.apDpDetails.remarks = remark;
        } else if (state.formType === 'AP') {
          location = data.apLocationList || [];
          oldWebDP.apDpDetails.justificationsForUsingWLAN = remark;
        }

        oldWebDP.dpId = data.isDetail ? id : 0;
        oldWebDP.requestNo = data.isDetail ? requestNo : 0;
        oldWebDP.status = dprequeststatus;

        oldWebDP.apDpDetails.expectedCompleteDate = expectedcompletiondate
          ? new Date(expectedcompletiondate)
          : null;
        oldWebDP.apDpDetails.specialRequirements = otherservices;

        const copyItem = _.cloneDeep(oldWebDP?.apDpDetails?.items?.[0] || {}); // 纯净的item

        const APFilesList = [];

        location.forEach((locationItem, index) => {
          const newItem = { ..._.cloneDeep(copyItem), ...locationItem };
          newItem.key = locationItem.id;

          // handle AP file
          if (state.formType === 'AP' && data.isDetail) {
            const APFile = data.requestFileList?.fileList?.find(
              (APFileItem) => APFileItem.id === parseInt(locationItem.fileName)
            );
            if (APFile) {
              APFilesList.push({
                key: newItem.key,
                file: { ...APFile, name: APFile.fileName }
              });
            }
          }

          // newItem.dpId = data.isDetail ? locationItem.dpId : 0;
          newItem.requestNo = data.isDetail ? locationItem.requestNo : 0;
          newItem.id = data.isDetail ? locationItem.id : 0;
          newItem.amount = locationItem.numOfDP;
          // Data Port Information
          newItem.dataPortInformation.service.type = locationItem.serviceType;
          newItem.dataPortInformation.service.existingLocation = locationItem.dataPortID;
          newItem.dataPortInformation.service.secondaryDataPortID =
            locationItem.secondaryDataPortID || '';
          newItem.dataPortInformation.service.others = locationItem.otherServiceDesc;
          newItem.dataPortInformation.conduitType = locationItem.conduitType || '';
          newItem.dataPortInformation.projectInfo.others = locationItem.dpusageDesc || '';

          const projectObj = oldWebDP.apDpDetails.projectList.find(
            (projectItem) => projectItem.project === locationItem.dpusage
          );

          if (projectObj) {
            newItem.dataPortInformation.projectInfo.project = projectObj;
          } else if (locationItem.dpusage) {
            // 在project列表找不到就手动构造一个
            const diyProject = {
              apptype: state.formType,
              createdBy: '',
              createdDate: null,
              description: '',
              lastUpdatedBy: null,
              lastUpdatedDate: null,
              params: {},
              project: locationItem.dpusage,
              remarks: null,
              status: 'Active',
              website: null
            };
            newItem.dataPortInformation.projectInfo.project = diyProject;
          } else {
            newItem.dataPortInformation.projectInfo.project = {};
          }

          newItem.dataPortInformation.externalNetworkRequirement =
            locationItem.externalNetworkRequirement || '';

          // Location Details
          newItem.locationInformation.department = locationItem.dept;
          newItem.locationInformation.block = locationItem.block;
          newItem.locationInformation.floor = locationItem.floor;
          newItem.locationInformation.roomOrWard = locationItem.room;
          newItem.locationInformation.publicAreas = locationItem.isPublicArea === 1 ? 1 : 0;
          newItem.locationInformation.icm = locationItem.needInfectionControl === 1 ? 1 : 0;
          newItem.locationInformation.awp = locationItem.needWorkingPlatform === 1 ? 1 : 0;

          // Site Contact
          newItem.siteContactInformation.contactPerson = locationItem.siteContactPerson;
          newItem.siteContactInformation.jobTitle = locationItem.siteContactTitle;
          newItem.siteContactInformation.phone = locationItem.siteContactPhone;
          newItem.siteContactInformation.phone = locationItem.siteContactPhone;
          newItem.siteContactInformation.email = locationItem.siteContactEmail;

          oldWebDP.apDpDetails.items[index] = newItem;
          oldWebDP.error.dpDetails[index] = new ErrorItems();
        });

        if (data.isDetail) {
          oldWebDP.requester.phone = requesterphone || '';
          oldWebDP.requester.name = requestername || '';
          oldWebDP.requester.title = requestertitle || '';
          oldWebDP.requester.hospital = requesterhosp || '';
          oldWebDP.requester.requesterid = requesterid || '';
        }

        oldWebDP.serviceRequired.hospitalRef = hospitalreference;
        const hospitalObj = oldWebDP.serviceRequired.hospitalList.find(
          (hospitalItem) => serviceathosp === hospitalItem.hospital
        );
        oldWebDP.serviceRequired.hospitalLocation = hospitalObj || {};

        // 如果是MNI项目才会将数据set回redux中的externalNetwork
        if (data?.mniRequest?.id) {
          const {
            endusercontact,
            endusertel,
            enduseremail,
            respitcontact,
            respittel,
            respitemail,
            localnetwork,
            localnetworksupplier,
            locationpc,
            locationserver,
            integratehasystem,
            integratehaproject,
            integratehaserver,
            traffictoha,
            destinationproject,
            destinationserver,
            numberofdevice,
            numberoftraffic,
            sizepertraffic,
            networkresponsetime,
            peakhour,
            peakhourend,
            resilientnetworkrequired,
            remotemaintenancemethods,
            vendor,
            implementcontact,
            implementtel,
            implementemail,
            maintenancecontact,
            maintenancetel,
            maintenanceemail,
            id
          } = data.mniRequest || {};

          oldWebDP.externalNetwork.id = data.isDetail ? id : 0;

          oldWebDP.externalNetwork.adminContact.contactPerson = endusercontact;
          oldWebDP.externalNetwork.adminContact.phone = endusertel;
          oldWebDP.externalNetwork.adminContact.email = enduseremail;

          oldWebDP.externalNetwork.technicalContact.contactPerson = respitcontact;
          oldWebDP.externalNetwork.technicalContact.phone = respittel;
          oldWebDP.externalNetwork.technicalContact.email = respitemail;

          // Project System Information
          oldWebDP.externalNetwork.system.existedNetwork = localnetwork;
          oldWebDP.externalNetwork.system.supplierName = localnetworksupplier;
          oldWebDP.externalNetwork.system.pcLocation = locationpc;
          oldWebDP.externalNetwork.system.serverLocation = locationserver;
          oldWebDP.externalNetwork.system.haSystemIntegrate = integratehasystem;
          oldWebDP.externalNetwork.system.relatedProject = integratehaproject;
          oldWebDP.externalNetwork.system.relatedServer = integratehaserver;
          oldWebDP.externalNetwork.system.initiateTraffic = traffictoha;
          oldWebDP.externalNetwork.system.projectDestination = destinationproject;
          oldWebDP.externalNetwork.system.serverDestination = destinationserver;

          // Network Traffic Information
          oldWebDP.externalNetwork.networkTraffic.deviceAmount = numberofdevice;
          oldWebDP.externalNetwork.networkTraffic.trafficPerDay = numberoftraffic;
          oldWebDP.externalNetwork.networkTraffic.perFileSize = sizepertraffic;
          oldWebDP.externalNetwork.networkTraffic.expectedResponseTime = networkresponsetime;
          oldWebDP.externalNetwork.networkTraffic.peakHourFrom = peakhour;
          oldWebDP.externalNetwork.networkTraffic.peakHourTo = peakhourend;
          oldWebDP.externalNetwork.networkTraffic.networkResilience = resilientnetworkrequired;
          oldWebDP.externalNetwork.networkTraffic.remoteMethod = remotemaintenancemethods;

          // Vendor Information
          oldWebDP.externalNetwork.vendor.vendorName = vendor;
          oldWebDP.externalNetwork.vendor.implementalPerson = implementcontact;
          oldWebDP.externalNetwork.vendor.implementalPhone = implementtel;
          oldWebDP.externalNetwork.vendor.implementalEmail = implementemail;

          // Maintenance Information
          oldWebDP.externalNetwork.vendor.maintenancePerson = maintenancecontact;
          oldWebDP.externalNetwork.vendor.maintenancePhone = maintenancetel;
          oldWebDP.externalNetwork.vendor.maintenanceEmail = maintenanceemail;
        }

        // handle DP file
        if (data?.requestFileList?.fileList?.length && state.formType === 'DP' && data.isDetail) {
          const fileMap = data.requestFileList.fileList.map((fileItem) => ({
            ...fileItem,
            name: fileItem.fileName,
            size: fileItem.fileSize
          }));
          oldWebDP.fileAttachment = fileMap;
        } else if (
          data?.requestFileList?.fileList?.length &&
          state.formType === 'AP' &&
          data.isDetail
        ) {
          oldWebDP.apDpDetails.floorPlan = APFilesList;
        }

        oldWebDP.requestAll = data;
        oldWebDP.rManager.name = rmanagername || '';
        oldWebDP.rManager.title = rmanagertitle || '';
        oldWebDP.rManager.phone = rmanagerphone || '';
        oldWebDP.rManager.email = rmanageremail || '';
        oldWebDP.rManager.corp = rmanagerid || '';
        if (rmanagerid) {
          oldWebDP.rManager.options = [
            { corp: rmanagerid, mail: rmanageremail, phone: rmanagerphone, display: rmanagername }
          ];
        }

        // budgetHolder information ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        oldWebDP.myBudgetHolder = { ...oldWebDP.myBudgetHolder };
        if (fundparty) {
          oldWebDP.myBudgetHolder.fundtransferredtohsteam = fundtransferredtohsteam;
        }
        if (parseInt(fundtransferredtohsteam) === 1) {
          oldWebDP.myBudgetHolder.fundparty = fundparty;
        }
        oldWebDP.myBudgetHolder.paymentmethod = paymentmethod;
        const chartofaccountArr = chartofaccount?.split?.('-') || [];
        oldWebDP.myBudgetHolder.cardNo[0] = chartofaccountArr[0] || '';
        oldWebDP.myBudgetHolder.cardNo[1] = chartofaccountArr[1] || '';
        oldWebDP.myBudgetHolder.cardNo[2] = chartofaccountArr[2] || '';
        oldWebDP.myBudgetHolder.cardNo[3] = chartofaccountArr[3] || '';
        oldWebDP.myBudgetHolder.cardNo[4] = chartofaccountArr[4] || '';
        oldWebDP.myBudgetHolder.cardNo[5] = chartofaccountArr[5] || '';
        // const chartofaccountArr = chartofaccount?.split('-') || [];
        // chartofaccountArr.forEach((item, index) => {
        //   oldWebDP.myBudgetHolder.COA[index * 2].value = item;
        // });

        oldWebDP.myBudgetHolder.budgetholdername = budgetholdername || '';
        oldWebDP.myBudgetHolder.budgetholdertitle = budgetholdertitle || '';
        oldWebDP.myBudgetHolder.budgetholderphone = budgetholderphone || '';
        oldWebDP.myBudgetHolder.budgetholderemail = budgetholderemail || '';
        oldWebDP.myBudgetHolder.budgetholderid = budgetholderid || '';
        oldWebDP.myBudgetHolder.extbillcompanyname = extbillcompanyname || '';
        oldWebDP.myBudgetHolder.extbillcontactname = extbillcontactname || '';
        oldWebDP.myBudgetHolder.extbillcontactphone = extbillcontactphone || '';
        oldWebDP.myBudgetHolder.extbillcompanyadd = extbillcompanyadd || '';
        oldWebDP.myBudgetHolder.otherpaymentmethod = otherpaymentmethod || '';

        oldWebDP.cancelRemark.remark = detail?.dpRequestCancelProcessRemark;
        oldWebDP.cancelRemark.reason = detail?.dpRequestCancelExamineReason;

        oldWebDP.pendingRemark.remark = detail?.dpRequestPendingProcessRemark;
        oldWebDP.pendingRemark.reason = detail?.dpRequestPendingExamineReason;

        if (budgetholderid) {
          const optionItem = {
            corp: budgetholderid,
            display: budgetholdername,
            mail: budgetholderemail || '',
            phone: budgetholderphone || ''
          };
          oldWebDP.myBudgetHolder.options = [optionItem];
        }
        // end budgetHolder information ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      } catch (error) {
        console.log(error);
      }
      return { ...state, ...oldWebDP };
    }

    case TYPES.SET_FILES: {
      return { ...state, fileAttachment: action.payload };
    }

    case TYPES.SET_WEBDP_REQUEST_FORM: {
      return { ...state, requestAll: action.payload };
    }

    case TYPES.SET_ERROR: {
      return { ...state, error: action.payload };
    }

    case TYPES.SET_SELECTED_ITEM: {
      return {
        ...state,
        budgetHolder: {
          ...state.budgetHolder,
          fundTransferredTohSteam: action.payload,
          fundParty: parseInt(action.payload, 10) === 1 ? 'LPool' : ''
        }
      };
    }

    case TYPES.SET_FUND_PARTY: {
      return {
        ...state,
        budgetHolder: { ...state.budgetHolder, fundParty: action.payload }
      };
    }

    case TYPES.SET_PAYMENT_METHOD: {
      return {
        ...state,
        budgetHolder: { ...state.budgetHolder, paymentMethod: action.payload }
      };
    }

    case TYPES.SET_BH_CONTACT: {
      return {
        ...state,
        budgetHolder: { ...state.budgetHolder, contact: action.payload }
      };
    }

    case TYPES.SET_EXTERNAL_COMPANY: {
      return {
        ...state,
        budgetHolder: {
          ...state.budgetHolder,
          externalCompany: action.payload
        }
      };
    }

    case TYPES.SET_COA: {
      return {
        ...state,
        budgetHolder: { ...state.budgetHolder, COA: action.payload }
      };
    }

    case TYPES.SET_OTHER_PAYMENT_METHOD: {
      return {
        ...state,
        budgetHolder: { ...state.budgetHolder, otherPaymentMethod: action.payload }
      };
    }

    case TYPES.SET_MY_BUDGET_HOLDER: {
      return {
        ...state,
        myBudgetHolder: { ...state.myBudgetHolder, ...action.payload },
        error: {
          ...state.error,
          myBudgetHolder: { ...state.error.myBudgetHolder, budgetholdername: false, fPhone: false }
        }
      };
    }

    case TYPES.SET_APPLYREQMANBUDTOUCH: {
      const newApplyReqManBudTouch = { ...state.applyReqManBudTouch, ...action.payload };
      return {
        ...state,
        applyReqManBudTouch: newApplyReqManBudTouch
      };
    }

    case TYPES.SET_CANCEL_REMARK: {
      return {
        ...state,
        cancelRemark: { ...state.cancelRemark, ...action.payload }
      };
    }

    case TYPES.SET_PENDING_REMARK: {
      return {
        ...state,
        pendingRemark: { ...state.pendingRemark, ...action.payload }
      };
    }

    default: {
      return { ...state };
    }
  }
  return { ...state };
};

export default webDP;
