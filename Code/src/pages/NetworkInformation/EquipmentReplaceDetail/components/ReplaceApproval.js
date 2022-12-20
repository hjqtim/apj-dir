import React, { memo } from 'react';
import WebdpAccordion from '../../../../components/Webdp/WebdpAccordion';
import Remark from './Remark';
import Replacehistory from './Replacehistory';
import EquipmentInfo from './EquipmentInfo';

const titleStyle = { color: '#078080', fontSize: '16px', paddingLeft: '4px', paddingBottom: '5px' };

const ReplaceApproval = (props) => {
  const {
    setFieldValue,
    handleChange,
    handleSubmit,
    baseData = {},
    maintenance = {},
    history,
    approvalRemark
  } = props;

  // 格式化样式
  const GridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    item: true,
    container: true
  };
  const PlaceGridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    item: true
  };
  const ItemProps = {
    item: true,
    xs: 12
  };

  const ItemStyle = {
    padding: '5px'
  };

  return (
    <div>
      <WebdpAccordion
        label="Equipment Infomation"
        expandedSW
        content={
          <div>
            {/* equipment base info */}
            <EquipmentInfo
              titleStyle={titleStyle}
              PlaceGridProps={PlaceGridProps}
              ItemStyle={ItemStyle}
              GridProps={GridProps}
              ItemProps={ItemProps}
              setFieldValue={setFieldValue}
              baseData={baseData}
              maintenance={maintenance}
            />
            {/* replace infomation */}
            <Replacehistory
              titleStyle={titleStyle}
              PlaceGridProps={PlaceGridProps}
              ItemStyle={ItemStyle}
              GridProps={GridProps}
              ItemProps={ItemProps}
              history={history}
            />
          </div>
        }
      />
      {/* 审核部分 */}
      <WebdpAccordion
        label="Remark"
        expandedSW
        content={
          <Remark
            approvalRemark={approvalRemark}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            handleSubmit={handleSubmit}
          />
        }
      />
    </div>
  );
};

export default memo(ReplaceApproval);
