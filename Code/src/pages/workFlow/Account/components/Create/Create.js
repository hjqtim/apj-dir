import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import path from '../../../../../utils/path';
// import CommonWorkflowForm from "../../../../../components/CommonWorkflowForm"
import HADynamicForm from '../../../../../components/HADynamicForm';
import { CREATE } from '../../../../../utils/variable/stepName';

const DynamicForm = memo(HADynamicForm);

function Create() {
  const { id } = useParams();
  const arr = path.getQueryString(useLocation().search);
  const { deploymentId, cuId } = arr;
  const startData = {
    cuId: cuId || null
  };
  return (
    <>
      <DynamicForm
        stepName={CREATE}
        startData={startData}
        processDefinitionId={id}
        deploymentId={deploymentId}
      />
    </>
  );
}

export default Create;
