const menu = {
  resources: {
    id: 'Resource',
    name: 'Resource',
    path: '/resources',
    children: {
      quota: {
        name: 'Quota',
        path: '/resources/quota'
      },
      vm: {
        name: 'VM',
        path: '/resources/vm/'
      },
      IPAddress: {
        name: 'IP Address',
        path: '/resources/IPAddress/'
      },
      network: {
        name: 'Network',
        path: '/resources/network/'
      },
      server: {
        name: 'Server',
        path: '/resources/server/'
      },
      platform: {
        name: 'Platform Profiles',
        path: '/resources/platform/'
      },
      lifeCycle: {
        name: 'Life Cycle',
        path: '/resources/lifeCycle/'
      }
    }
  },
  workflow: {
    id: 'Workflow',
    name: 'Workflow',
    path: '/workflow',
    children: {
      account: {
        name: 'Account Management',
        path: '/workflow/account/'
      },
      nonPersonalAccount: {
        name: 'Non-Personal Account',
        path: '/workflow/nonPersonalAccount/'
      },
      distributionList: {
        name: 'Distribution List',
        path: '/workflow/distributionList/'
      },
      closingAccount: {
        name: 'Closing Account',
        path: '/workflow/closingAccount/'
      },
      vm: {
        name: 'VM Allocation',
        path: '/workflow/vm'
      },
      movein: {
        name: 'Move In',
        path: '/workflow/movein'
      },
      request: {
        name: 'My Request',
        path: '/workflow/request/'
      },
      approval: {
        name: 'My Approval',
        path: '/workflow/approval/'
      },
      workflowSetting: {
        name: 'Workflow Setting',
        path: '/workflow/workflowSetting/'
      }
    }
  },
  logging: {
    id: 'Log',
    name: 'Log',
    path: '/logging/',
    children: {
      logging: {
        name: 'logging',
        path: '/logging/'
      }
    }
  },
  AAAService: {
    id: 'AAA Service',
    name: 'AAA Service',
    path: '/AAAService',
    children: {
      adGroup: {
        name: 'AD Group',
        path: '/AAAService/adGroup/'
      },
      user: {
        name: 'User Profile',
        path: '/AAAService/user/'
      },
      tenant: {
        name: 'Tenant',
        path: '/AAAService/tenant/'
      },
      expiry: {
        name: 'Expiry',
        path: '/AAAService/expiry/'
      }
    }
  },
  camunda: {
    id: 'Camunda Service',
    name: 'Camunda Service',
    path: '/camunda',
    children: {
      account: {
        name: 'Account Management',
        path: '/camunda/account/'
      },
      demo: {
        name: 'Demo Management',
        path: '/camunda/demo/'
      },
      test: {
        name: 'Test Management',
        path: '/camunda/test/'
      },
      approval: {
        name: 'My Approval',
        path: '/camunda/approval/'
      },
      request: {
        name: 'My Request',
        path: '/camunda/request/'
      },
      workflowSetting: {
        name: 'Camunda Workflow Setting',
        path: '/camunda/workflowSetting/'
      },
      NewWorkflowSetting: {
        name: 'New Workflow Setting',
        path: '/camunda/NewWorkflowSetting/'
      }
    }
  },
  email: {
    id: 'Email',
    name: 'Email Manager',
    path: '/email',
    children: {
      template: {
        name: 'Template',
        path: '/email/template'
      },
      mailRecord: {
        name: 'Sent Record',
        path: '/email/mailRecord'
      }
    }
  },
  file: {
    id: 'File',
    name: 'File',
    path: '/file',
    children: {
      fileList: {
        name: 'File List',
        path: '/file/fileList'
      }
    }
  },
  logs: {
    id: 'Logs',
    name: 'Logs',
    path: '/logs',
    children: {
      logsList: {
        name: 'Logs',
        path: '/logs/logsList'
      }
    }
  },
  AddressBook: {
    id: 'AddressBook',
    name: 'Address Book',
    path: '/addressbookhosp',
    children: {
      list: {
        name: 'Address Book Institution',
        path: '/addressbookhosp/list'
      }
    }
  },
  message: {
    id: 'Message',
    name: 'Message',
    path: '/message',
    children: {
      list: {
        name: 'Message List',
        path: '/message/list'
      }
    }
  },
  Procurement: {
    id: 'Procurement',
    name: 'Procurement',
    path: '/Procurement',
    children: {
      list: {
        name: 'Procurement',
        path: '/Procurement/pages'
      }
    }
  },
  project: {
    id: 'Project',
    name: 'Project',
    path: '/project',
    children: {
      list: {
        name: 'Project List',
        path: '/project/list'
      }
    }
  },
  myrequest: {
    id: 'My Request',
    name: 'My Request',
    path: '/myrequest',
    children: {
      list: {
        name: 'My Request',
        path: '/myrequest/list'
      }
    }
  },
  myaction: {
    id: 'My Action',
    name: 'My Action',
    path: '/myaction',
    children: {
      list: {
        name: 'My Action',
        path: '/myaction/list'
      }
    }
  },
  webdp: {
    id: 'Web DP',
    name: 'Web DP',
    path: '/webdp',
    children: {
      apForm: {
        name: 'AP Application',
        path: '/webdp/apForm'
      },
      dpForm: {
        name: 'DP Application',
        path: '/webdp/dpForm'
      },
      deForm: {
        name: 'D/E Data Port',
        path: '/webdp/deForm'
      },
      request: {
        name: 'My Request',
        path: '/webdp/request/'
      },
      addressbookhosp: {
        name: 'addressbookhosp',
        path: '/webdp/addressbookhosp'
      }
    }
  },
  administrator: {
    id: 'Admin',
    name: 'Administrator',
    path: '/admin',
    children: {
      feedBack: {
        name: 'Feed Back',
        path: '/admin/feedback/list'
      },
      grantread: {
        name: 'Read-Only Permission',
        path: '/admin/grantread/'
      },
      switchtoanotheruser: {
        name: 'Switch to Another User',
        path: '/admin/switchtoanotheruser'
      }
    }
  },
  hardwardstatus: {
    id: 'hardwardstatus',
    name: 'Hardward Status',
    path: '/hardwardstatus',
    children: {
      CheckDataPortStatus: {
        name: 'Check Data Port Status',
        path: '/hardwardstatus/CheckDataPortStatus'
      },
      ExternalNetworkInterfaceCoverage: {
        name: 'External Network Interface Coverage',
        path: '/hardwardstatus/ExternalNetworkInterfaceCoverage'
      },
      SearchEndPointDeviceLocation: {
        name: 'Search End Point DeviceLocation',
        path: '/hardwardstatus/SearchEndPointDeviceLocation'
      },
      SearchPDUInformation: {
        name: 'Search PDU Information',
        path: '/hardwardstatus/SearchPDUInformation'
      },
      WiredlessNetworkCoverage: {
        name: 'Wiredless Network Coverage',
        path: '/hardwardstatus/WiredlessNetworkCoverage'
      },
      WiredNetworkCoverage: {
        name: 'Wired Network Coverage',
        path: '/hardwardstatus/WiredNetworkCoverage'
      }
    }
  },
  ncs: {
    id: 'NCS',
    name: 'NCS',
    path: '/ncs',
    children: {
      ApEquipment: {
        name: 'AP Equipment',
        path: '/ncs/ApEquipment'
      },
      Equipment: {
        name: 'Equipment',
        path: '/ncs/Equipment'
      },
      Cabling: {
        name: 'Cabling',
        path: '/ncs/Cabling'
      }
    }
  },

  // new menu
  dashboard: {
    id: 'Dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    children: {
      list: {
        name: 'dashboard',
        path: '/dashboard'
      }
    }
  },
  search: {
    id: 'Search',
    name: 'Search',
    path: '/search',
    children: {
      list: {
        name: 'search',
        path: '/search/detail'
      }
    }
  }
};

export default menu;
