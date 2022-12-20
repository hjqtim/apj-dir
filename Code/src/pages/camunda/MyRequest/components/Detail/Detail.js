import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import path from '../../../../../utils/path';
import HADynamicForm from '../../../../../components/HADynamicForm';
import { DETAIL } from '../../../../../utils/variable/stepName';
import getStepName from '../../../../../utils/getStepName';

const DynamicForm = memo(HADynamicForm);

function Create() {
  const { id } = useParams();
  const arr = path.getQueryString(useLocation().search);
  const { deploymentId } = arr;
  if (arr.stepName && arr.taskId) {
    const stepName = getStepName(arr.stepName);
    const pageName = 'myRequest';
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
