class NetworkDesignItem {
  id;

  isNetworkDesign;

  reason;

  remark;

  constructor(id, isNetworkDesign, reason, remark) {
    this.id = id;
    this.isNetworkDesign = isNetworkDesign;
    this.reason = reason;
    this.remark = remark;
  }
}

export default NetworkDesignItem;
