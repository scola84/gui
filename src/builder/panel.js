import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class PanelBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._base = null;
    this._user = null;

    this.setBase(options.base);
  }

  setBase(value = null) {
    this._base = value;
    return this;
  }

  setUser(value = null) {
    this._user = value;
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

    const panel = this._base
      .append('div')
      .classed('panel', true)
      .style(property, newBegin);

    const body = panel
      .append('div')
      .classed('body', true);

    body
      .append('form')
      .classed('search', true)
      .append('div')
      .append('input')
      .datum(() => ({ name: 'search' }))
      .attr('autocomplete', 'on')
      .attr('name', 'search')
      .attr('placeholder', (d, i, n) => {
        return this.format(d, i, n, { name: 'placeholder' });
      })
      .attr('type', 'search');

    body
      .append('div')
      .classed('message', true)
      .append('span');

    body
      .append('div')
      .classed('content', true);

    this._createBar(panel)
      .classed('header', true);

    this._createBar(panel)
      .classed('footer', true);

    panel
      .transition()
      .style(property, newEnd);

    route.node = panel.node();
    route.user = this._user;

    this.pass(route, data);
  }

  _calculate(moveDir, readDir, width) {
    return moveDir ?
      this._calculateMove(moveDir, readDir, width) :
      this._calculateFade();
  }

  _calculateFade() {
    return {
      property: 'opacity',
      oldBegin: 1,
      oldEnd: 0,
      newBegin: 0,
      newEnd: 1
    };
  }

  _calculateMove(moveDir, readDir, width) {
    return {
      property: readDir === 'ltr' ? 'left' : 'right',
      oldBegin: 0,
      oldEnd: (moveDir === 'rtl' ? '-' : '') + width,
      newBegin: (moveDir === 'rtl' ? '' : '-') + width,
      newEnd: 0
    };
  }

  _createBar(node) {
    const bar = node
      .append('div')
      .classed('bar', true);

    bar
      .append('div')
      .classed('left', true);

    bar
      .append('div')
      .classed('center', true);

    bar
      .append('div')
      .classed('right', true);

    return bar;
  }
}
