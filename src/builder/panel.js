import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class PanelBuilder extends Worker {
  constructor(methods) {
    super(methods);
    this._base = null;
  }

  setBase(value) {
    this._base = value;
    return this;
  }

  act(route, data) {
    const readDir = select('html').attr('dir') || 'ltr';
    const moveDir = route.dir;
    const width = this._base.style('width');

    let property = 'opacity';
    let oldBegin = 1;
    let oldEnd = 0;
    let newBegin = 0;
    let newEnd = 1;

    if (moveDir) {
      property = readDir === 'ltr' ? 'left' : 'right';
      oldBegin = 0;
      oldEnd = (moveDir === 'rtl' ? '-' : '') + width;
      newBegin = (moveDir === 'rtl' ? '' : '-') + width;
      newEnd = 0;
    }

    this._base
      .select('.panel')
      .style(property, oldBegin)
      .transition()
      .style(property, oldEnd)
      .remove();

    const node = this._base
      .append('div')
      .classed('panel', true)
      .style(property, newBegin);

    node
      .append('div')
      .classed('body', true);

    node
      .append('div')
      .classed('bar header', true);

    node
      .append('div')
      .classed('bar footer', true);

    node
      .transition()
      .style(property, newEnd);

    route.node = node.node();

    this.pass(route, data);
  }
}
