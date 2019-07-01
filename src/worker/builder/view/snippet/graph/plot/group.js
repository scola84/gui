import { Data } from './data';

export class Group extends Data {
  constructor(options = {}) {
    super(options);

    this._index = null;
    this.setIndex(options.value);
  }

  getIndex() {
    return this._index;
  }

  setIndex(value = null) {
    this._index = value;
    return this;
  }

  index(value) {
    return this.setIndex(value);
  }

  prepareValue(result, x, y, datum) {
    if (typeof result.data[x] === 'undefined') {
      result.data[x] = [];
      result.keys[result.keys.length] = x;
    }

    const set = result.data[x];
    const index = this._index ? this._index(datum) : set.length;

    set[index] = [0, y];

    return [index, 'group'];
  }
}
