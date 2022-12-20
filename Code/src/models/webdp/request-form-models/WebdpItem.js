class WebdpItem {
  key = new Date().getTime() + Math.ceil(Math.random() * 1000); // 唯一的key

  amount = 1;

  expectedCompleteDate = undefined;

  remark = '';

  dataPortInformation = {
    service: {
      type: '',
      existingLocation: '',
      others: '',
      secondaryDataPortID: ''
    },
    conduitType: '',
    projectInfo: {
      project: {}, // 选中的project
      others: ''
    },
    floorPlan: []
  };

  locationInformation = {
    department: '',
    block: '',
    floor: '',
    blockAndFloorByHospCodeList: [], // Location Details中每个item的floor下拉列表数据
    roomOrWard: '',
    publicAreas: 0,
    icm: 0,
    awp: 0
  };

  siteContactInformation = {
    contactPerson: '',
    jobTitle: '',
    phone: '',
    email: ''
  };
}

export default WebdpItem;
