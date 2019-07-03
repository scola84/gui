import { select } from 'd3';
import { Axis } from './axis';
import { Node } from '../node';
import * as plot from './plot/';

export class Plot extends Node {
  static attach() {
    Object.keys(plot).forEach((name) => {
      Plot.attachFactory(Plot, name, plot[name]);
    });
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

  hideTip() {
    const [tip] = this._list;

    if (typeof tip === 'undefined') {
      return;
    }

    tip.node().remove();
  }

  showTip(key, j, set, box, target) {
    const [tip] = this._list;

    if (typeof tip === 'undefined') {
      return;
    }

    const [from, to, datum] = set[j];
    const data = { datum, from, key, to };
    const node = this.resolveValue(box, data, tip);

    select('body').insert(() => node.node());

    const targetRect = target.getBoundingClientRect();
    const tipRect = node.node().getBoundingClientRect();

    const left = targetRect.left +
      (targetRect.width / 2) -
      (tipRect.width / 2);

    const top = targetRect.top -
      tipRect.height;

    node
      .style('top', top + 'px')
      .style('left', left + 'px')
      .style('width', tipRect.width + 'px')
      .style('height', tipRect.height + 'px');
  }

  prepare(data) {
    return this._data.prepare(data);
  }
}
