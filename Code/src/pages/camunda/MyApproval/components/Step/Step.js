import React from 'react';
import { useParams } from 'react-router-dom';
import HAStep from '../../../../../components/HAStep';
import API from '../../../../../api/camunda';

function WorkFlowStep() {
  const { id } = useParams();

  return <HAStep processInstanceId={id} request={API} />;
}
export default WorkFlowStep;
