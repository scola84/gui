import { event, select } from 'd3';
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
        this.resolveCircle(box, key, j, set, endogenous, exogenous);
      }
    }

    return this._node;
  }

  resolveBefore(box, data) {
    this._node
      .selectAll('circle')
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-circle', (datum, index, nodes) => {
        select(nodes[index])
          .on('.scola-circle', null)
          .remove();
      });

    this.resolveOuter(box, data);
  }

  resolveCircle(box, key, j, set, endogenous, exogenous) {
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

    const circle = this._node
      .append('circle')
      .attr('c' + endogenousOrientation, endogenousDistance)
      .attr('c' + exogenousOrientation, exogenousDistance)
      .attr('r', radius)
      .classed('transition', true);

    circle
      .on('mouseover.scola-circle', () => {
        data.target = event.target;
        this.resolveValue(box, data, this._list[0]);
      })
      .on('mouseout.scola-circle', () => {
        return this._list[0] ? this._list[0].remove() : null;
      });

    circle.style('width');
    circle.classed('in', true);
  }
}
