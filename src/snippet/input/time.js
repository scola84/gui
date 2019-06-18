import { DateTime } from './datetime';

export class Time extends DateTime {
  constructor(options) {
    super(options);

    this.setAttributes({
      type: 'time'
    });
  }

  setFormat(value = 'HH:mm') {
    this._format = value;
    return this;
  }
}
