import accountAPI from '../api/accountManagement';
import returnType from './variable/returnType';

export default function formatField(field) {
  if (!field) return field;
  const { fieldName, fieldDisplayName } = field;
  if (!fieldName) return field;
  let abbrFieldName = fieldDisplayName;
  if (fieldDisplayName.length > 40) {
    abbrFieldName = `${fieldDisplayName.slice(0, 31)} ... `;
  }
  field.abbrFieldName = abbrFieldName;
  switch (fieldName) {
    case 'distribution_list':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.D };
      break;
    case 'supervisoremailaccount':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.U };
      if (field.remark && field.remark.indexOf('checkMail') !== -1) {
        field.checkMail = false;
      } else {
        field.checkMail = true;
      }
      break;
    case 'alternaterecipient':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.UD };
      break;
    case 'alreadyaddeddistributionlist':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.UD };
      break;
    case 'acceptmessagesfrom':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.UD };
      break;
    case 'rejectmessagesfrom':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.UD };
      break;
    case 'members':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.M };
      break;
    case 'memberof':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.D };
      break;
    case 'owneremail':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.U };
      break;
    case 'emailid':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.U };
      break;
    case 'isowner_mailboxdisplayname':
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.U };
      break;
    default:
      field.apiKey = accountAPI.findUsers;
      field.apiValue = { returnType: returnType.U };
      break;
  }
  return field;
}
