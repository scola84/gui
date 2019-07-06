import { select } from 'd3';
import { Node } from '../node';
import { Linear, token } from './axis/';

export class Axis extends Node {
  static setup() {
    Axis.attach(Axis, { token });
  }

  constructor(options = {}) {
    super(options);

    this._scale = null;
    this.setScale(options.scale);
  }

  getScale() {
    return this._scale;
  }

  setScale(value = new Linear()) {
    this._scale = value.setAxis(this);
    return this;
  }

  scale(value) {
    return this.setScale(value(this));
  }

  resolveAfter() {
    this._node
      .classed(this._scale.mapOrientation(), true)
      .classed(this._scale.getName(), true)
      .classed(this._scale.getPosition(), true);

    return this._node;
  }

  resolveBefore(box, data) {
    this._node
      .selectAll('.tick')
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-axis', (datum, index, nodes) => {
        select(nodes[index]).on('.scola-axis', null);
        nodes[index].snippet.remove();
      });

    this._scale.prepare(data);
    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    const [tick] = this._list;

    if (typeof tick === 'undefined') {
      return this._node;
    }

    const ticks = this._scale.calculateTicks();
    const position = this._scale.mapPosition();

    let distance = null;
    let node = null;
    let value = null;

    for (let i = 0; i < ticks.length; i += 1) {
      [value, distance] = ticks[i];

      node = tick
        .clone()
        .resolve(box, value);

      node
        .classed('transition', true)
        .style(position, Math.floor(distance) + 'px');

      node.style('width');
      node.classed('in', true);
    }

    return this.resolveAfter(box, data);
  }
}
