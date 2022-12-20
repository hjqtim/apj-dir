import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import EquipmentBase from './EquipmentBase';
import EquipmentLocation from './EquipmentLocation';
import EquipmentModule from './EquipmentModule';
import HistoryDialog from './HistoryDialog';

const EquipmentTab = ({
  setFieldValue,
  history,
  baseData,
  maintenance,
  closet,
  modules,
  statusList,
  cabinets,
  cabinetPowerList,
  handleChange,
  getCabinetPower,
  handleSave,
  getDetailByOne,
  freshData
}) => (
  <div>
    <Grid container spacing={2}>
      {/* equipment基础信息 */}
      <Grid item xs={12}>
        <EquipmentBase
          setFieldValue={setFieldValue}
          baseData={baseData}
          maintenance={maintenance}
          statusList={statusList}
          handleChange={handleChange}
          handleSave={handleSave}
        />
      </Grid>

      {/* location信息 */}
      <Grid item xs={12}>
        <EquipmentLocation
          closet={closet}
          cabinetid={baseData?.cabinetid}
          powerBarId={baseData?.powerBarId}
          sequence={baseData?.sequence}
          cabinets={cabinets}
          cabinetPowerList={cabinetPowerList}
          setFieldValue={setFieldValue}
          getCabinetPower={getCabinetPower}
        />
      </Grid>

      {/* module */}
      <Grid item xs={12}>
        <EquipmentModule
          modules={modules}
          setFieldValue={setFieldValue}
          getDetailByOne={getDetailByOne}
          statusList={statusList}
        />
      </Grid>
    </Grid>

    {/* replace、relocate、history对话框 */}
    <HistoryDialog
      history={history}
      setValueByField={setFieldValue}
      equipid={baseData?.equipid}
      statusList={statusList}
      freshData={freshData}
    />
  </div>
);

export default memo(EquipmentTab);
