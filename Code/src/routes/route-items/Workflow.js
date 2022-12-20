import WorkflowSetting from '../../pages/workFlow/WorkflowSetting';
import WFMyRequest from '../../pages/workFlow/MyRequest';
import WFMyApproval from '../../pages/workFlow/MyApproval';
import VMAllocation from '../../pages/workFlow/VMAllocation';
import WFAccount from '../../pages/workFlow/Account';
import NonPersonalAccount from '../../pages/workFlow/NonPersonalAccount';
import DistributionList from '../../pages/workFlow/DistributionList';
import ClosingAccount from '../../pages/workFlow/ClosingAccount';
import MoveIn from '../../pages/workFlow/MoveIn';
import Logging from '../../pages/logging/Log';
import getIcons from '../../utils/getIcons';

const Workflow = {
  id: 'Workflow',
  name: 'Workflow',
  path: '/workflow',
  icon: getIcons('workflowIcon'),
  component: Logging,
  children: [
    {
      name: 'Account Management',
      path: '/workflow/account/',
      component: WFAccount
    },
    {
      name: 'Non-Personal Account',
      path: '/workflow/nonPersonalAccount/',
      component: NonPersonalAccount
    },
    {
      name: 'Distribution List',
      path: '/workflow/distributionList/',
      component: DistributionList
    },
    {
      name: 'Closing Account',
      path: '/workflow/closingAccount/',
      component: ClosingAccount
    },
    {
      name: 'VM Allocation',
      path: '/workflow/vm',
      component: VMAllocation
    },
    {
      name: 'Move In',
      path: '/workflow/movein',
      component: MoveIn
    },
    {
      name: 'My Request',
      path: '/workflow/request/',
      component: WFMyRequest
    },
    {
      name: 'My Approval',
      path: '/workflow/approval/',
      component: WFMyApproval
    },
    {
      name: 'Workflow Setting',
      path: '/workflow/workflowSetting/',
      component: WorkflowSetting
    }
  ]
};

export default Workflow;
