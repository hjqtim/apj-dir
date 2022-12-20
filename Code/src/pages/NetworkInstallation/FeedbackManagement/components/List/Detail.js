import React, { memo, useState } from 'react';
import { Grid, TextField, IconButton, Tooltip } from '@material-ui/core';
import { SaveOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';
import CommonDialog from '../../../../../components/CommonDialog';
import { CommonDataGrid } from '../../../../../components';
import API from '../../../../../api/webdp/webdp';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';

const Detail = (props) => {
  const { open, obj, detailList, getDetailList, isGetDetail, closeDetail, queryFeedbackList } =
    props;

  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10
  });

  const [taken, setTaken] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setTaken('');
    closeDetail();
  };

  const columns = [
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      renderCell: ({ row }) =>
        row.createdDate ? dayjs(row.createdDate).format('DD-MMM-YYYY HH:mm:ss') : ''
    },
    {
      field: 'taken',
      headerName: 'Action Taken',
      flex: 1,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: row.taken };
        return dataGridTooltip(newRow);
      }
    },
    {
      field: 'createdBy',
      headerName: 'Action By',
      flex: 1
    }
  ];

  const onPageChange = (newPage) => {
    const newParams = {
      ...params,
      pageIndex: newPage
    };
    setParams(newParams);
  };

  const onPageSizeChange = (newPageSize) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: newPageSize
    };
    setParams(newParams);
  };

  const handleSubmit = () => {
    if (taken.trim() && !saving && obj.id) {
      const saveParams = {
        feedbackCommentId: obj.id,
        taken: taken.trim()
      };

      setSaving(true);
      API.saveFeedbackTaken(saveParams)
        .then((res) => {
          if (res?.data?.status === 200) {
            queryFeedbackList();
            getDetailList(obj);
            setTaken('');
          }
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

  return (
    <>
      <CommonDialog
        title="Feedback Follow Up Action"
        content={
          <div style={{ padding: 30 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  label="Action Log"
                  style={{ flex: 1 }}
                  value={taken}
                  onChange={(e) => {
                    setTaken(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Save" placement="top">
                        <IconButton size="small" onClick={handleSubmit}>
                          <SaveOutlined />
                        </IconButton>
                      </Tooltip>
                    )
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <CommonDataGrid
                  columns={columns}
                  rows={detailList}
                  pageSize={params.pageSize}
                  page={params.pageIndex}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                  loading={isGetDetail}
                />
              </Grid>
            </Grid>
          </div>
        }
        open={open}
        maxWidth="md"
        handleClose={handleClose}
      />
    </>
  );
};

export default memo(Detail);
