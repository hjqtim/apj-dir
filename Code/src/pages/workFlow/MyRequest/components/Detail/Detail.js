import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import path from '../../../../../utils/path';
import HADynamicForm from '../../../../../components/HADynamicForm';
import { DETAIL } from '../../../../../utils/variable/stepName';

const DynamicForm = memo(HADynamicForm);

function Create() {
  const { id } = useParams();
  const arr = path.getQueryString(useLocation().search);
  const { deploymentId } = arr;
  return (
    <>
      <DynamicForm pid={id} stepName={DETAIL} deploymentId={deploymentId} />
    </>
  );
}

export default Create;
