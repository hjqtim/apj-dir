import React, { useEffect, useState, createContext } from 'react';
import Api from '../../api/HADynamicForm';
import DynamicForm from './Components/DynamicForm/DynamicForm';
import getStyle from '../../utils/dynamicForm/style';
import getLogic from '../../utils/dynamicForm/logic';
import Loading from '../Loading';

export const DynamicContext = createContext({});

export default function HADynamicFormCamunda(props) {
  const { deploymentId, stepName } = props;

  const [dynamic, setDynamic] = useState({});
  useEffect(() => {
    Loading.show();
    Api.getDynamicForm({ deploymentId, stepName })
      .then(({ data }) => {
        let detail = {};
        if (data.data) {
          detail = data.data;
        }
        let workflowName = 'Test';
        let childHeaderLength = 5;
        if (data.data && data.data.workflowName) {
          workflowName = data.data.workflowName;
        }
        if (workflowName === 'Test') {
          childHeaderLength = 1;
        }
        const style = getStyle(workflowName, { ...props });
        console.log(style);
        let logic;
        return getLogic(workflowName, {
          deploymentId,
          ...props,
          ...detail,
          childHeaderLength
        }).then((data) => {
          logic = data;
          setDynamic({
            initProps: props,
            logic,
            style
          });
        });
      })
      .finally(() => {
        Loading.hide();
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
    // eslint-disable-next-line
  }, []);

  return (
    <DynamicContext.Provider value={{ ...dynamic }}>
      <DynamicForm />
    </DynamicContext.Provider>
  );
}
