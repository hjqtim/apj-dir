import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { switchComponent } from '../../utils';
import ChildTable from '../ChildTable';
import { DynamicContext } from '../../HADynamicForm';
import Loading from '../../../Loading';
import RequiredField from '../../../RequiredField';

export default function DynamicForm() {
  const { logic, style } = useContext(DynamicContext);

  const [initData, setInitData] = useState({
    parentInitData: undefined,
    childInitDetail: undefined
  });

  useEffect(() => {
    Loading.show();
    logic &&
      logic
        .getInitData()
        .then((data) => {
          logic
            .changeItemList()
            .then(() => {
              const { parentInitData, childInitData, callback } = data;
              const pInitData = parentInitData || new Map();
              logic.parentData = pInitData;
              const parentInitDetail = logic.getParentInitDetail(pInitData);
              logic.childrenDataList = childInitData || [];
              setInitData({
                parentInitDetail,
                childInitDetail: childInitData || []
              });
              if (callback) callback();
            })
            .then(() => {
              logic.hideItem();
              logic.insertHeadLine();
            });
        })
        .finally(() => {
          Loading.hide();
        })
        .catch((e) => {
          console.log(e);
          Loading.hide();
        });
  }, [logic]);

  const useStyles = makeStyles(style || {});
  const classes = useStyles();

  const history = useHistory();

  const getComponent = useCallback(
    (el, i) => switchComponent(el, i, logic, style, true),
    [logic, style]
  );

  return (
    <>
      <Paper className={classes.container} id="dynamic_form_container">
        <RequiredField />
        {logic && logic.getParentTitle() && (
          <Typography variant="h3" id="tableTitle" className={classes.parentTitle}>
            {logic.getParentTitle()}
          </Typography>
        )}
        <div className={classes.parent} id="dynamic_form_parent">
          <div className={classes.parentRawData} id="dynamic_form_parent_raw_data">
            {initData.parentInitDetail &&
              initData.parentInitDetail.map((el, i) => getComponent(el, i))}
          </div>
        </div>
        {logic && logic.childFormDetail && logic.childFormDetail.length ? (
          <div className={classes.child} id="dynamic_form_child">
            <ChildTable />
          </div>
        ) : null}
        <div className={classes.actions} id="dynamic_form_actions">
          {logic && logic.getActions(history)}
        </div>
      </Paper>
    </>
  );
}
