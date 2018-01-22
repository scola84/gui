import { select } from 'd3';
import throttle from 'lodash-es/throttle';
import GraphicWorker from '../worker/graphic';

export default class ListPreparer extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._height = null;
    this.setHeight(options.height);
  }

  setHeight(value = 48) {
    this._height = value;
    return this;
  }

  act(route, data = {}, callback) {
    this._prepareScroll(route, data);
    this._prepareSearch(route, data);

    this.pass(route, data, callback);
  }

  _prepareScroll(route, data) {
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
        this.act(route, data);
      }
    }, 250));
  }

  _prepareSearch(route, data) {
    const panel = select(route.node);

    const form = panel
      .select('.body .search');

    const input = form
      .select('input');

    form.on('submit', () => {
      event.preventDefault();

      const value = input
        .property('value');

      if (value.length === 0 || value.length > 2) {
        if (value.length === 0) {
          delete data.where;
        } else {
          data.where = value;
        }

        route.clear = true;
        this.act(route, data);
      }
    });

    input.on('input', () => {
      const value = input
        .property('value');

      sessionStorage.setItem('search-' + this._id, value);

      if (typeof event.data === 'undefined' && value.length === 0) {
        form.dispatch('submit');
      }
    });

    const value = sessionStorage.getItem('search-' + this._id);

    if (value) {
      panel.classed('search immediate', true);
      input.attr('value', value);
      data.where = value;
    }
  }
}
