import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import { Snippet } from '../snippet';
import { vsprintf } from '../../../../../helper';

let locale = 'nl_NL';
let strings = {};

export class Format extends Snippet {
  static getLocale() {
    return locale;
  }

  static setLocale(value) {
    locale = value;
  }

  static getNumbers() {
    return vsprintf.n.definitions;
  }

  static setNumbers(value) {
    vsprintf.n.definitions = value;
  }

  static addNumbers(value) {
    merge(vsprintf.n.definitions, value);
  }

  static getStrings() {
    return strings;
  }

  static setStrings(value) {
    strings = value;
  }

  static addStrings(value) {
    merge(strings, value);
  }

  constructor(options = {}) {
    super(options);

    this._locale = null;
    this.setLocale(options.locale);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      locale: this._locale
    });
  }

  getLocale() {
    return this._locale;
  }

  setLocale(value = locale) {
    this._locale = value;
    return this;
  }

  locale(value) {
    return this.setLocale(value);
  }

  resolveAfter(box, data) {
    const result = [];
    const flocale = this.resolveValue(box, data, this._locale);

    let args = null;
    let code = null;
    let string = null;
    let value = null;

    for (let i = 0; i < this._args.length; i += 1) {
      value = this.resolveValue(box, data, this._args[i]);

      [code, ...args] = Array.isArray(value) ?
        value : [value, data];

      string = get(strings, `${flocale}.${code}`);
      string = typeof string === 'undefined' ? code : string;

      try {
        string = vsprintf(string, args, flocale);
      } catch (error) {
        string = error.message;
      }

      result[result.length] = string;
    }

    return result;
  }
}
