import { lang } from '../lang/lang';

export function getLang() {
  return lang.ex_us;
}
export function L(slang, args = []) {
  let s = lang.ex_us[slang] || slang;
  if (args.length > 0) {
    // eslint-disable-next-line
    args.forEach((item, i) => {
      // array-callback-return
      s = s.replace(`{${i}}`, item);
    });
  }
  return s;
}
