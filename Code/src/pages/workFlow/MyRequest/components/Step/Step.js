import React from 'react';
import { useParams } from 'react-router-dom';
import HAStep from '../../../../../components/HAStep';

function WorkFlowStep() {
  const { id } = useParams();

  return <HAStep processInstanceId={id} />;
}
export default WorkFlowStep;
