import { Node } from '../node';

export class Axis extends Node {
  constructor(options = {}) {
    super(options);

    this._type = null;
    this.setType(options.type);
  }

  getType() {
    return this._type;
  }

  setType(value = null) {
    this._type = value;
    return this;
  }

  bottom() {
    this.setType('bottom');
    return this.class('bottom');
  }

  left() {
    this.setType('left');
    return this.class('left');
  }

  right() {
    this.setType('right');
    return this.class('right');
  }

  top() {
    this.setType('top');
    return this.class('top');
  }

  getMaxMin(box, data) {
    const plots = this._builder
      .selector('.plot.' + this._type)
      .resolve();

    const result = {
      maxX: -Infinity,
      minX: Infinity,
      maxY: -Infinity,
      minY: Infinity,
    };

    let plotData = null;

    for (let i = 0; i < plots.length; i += 1) {
      plotData = plots[i].resolveData(box, data);

      result.maxX = Math.max(result.maxX, plotData.maxX);
      result.minX = Math.min(result.minX, plotData.minX);
      result.maxY = Math.max(result.maxY, plotData.maxY);
      result.minY = Math.min(result.minY, plotData.minY);
    }

    return result;
  }
}
