import { select } from 'd3';
import Resizer from 'element-resize-detector';
import debounce from 'lodash-es/debounce';
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
      if (route.force !== true) {
        return;
      }
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
    } = this._calculate(moveDir, readDir, width, route.factor);

    const old = this._base
      .select('.panel')
      .style(property, oldBegin)
      .transition()
      .duration(this._duration)
      .style(property, oldEnd)
      .remove();

    if (old.size() > 0) {
      old.node().resizer
        .uninstall(old.select('.content').node());
    }

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

    const content = body
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

    route.node.size = {};

    route.node.resizer = Resizer({
      callOnAdd: false
    });

    route.node.resizer.listenTo(content.node(), debounce(() => {
      this._resize(route);
    }, 100));

    this.pass(route, data, callback);
  }

  _calculate(moveDir, readDir, width, factor) {
    return moveDir ?
      this._calculateMove(moveDir, readDir, width, factor) :
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

  _calculateMove(moveDir, readDir, width, factor = 0.25) {
    const move = moveDir === 'rtl' ? -1 : 1;
    const read = readDir === 'rtl' ? -1 : 1;

    return {
      property: 'transform',
      oldBegin: 'translate(0, 0)',
      oldEnd: `translate(${move * read * factor * width}px, 0)`,
      newBegin: `translate(${-move * read * width}px, 0)`,
      newEnd: 'translate(0, 0)'
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

  _resize(route) {
    const node = select(route.node);
    const body = node.select('.body').node();

    const height = body.getBoundingClientRect().height;
    const width = body.getBoundingClientRect().width;

    const changed =
      route.node.size.height !== height ||
      route.node.size.width !== width;

    route.node.size.height = height;
    route.node.size.width = width;

    select(route.node).dispatch('resize', {
      detail: changed
    });
  }
}
