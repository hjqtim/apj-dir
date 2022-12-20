export default class ApDpDetailModel {
  remarks = '';

  specialRequirements = '';

  justificationsForUsingWLAN = '';

  expectedCompleteDate = new Date().setDate(new Date().getDate() + 14);

  blockByHospCodeList = []; // 选中的医院的具体街道信息列表

  projectList = []; // project下拉列表数据

  floorPlan = [];

  serviceTypeOption = []; // service type 下拉列表数据

  conduitTypeOption = []; // conduit type 下拉列表数据

  items = [
    {
      key: -1, // 唯一的key
      amount: 0,
      expectedCompleteDate: undefined,
      remark: '',
      dataPortInformation: {
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
        externalNetworkRequirement: ''
      },
      locationInformation: {
        department: '',
        block: '',
        floor: '',
        blockAndFloorByHospCodeList: [], // Location Details中每个item的floor下拉列表数据
        roomOrWard: '',
        publicAreas: 1,
        icm: 0,
        awp: 0
      },
      siteContactInformation: {
        contactPerson: '',
        contactObj: {},
        jobTitle: '',
        phone: '',
        email: ''
      }
    }
  ];
}
