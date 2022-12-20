import React, { memo } from 'react';
import { Grid, Tooltip } from '@material-ui/core';
// import { L } from '../../../../../utils/lang';
import CommonDialog from '../../../../../components/CommonDialog';

const Detail = (props) => {
  const { actionRow, isOpenDetail, setIsOpenDetail } = props;

  const handleClose = () => {
    setIsOpenDetail(false);
  };

  const rows = [
    { title: 'Job Name', field: 'jobName' },
    { title: 'Job Group', field: 'jobGroup' },
    { title: 'Job Class Name', field: 'jobClassName' },
    { title: 'Trigger Name', field: 'triggerName' },
    { title: 'Expression', field: 'cronExpression' },
    { title: 'Trigger Start Time', field: 'triggerStartTime' },
    { title: 'Next Trigger Time', field: 'nexTriggerStartTime' },
    { title: 'Description', field: 'description' },
    { title: 'State', field: 'triggerState' }
  ];

  const content = (
    <div style={{ padding: '30px 50px' }}>
      <Grid container spacing={4} style={{ fontSize: '16px' }}>
        {rows.map((item) => (
          <Grid key={item.title} item container xs={6}>
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <span style={{ fontSize: 14, color: '#0F3E5B' }}>{item.title}</span>
              </Grid>
              <Grid item xs={12}>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 400,
                    color: '#000',
                    wordBreak: 'break-all',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Tooltip title={actionRow[item.field] || ''} placement="top">
                    <span>{actionRow[item.field]}</span>
                  </Tooltip>
                </span>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );

  return (
    <div>
      <CommonDialog
        title="Detail"
        content={content}
        open={isOpenDetail}
        isHideSubmit
        maxWidth="md"
        handleClose={handleClose}
        isHideFooter={false}
      />
    </div>
  );
};

export default memo(Detail);
