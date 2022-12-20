import Common from './Common';
import VMAllocation from './VMAllocation';
import CamundaCommon from './CamundaCommon';

export default function getStyle(workflowName) {
  switch (workflowName) {
    case 'VM Allocation':
      return new VMAllocation();
    case 'Camunda':
      return new CamundaCommon();
    case 'Test':
      return new CamundaCommon();
    case 'demo':
      return new CamundaCommon();
    default:
      return new Common();
  }
}
