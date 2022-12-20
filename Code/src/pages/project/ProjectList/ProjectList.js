import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import CommonPage from '../../../components/CommonPage';
import Loading from '../../../components/Loading';
import CommonTip from '../../../components/CommonTip';
import WarningDialog from '../../../components/WarningDialog';
import { Create, List, Detail, Update2 as Update } from './components';
import getIcons from '../../../utils/getIcons';
import API from '../../../api/project/project';

const title = 'Project Profiles';

const ProjectList = () => {
  const [openSync, setOpenSync] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const customAction = (
    <Tooltip placement="top" title="Sync">
      <IconButton onClick={() => setOpenSync(true)}>{getIcons('syncIcon')}</IconButton>
    </Tooltip>
  );

  const config = {
    title,
    customAction,
    List,
    Create,
    Detail,
    Update,
    refresh
  };

  const handleSyncData = () => {
    setOpenSync(false);
    Loading.show();
    API.getProjectByAPI()
      .then((res) => {
        if (res?.data?.code === 200) {
          setRefresh(!refresh);
          CommonTip.success('Success');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  return (
    <>
      <CommonPage {...config} />

      <WarningDialog
        open={openSync}
        handleConfirm={handleSyncData}
        handleClose={() => setOpenSync(false)}
        content="This will synchronize all the data. Are you sure?"
      />
    </>
  );
};

export default ProjectList;
