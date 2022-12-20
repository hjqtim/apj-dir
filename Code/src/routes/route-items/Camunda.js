// import CamundaAccount from '../../pages/camunda/Account';
// import CamundaDemo from '../../pages/camunda/Demo';
// import CamundaTest from '../../pages/camunda/Test';
// import MyApproval from '../../pages/camunda/MyApproval';
// import MyRequest from '../../pages/camunda/MyRequest';
// import CamundaWorkflowSetting from '../../pages/camunda/WorkflowSetting';
import NewWorkflowSetting from '../../pages/camunda/NewWorkflowSetting';
import getIcons from '../../utils/getIcons';

const Camunda = {
  id: 'Camunda Service',
  name: 'Workflow Setting',
  // path: '/camunda',
  path: '/camunda/NewWorkflowSetting/',
  icon: getIcons('camundaService'),
  component: NewWorkflowSetting,
  children: null
  // children: [
  //   {
  //     name: 'Account Management',
  //     path: '/camunda/account/',
  //     component: CamundaAccount
  //   },
  //   {
  //     name: 'Demo Management',
  //     path: '/camunda/demo/',
  //     component: CamundaDemo
  //   },
  //   {
  //     name: 'All Management',
  //     path: '/camunda/All/',
  //     component: CamundaTest
  //   },
  //   {
  //     name: 'My Approval',
  //     path: '/camunda/approval/',
  //     component: MyApproval
  //   },
  //   {
  //     path: '/camunda/request',
  //     name: 'My Request',
  //     component: MyRequest
  //   },
  //   {
  //     name: 'Camunda Workflow Setting',
  //     path: '/camunda/workflowSetting/',
  //     component: CamundaWorkflowSetting
  //   },
  //   {
  //     name: 'New Workflow Setting',
  //     path: '/camunda/NewWorkflowSetting/',
  //     component: NewWorkflowSetting
  //   }
  // ]
};

export default Camunda;
