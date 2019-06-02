import Date from './date';

export default class DateTime extends Date {
  constructor(options) {
    super(options);

    this.setAttributes({
      type: 'datetime-local'
    });
  }

  setFormat(value = 'yyyy-MM-ddTHH:mm') {
    this._format = value;
    return this;
  }
}
