import React from 'react';

// import { CheckSquare, Grid, Monitor, Users, Mail, Folder, Activity } from 'react-feather';
import { Grid, Monitor, Users } from 'react-feather';
import async from '../components/Async';

import menu from '../utils/menu';
import getIcons from '../utils/getIcons';

// Auth components
const SignIn = async(() => import('../pages/auth/SignIn'));
const ResetPassword = async(() => import('../pages/auth/ResetPassword'));
const Page404 = async(() => import('../pages/auth/Page404'));
const Page500 = async(() => import('../pages/auth/Page500'));
const PageHealthCheck = async(() => import('../pages/auth/Pagehealthcheck'));

// logging components
const logging = async(() => import('../pages/logging/Log'));

// user components
const user = async(() => import('../pages/aaa-service/User'));

// workFlow
const WorkflowSetting = async(() => import('../pages/workFlow/WorkflowSetting'));
const request = async(() => import('../pages/workFlow/MyRequest'));
const approval = async(() => import('../pages/workFlow/MyApproval'));
const VMAllocation = async(() => import('../pages/workFlow/VMAllocation'));
const Account = async(() => import('../pages/workFlow/Account'));
const NonPersonalAccount = async(() => import('../pages/workFlow/NonPersonalAccount'));
const DistributionList = async(() => import('../pages/workFlow/DistributionList'));
const ClosingAccount = async(() => import('../pages/workFlow/ClosingAccount'));
const MoveIn = async(() => import('../pages/workFlow/MoveIn'));

// IP Assignment
const IPAddress = async(() => import('../pages/resources/IPAddress'));
const Platform = async(() => import('../pages/resources/Platform'));
const LifeCycle = async(() => import('../pages/resources/LifeCycle'));
const VM = async(() => import('../pages/resources/VM'));
const Network = async(() => import('../pages/resources/Network'));
const Server = async(() => import('../pages/resources/Server'));
const Quota = async(() => import('../pages/resources/tenantQuotaMapping'));

// tenant
const tenant = async(() => import('../pages/aaa-service/Tenant'));

// ADGroup
const ADGroup = async(() => import('../pages/aaa-service/ADGroup'));

// expiry
const expiry = async(() => import('../pages/aaa-service/Expiry'));

// Camunda
const CamundaAccount = async(() => import('../pages/camunda/Account'));

const CamundaDemo = async(() => import('../pages/camunda/Demo'));

const CamundaTest = async(() => import('../pages/camunda/Test'));

const MyApproval = async(() => import('../pages/camunda/MyApproval'));

const MyRequest = async(() => import('../pages/camunda/MyRequest'));

const CamundaWorkflowSetting = async(() => import('../pages/camunda/WorkflowSetting'));

const NewWorkflowSetting = async(() => import('../pages/camunda/NewWorkflowSetting'));

// email
const Template = async(() => import('../pages/email/Template'));

// file
const FileList = async(() => import('../pages/file/FileList'));
const MailRecord = async(() => import('../pages/email/MailRecord'));

// log
const LogsList = async(() => import('../pages/logs/Log'));

// project
const ProjectList = async(() => import('../pages/project/ProjectList'));

// Address Book Hospital
const AddressBook = async(() => import('../pages/AddressBookHosp'));

// Procurement
const Procurement = async(() => import('../pages/rms/Preparation/index'));

// WebDPMyRequest
const WebDPMyRequest = async(() => import('../pages/myrequest/index'));

// webDP
const APForm = async(() => import('../pages/webdp/Application/ApApplicationForm'));
const DPForm = async(() => import('../pages/webdp/Application/DpApplicationForm'));
const DEForm = async(() => import('../pages/webdp/DERequestForm'));
const WebdpMyRequest = async(() => import('../pages/webdp/MyDraft/index'));

// Administrator
const FeedBack = async(() => import('../pages/Administrator/FeedBack'));
const Grantread = async(() => import('../pages/Administrator/GrantReadOnlyRighttoOthers'));
const SwitchToAnotherUser = async(() => import('../pages/Administrator/SwitchToAnotherUser'));

// HardWardStatus
// const CheckDataPortStatus = async(() => import('../pages/HardwardStatus/CheckDataPortStatus'));
const ExternalNetworkInterfaceCoverage = async(() =>
  import('../pages/HardwardStatus/ExternalNetworkInterfaceCoverage')
);
// const SearchEndPointDeviceLocation = async(() =>
//   import('../pages/HardwardStatus/SearchEndPointDeviceLocation')
// );
const SearchPDUInformation = async(() => import('../pages/HardwardStatus/SearchPDUInformation'));
const WiredlessNetworkCoverage = async(() =>
  import('../pages/HardwardStatus/WiredlessNetworkCoverage')
);
const WiredNetworkCoverage = async(() => import('../pages/HardwardStatus/WiredNetworkCoverage'));

// NCS
const ApEquipment = async(() => import('../pages/NCS/ApEquipment'));

// Message
const MessageModule = async(() => import('../pages/Message'));
const AutoLogin = async(() => import('../pages/AutoLogin'));

const authRoutes = {
  id: 'Auth',
  path: '/auth',
  icon: <Users />,
  children: [
    {
      path: '/auth/sign-in',
      name: 'Sign In',
      component: SignIn
    },
    {
      path: '/auth/reset-password',
      name: 'Reset Password',
      component: ResetPassword
    },
    {
      path: '/auth/404',
      name: '404 Page',
      component: Page404
    },
    {
      path: '/auth/500',
      name: '500 Page',
      component: Page500
    },
    {
      path: '/healthcheck',
      name: 'HealthCheck',
      component: PageHealthCheck
    },
    {
      path: '/auto-login',
      name: 'login',
      component: AutoLogin
    }
  ]
};

const presentationRoutes = {
  id: 'Presentation',
  path: '/',
  header: 'Docs',
  icon: <Monitor />,
  component: SignIn,
  children: null
};

// const logRoutes = {
//   id: menu.logging.id,
//   path: menu.logging.path,
//   icon: getIcons('logsServiceIcon'),
//   component: logging,
//   children: null
// };

const workflowRoutes = {
  id: menu.workflow.id,
  path: menu.workflow.path,
  icon: getIcons('workflowIcon'),
  component: logging,
  children: [
    {
      path: menu.workflow.children.account.path,
      name: menu.workflow.children.account.name,
      component: Account
    },
    {
      path: menu.workflow.children.nonPersonalAccount.path,
      name: menu.workflow.children.nonPersonalAccount.name,
      component: NonPersonalAccount
    },
    {
      path: menu.workflow.children.distributionList.path,
      name: menu.workflow.children.distributionList.name,
      component: DistributionList
    },
    {
      path: menu.workflow.children.closingAccount.path,
      name: menu.workflow.children.closingAccount.name,
      component: ClosingAccount
    },
    {
      path: menu.workflow.children.vm.path,
      name: menu.workflow.children.vm.name,
      component: VMAllocation
    },
    {
      path: menu.workflow.children.movein.path,
      name: menu.workflow.children.movein.name,
      component: MoveIn
    },
    {
      path: menu.workflow.children.request.path,
      name: menu.workflow.children.request.name,
      component: request
    },
    {
      path: menu.workflow.children.approval.path,
      name: menu.workflow.children.approval.name,
      component: approval
    },
    {
      path: menu.workflow.children.workflowSetting.path,
      name: menu.workflow.children.workflowSetting.name,
      component: WorkflowSetting
    }
  ]
};

const aaaServiceRoutes = {
  id: menu.AAAService.id,
  path: menu.AAAService.path,
  icon: getIcons('aaaServiceIcon'),
  children: [
    {
      path: menu.AAAService.children.adGroup.path,
      name: menu.AAAService.children.adGroup.name,
      component: ADGroup
    },
    {
      path: menu.AAAService.children.user.path,
      name: menu.AAAService.children.user.name,
      component: user
    },
    {
      path: menu.AAAService.children.tenant.path,
      name: menu.AAAService.children.tenant.name,
      component: tenant
    },
    {
      path: menu.AAAService.children.expiry.path,
      name: menu.AAAService.children.expiry.name,
      component: expiry
    }
  ]
};

const resourceRoutes = {
  id: menu.resources.id,
  path: menu.resources.path,
  icon: getIcons('resourceIcon'),
  children: [
    {
      path: menu.resources.children.vm.path,
      name: menu.resources.children.vm.name,
      component: VM
    },
    {
      path: menu.resources.children.IPAddress.path,
      name: menu.resources.children.IPAddress.name,
      component: IPAddress
    },
    {
      path: menu.resources.children.network.path,
      name: menu.resources.children.network.name,
      component: Network
    },
    {
      path: menu.resources.children.server.path,
      name: menu.resources.children.server.name,
      component: Server
    },
    {
      path: menu.resources.children.platform.path,
      name: menu.resources.children.platform.name,
      component: Platform
    },
    {
      path: menu.resources.children.lifeCycle.path,
      name: menu.resources.children.lifeCycle.name,
      component: LifeCycle
    },
    {
      path: menu.resources.children.quota.path,
      name: menu.resources.children.quota.name,
      component: Quota
    }
  ]
};

const camundaRoutes = {
  id: menu.camunda.id,
  path: menu.camunda.path,
  icon: getIcons('camundaService'),
  children: [
    {
      path: menu.camunda.children.account.path,
      name: menu.camunda.children.account.name,
      component: CamundaAccount
    },
    {
      path: menu.camunda.children.demo.path,
      name: menu.camunda.children.demo.name,
      component: CamundaDemo
    },
    {
      path: menu.camunda.children.test.path,
      name: menu.camunda.children.test.name,
      component: CamundaTest
    },
    {
      path: menu.camunda.children.approval.path,
      name: menu.camunda.children.approval.name,
      component: MyApproval
    },
    {
      path: menu.camunda.children.request.path,
      name: menu.camunda.children.request.name,
      component: MyRequest
    },
    {
      path: menu.camunda.children.workflowSetting.path,
      name: menu.camunda.children.workflowSetting.name,
      component: CamundaWorkflowSetting
    },
    {
      path: menu.camunda.children.NewWorkflowSetting.path,
      name: menu.camunda.children.NewWorkflowSetting.name,
      component: NewWorkflowSetting
    }
  ]
};
const EmailRoutes = {
  id: menu.email.id,
  path: menu.email.path,
  icon: getIcons('emailServiceIcon'),
  children: [
    {
      path: menu.email.children.template.path,
      name: menu.email.children.template.name,
      component: Template
    },
    {
      path: menu.email.children.mailRecord.path,
      name: menu.email.children.mailRecord.name,
      component: MailRecord
    }
  ]
};
const FileRoutes = {
  id: menu.file.id,
  path: menu.file.path,
  icon: getIcons('fileServiceIcon'),
  component: FileList,
  children: null
  // children: [
  //   {
  //     path: menu.file.children.fileList.path,
  //     name: menu.file.children.fileList.name,
  //     component: FileList
  //   }
  // ]
};

const LogsRoutes = {
  id: menu.logs.id,
  path: menu.logs.path,
  icon: getIcons('logsServiceIcon'),
  component: LogsList,
  children: null
  // children: [
  //   {
  //     path: menu.logs.children.logsList.path,
  //     name: menu.logs.children.logsList.name,
  //     component: LogsList
  //   }
  // ]
};

const addressBookhospitalRoutes = {
  id: menu.AddressBook.id,
  path: menu.AddressBook.path,
  icon: <Grid />,
  component: AddressBook,
  children: null
};

const messageRoutes = {
  id: menu.message.id,
  path: menu.message.path,
  icon: <Grid />,
  component: MessageModule,
  children: null
};

const procurementRoutes = {
  id: menu.Procurement.id,
  path: menu.Procurement.path,
  icon: <Grid />,
  component: Procurement,
  children: null
};

const projectRoutes = {
  id: menu.project.id,
  path: menu.project.path,
  icon: <Grid />,
  component: ProjectList,
  children: null
  // children: [
  //   {
  //     path: menu.project.children.list.path,
  //     name: menu.project.children.list.name,
  //     component: ProjectList
  //   }
  // ]
};

const webdpRoutes = {
  id: menu.webdp.id,
  path: menu.webdp.path,
  icon: <Grid />,
  children: [
    {
      path: menu.webdp.children.apForm.path,
      name: menu.webdp.children.apForm.name,
      component: APForm
    },
    {
      path: menu.webdp.children.dpForm.path,
      name: menu.webdp.children.dpForm.name,
      component: DPForm
    },
    {
      path: menu.webdp.children.deForm.path,
      name: menu.webdp.children.deForm.name,
      component: DEForm
    },
    {
      path: menu.webdp.children.request.path,
      name: menu.webdp.children.request.name,
      component: WebdpMyRequest
    }
  ]
};

const WebDPMyRequestRoutes = {
  id: menu.myrequest.id,
  path: menu.myrequest.path,
  icon: <Grid />,
  component: WebDPMyRequest,
  children: null
};

const administratorRoutes = {
  id: menu.administrator.id,
  path: menu.administrator.path,
  icon: <Grid />,
  children: [
    {
      path: menu.administrator.children.feedBack.path,
      name: menu.administrator.children.feedBack.name,
      component: FeedBack
    },
    {
      path: menu.administrator.children.grantread.path,
      name: menu.administrator.children.grantread.name,
      component: Grantread
    },
    {
      path: menu.administrator.children.switchtoanotheruser.path,
      name: menu.administrator.children.switchtoanotheruser.name,
      component: SwitchToAnotherUser
    }
  ]
};

const hardwardstatusRoutes = {
  id: menu.hardwardstatus.id,
  path: menu.hardwardstatus.path,
  icon: <Grid />,
  children: [
    {
      path: menu.hardwardstatus.children.ExternalNetworkInterfaceCoverage.path,
      name: menu.hardwardstatus.children.ExternalNetworkInterfaceCoverage.name,
      component: ExternalNetworkInterfaceCoverage
    },

    {
      path: menu.hardwardstatus.children.SearchPDUInformation.path,
      name: menu.hardwardstatus.children.SearchPDUInformation.name,
      component: SearchPDUInformation
    },
    {
      path: menu.hardwardstatus.children.WiredlessNetworkCoverage.path,
      name: menu.hardwardstatus.children.WiredlessNetworkCoverage.name,
      component: WiredlessNetworkCoverage
    },
    {
      path: menu.hardwardstatus.children.WiredNetworkCoverage.path,
      name: menu.hardwardstatus.children.WiredNetworkCoverage.name,
      component: WiredNetworkCoverage
    }
  ]
};

const ncsRoutes = {
  id: menu.ncs.id,
  path: menu.ncs.path,
  icon: <Grid />,
  children: [
    {
      path: menu.ncs.children.ApEquipment.path,
      name: menu.ncs.children.ApEquipment.name,
      component: ApEquipment
    }
  ]
};

export const dashboard = [
  workflowRoutes,
  resourceRoutes,
  aaaServiceRoutes,
  // logRoutes,
  camundaRoutes,
  addressBookhospitalRoutes,
  EmailRoutes,
  FileRoutes,
  LogsRoutes,
  projectRoutes,
  messageRoutes,
  WebDPMyRequestRoutes,
  procurementRoutes,
  ncsRoutes,
  hardwardstatusRoutes,
  administratorRoutes,
  webdpRoutes
];

export const auth = [authRoutes, presentationRoutes];

export default [
  workflowRoutes,
  resourceRoutes,
  aaaServiceRoutes,
  // logRoutes,
  camundaRoutes,
  addressBookhospitalRoutes,
  EmailRoutes,
  FileRoutes,
  LogsRoutes,
  projectRoutes,
  messageRoutes,
  WebDPMyRequestRoutes,
  procurementRoutes,
  ncsRoutes,
  hardwardstatusRoutes,
  administratorRoutes,
  webdpRoutes
];
