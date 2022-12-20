export default class SiteVisitItem {
  id;

  isSiteVisit;

  contact;

  constructor(id, isSiteVisit, contact) {
    this.id = id;
    this.isSiteVisit = isSiteVisit;
    this.contact = contact;
  }
}
