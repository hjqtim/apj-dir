import { CREATE, HA4, UPDATE } from '../../../variable/stepName';
import NonPersonal from './NonPersonalClass';
import NonPersonalUpdate from './NonPersonalUpdateClass';
import NonPersonalDetail from './NonPersonalDetailClass';

export default async function getNonPersonalLogic(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      return new NonPersonal(props);
    case UPDATE:
      return new NonPersonalUpdate(props);
    case HA4:
      return new NonPersonalUpdate(props);
    default:
      return new NonPersonalDetail(props);
  }
}
