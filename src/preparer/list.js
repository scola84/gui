import { event, select } from 'd3';
import throttle from 'lodash-es/throttle';
import GraphicWorker from '../worker/graphic';

export default class ListPreparer extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._dynamic = null;
    this._height = null;

    this.setDynamic(options.dynamic);
    this.setHeight(options.height);
  }

  setDynamic(value = true) {
    this._dynamic = value;
    return this;
  }

  setHeight(value = 48) {
    this._height = value;
    return this;
  }

  act(route, data, callback) {
    data = data || {};

    if (this._dynamic === true) {
      this._prepareScroll(route, data, callback);
    }

    this._prepareSearch(route, data, callback);

    this.pass(route, data, callback);
  }

  _prepareScroll(route, data, callback) {
    const panel = select(route.node);

    const content = panel
      .select('.body .content');

    const height = parseInt(content.style('height'), 10) || 768;

    data.offset = data.offset || 0;
    data.count = Math.round(height / this._height) * 2;

    content.classed('busy', true);

    content.on('scroll', throttle((datum, index, nodes) => {
      if (content.classed('done') === true) {
        return;
      }

      if (content.classed('busy') === true) {
        return;
      }

      delete route.clear;

      const top = height + nodes[index].scrollTop;
      const threshold = nodes[index].scrollHeight - (height / 4);

      if (top > threshold) {
        data.offset += data.count;
        this.act(route, data, callback);
      }
    }, 250));
  }

  _prepareSearch(route, data, callback) {
    const panel = select(route.node);

    const form = panel
      .select('.body .search');

    const input = form
      .select('input');

    form.on('submit', () => {
      event.preventDefault();
      this._submitSearch(route, data, callback, input.property('value'));
    });

    input.on('input', () => {
      const value = input.property('value');
      sessionStorage.setItem('search-' + route.path, value);

      if (typeof event.data === 'undefined' && value.length === 0) {
        this._submitSearch(route, data, callback, value);
      }
    });

    const value = sessionStorage.getItem('search-' + route.path);

    if (value) {
      panel.classed('search immediate', true);
      input.attr('value', value);
      data.where = value;
    }
  }

  _submitSearch(route, data, callback, value) {
    if (value.length === 0 || value.length > 2) {
      if (value.length === 0) {
        delete data.where;
      } else {
        data.where = value;
      }

      delete data.offset;
      delete data.count;

      route.clear = true;
      this.act(route, data, callback);
    }
  }
}
