import { Plot } from './plot';

export class Scatter extends Plot {
  constructor(options = {}) {
    super(options);

    this._radius = null;
    this.setRadius(options.radius);

    this
      .name('g')
      .class('plot');
  }

  getRadius() {
    return this._radius;
  }

  setRadius(value = 3) {
    this._radius = value;
    return this;
  }

  radius(value) {
    return this.setRadius(value);
  }

  resolveAfter(box, data) {
    const endogenous = this.findScale('endogenous');
    const exogenous = this.findScale('exogenous');

    const endogenousOrientation = endogenous.mapOrientation();
    const exogenousOrientation = exogenous.mapOrientation();

    const radius = this._radius;

    let key = null;
    let set = null;

    let to = null;

    let endogenousDistance = null;
    let exogenousDistance = null;

    data = this.prepare(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [, to] = set[j];

        endogenousDistance = endogenous.calculateDistance(to);
        exogenousDistance = exogenous.calculateDistance(key);

        this._node
          .append('circle')
          .classed('scatter', true)
          .attr('c' + endogenousOrientation, endogenousDistance)
          .attr('c' + exogenousOrientation, exogenousDistance)
          .attr('r', radius);
      }
    }

    return this._node;
  }
}
