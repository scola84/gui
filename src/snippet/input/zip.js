import postalcodes from 'postal-codes-js';
import Input from '../input';

export default class Zip extends Input {
  constructor(options = {}) {
    super(options);

    this._country = null;
    this.setCountry(options.country);

    this
      .setAttributes({
        type: 'zip'
      })
      .setName('input');
  }

  getCountry() {
    return this._country;
  }

  setCountry(value = 'NL') {
    this._country = value;
    return this;
  }

  country(value) {
    return this.setCountry(value);
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).replace(/[-\s]+/g, ''));
  }

  validateBefore(box, data, error, name, value) {
    const country = this.resolveValue(box, data, this._country);

    if (postalcodes.validate(country, value) !== true) {
      this.throwError(value, 'type');
    }
  }
}
