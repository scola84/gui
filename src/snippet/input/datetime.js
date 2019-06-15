import { DateTime as Luxon } from 'luxon';
import Input from '../input';

export default class DateTime extends Input {
  constructor(options = {}) {
    super(options);

    this._format = null;
    this.setFormat(options.format);

    this
      .setAttributes({
        type: 'datetime-local'
      })
      .setName('input');
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      format: this._format
    });
  }

  getFormat() {
    return this._format;
  }

  setFormat(value = 'yyyy-MM-ddTHH:mm') {
    this._format = value;
    return this;
  }

  format(value) {
    return this.setFormat(value);
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).trim());
  }

  validateAfter(box, data, error, name, value) {
    const format = this.resolveValue(box, data, this._format);
    const date = Luxon.fromFormat(value, format);

    if (date.isValid === false) {
      return this.setError(error, name, value, 'type');
    }

    return null;
  }
}
