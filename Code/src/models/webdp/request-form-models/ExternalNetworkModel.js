export default class ExternalNetworkModel {
  adminContact = {
    contactPerson: '',
    phone: '',
    email: ''
  };

  technicalContact = {
    contactPerson: '',
    phone: '',
    email: ''
  };

  system = {
    existedNetwork: '',
    supplierName: '',
    pcLocation: '',
    serverLocation: '',
    haSystemIntegrate: '',
    relatedProject: '',
    relatedServer: '',
    initiateTraffic: '',
    projectDestination: '',
    serverDestination: '',
    expectedImplementalDate: undefined
  };

  networkTraffic = {
    deviceAmount: 0,
    trafficPerDay: 0,
    perFileSize: 0,
    expectedResponseTime: 0,
    peakHourFrom: '',
    peakHourTo: '',
    networkResilience: '',
    remoteMethod: ''
  };

  vendor = {
    vendorName: '',
    implementalPerson: '',
    implementalPhone: '',
    implementalEmail: '',
    maintenancePerson: '',
    maintenancePhone: '',
    maintenanceEmail: ''
  };
}
