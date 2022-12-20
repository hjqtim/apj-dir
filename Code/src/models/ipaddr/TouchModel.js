export default class TouchModel {
  constructor(bol) {
    this.bol = bol;
  }

  genData() {
    const data = {};
    data.requester = {
      userPhone: this.bol
    };

    data.contactPerson = {
      endUserPhone: this.bol
    };

    data.projectInfo = {
      hospital: this.bol,
      remark: this.bol
    };

    data.items = [itemTouch(this.bol)];
    return data;
  }
}

export const itemTouch = (bol) => ({
  purpose: bol,
  computerName: bol,
  ipType: bol,
  ipNumber: bol,
  remarks: bol,
  equpType: bol,
  macAddress: bol,
  hospital: bol,
  floor: bol,
  block: bol,
  releaseDate: bol
});

export const staticItemTouch = (bol) => ({
  subnetSelected: bol,
  bit: bol,
  ipaddressLast: bol,
  subnetMask: bol,
  gateway: bol
});

export const reserverItemTouch = (bol) => ({
  subnetSelected: bol,
  bit: bol,
  ipaddressLast: bol,
  subnetMask: bol,
  gateway: bol
});

export const rangeItemTouch = (bol) => ({
  subnetSelected: bol,
  rangeFrom: bol
});
