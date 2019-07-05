import { select } from 'd3';
import { Plot } from './plot';

export class Rect extends Plot {
  constructor(options = {}) {
    super(options);

    this._padding = null;
    this.setPadding(options.padding);

    this
      .name('g')
      .class('plot');
  }

  getPadding() {
    return this._padding;
  }

  setPadding(value = 0.1) {
    this._padding = value;
    return this;
  }

  padding(value) {
    return this.setPadding(value);
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
        this.resolveRect(box, key, j, set, endogenous, exogenous);
      }
    }

    return this._node;
  }

  resolveBefore(box, data) {
    this._node
      .selectAll('rect')
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-rect', (datum, index, nodes) => {
        select(nodes[index])
          .on('.scola-rect', null)
          .remove();
      });

    this.resolveOuter(box, data);
  }

  resolveRect(box, key, j, set, endogenous, exogenous) {
    const [from, to, datum] = set[j] || [0, 0, {}];

    const data = {
      datum,
      from,
      key,
      to
    };

    const padding = this.resolveValue(box, data, this._padding);

    const endogenousRange = endogenous.mapRange();
    const endogenousOrientation = endogenous.mapOrientation();

    const begin = endogenous.calculateDistance(from);
    let end = endogenous.calculateDistance(to);

    if (begin === end) {
      end = endogenous.calculateDistance(3 / endogenous.getPpu());
    }

    let endogenousDistance = end;
    let endogenousSize = begin - end;

    if (begin < end) {
      endogenousDistance = begin;
      endogenousSize = end - begin;
    }

    const exogenousRange = exogenous.mapRange();
    const exogenousOrientation = exogenous.mapOrientation();

    let exogenousDistance = exogenous.calculateDistance(key);
    let exogenousSize = exogenous.getPpu();

    if (exogenous.getDomain().type === 'group') {
      exogenousSize /= exogenous.getDomain().size;
      exogenousDistance += j * exogenousSize;
      exogenousDistance -= exogenousSize;
    }

    exogenousDistance -= exogenousSize * 0.5;
    exogenousDistance += exogenousSize * padding;
    exogenousSize -= exogenousSize * padding * 2;

    const rect = this._node
      .append('rect')
      .attr(endogenousOrientation, endogenousDistance)
      .attr(endogenousRange, endogenousSize)
      .attr(exogenousOrientation, exogenousDistance)
      .attr(exogenousRange, exogenousSize)
      .classed('negative', to < 0)
      .classed('transition', true)
      .classed('zero', to === 0);

    rect
      .on('mouseover.scola-rect', () => {
        data.target = event.target;
        this.resolveValue(box, data, this._list[0]);
      })
      .on('mouseout.scola-rect', () => {
        return this._list[0] ? this._list[0].remove() : null;
      });

    rect.style('width');
    rect.classed('in', true);
  }
}
