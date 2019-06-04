import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import sprintf from 'sprintf-js';
import Snippet from '../snippet';
import { format } from '../../helper';

const regexpBase = '%((\\((\\w+)\\))?((\\d+)\\$)?)([b-gijostTuvxXlmn])(\\[(.+)\\])?';
const regexpGlobal = new RegExp(regexpBase, 'g');
const regexpSingle = new RegExp(regexpBase);
const reductor = (name) => (a, v) => v[name] || a;

const strings = {};
let wlocale = 'nl_NL';

export default class Format extends Snippet {
  static getLocale() {
    return wlocale;
  }

  static setLocale(value) {
    wlocale = value;
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

  setLocale(value = 'nl_NL') {
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
      string = this.resolveCustom(string, locale, args);

      try {
        result[result.length] = sprintf.vsprintf(string, args);
      } catch (e) {
        console.warn(e);
        result[result.length] = string;
      }
    }

    return result;
  }

  resolveCustom(string, locale, args) {
    const matches = string.match(regexpGlobal) || [];

    let match = null;
    let name = null;
    let number = null;
    let options = null;
    let type = null;
    let value = null;

    for (let i = 0; i < matches.length; i += 1) {
      [
        match, , , name, , number, type, , options
      ] = matches[i].match(regexpSingle);

      value = number ?
        args[number - 1] :
        name ?
        args.reduce(reductor(name), '') :
        args[i];

      if (format[type]) {
        string = string.replace(
          match,
          format[type](value, locale, options)
        );
      }
    }

    return string;
  }
}
