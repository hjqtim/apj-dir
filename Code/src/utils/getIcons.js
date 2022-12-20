import React from 'react';
import {
  BorderColorOutlined,
  EmailOutlined,
  CheckCircleOutlineOutlined,
  RemoveRedEyeOutlined,
  AppsOutlined,
  AddCircle,
  FilterList
} from '@material-ui/icons';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ReplayIcon from '@material-ui/icons/Replay';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SyncIcon from '@material-ui/icons/Sync';
import theme from '../theme/variants';
import {
  CamundaServiceIcon,
  WorkflowIcon,
  ResourceIcon,
  AAAServiceIcon,
  EmailServiceIcon,
  FileServiceIcon,
  LogsServiceIcon,
  EdictIcon,
  LogoutIcon,
  UserIcon,
  DeleteIcon,
  DetaiEyeIcon,
  BbnormalIcon,
  Comment,
  SwitchBack,
  CloseEye
} from './svgIcon';

export default (name, color) => {
  const iconsMap = {
    edit: <BorderColorOutlined fontSize="small" style={{ color: color || '#2553F4' }} />, // 修改 icon
    email: <EmailOutlined fontSize="small" style={{ color: color || '#229FFA' }} />, // 邮箱 icon
    delete: <DeleteIcon color={color} />, // 删除icon
    replay: <ReplayIcon fontSize="small" style={{ color: color || '#229ffa' }} />, // 邮件列表重新发送icon
    success: <CheckCircleOutlineOutlined fontSize="small" style={{ color: color || '#04DE69' }} />, // 邮件列表重新发送icon
    detail: <RemoveRedEyeOutlined fontSize="small" style={{ color: color || '#229ffa' }} />, // 详情icon
    camundaService: <CamundaServiceIcon />, // 侧边栏 CamundaServiceIcon
    workflowIcon: <WorkflowIcon />, // 侧边栏 WorkflowIcon
    resourceIcon: <ResourceIcon />, // 侧边栏 ResourceIcons
    logsServiceIcon: <LogsServiceIcon />, // 侧边栏 LogsServiceIcon
    emailServiceIcon: <EmailServiceIcon />, // 侧边栏 EmailServiceIcon
    fileServiceIcon: <FileServiceIcon />, // 侧边栏 FileServiceIcon
    aaaServiceIcon: <AAAServiceIcon />, // 侧边栏 AAAServiceIcons
    detaiEyeIcon: <DetaiEyeIcon />, // 详情 DetaiEyeIcon
    addIcon: <AddCircle />, // 详情 DetaiEyeIcon
    logoutIcon: <LogoutIcon />, // 退出登录 LogoutIcon
    userIcon: <UserIcon />, //  用户图标 UserIcon
    edictIcon: <EdictIcon />, // 详情 EdictIcon
    billIcon: <ReceiptIcon style={{ color: color || theme?.[0]?.palette?.secondary?.main }} />, // 账单明细  ReorderIcon
    bbnormalIcon: <BbnormalIcon />, // Displayed when the file display is abnormal
    app: <AppsOutlined fontSize="small" style={{ color: color || '#229FFA' }} />,
    comment: <Comment />,
    gpsFixedIcon: <GpsFixedIcon fontSize="small" style={{ color: color || '#229FFA' }} />, // check data port status action icon
    syncIcon: <SyncIcon fontSize="medium" style={{ color: color || '#229FFA' }} />, // check data port status action icon
    switchBack: <SwitchBack />,
    filter: <FilterList fontSize="small" />,
    closeEye: <CloseEye fontSize="small" style={{ color: color || '#229ffa' }} />
  };
  return iconsMap[name];
};
