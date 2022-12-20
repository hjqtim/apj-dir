import { CREATE, UPDATE } from '../../../variable/stepName';
import Common from './CommonClass';
import CommonDetail from './CommonDetailClass';
import CommonUpdate from './CommonUpdateClass';

export { Common, CommonDetail, CommonUpdate };

export default function getCommon(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      return new Common(props);
    case UPDATE:
      return new CommonUpdate(props);
    default:
      return new CommonDetail(props);
  }
}
