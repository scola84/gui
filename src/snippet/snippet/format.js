import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import sprintf from 'sprintf-js';
import Snippet from '../snippet';

const strings = {};
let locale = '';

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
    merge(strings, value);
  }

  resolve(box, data) {
    const result = [];
    let value = null;

    for (let i = 0; i < this._list.length; i += 1) {
      value = this.resolveValue(box, data, this._list[i]);

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
