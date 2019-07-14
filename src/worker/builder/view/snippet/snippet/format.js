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

    this._code = null;
    this._locale = null;
    this._values = null;

    this.setCode(options.code);
    this.setLocale(options.locale);
    this.setValues(options.values);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      code: this._code,
      locale: this._locale,
      values: this._values
    });
  }

  getCode() {
    return this._code;
  }

  setCode(value = null) {
    this._code = value;
    return this;
  }

  getLocale() {
    return this._locale;
  }

  setLocale(value = locale) {
    this._locale = value;
    return this;
  }

  getValues() {
    return this._values;
  }

  setValues(value = null) {
    this._values = value;
    return this;
  }

  code(value) {
    return this.setCode(value);
  }

  locale(value) {
    return this.setLocale(value);
  }

  values(value) {
    return this.setValues(value);
  }

  resolveAfter(box, data) {
    let string = '';

    const flocale = this.resolveValue(box, data, this._locale);
    const code = this.resolveValue(box, data, this._code);

    let values = this.resolveValue(box, data, this._values);
    values = Array.isArray(values) ? values : [values];

    string = get(strings, `${flocale}.${code}`);
    string = typeof string === 'undefined' ? code : string;

    try {
      string = vsprintf(string, values, flocale);
    } catch (error) {
      string = error.message;
    }

    return string;
  }
}
