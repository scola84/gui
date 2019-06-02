import IBAN from 'iban';
import Input from '../input';

export default class Iban extends Input {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        type: 'text'
      })
      .setName('input');
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).replace(/\s+/g, ''));
  }

  validateAfter(box, data, error, name, value) {
    const country = value
      .toUpperCase()
      .slice(0, 2);

    const specification = IBAN.countries[country];

    if (typeof specification === 'undefined') {
      this.throwError(value, 'country');
    }

    value = value.slice(0, specification.length);

    if (IBAN.isValid(value) === false) {
      this.throwError(value, 'type');
    }

    this.set(data, name, IBAN.electronicFormat(value));
  }
}
