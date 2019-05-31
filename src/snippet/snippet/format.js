import get from 'lodash-es/get';
import sprintf from 'sprintf-js';
import Snippet from '../snippet';

let locale = '';
let strings = {};

export default class Format extends Snippet {
  static getLocale() {
    return locale;
  }

  static setLocale(value) {
    locale = value;
  }

  static getStrings() {
    return strings;
  }

  static setStrings(value) {
    strings = value;
  }

  resolve(box, data) {
    const result = [];
    let value = null;

    for (let i = 0; i < this._list.length; i += 1) {
      value = this._resolve(box, data, this._list[i]);

      const [code, ...args] = Array.isArray(value) ?
        value : [value];

      const plocale = box.locale || locale;
      const path = plocale ? `${plocale}.${code}` : code;
      const string = get(strings, path);

      result[result.length] = sprintf.vsprintf(string, args);
    }

    return result;
  }
}
