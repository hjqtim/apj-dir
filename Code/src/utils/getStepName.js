import { HA4, T3, UPDATE } from './variable/stepName';

export default function getStepName(name) {
  switch (name) {
    case T3:
      return T3;
    case HA4:
      return HA4;
    default:
      return UPDATE;
  }
}
