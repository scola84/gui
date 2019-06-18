import { DateTime } from './datetime';

export class Month extends DateTime {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'month'
    });
  }

  setFormat(value = 'yyyy-MM') {
    this._format = value;
    return this;
  }
}
