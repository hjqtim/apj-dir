import MailRecord from '../../pages/email/MailRecord';
import Template from '../../pages/email/Template';
import getIcons from '../../utils/getIcons';

const Email = {
  id: 'Email',
  name: 'Email Manager',
  path: '/email',
  icon: getIcons('emailServiceIcon'),
  children: [
    {
      name: 'Template',
      path: '/email/template',
      component: Template
    },
    {
      name: 'Sent Record',
      path: '/email/mailRecord',
      component: MailRecord
    }
  ]
};

export default Email;
