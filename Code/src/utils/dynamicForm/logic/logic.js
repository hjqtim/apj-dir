import getVMLogic from './VMAllocation';
import getCommon from './Common';
import getClosingLogic from './ClosingAccount';
import getAccountLogic from './Account';
import getNonPersonalLogic from './NonPersonal';
import getDistributionLogic from './Distribution';
import getTest from './Test';

async function getLogic(workflowName, props) {
  console.log('workflowName: ', workflowName);
  switch (workflowName) {
    case 'VM Allocation':
      return getVMLogic(props);
    case 'Account management':
      return getAccountLogic(props);
    case 'Non-Personal Account':
      return getNonPersonalLogic(props);
    case 'Distribution List':
      return getDistributionLogic(props);
    case 'Closing Account':
      return getClosingLogic(props);
    case 'Camunda':
      return getTest(props);
    case 'demo':
      return getTest(props);
    default:
      return getCommon(props);
  }
}

export default getLogic;
