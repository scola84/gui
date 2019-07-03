import { event } from 'd3';
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

    let key = null;
    let set = null;

    data = this.prepare(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        this.resolveScatter(key, j, set, box, endogenous, exogenous);
      }
    }

    return this._node;
  }

  resolveBefore(box, data) {
    const [tip] = this._list;

    if (typeof tip !== 'undefined') {
      tip.setParent(null);
    }

    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    return this.resolveAfter(box, data);
  }

  resolveScatter(key, j, set, box, endogenous, exogenous) {
    const [, to] = set[j] || [0, 0];

    const endogenousOrientation = endogenous.mapOrientation();
    const exogenousOrientation = exogenous.mapOrientation();

    const endogenousDistance = endogenous.calculateDistance(to);
    const exogenousDistance = exogenous.calculateDistance(key);

    const radius = this._radius;

    this._node
      .append('circle')
      .classed('scatter', true)
      .attr('c' + endogenousOrientation, endogenousDistance)
      .attr('c' + exogenousOrientation, exogenousDistance)
      .attr('r', radius)
      .on('mouseover.scola-graph', () => {
        this.showTip(key, j, set, box, event.target);
      })
      .on('mouseout.scola-graph', () => {
        this.hideTip();
      });
  }
}
