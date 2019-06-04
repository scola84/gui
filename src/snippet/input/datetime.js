import { DateTime } from 'luxon';
import Input from '../input';

export default class DateTimeLocal extends Input {
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

  validateBefore(box, data, error, name, value) {
    if (this.isEmpty(value) === true) {
      return;
    }

    const format = this.resolveValue(box, data, this._format);
    const date = DateTime.fromFormat(value, format);

    if (date.isValid === false) {
      this.throwError(value, 'type');
    }
  }
}
