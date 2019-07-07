import { event } from 'd3';
import { Plot } from './plot';

export class Circle extends Plot {
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

  appendCircle(box, key, j, set, endogenous, exogenous) {
    const [circle, tip] = this._list;
    const [from, to, datum] = set[j] || [0, 0, {}];

    const data = {
      datum,
      from,
      key,
      to
    };

    const radius = this.resolveValue(box, data, this._radius);

    const endogenousOrientation = endogenous.mapOrientation();
    const exogenousOrientation = exogenous.mapOrientation();

    const endogenousDistance = endogenous.calculateDistance(to);
    const exogenousDistance = exogenous.calculateDistance(key);

    const node = this.appendChild(box, data, circle)
      .attr('c' + endogenousOrientation, endogenousDistance)
      .attr('c' + exogenousOrientation, exogenousDistance)
      .attr('r', radius);

    this.appendTip(box, data, node, tip);
  }

  resolveInner(box, data) {
    const endogenous = this.findScale('endogenous');
    const exogenous = this.findScale('exogenous');

    let key = null;
    let set = null;

    data = this.prepare(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        this.appendCircle(box, key, j, set, endogenous, exogenous);
      }
    }

    return this.resolveAfter(box, data);
  }
}
