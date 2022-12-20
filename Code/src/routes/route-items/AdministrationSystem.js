import getIcons from '../../utils/getIcons';

import NewWorkflowSetting from '../../pages/camunda/NewWorkflowSetting';
import Template from '../../pages/email/Template';
import MailRecord from '../../pages/email/MailRecord';
import FileList from '../../pages/file/FileList';
import LogsList from '../../pages/logs/Log';
import ProjectList from '../../pages/project/ProjectList';
import SystemMessages from '../../pages/AdministrationSystem/SystemMessages';
import ScheduledTask from '../../pages/AdministrationSystem/ScheduledTask';
import Platform from '../../pages/resources/Platform';

const AdministratorSystem = {
  id: 'Administration-System',
  name: 'AdministratorSystem',
  path: '/AdministratorSystem',
  icon: getIcons('camundaService'),
  children: [
    {
      name: 'Workflows',
      path: '/camunda/NewWorkflowSetting/',
      component: NewWorkflowSetting
    },
    {
      name: 'Email Templates',
      path: '/email/template',
      component: Template
    },
    {
      name: 'Logging - Email',
      path: '/email/mailRecord',
      component: MailRecord
    },
    {
      name: 'File Management',
      path: '/file',
      component: FileList
    },
    {
      name: 'Logging - API',
      path: '/logs',
      component: LogsList
    },
    {
      name: 'Project Profiles',
      path: '/project',
      component: ProjectList
    },
    {
      name: 'Task Scheduler',
      path: '/AdministrationSystem/ScheduledTask',
      component: ScheduledTask
    },
    {
      name: 'System Messages',
      path: '/AdministrationSystem/SystemMessages',
      component: SystemMessages
    },
    {
      name: 'Platform Profiles',
      path: '/resources/platform/',
      component: Platform
    }
  ]
};

export default AdministratorSystem;
