import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import path from '../../../../../utils/path';
import HADynamicForm from '../../../../../components/HADynamicForm';
import getStepName from '../../../../../utils/getStepName';
import { DETAIL } from '../../../../../utils/variable/stepName';

const DynamicForm = memo(HADynamicForm);

function Create() {
  console.log(useParams());
  console.log('------------userParams----------------');
  const { id } = useParams();
  const arr = path.getQueryString(useLocation().search);
  const { deploymentId } = arr;
  if (arr.stepName && arr.taskId) {
    const stepName = getStepName(arr.stepName);
    const pageName = 'myApprove';
    const { taskId } = arr;
    return (
      <>
        <DynamicForm
          pid={id}
          stepName={stepName}
          pageName={pageName}
          taskId={taskId}
          deploymentId={deploymentId}
        />
      </>
    );
  }
  return (
    <>
      <DynamicForm pid={id} stepName={DETAIL} deploymentId={deploymentId} />
    </>
  );
}

export default Create;
