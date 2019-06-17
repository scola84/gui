import DateTime from './datetime';

export default class Date extends DateTime {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'date'
    });
  }

  setFormat(value = 'yyyy-MM-dd') {
    this._format = value;
    return this;
  }
}
