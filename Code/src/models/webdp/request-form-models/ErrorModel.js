export default class ErrorModel {
  requester = {
    phone: false
  };

  rManager = {
    name: false,
    phone: false
  };

  serviceRequired = {
    hospitalLocation: false
  };

  expectedDate = false;

  dpDetails = [
    {
      amount: false,
      service: {
        type: false,
        existingLocation: false,
        others: false,
        secondaryDataPortID: false
      },
      conduitType: false,
      project: {
        project: false,
        others: false
      },
      floorPlan: false,
      block: false,
      floor: false,
      publicAreas: false,
      siteContactPerson: false,
      phone: false,
      email: false
    }
  ];

  externalNetwork = {
    acContactPerson: false,
    tcContactPerson: false,
    implementalPerson: false,
    ivendorName: false,
    acPhone: false,
    tcPhone: false,
    iPhone: false,
    mPhone: false,
    acEmail: false,
    tcEmail: false,
    iEmail: false,
    mEmail: false
  };

  myBudgetHolder = {
    budgetholdername: false,
    fPhone: false
  };
}
