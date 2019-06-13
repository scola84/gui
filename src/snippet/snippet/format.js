import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import Snippet from '../snippet';
import { vsprintf } from '../../helper';

const strings = {};
let wlocale = 'nl_NL';

export default class Format extends Snippet {
  static getLocale() {
    return wlocale;
  }

  static setLocale(value) {
    wlocale = value;
  }

  static setNumbers(value) {
    merge(vsprintf.n.definitions, value);
  }

  static getNumbers() {
    return vsprintf.n.definitions;
  }

  static getStrings() {
    return strings;
  }

  static setStrings(value) {
    merge(strings, value);
  }

  constructor(options = {}) {
    super(options);

    this._locale = null;
    this.setLocale(options.locale);
  }

  getLocale() {
    return this._locale;
  }

  setLocale(value = wlocale) {
    this._locale = value;
    return this;
  }

  locale(value) {
    return this.setLocale(value);
  }

  resolve(box, data) {
    const result = [];
    const locale = this.resolveValue(box, data, this._locale) || wlocale;

    let args = null;
    let code = null;
    let path = null;
    let string = null;
    let value = null;

    for (let i = 0; i < this._list.length; i += 1) {
      value = this.resolveValue(box, data, this._list[i]);

      [code, ...args] = Array.isArray(value) ?
        value : [value, data];

      path = locale ? `${locale}.${code}` : code;

      string = get(strings, path);
      string = typeof string === 'undefined' ? code : string;

      try {
        string = vsprintf(string, args, locale);
      } catch (e) {
        console.warn(e);
      }

      result[result.length] = string;
    }

    return result;
  }
}
