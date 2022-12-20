import React, { useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Paper from '@material-ui/core/Paper';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MButton from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import BorderColorIcon from '@material-ui/icons/BorderColorOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ChatIcon from '@material-ui/icons/Chat';
import { orange } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import { L } from '../../utils/lang';
import ChatBox from '../ChatBox';
import Loading from '../Loading';
import formatDateTime from '../../utils/formatDateTime';
import { CommonTable } from '..';
import API from '../../api/workFlow';

function HAStep(props) {
  const Button = withStyles(() => ({
    root: {
      width: '5vw'
    }
  }))(MButton);

  const [shown, setShown] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [reason, setReason] = useState('');
  const [taskId, setTaskId] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const handleDetail = (event, row) => {
    let { reason } = row;
    reason = reason ? reason.trim().replace(/<[^>]+>/g, '') : reason;
    setReason(reason);
    setShown(true);
  };
  const handleChatBox = (event, row) => {
    setTaskId(row.taskId);
    if (row.endDate) {
      setShowDisabled(true);
    } else {
      setShowDisabled(false);
    }
    setShowChatBox(true);
  };
  const display = (row) => {
    if (row.taskId) {
      if (row.userName || row.groupName) {
        return true;
      }
    }
    return false;
  };

  const actionList = [
    {
      label: L('Reject Reason'),
      icon: <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleDetail
    },
    {
      label: L('message'),
      icon: <ChatIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleChatBox,
      display
    }
  ];

  const { processInstanceId, request } = props;
  // const processInstanceId = 827520
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [rows, setRows] = useState([]);
  const [api] = useState(request || API);

  useEffect(() => {
    Loading.show();
    api
      .getProcessPoint({ id: processInstanceId })
      .then(({ data }) => {
        const process = data.data;
        if (process) {
          const pointList = [];
          let active = 0;
          process.showProcessPointList.forEach((index) => {
            const point = process.showProcessPointList[index];
            const model = {
              name: point.name,
              status: point.status ? point.status : 'completed'
            };
            pointList.push(model);
            if (point.id === process.processStatus) {
              active = index;
              if (parseInt(index) + 1 === process.showProcessPointList.length) {
                active += 1;
              }
            }
          });
          setSteps(pointList);
          setActiveStep(parseInt(active));
          const pointUserList = [];
          process.processPointUser.forEach((pointUser) => {
            let status = null;
            if (pointUser.status && pointUser.taskInstance.endTime) {
              status = L('Passed');
            } else if (!pointUser.status) {
              status = L('Rejected');
            }
            const pointRow = {
              taskId: pointUser.taskInstance.taskId,
              assignee: pointUser.assignee,
              userName: pointUser.user ? pointUser.user : null,
              groupName: pointUser.group ? pointUser.group : null,
              name: pointUser.taskInstance.activityName,
              endDate: pointUser.taskInstance.endTime
                ? formatDateTime(new Date(pointUser.taskInstance.endTime))
                : null,
              status,
              reason: pointUser.rejectReason || ''
            };
            pointUserList.push(pointRow);
          });
          setRows(pointUserList);
        }
      })
      .finally(() => Loading.hide())
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  }, [processInstanceId, api]);

  // const steps = [ 'Select master blaster campaign settings', 'Create an ad group', 'Create an ad' ]

  // 表头字段列表
  const headCells = [
    { id: 'name', alignment: 'left', label: L('Name') },
    { id: 'assignee', alignment: 'left', label: L('Assignee') },
    { id: 'userName', alignment: 'left', label: L('User') },
    { id: 'groupName', alignment: 'left', label: L('Group') },
    { id: 'status', alignment: 'left', label: L('Status') },
    { id: 'endDate', alignment: 'left', label: L('End Date') },
    { id: 'action', alignment: 'center', label: L('Action') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'name', align: 'left' },
    { field: 'assignee', align: 'left' },
    { field: 'userName', align: 'left' },
    { field: 'groupName', align: 'left' },
    { field: 'status', align: 'left' },
    { field: 'endDate', align: 'left' }
  ];

  return (
    <div style={{ maxWidth: '100%' }}>
      <Typography variant="h3" id="tableTitle" style={{ fontSize: '22px', marginBottom: '1em' }}>
        {L('My Request')}
      </Typography>
      <Stepper style={{ backgroundColor: '#F7F9FC' }} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          let labelProps = {};
          if (label.status === 'processing') {
            labelProps = {
              icon: <AutorenewIcon style={{ color: orange[500] }} />
            };
          }
          if (label.status === 'fail') {
            labelProps = {
              error: true
            };
          }
          return (
            <Step key={label.name}>
              <StepLabel {...labelProps}>{label.name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Paper style={{ paddingBottom: '20px', borderRadius: '1em' }}>
        <CommonTable
          rows={rows}
          tableName={L('History List')}
          hideCheckBox
          hideUpdate
          hideDetail
          headCells={headCells}
          fieldList={fieldList}
          hideCreate
          actionList={actionList}
        />
      </Paper>
      <ChatBox
        open={showChatBox}
        onClose={() => {
          setShowChatBox(false);
        }}
        disabled={showDisabled}
        taskId={taskId}
        request={request}
      />
      <Dialog
        open={shown}
        onClose={() => {
          setShown(false);
        }}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="form-dialog-title">{L('Reject Reason')}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>{reason}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            fullwidth
            variant="contained"
            onClick={() => {
              setShown(false);
            }}
            style={{ marginRight: '2ch' }}
          >
            {L('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default HAStep;
