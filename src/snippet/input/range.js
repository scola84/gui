import Number from './number';

export default class Range extends Number {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'range'
    });
  }
}
