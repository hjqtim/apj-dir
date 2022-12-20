import { CREATE, HA4, UPDATE } from '../../../variable/stepName';
import Distribution from './DistributionClass';
import DistributionUpdate from './DistributionUpdateClass';
import DistributionDetail from './DistributionDetailClass';

export default async function getDistributionLogic(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      return new Distribution(props);
    case UPDATE:
      return new DistributionUpdate(props);
    case HA4:
      return new DistributionUpdate(props);
    default:
      return new DistributionDetail(props);
  }
}
