export default () => ({
  hospitalList: [], // 医院下拉列表数据
  closetList: [], // closet表格数据
  closetSelectItem: {}, // closet选中的item
  selectHospital: {}, // 选中的医院
  closetIdFilter: '', // 过滤条件中的closet id
  tabValue: 'equipment',
  statusList: [], // status下拉列表数据
  cabinetList: [], // Cabinet表格数据
  cabinetSelectItem: {}, // cabinet选中的对象
  cabinetPowerList: [], // cabinet power 表格数据
  cabinetPowerSelectItem: {}, // cabinet power选中的对象
  equipmentList: [], // Equipment表格数据
  equipmentSelectItem: {}, // Equipment选中对象
  outletList: [], // outlet表格数据
  backboneList: [], // backbone表格数据
  moduleList: [], // Module表格数据
  blockList: [],
  closetHistory: [], // closet修改历史列表
  cabinetHistory: [], // cabinet修改历史列表
  cabinetPowerHistory: [], // cabinet power修改历史列表
  equipmentHistory: [], // equipment修改历史列表
  outletHistory: [], // outlet修改历史列表
  backboneHistory: [], // backbone修改历史列表
  addCloset: {}, // 新增closet时的数据
  isOpenAddCloset: false, // 是否打开新增closet对话框
  isOpenAddPower: false, // 是否打开新增Power对话框
  connectPortHistory: [], // port connect修改历史记录
  connectPortSelectItem: [], // port connect选中对象,可多选
  outletSelectItem: [] // outlet选中的对象，单选
});
