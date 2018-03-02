import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class PanelBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._base = null;
    this._duration = null;
    this._user = null;

    this.setBase(options.base);
    this.setDuration(options.duration);
  }

  setBase(value = null) {
    this._base = value;
    return this;
  }

  setDuration(value = 250) {
    this._duration = value;
    return this;
  }

  setUser(value = null) {
    this._user = value;
    return this;
  }

  act(route, data, callback) {
    if (this._base.classed('busy') === true) {
      return;
    }

    this._base.classed('busy', true);

    const moveDir = route.rtl ? 'rtl' : route.ltr ? 'ltr' : null;
    const readDir = select('html').attr('dir') || 'ltr';
    const width = parseFloat(this._base.style('width'));

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
      .duration(this._duration)
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
      .classed('ion-ios-search', true)
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
      .duration(this._duration)
      .style(property, newEnd)
      .on('end', () => {
        this._base.classed('busy', false);
      });

    route.node = panel.node();
    route.user = this._user;

    this.pass(route, data, callback);
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
    const move = moveDir === 'rtl' ? -1 : 1;
    const read = readDir === 'rtl' ? -1 : 1;

    return {
      property: 'transform',
      oldBegin: 'translate3d(0, 0, 0)',
      oldEnd: `translate3d(${move * read * 0.25 * width}px,0,0)`,
      newBegin: `translate3d(${-move * read * width}px,0,0)`,
      newEnd: 'translate3d(0, 0, 0)'
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
