import React from 'react';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

import ApApplicationForm from '../../pages/webdp/Application/ApApplicationForm';
import DpApplicationForm from '../../pages/webdp/Application/DpApplicationForm';
import FeedbackManagement from '../../pages/NetworkInstallation/FeedbackManagement';
import ILTIButton from '../../pages/webdp/Application/components/dpForm/ILTIButton';
import PLButton from '../../pages/webdp/Application/components/dpForm/PriceList';
import NetworkDesignMeeting from '../../pages/NetworkInstallation/NetworkDesignMeeting';
import NetworkDesignMeetingAdd from '../../pages/NetworkInstallation/NetworkDesignMeeting/Makemeeting';
import NetworkDesignMeetingEdit from '../../pages/NetworkInstallation/NetworkDesignMeeting/Detailmeeting';

const NetworkInstallation = {
  id: 'Network Installation',
  name: 'Network Installation',
  path: '/NetworkInstallation',
  icon: <AccountTreeIcon />,
  children: [
    {
      name: 'Data Port Installation',
      path: '/webdp/dpForm',
      component: DpApplicationForm
    },
    {
      name: 'HA WIFI AP Installation',
      path: '/webdp/apForm',
      component: ApApplicationForm
    },

    {
      name: 'Installation Lead Time Info',
      path: '/webdp/leadtimeinfo/:formType',
      component: ILTIButton,
      isHidden: true
    },
    {
      name: 'Installation Price List',
      path: '/webdp/pricelist/:formType',
      component: PLButton,
      isHidden: true
    },
    {
      name: 'Feedback Management',
      path: '/NetworkInstallation/FeedbackManagement',
      component: FeedbackManagement
    },
    {
      name: 'Network Design Meeting',
      path: '/NetworkInstallation/NetworkDesignMeeting',
      component: NetworkDesignMeeting
    },
    {
      name: 'Network Design Meeting Add',
      path: '/NetworkInstallation/NetworkDesignMeeting/addmeeting',
      component: NetworkDesignMeetingAdd
    },
    {
      name: 'Network Design Meeting Edit',
      path: '/NetworkInstallation/NetworkDesignMeeting/meeting/:status/:meetingNo',
      component: NetworkDesignMeetingEdit
    }
  ]
};

export default NetworkInstallation;
