import { parsePhoneNumber } from 'libphonenumber-js';
import Input from '../input';

export default class Tel extends Input {
  constructor(options = {}) {
    super(options);

    this._country = null;
    this._format = null;

    this.setCountry(options.country);
    this.setFormat(options.format);

    this
      .setAttributes({
        type: 'tel'
      })
      .setName('input');
  }

  getFormat() {
    return this._format;
  }

  setFormat(value = 'E.164') {
    this._format = value;
    return this;
  }

  getCountry() {
    return this._country;
  }

  setCountry(value = 'NL') {
    this._country = value;
    return this;
  }

  format(value) {
    return this.setFormat(value);
  }

  country(value) {
    return this.setCountry(value);
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).trim());
  }

  validateBefore(box, data, error, name, value) {
    const country = this.resolveValue(box, data, this._country);
    let number = null;

    try {
      number = parsePhoneNumber(value, country);
    } catch (err) {
      this.throwError(value, 'type');
    }

    if (number.isValid() === false) {
      this.throwError(value, 'type');
    }

    const format = this.resolveValue(box, data, this._format);
    this.set(data, name, number.format(format));
  }
}
