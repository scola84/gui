import { event, select } from 'd3';
import throttle from 'lodash-es/throttle';
import { DateTime } from 'luxon';
import GraphicWorker from '../worker/graphic';

export default class ListPreparer extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._dynamic = null;
    this._height = null;
    this._search = null;

    this.setDynamic(options.dynamic);
    this.setHeight(options.height);
    this.setSearch(options.search);
  }

  setDynamic(value = true) {
    this._dynamic = value;
    return this;
  }

  setHeight(value = 48) {
    this._height = value;
    return this;
  }

  setSearch(value = null) {
    this._search = value;
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

  _formatSearch(route, value) {
    const format = this._search ||
      this._extract(route.structure || this._structure);

    if (typeof format === 'undefined') {
      return value;
    }

    const parts = value.match(/[^"\s]+|"[^"]+"/g);
    let dateMatch = null;
    let quoteMatch = null;
    let rangeMatch = null;

    for (let i = 0; i < parts.length; i += 1) {
      dateMatch = this._parseDate(parts[i], 'search.begin');
      quoteMatch = parts[i].match(/".+"/);
      rangeMatch = parts[i].match(/\.\./);

      if (dateMatch !== null && dateMatch.isValid) {
        parts[i] = this._formatDate(parts[i]);
      } else if (rangeMatch !== null) {
        parts[i] = this._formatRange(parts[i]);
      } else if (quoteMatch === null) {
        parts[i] = format(parts[i]);
      }
    }

    return parts.join(' ');
  }

  _formatDate(value) {
    const beginDate = this._parseDate(value, 'search.begin')
    const endDate = beginDate.plus({ day: 1 })
    return `[${beginDate.valueOf()};${endDate.valueOf()})`
  }

  _formatRange(value) {
    let [begin, end] = value.split('..');
    let beginDate = null;
    let endDate = null;

    if (begin === '*') {
      begin = '';
    } else {
      beginDate = this._parseDate(begin, 'search.begin');

      if (beginDate.isValid) {
        begin = beginDate.valueOf();
      }
    }

    if (end === '*') {
      end = '';
    } else {
      endDate = this._parseDate(end, 'search.end');

      if (endDate.isValid) {
        end = endDate.valueOf();
      }
    }

    return `[${begin};${end}]`
  }

  _parseDate(value, name) {
    const format = this.format({}, null, null, {
      data: {},
      name
    });

    if (!format) {
      return null;
    }

    return DateTime.fromFormat(value, format, {
      zone: 'UTC'
    });
  }

  _prepareScroll(route, data, callback) {
    const panel = select(route.node);

    const content = panel
      .select('.body .content');

    const height = parseInt(content.style('height'), 10) || 768;

    data.offset = data.offset || 0;
    data.count = Math.round(height / this._height) * 2;

    content.classed('busy', true);

    if (data.offset === 0) {
      content.node().scrollTop = 0;
    }

    content.on('scroll', throttle((datum, index, nodes) => {
      if (content.classed('done') === true) {
        return;
      }

      if (content.classed('busy') === true) {
        return;
      }

      delete route.clear;

      const top = height + nodes[index].scrollTop;
      const threshold = nodes[index].scrollHeight - (height / 4 * 2);

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
      panel.classed('show-search immediate', true);
      input.attr('value', value);
      data.where = this._formatSearch(route, value);
    }
  }

  _submitSearch(route, data, callback, value) {
    if (value.length === 0 || value.length > 2) {
      if (value.length === 0) {
        delete data.where;
      } else {
        data.where = this._formatSearch(route, value);
      }

      delete data.offset;
      delete data.count;

      route.clear = true;
      this.act(route, data, callback);
    }
  }
}
