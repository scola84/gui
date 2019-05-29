import get from 'lodash-es/get';
import sprintf from 'sprintf-js';
import Node from '../node';

let locale = '';
let strings = {};

export default class Format extends Node {
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

  render(box, data) {
    const result = [];
    const values = this._resolve(this._list, box, data);

    let value = null;

    for (let i = 0; i < values.length; i += 1) {
      value = values[i];
      value = this._resolve(value, box, data);

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
