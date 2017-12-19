import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class PanelBuilder extends Worker {
  constructor(options = {}) {
    super(options);

    this._base = null;
    this.setBase(options.base);
  }

  setBase(value = null) {
    this._base = value;
    return this;
  }

  act(route, data) {
    const moveDir = route.dir;
    const readDir = select('html').attr('dir') || 'ltr';
    const width = this._base.style('width');

    const {
      property,
      oldBegin,
      oldEnd,
      newBegin,
      newEnd
    } = this._calculate(moveDir, readDir, width);

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

  _calculate(moveDir, readDir, width) {
    if (moveDir) {
      return {
        property: readDir === 'ltr' ? 'left' : 'right',
        oldBegin: 0,
        oldEnd: (moveDir === 'rtl' ? '-' : '') + width,
        newBegin: (moveDir === 'rtl' ? '' : '-') + width,
        newEnd: 0
      };
    }

    return {
      property: 'opacity',
      oldBegin: 1,
      oldEnd: 0,
      newBegin: 0,
      newEnd: 1
    };
  }
}
