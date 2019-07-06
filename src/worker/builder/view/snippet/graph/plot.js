import { Axis } from './axis';
import { Node } from '../node';
import { token } from './plot/';

export class Plot extends Node {
  static setup() {
    Plot.attach(Plot, { token });
  }

  constructor(options = {}) {
    super(options);

    this._data = null;
    this.setData(options.data);
  }

  getData() {
    return this._data;
  }

  setData(value = null) {
    this._data = value;
    return this;
  }

  data(value) {
    return this.setData(value(this));
  }

  findScale(type) {
    const position = this._data.getPosition();

    const [axis] = this._builder.selector((snippet) => {
      return snippet instanceof Axis &&
        position.indexOf(snippet.getScale().getPosition()) > -1 &&
        snippet.getScale().getType() === type;
    }).resolve();

    return axis.getScale();
  }

  prepare(data) {
    return this._data.prepare(data);
  }

  resolveInner(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      this._list[i].setParent(null);
    }

    return this.resolveAfter(box, data);
  }
}
