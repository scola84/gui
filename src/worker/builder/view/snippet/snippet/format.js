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

    this._args = null;
    this._code = null;
    this._locale = null;

    this.setArgs(options.args);
    this.setCode(options.code);
    this.setLocale(options.locale);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      args: this._args,
      code: this._code,
      locale: this._locale
    });
  }

  getArgs() {
    return this._args;
  }

  setArgs(value = null) {
    this._args = value;
    return this;
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

  args(value) {
    return this.setArgs(value);
  }

  code(value) {
    return this.setCode(value);
  }

  locale(value) {
    return this.setLocale(value);
  }

  resolveAfter(box, data) {
    let string = '';

    const flocale = this.resolveValue(box, data, this._locale);
    const code = this.resolveValue(box, data, this._code);
    const args = this.resolveValue(box, data, this._args);

    string = get(strings, `${flocale}.${code}`);
    string = typeof string === 'undefined' ? code : string;

    try {
      string = vsprintf(string, args, flocale);
    } catch (error) {
      string = error.message;
    }

    return string;
  }
}
