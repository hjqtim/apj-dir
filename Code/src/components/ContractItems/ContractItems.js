import {
  Corp,
  WLAN,
  InternetAccount,
  IBRA,
  NonPersonal,
  Distribution,
  ClosingAccount
} from './Items';

const items = new Map();

items.set('CORP Account (Personal) Application', Corp);
items.set('Wireless LAN (WLAN) Application', WLAN);
items.set('Internet Account Application', InternetAccount);
items.set('IBRA Account Application', IBRA);
items.set('CORP Account (Non-Personal) Application', NonPersonal);
items.set('Distribution List Application', Distribution);
items.set('Closing Account', ClosingAccount);

export default items;
